import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";
import { Surveyor } from "@/types/surveyor";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body: Surveyor = await request.json();

    await Prisma.pengguna.update({
      where: { id_pengguna: parseInt((await params).id, 10) },
      data: {
        nama_lengkap: body.full_name,
        nip: body.nip,
        nomor_telepon: body.phone_number,
        id_kecamatan: body.district ? parseInt((body.district.id as number).toString(), 10) : null,
        ...(body.password ? { kata_sandi: await hash(body.password, 10) } : {}),
      },
    });

    return NextResponse.json({ message: "Data surveyor berhasil diperbarui." }, { status: 200 });
  } catch (err) {
    console.error("❌ [route] Error PATCH /api/admin/surveyors/[id]: ", err);
    return NextResponse.json({ message: "Terjadi kesalahan saat memperbarui data surveyor." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await Prisma.pengguna.delete({ where: { id_pengguna: parseInt((await params).id, 10) }});
    return NextResponse.json({ message: "Data surveyor berhasil dihapus." }, { status: 200 });
  } catch (err) {
    console.error("❌ [route] Error DELETE /api/admin/surveyors/[id]: ", err);
    return NextResponse.json({ message: "Terjadi kesalahan saat menghapus data surveyor." }, { status: 500 });
  }
}