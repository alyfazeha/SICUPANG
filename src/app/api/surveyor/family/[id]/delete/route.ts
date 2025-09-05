import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";
import { cwd } from "process";
import { Prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const documentation = await Prisma.keluarga.findUnique({
      where: { id_keluarga: parseInt(id, 10) },
      select: { gambar: true },
    });

    if (documentation?.gambar) {
      const path = join(cwd(), "public", documentation.gambar);
      await unlink(path);
    }

    await Prisma.pangan_keluarga.deleteMany({ where: { id_keluarga: parseInt(id, 10) } });
    await Prisma.keluarga.delete({ where: { id_keluarga: parseInt(id, 10) } });

    return NextResponse.json({ message: "✅ Data keluarga berhasil dihapus" }, { status: 200 });
  } catch (err: unknown) {
    console.error(`Gagal menghapus data keluarga: ${err}`);
    return NextResponse.json({ message: "❌ Gagal menghapus data keluarga" }, { status: 500 });
  }
}