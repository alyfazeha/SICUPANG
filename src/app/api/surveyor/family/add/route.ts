import { mkdir, writeFile } from "fs/promises";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { z } from "zod";
import { SURVEYOR_ADD_DATA_FAMILY, SURVEYOR_FAMILY } from "@/constants/routes";
import { AUTH_TOKEN } from "@/constants/token";
import { Prisma } from "@/lib/prisma";
import type { Auth } from "@/types/auth";
import type { Foodstuff } from "@/types/family";

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
    const normalized: Record<string, unknown> = {
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
    const filename = `${Date.now()}-${file.name}`;
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
          rentang_pendapatan: parsed.data.income,
          rentang_pengeluaran: parsed.data.spending,
          hamil: parsed.data.pregnant,
          menyusui: parsed.data.breastfeeding,
          balita: parsed.data.toddler,
          gambar: `/storage/family/${filename}`,
        },
      });

      await table.pangan_keluarga.create({
        data: {
          id_keluarga: keluarga.id_keluarga,
          id_pangan: Number(parsed.data.id_foods),
          urt: Number(parsed.data.portion),
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