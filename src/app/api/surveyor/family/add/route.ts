import { mkdir, writeFile } from "fs/promises";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { z } from "zod";
import { API_SURVEYOR_ADD_DATA_FAMILY, SURVEYOR_ADD_DATA_FAMILY, SURVEYOR_FAMILY } from "@/constants/routes";
import { AUTH_TOKEN } from "@/constants/token";
import { Prisma } from "@/lib/prisma";
import type { Auth } from "@/types/auth";
import type { Family, Foodstuff } from "@/types/family";

export async function GET(): Promise<NextResponse> {
  try {
    const villages = (await Prisma.desa.findMany({
      select: { id_desa: true, nama_desa: true, kode_wilayah: true },
      distinct: ["id_desa"],
    })).map((village) => ({
      id: village.id_desa,
      label: `${village.nama_desa} - ${village.kode_wilayah}`,
    }));

    const processingFoods = (await Prisma.pangan.findMany({
      select: { id_pangan: true, nama_pangan: true },
      distinct: ["id_pangan"],
    })).map((food) => ({
      id: food.id_pangan,
      label: food.nama_pangan,
    }));

    const salaryRanges = await Prisma.rentang_uang.findMany({
      select: { id_rentang_uang: true, batas_atas: true, batas_bawah: true },
      distinct: ["id_rentang_uang"],
    });

    const formattedSalary = salaryRanges.map((salary) => {
      if (salary.id_rentang_uang === 1) return { id: salary.id_rentang_uang, label: `< ${salary.batas_atas}` }; 
      else if (salary.id_rentang_uang === 15) return { id: salary.id_rentang_uang, label: `Lebih dari ${salary.batas_atas}` }; 
      return { id: salary.id_rentang_uang, label: `${salary.batas_bawah} - ${salary.batas_atas}` };
    });

    return NextResponse.json({ processed_foods: processingFoods, salary: formattedSalary, villages }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET ${API_SURVEYOR_ADD_DATA_FAMILY}: ${err}`);
    return NextResponse.json({ error: "Gagal mengambil data keluarga." }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {    
    const token = (await cookies()).get(AUTH_TOKEN)?.value;

    if (!token) {
      return NextResponse.json({ error: "Pengguna tidak terautentikasi" }, { status: 401 });
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    if (!decoded.id_pengguna) {
      return NextResponse.json({ message: "Token surveyor tidak valid" }, { status: 401 });
    }

    const user = await Prisma.pengguna.findUnique({  where: { id_pengguna: decoded.id_pengguna }  });
    if (!user) return NextResponse.json({ message: "Pengguna tidak ditemukan" }, { status: 404 });

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error("NEXT_PUBLIC_APP_URL belum di-set di environment!");
    }

    const formData = await request.formData();

    // ✅ Ambil file dari formData
    const file = formData.get("photo") as File | null;
    if (!file) {
      return NextResponse.json({ message: "Foto wajib diunggah." }, { status: 400 });
    }

    // ✅ Convert FormData ke object JS
    const values: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key !== "photo") values[key] = String(value);
    });

    // ✅ Parse foodstuff dengan type
    let foodstuff: Foodstuff[] = [];
    if (values.foodstuff) {
      try {
        foodstuff = JSON.parse(values.foodstuff) as Foodstuff[];
      } catch {
        return NextResponse.json({ message: "Format pangan keluarga tidak valid." }, { status: 400 });
      }
    }

    // ✅ Adaptasi field biar sesuai validasi
    const normalized: Record<keyof Pick<Family, "id_district" | "id_foods" | "id_surveyor" | "members" | "breastfeeding" | "pregnant" | "toddler" | "portion" | "village">, unknown> = {
      ...values,
      id_district: Number(values.id_district) || 0,
      id_foods: foodstuff[0]?.id ?? 0,
      id_surveyor: values.id_surveyor ?? null,
      members: Number(values.members) || 0,
      breastfeeding: values.breastfeeding === "Ya" ? "Ya" : "Tidak",
      pregnant: values.pregnant === "Ya" ? "Ya" : "Tidak",
      toddler: values.toddler === "Ya" ? "Ya" : "Tidak",
      portion: foodstuff[0]?.portion ?? 0,
      village: values.village || "",
    };

    // ✅ Validasi dengan Zod
    const validate = z.object({
      id_district: z.number(),
      id_surveyor: z.string().nullable(),
      name: z.string().min(1).max(50),
      family_card_number: z.string().min(1).max(16),
      village: z.string().min(1),
      address: z.string().min(1).max(100),
      members: z.number(),
      income: z.string().min(1).max(50),
      spending: z.string().min(1).max(50),
      pregnant: z.enum(["Ya", "Tidak"]),
      breastfeeding: z.enum(["Ya", "Tidak"]),
      toddler: z.enum(["Ya", "Tidak"]),
      id_foods: z.number(),
      portion: z.number(),
    });

    const parsed = validate.safeParse(normalized);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    // ✅ Simpan file
    const formattedDate = `${String(new Date().getDate()).padStart(2, "0")}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${new Date().getFullYear()}`;
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "-");
    const extension = file.name.split(".").pop()?.toLowerCase();
    const filename = `${formattedDate}-${nameWithoutExtension}.${extension}`;

    await mkdir(join(process.cwd(), "public", "storage", "family"), { recursive: true });
    await writeFile(join(process.cwd(), "public", "storage", "family", filename), Buffer.from(await file.arrayBuffer()));

    // ✅ Simpan ke database
    await Prisma.$transaction(async (table) => {
      const keluarga = await table.keluarga.create({
        data: {
          id_kecamatan: Number(user.id_kecamatan),
          id_pengguna: decoded.id_pengguna,
          nama_kepala_keluarga: parsed.data.name,
          nomor_kartu_keluarga: parsed.data.family_card_number,
          id_desa: Number(parsed.data.village),
          alamat: parsed.data.address,
          jumlah_keluarga: Number(parsed.data.members),
          rentang_pendapatan: Number(parsed.data.income),
          rentang_pengeluaran: Number(parsed.data.spending),
          hamil: parsed.data.pregnant,
          menyusui: parsed.data.breastfeeding,
          balita: parsed.data.toddler,
          gambar: `/storage/family/${filename}`,
        },
      });

      // ✅ Loop semua foodstuff lalu simpan ke pangan_keluarga
      for (const food of foodstuff) {
        await table.pangan_keluarga.create({
          data: {
            id_keluarga: keluarga.id_keluarga,
            id_pangan: food.id,
            urt: food.portion,
            tanggal: new Date(),
          },
        });
      }
    });

    return NextResponse.redirect(new URL(SURVEYOR_FAMILY, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), 303);
  } catch (err) {
    console.error(`❌ Error POST ${SURVEYOR_ADD_DATA_FAMILY}:`, err);
    return NextResponse.json({ message: "Gagal menambah data keluarga" }, { status: 500 });
  }
}