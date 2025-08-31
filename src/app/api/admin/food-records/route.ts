import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? 25)));
    const skip = (page - 1) * limit;

    // Menghitung total kecamatan.
    const totalOfDistricts = await Prisma.kecamatan.count();

    // Mengambil data kecamatan dengan paginasi.
    const districtWithCounts = await Prisma.kecamatan.findMany({
      skip,
      take: limit,
      select: {
        id_kecamatan: true,
        nama_kecamatan: true,
        _count: { select: { keluarga: true } },
      },
      orderBy: { nama_kecamatan: "asc" },
    });

    const formattedData = districtWithCounts.map((district) => ({
      id_kecamatan: district.id_kecamatan,
      nama_kecamatan: district.nama_kecamatan,
      total_keluarga: district._count.keluarga,
    }));

    return NextResponse.json({ data: formattedData, paginasi: Math.ceil(totalOfDistricts / limit), total: totalOfDistricts }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET /api/admin/food-records: ${err}`);
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data." }, { status: 500 });
  }
}