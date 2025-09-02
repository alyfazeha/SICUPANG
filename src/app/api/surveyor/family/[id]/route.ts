import { NextResponse } from "next/server";
import { SURVEYOR_FAMILY } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
// import type { Family } from "@/types/family";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    await Prisma.pangan_keluarga.deleteMany({ where: { id_keluarga: parseInt(id, 10) } });
    await Prisma.keluarga.delete({ where: { id_keluarga: parseInt(id, 10) } });

    return NextResponse.json({ message: "✅ Data keluarga berhasil dihapus" }, { status: 200 });
  } catch (err: unknown) {
    console.error(`Gagal menghapus data keluarga: ${err}`);
    return NextResponse.json({ message: "❌ Gagal menghapus data keluarga" }, { status: 500 });
  }
}

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

export async function PATCH() {
  try {
    if (!process.env.NEXT_PUBLIC_APP_URL) throw new Error("NEXT_PUBLIC_APP_URL belum di-set di environment!");
    return NextResponse.redirect(new URL(SURVEYOR_FAMILY, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (err: unknown) {
    console.error(`Gagal mengedit data keluarga: ${err}`);
    return NextResponse.json({ message: "Gagal mengedit data keluarga" }, { status: 500 });
  }
}