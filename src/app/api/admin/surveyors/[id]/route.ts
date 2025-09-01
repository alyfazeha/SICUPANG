import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const surveyor = await Prisma.pengguna.findMany({
      where: { peran: "SURVEYOR" },
      select: {
        id_pengguna: true,
        nama_lengkap: true,
        nip: true,
        nomor_telepon: true,
        kecamatan: { select: { id_kecamatan: true, nama_kecamatan: true } },
      },
    });

    if (!surveyor || surveyor.length === 0) {
      return NextResponse.json({ message: "Surveyor tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ surveyor }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET /api/admin/surveyors/[id]: ${err}`);
    return NextResponse.json({ message: "Terjadi kesalahan saat mengambil data." }, { status: 500 });
  }
}