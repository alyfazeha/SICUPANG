import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { Prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const familyToDelete = await Prisma.keluarga.findUnique({
      where: { id_keluarga: parseInt(id, 10) },
      select: { gambar: true },
    });

    if (familyToDelete?.gambar) await del(familyToDelete.gambar);
    await Prisma.keluarga.delete({ where: { id_keluarga: parseInt(id, 10) } });
    return NextResponse.json({ message: "Data keluarga berhasil dihapus." });
  } catch (error) {
    console.error(`❌ Error DELETE /api/surveyor/family/[id]/delete: ${error}`);
    return NextResponse.json({ error: "Gagal menghapus data keluarga." }, { status: 500 });
  }
}