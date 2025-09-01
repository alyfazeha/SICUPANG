import { NextResponse } from "next/server";
import { API_SURVEYOR_FAMILY } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import { Family } from "@/types/family";

export async function GET(): Promise<NextResponse> {
  try {
    const family = await Prisma.keluarga.findMany({
      select: {
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

    const formattedData = family.map((value) => ({
      name: value.nama_kepala_keluarga,
      family_card_number: value.nomor_kartu_keluarga,
      village: value.desa.nama_desa,
      status: value.status,
      comment: value.komentar,
    }) as unknown as Pick<Family, "name" | "family_card_number" | "village" | "status" | "comment">);

    return NextResponse.json({ family: formattedData }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET ${API_SURVEYOR_FAMILY}: ${err}`);
    return NextResponse.json({ error: "Gagal dalam mengambil data keluarga." }, { status: 500 });
  }
}