import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const family = await Prisma.keluarga.findUnique({ where: { id_keluarga: parseInt(id, 10) } });

    if (!family) {
      return NextResponse.json({ message: "Data keluarga tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ family, message: "✅ Data keluarga berhasil diambil" }, { status: 200 });
  } catch (err: unknown) {
    console.error(`Gagal mengambil data keluarga: ${err}`);
    return NextResponse.json({ message: "Gagal mengambil data keluarga" }, { status: 500 });
  }
}