import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { Prisma } from "@/lib/prisma";

export async function extractAndSaveIngredients(idFamily: number, items: { food_name: string; portion: number }[]) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);
  const embeddings = new OpenAIEmbeddings({ modelName: "text-embedding-3-small" });

  if (!process.env.GOOGLE_API_KEY || !process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
    throw new Error("Missing required environment variables for Google API or Pinecone.");
  }

  const SYSTEM_INSTRUCTION = `
    You are an expert nutritionist assistant. Your task is to map all given recipes into a structured JSON data format. Provide ONLY one JSON object in your entire output.
  
    CRITICAL PORTION DETERMINATION RULE: The 'standard_portion' value must represent the TOTAL NUMBER OF PORTIONS (e.g., 4.0 portions) the recipe yields. Infer this value logically based on the total quantity of the main ingredients (e.g., a total of 1 kg of meat/chicken usually yields 4.0 portions, 500 grams of chicken yields 2.0 portions). If it's hard to infer, use a default value of 1.0. All 'standard_quantity' values in 'parsed_ingredients' MUST BE THE TOTAL WEIGHT OF THE INGREDIENT needed to make the entire recipe that yields the 'standard_portion'.
  
    CRITICAL CONVERSION RULE: Convert ingredient quantities as follows:
    1. Bulk weight units (e.g., kg, ons, gr) MUST be converted to grams (g).
    2. Volume units (e.g., liter, ml) MUST be converted to milliliters (ml).
    3. Counted or non-standard units (e.g., clove, piece, stalk, to taste) MUST be retained as the conversion unit.
    4. Special Case: If the original unit is 'plate' (usually for Rice), convert its value to 200.0 grams.
  
    MANDATORY QUANTIFICATION RULE:
    The LLM MUST remove ALL non-numeric placeholders like 'to taste' or 'as needed' from the 'conversion_unit' and 'standard_quantity' columns. For ALL ingredients that do not have a measured quantity in the VDB, the LLM MUST estimate their value into grams (g) or a logical count unit.
    OBLIGATION: ENSURE THAT NOT A SINGLE 'standard_quantity' FIELD CONTAINS 0.0, UNLESS IT IS TRULY NOT A CONSUMABLE INGREDIENT.
  `;
  
  const ParsedIngredientSchema = z.object({
    nama_bahan: z.string(),
    jumlah_standar: z.number(),
    satuan_konversi: z.string(),
  });
  
  const RecipeDataSchema = z.object({
    resep_id_vdb: z.string(),
    standar_porsi: z.number().positive(),
    bahan_parsed: z.array(ParsedIngredientSchema),
  });

  try {
    for (const item of items) {
      const { food_name: foodName, portion: portionInput } = item;
      const cachedRecipe = await Prisma.resep_makanan.findUnique({ where: { nama_olahan: foodName }});

      let recipeData;
      if (cachedRecipe && typeof cachedRecipe.uraian_bahan === "object" && cachedRecipe.uraian_bahan !== null) {
        console.log(`✅ Ditemukan di cache: ${foodName}`);
        recipeData = RecipeDataSchema.parse(cachedRecipe.uraian_bahan);
      } else {
        console.log(`❌ Tidak ditemukan di cache: ${foodName}. Memulai RAG...`);
        const queryVector = await embeddings.embedQuery(foodName.replace(/nasi/gi, "").trim());
        const queryResult = await index.namespace("recipes").query({ vector: queryVector, topK: 1, includeMetadata: true });

        if (!queryResult.matches || queryResult.matches.length === 0) {
          console.warn(`⚠️ Tidak ada resep yang ditemukan di Pinecone: ${foodName}`);
          continue;
        }

        const match = queryResult.matches[0];
        const context = `ORIGINAL FOOD NAME: ${foodName}\nVDB ID: ${match.id}\nRAW INGREDIENTS:\n${(match.metadata?.content as string)?.split("--").join("\n- ")}`;
        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest", systemInstruction: SYSTEM_INSTRUCTION });

        const prompt = `
          Based on the following recipe context, extract the ingredients into the JSON format.
          RECIPE CONTEXT:
          ${context}

          EXPECTED JSON FORMAT:
          {
            "resep_id_vdb": "${match.id}",
            "standar_porsi": 0.0,
            "bahan_parsed": [
              {"nama_bahan": "ingredient name", "jumlah_standar": 0.0, "satuan_konversi": "unit"}
            ]
          }
        `;

        let result;
        const maxRetries = 3; // Coba maksimal 3 kali

        for (let i = 0; i < maxRetries; i++) {
          try {
            result = await model.generateContent(prompt);
            break;
          } catch (error: unknown) {
            if (i === maxRetries - 1) throw error;
            console.warn(`⚠️ Upaya ke-${i + 1} gagal karena model overload. Mencoba lagi dalam 2 detik...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }

        if (!result) throw new Error("Gagal mendapatkan respons dari model setelah beberapa kali percobaan.");

        const jsonString = result.response.text().replace(/```json|```/g, "").trim();
        const parsedJson = JSON.parse(jsonString);

        if (/nasi/gi.test(foodName) && !parsedJson.bahan_parsed.some((ingredient: z.infer<typeof ParsedIngredientSchema>) => /beras|nasi/gi.test(ingredient.nama_bahan))) {
          console.log(`Adding Rice to: ${foodName}`);
          parsedJson.bahan_parsed.unshift({ nama_bahan: "Beras Putih Mentah", jumlah_standar: 200.0, satuan_konversi: "g" });
        }

        recipeData = RecipeDataSchema.parse(parsedJson);

        await Prisma.resep_makanan.create({
          data: {
            nama_olahan: foodName,
            id_resep_vektor_db: recipeData.resep_id_vdb,
            uraian_bahan: parsedJson,
            standar_porsi: recipeData.standar_porsi,
          },
        });
      }

      for (const ingredient of recipeData.bahan_parsed) {
        const foodRecord = await Prisma.pangan.findFirst({
          where: { nama_pangan: { equals: ingredient.nama_bahan, mode: "insensitive" }},
        });

        if (foodRecord && foodRecord.referensi_gram_berat > 0) {
          const consumedWeight = ingredient.jumlah_standar * (portionInput / recipeData.standar_porsi);
          await Prisma.pangan_keluarga.create({
            data: {
              id_keluarga: idFamily,
              id_pangan: foodRecord.id_pangan,
              nama_pangan: foodRecord.nama_pangan,
              urt: parseFloat((consumedWeight / foodRecord.referensi_gram_berat).toFixed(2)),
              tanggal: new Date(),
            },
          });

          console.log(`✅ Berhasil menyimpan ${ingredient.nama_bahan} untuk keluarga ${idFamily}`);
        } else {
          console.warn(`⚠️ Pangan "${ingredient.nama_bahan}" tidak ditemukan di DB atau referensi berat 0.`);
        }
      }
    }
  } catch (error: unknown) {
    console.error(`❌ Terjadi kesalahan besar saat mengekstraksi bahan makan: ${error}`);
  }
}