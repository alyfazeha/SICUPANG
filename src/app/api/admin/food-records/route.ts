import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get("limit") ?? 25)));
    const skip = (page - 1) * limit;

    const totalofDistrict = await Prisma.kecamatan.count();

    const districtWithCounts = await Prisma.kecamatan.findMany({
      skip,
      take: limit,
      orderBy: { nama_kecamatan: "asc" },
      select: {
        id_kecamatan: true,
        nama_kecamatan: true,
        _count: { select: { keluarga: true } },
      },
    });

    const formattedData = districtWithCounts.map((district) => ({
      id_kecamatan: district.id_kecamatan,
      nama_kecamatan: district.nama_kecamatan,
      total_keluarga: district._count.keluarga,
    }));

    return NextResponse.json({ total: totalofDistrict, pages: Math.ceil(totalofDistrict / limit), data: formattedData }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET /api/admin/rekap-pangan: ${err}`);
    return NextResponse.json({ error: "Gagal mengambil data kecamatan." }, { status: 500 });
  }
}