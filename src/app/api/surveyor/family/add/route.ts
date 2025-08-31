import { NextRequest, NextResponse } from "next/server";
import { SURVEYOR_FAMILY } from "@/constants/routes";
import type { Family, FamilyFoods } from "@/types/family";
import { Prisma } from "@/lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!process.env.NEXT_PUBLIC_APP_URL) throw new Error("NEXT_PUBLIC_APP_URL belum di-set di environment!");

    const { id_district, id_surveyor, name, family_card_number, village, address, members, income, spending, pregnant, breastfeeding, toddler, photo } = await request.json() as Family;
    const { id_family_foods, id_foods, portion } = await request.json() as FamilyFoods;

    await Prisma.keluarga.create({
      data: {
        id_kecamatan: Number(id_district),
        id_pengguna: Number(id_surveyor),
        nama_kepala_keluarga: name,
        nomor_kartu_keluarga: family_card_number,
        id_desa: Number(village),
        alamat: address,
        jumlah_keluarga: Number(members),
        rentang_pendapatan: income,
        rentang_pengeluaran: spending,
        hamil: pregnant === "YA" ? "YA" : "TIDAK",
        menyusui: breastfeeding === "YA" ? "YA" : "TIDAK",
        balita: toddler === "YA" ? "YA" : "TIDAK",
        gambar: photo,
      }
    });

    await Prisma.pangan_keluarga.create({
      data: {
        id_keluarga: Number(id_surveyor),
        id_pangan: Number(id_foods),
        jumlah_porsi: Number(portion),
      }
    });

    return NextResponse.redirect(new URL(SURVEYOR_FAMILY, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (err: unknown) {
    console.error(`Gagal menambah data keluarga: ${err}`);
    return NextResponse.json({ message: "Gagal menambah data keluarga" }, { status: 500 });
  }
}