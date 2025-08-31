import { Prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const userId = req.headers.get("x-user-id");
    console.log(userId);
    const id = Number(userId);

    const pengguna = await Prisma.pengguna.findUnique({
      where: { id_pengguna: id },
    });

    if (!pengguna) {
      return new Response(
        JSON.stringify({ error: "Data pengguna tidak ditemukan." }, null, 2),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const totalVillages = await Prisma.desa.count({
      where: { id_kecamatan: Number(pengguna.id_kecamatan) },
    });

    const totalFamilies = await Prisma.keluarga.count({
      where: { id_kecamatan: Number(pengguna.id_kecamatan) },
    });

    const familiesData = await Prisma.keluarga.findMany({
      where: { id_kecamatan: Number(pengguna.id_kecamatan) },
      select: {
        id_keluarga: true,
        nama_kepala_keluarga: true,
        desa: true,
      },
      take: 10,
      orderBy: { nama_kepala_keluarga: "asc" },
    });

    const formattedData = familiesData.map((item) => ({
      id_keluarga: item.id_keluarga,
      nama_kepala_keluarga: item.nama_kepala_keluarga,
      desa: item.desa,
    }));
    
    return new Response(
      JSON.stringify(
        {
          jumlah_desa: totalVillages,
          jumlah_keluarga: totalFamilies,
          data: formattedData,
        },
        null,
        2,
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    console.error(
      `Terjadi kesalahan saat mengambil data keluarga pada halaman dasbor surveyor: ${err}`,
    );
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data keluarga." }),
      { status: 500 },
    );
  }
}
