import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";
import { Prisma } from "@/lib/prisma";
import { AUTH_TOKEN } from "@/constants/token";
import { SURVEYOR_FAMILY } from "@/constants/routes";
import { extractAndSaveIngredients } from "@/services/ingredient-extract";
import type { Auth } from "@/types/auth";
import type { Foodstuff } from "@/types/family";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get(AUTH_TOKEN)?.value;
    if (!token) return NextResponse.json({ error: "Pengguna tidak terautentikasi" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    const user = await Prisma.pengguna.findUnique({ where: { id_pengguna: decoded.id_pengguna } });
    if (!user) return NextResponse.json({ message: "Pengguna tidak ditemukan" }, { status: 404 });

    const { id } = await params;
    const id_keluarga = Number(id);
    if (!id_keluarga) return NextResponse.json({ message: "ID keluarga tidak valid" }, { status: 400 });

    const formData = await request.formData();
    const file = formData.get("photo") as File | null;

    const values: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key !== "photo") values[key] = String(value);
    });

    let foodstuff: Foodstuff[] = [];
    if (values.foodstuff) {
      try {
        foodstuff = JSON.parse(values.foodstuff) as Foodstuff[];
      } catch {
        return NextResponse.json({ message: "Format pangan keluarga tidak valid." }, { status: 400 });
      }
    }

    const validate = z.object({
      id_district: z.string(),
      id_surveyor: z.string().nullable(),
      name: z.string().min(1).max(50),
      family_card_number: z.string().min(1).max(16),
      village: z.string().min(1),
      address: z.string().min(1).max(100),
      members: z.string(),
      income: z.string(),
      spending: z.string(),
      pregnant: z.enum(["Ya", "Tidak"]),
      breastfeeding: z.enum(["Ya", "Tidak"]),
      toddler: z.enum(["Ya", "Tidak"]),
    });

    const parsed = validate.safeParse(values);
    if (!parsed.success) {
      console.error(`❌ Error VALIDATION /api/surveyor/family/${id}/patch: `, parsed.error.issues);
      return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    const oldFamilyData = await Prisma.keluarga.findUnique({ where: { id_keluarga }, select: { gambar: true } });
    let newImageUrl = oldFamilyData?.gambar;

    if (file && file.size > 0) {
      const blob = await put(file.name, file, { access: "public", addRandomSuffix: true });
      newImageUrl = blob.url;

      if (oldFamilyData?.gambar) {
        try {
          await del(oldFamilyData.gambar);
        } catch (delError) {
          console.warn(`Gagal menghapus file lama dari Blob: ${delError}`);
        }
      }
    }

    await Prisma.keluarga.update({
      where: { id_keluarga },
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
        gambar: newImageUrl,
      },
    });

    await Prisma.pangan_keluarga.deleteMany({ where: { id_keluarga } });

    if (foodstuff && foodstuff.length > 0) {
      const itemsToProcess = foodstuff.map((food) => ({ food_name: food.name, portion: food.portion }));
      extractAndSaveIngredients(id_keluarga, itemsToProcess).catch((err) => console.error(`Gagal menjalankan ekstraksi AI di latar belakang (edit): ${err}`));
    }

    return NextResponse.redirect(new URL(SURVEYOR_FAMILY, request.url), 303);
  } catch (err) {
    console.error("Gagal mengedit data keluarga:", err);
    return NextResponse.json({ message: "Gagal mengedit data keluarga" }, { status: 500 });
  }
}