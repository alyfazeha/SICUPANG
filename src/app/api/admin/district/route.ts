import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? 25)));
    const skip = (page - 1) * limit;

    const numberOfVillages = await Prisma.kecamatan.count();
    const districts = await Prisma.kecamatan.findMany({
      orderBy: { nama_kecamatan: "asc" },
      skip,
      take: limit,
    });

    const formattedData = districts.map((district) => ({
      id: district.id_kecamatan,
      kode: district.kode_wilayah,
      nama: district.nama_kecamatan,
    }));

    return NextResponse.json({ data: formattedData, pages: Math.ceil(numberOfVillages / limit), total: numberOfVillages }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET /api/admin/district/subdistrict: ${err}`);
    return NextResponse.json({ error: "Gagal mengambil data kecamatan." }, { status: 500 });
  }
}