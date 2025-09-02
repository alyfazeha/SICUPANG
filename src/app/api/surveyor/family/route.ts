import { NextResponse } from "next/server";
import { API_SURVEYOR_FAMILY } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import type { Family as F } from "@/types/family";

type Family = Pick<F, "id_family" | "name" | "family_card_number" | "village" | "status" | "comment">;

export async function GET(): Promise<NextResponse> {
  try {
    const family = await Prisma.keluarga.findMany({
      select: {
        id_keluarga: true,
        nama_kepala_keluarga: true,
        nomor_kartu_keluarga: true,
        desa: { select: { nama_desa: true } },
        status: true,
        komentar: true,
      },
    });

    if (!family || family.length === 0) {
      return NextResponse.json({ message: "Data keluarga tidak ditemukan." }, { status: 404 });
    }

    const formattedData: Family[]= family.map((value) => ({
      id_family: value.id_keluarga,
      name: value.nama_kepala_keluarga,
      family_card_number: value.nomor_kartu_keluarga,
      village: value.desa.nama_desa,
      status: value.status,
      comment: value.komentar,
    }));

    return NextResponse.json({ family: formattedData }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET ${API_SURVEYOR_FAMILY}: ${err}`);
    return NextResponse.json({ error: "Gagal dalam mengambil data keluarga." }, { status: 500 });
  }
}