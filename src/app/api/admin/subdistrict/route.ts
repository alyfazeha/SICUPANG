import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma"; 

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? undefined;  
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 25)));
    const skip = (page - 1) * limit;

    const where = q
      ? { nama_kecamatan: { contains: q, mode: "insensitive" as const } }
      : undefined;

    const [rows, total] = await Promise.all([
      Prisma.kecamatan.findMany({
        where,
        orderBy: { nama_kecamatan: "asc" },
        skip,
        take: limit,
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
      }),
      Prisma.kecamatan.count({ where }),
    ]);

    const data = rows.map((k) => ({
      id: k.id_kecamatan,
      kode: k.kode_wilayah,
      nama: k.nama_kecamatan,
      desa: k.desa.map((d) => ({
        id: d.id_desa,
        nama: d.nama_desa,
        kode: d.kode_wilayah,
      })),
    }));

    return NextResponse.json(
      {
        data,
        meta: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
          q: q ?? null,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/kecamatan error:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data kecamatan." },
      { status: 500 }
    );
  }
}
