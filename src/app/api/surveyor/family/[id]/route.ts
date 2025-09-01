import { NextRequest, NextResponse } from "next/server";
import { SURVEYOR_FAMILY } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, context: { params: { id: string } }): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const id_keluarga = parseInt(id, 10);

    if (isNaN(id_keluarga)) {
      return NextResponse.json({ message: "ID keluarga tidak valid!" }, { status: 400 });
    }

    await Prisma.pangan_keluarga.deleteMany({ where: { id_keluarga } });
    await Prisma.keluarga.deleteMany({ where: { id_keluarga } });

    return NextResponse.redirect(new URL(SURVEYOR_FAMILY, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (err: unknown) {
    console.error(`Gagal menghapus data keluarga: ${err}`);
    return NextResponse.json({ message: "Gagal menghapus data keluarga" }, { status: 500 });
  }
}