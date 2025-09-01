import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const { id } = params;
    const where = id ? { id_kecamatan: Number(id) } : {};

    const totalOfVillages = await Prisma.desa.count({ where });
    const districts = await Prisma.kecamatan.findMany({
      where,
      orderBy: { nama_kecamatan: "asc" },
      include: {
        desa: {
          select: {
            id_desa: true,
            id_kecamatan: true,
            nama_desa: true,
            kode_wilayah: true,
          },
          orderBy: { nama_desa: "asc" },
        },
      },
    });

    const formattedData = districts.map((district) => ({
      id: district.id_kecamatan,
      kode: district.kode_wilayah,
      nama: district.nama_kecamatan,
      desa: district.desa.map((village) => ({
        id: village.id_desa,
        nama: village.nama_desa,
        kode: village.kode_wilayah,
      })),
    }));

    return NextResponse.json({ total: totalOfVillages, data: formattedData }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET /api/admin/district/subdistrict/[id]:`, err);
    return NextResponse.json({ error: "Gagal mengambil data kecamatan." }, { status: 500 });
  }
}