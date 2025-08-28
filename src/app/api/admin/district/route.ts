import { NextRequest } from "next/server";
import { Prisma } from "@/lib/prisma";


export async function GET(req: NextRequest): Promise<Response> {
  try {
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
    const limit = Math.min(
      100,
      Math.max(1, Number(req.nextUrl.searchParams.get("limit") ?? 25)),
    );
    const skip = (page - 1) * limit;

    const totalKecamatan = await Prisma.kecamatan.count();
    const kecamatanData = await Prisma.kecamatan.findMany({
      orderBy: { nama_kecamatan: "asc" },
      skip,
      take: limit,
    });

    const formattedData = kecamatanData.map((k) => ({
      id: k.id_kecamatan,
      kode: k.kode_wilayah,
      nama: k.nama_kecamatan
    }));

    return new Response(
      JSON.stringify(
        {
          total: totalKecamatan,
          total_pages: Math.ceil(totalKecamatan / limit),
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
