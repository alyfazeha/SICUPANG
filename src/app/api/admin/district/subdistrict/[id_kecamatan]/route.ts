import { NextRequest } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id_kecamatan: string } },
): Promise<Response> {
  try {
    const id = Number(params.id_kecamatan);

    const where = id ? { id_kecamatan: id } : {};

    const totalDesa = await Prisma.desa.count({ where });
    const kecamatanData = await Prisma.kecamatan.findMany({
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

    const formattedData = kecamatanData.map((k) => ({
      id: k.id_kecamatan,
      kode: k.kode_wilayah,
      nama: k.nama_kecamatan,
      desa: k.desa.map((d) => ({
        id: d.id_desa,
        nama: d.nama_desa,
        kode: d.kode_wilayah,
      })),
    }));

    return new Response(
      JSON.stringify(
        {
          total: totalDesa,
          data: formattedData,
        },
        null,
        2,
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    console.error(
      `❌ Error GET /api/admin/district/subdistrict/[id_kecamatan]:`,
      err,
    );
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data kecamatan." }),
      { status: 500 },
    );
  }
}
