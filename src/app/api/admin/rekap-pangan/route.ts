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

    const kecamatanWithCounts = await Prisma.kecamatan.findMany({
      select: {
        id_kecamatan: true,
        nama_kecamatan: true,
        _count: {
          select: { keluarga: true }, 
        },
      },
      orderBy: { nama_kecamatan: "asc" },
    });

    const formattedData = kecamatanWithCounts.map((k) => ({
      id_kecamatan: k.id_kecamatan,
      nama_kecamatan: k.nama_kecamatan,
      total_keluarga: k._count.keluarga,
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
      `❌ Error GET /api/admin/rekap-pangan`,
      err,
    );
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data kecamatan." }),
      { status: 500 },
    );
  }
}
