import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(context: { params: { district: string } }): Promise<NextResponse> {
  try {
    const id_district = Number(context.params.district);

    const family = await Prisma.keluarga.findMany({
      where: { id_kecamatan: id_district },
      select: {
        id_keluarga: true,
        nama_kepala_keluarga: true,
        nomor_kartu_keluarga: true,
        desa: { select: { id_desa: true, nama_desa: true } },
      },
    });

    if (!family || family.length === 0) {
      return NextResponse.json(
        { message: "Keluarga tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ family }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET /api/admin/food-records/[district]: ${err}`);
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data." }, { status: 500 });
  }
}