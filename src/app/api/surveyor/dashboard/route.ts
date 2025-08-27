import { Prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  try {
    const totalVillages = await Prisma.keluarga.findMany({ where: { id_pengguna: 1 }, select: { id_desa: true }, distinct: ["id_desa"] });
    const totalFamilies = await Prisma.keluarga.count({ where: { id_pengguna: 1 } });
    const familiesData = await Prisma.keluarga.findMany({ where: { id_pengguna: 1 }, include: { desa: true }, take: 10, orderBy: { created_at: "desc" } });

    const formattedData = familiesData.map((item) => ({
      id_keluarga: item.id_keluarga,
      nama_kepala_keluarga: item.nama_kepala_keluarga,
      nomor_kartu_keluarga: item.nomor_kartu_keluarga,
      desa: item.desa,
    }));

    return new Response(JSON.stringify({ jumlah_desa: totalVillages.length, jumlah_keluarga: totalFamilies, data: formattedData }), { status: 200 });
  } catch (err: unknown) {
    console.error(`Terjadi kesalahan saat mengambil data keluarga pada halaman dasbor surveyor: ${err}`);
    return new Response(JSON.stringify({ error: "Gagal mengambil data keluarga." }), { status: 500 });
  }
}