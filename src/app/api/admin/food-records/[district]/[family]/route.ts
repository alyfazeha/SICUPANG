import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(context: { params: { district: string } }): Promise<NextResponse> {
  try {
    const foodsFamily = await Prisma.keluarga.findMany({
      where: { id_keluarga: Number(context.params.district) },
      select: {
        id_keluarga: true,
        nama_kepala_keluarga: true,
        jumlah_keluarga: true,
        alamat: true,
        rentang_pendapatan: true,
        rentang_pengeluaran: true,
        balita: true,
        menyusui: true,
        hamil: true,
        desa: { select: { id_desa: true, nama_desa: true } },
        pangan_keluarga: {
          select: {
            id_pangan_keluarga: true,
            tanggal: true,
            urt: true,
            pangan: {
              select: {
                id_pangan: true,
                nama_pangan: true,
                id_takaran: true,
                takaran: { select: { nama_takaran: true } },
              },
            },
          },
          orderBy: [{ tanggal: "desc" }, { id_pangan_keluarga: "asc" }],
        },
      },
    });

    const response = foodsFamily.map((family) => {
      const byDate = family.pangan_keluarga.reduce((food, row) => {
        (food[row.tanggal.toISOString().slice(0, 10)] ??= []).push({ id: row.id_pangan_keluarga, urt: row.urt, pangan: row.pangan });
        return food;
      }, {} as Record<string, unknown[]>);

      return {
        id: family.id_keluarga,
        nama_kepala_keluarga: family.nama_kepala_keluarga,
        konsumsi_per_tanggal: Object.entries(byDate).map(([date, items]) => ({ date, items })),
      };
    });

    if (response.length === 0) {
      return NextResponse.json({ message: "Data pangan keluarga tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ id: foodsFamily }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET /api/admin/food-records/[district]/[family]: ${err}`);
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data pangan keluarga berdasarkan kecamatan." }, { status: 500 });
  }
}