import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { SURVEYOR_ADD_DATA_FAMILY, SURVEYOR_FAMILY } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import z from "zod";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error("NEXT_PUBLIC_APP_URL belum di-set di environment!");
    }

    // ✅ Ambil formData (bukan JSON)
    const formData = await request.formData();

    const validate = z.object({
      id_district: z.union([z.string(), z.number()]),
      id_surveyor: z.string().nullable(),
      name: z.string().min(1).max(50),
      family_card_number: z.string().min(1).max(16),
      village: z.string().min(1),
      address: z.string().min(1).max(100),
      members: z.string(),
      income: z.string().min(1).max(50),
      spending: z.string().min(1).max(50),
      pregnant: z.enum(["Ya", "Tidak"]),
      breastfeeding: z.enum(["Ya", "Tidak"]),
      toddler: z.enum(["Ya", "Tidak"]),
      id_foods: z.string(),
      portion: z.string(),
    });

    // ✅ Ambil file dari formData
    const file = formData.get("photo") as File | null;
    if (!file) {
      return NextResponse.json({ message: "Foto wajib diunggah" }, { status: 400 });
    }

    const values: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      if (key !== "photo") values[key] = value;
    });

    const parsed = validate.safeParse(values);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;

    // ✅ Tentukan path penyimpanan
    await mkdir(join(process.cwd(), "storage", "family"), { recursive: true });

    // ✅ Simpan file ke storage
    await writeFile(join(join(process.cwd(), "storage", "family"), `${Date.now()}-${file.name}`), Buffer.from(await file.arrayBuffer()));

    await Prisma.$transaction(async (table) => {
      const keluarga = await table.keluarga.create({
        data: {
          id_kecamatan: Number(data.id_district),
          id_pengguna: Number(data.id_surveyor),
          nama_kepala_keluarga: data.name,
          nomor_kartu_keluarga: data.family_card_number,
          id_desa: Number(data.village),
          alamat: data.address,
          jumlah_keluarga: Number(data.members),
          rentang_pendapatan: data.income,
          rentang_pengeluaran: data.spending,
          hamil: data.pregnant ? "Ya" : "Tidak",
          menyusui: data.breastfeeding ? "Ya" : "Tidak",
          balita: data.toddler ? "Ya" : "Tidak",
          gambar: `/storage/family/${`${Date.now()}-${file.name}`}`,
        },
      });

      await table.pangan_keluarga.create({
        data: {
          id_keluarga: keluarga.id_keluarga,
          id_pangan: Number(data.id_foods),
          urt: Number(data.portion),
          tanggal: new Date(),
        },
      });
    });

    return NextResponse.redirect(new URL(SURVEYOR_FAMILY, process.env.NEXT_PUBLIC_APP_URL));
  } catch (err) {
    console.error(`❌ Error POST ${SURVEYOR_ADD_DATA_FAMILY}:`, err);
    return NextResponse.json({ message: "Gagal menambah data keluarga" }, { status: 500 });
  }
}