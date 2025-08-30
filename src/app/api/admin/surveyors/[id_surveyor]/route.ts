import { NextRequest } from "next/server";
import { Prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id_surveyor: string } },
): Promise<Response> {
  try {
    const { id_surveyor } = await params; 
    const id = Number(id_surveyor);
    if (!Number.isFinite(id) || id <= 0) {
      return new Response(
        JSON.stringify({ error: "id_surveyor tidak valid." }, null, 2),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const surveyor = await Prisma.pengguna.findUnique({
      where: { id_pengguna: id },
      include: {
        kecamatan: {
          select: { id_kecamatan: true, nama_kecamatan: true },
        },
      },
    });

    if (!surveyor) {
      return new Response(
        JSON.stringify({ error: "Surveyor tidak ditemukan." }, null, 2),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const data = {
      id: surveyor.id_pengguna,
      nama: surveyor.nama_lengkap,
      nip: surveyor.nip,
      nomor_telepon: surveyor.nomor_telepon,
      peran: surveyor.peran,
      kecamatan: surveyor.kecamatan
        ? {
            id: surveyor.kecamatan.id_kecamatan,
            nama: surveyor.kecamatan.nama_kecamatan,
          }
        : null,
    };

    return new Response(JSON.stringify({ data }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("❌ Error GET /api/admin/surveyor/[id_surveyor]:", err);
    return new Response(
      JSON.stringify(
        { error: "Gagal mengambil data detail surveyor." },
        null,
        2,
      ),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id_surveyor: string } },
): Promise<Response> {
  try {
    const id = Number(params.id_surveyor);
    if (!Number.isFinite(id) || id <= 0) {
      return new Response(
        JSON.stringify({ error: "id_surveyor tidak valid." }, null, 2),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const surveyor = await Prisma.pengguna.findUnique({
      where: { id_pengguna: id },
    });

    if (!surveyor) {
      return new Response(
        JSON.stringify({ error: "Surveyor tidak ditemukan." }, null, 2),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const deletedUser = await Prisma.pengguna.delete({
      where: { id_pengguna: id },
    });

    return new Response(
      JSON.stringify(
        {
          message: "Surveyor berhasil dihapus.",
          data: {
            id: deletedUser.id_pengguna,
            nama: deletedUser.nama_lengkap,
            nip: deletedUser.nip,
          },
        },
        null,
        2,
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    console.error("❌ Error DELETE /api/admin/surveyor/[id_surveyor]:", err);
    return new Response(
      JSON.stringify({ error: "Gagal menghapus surveyor." }, null, 2),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id_surveyor: string } },
): Promise<Response> {
  try {
    const id = Number(params.id_surveyor);
    if (!Number.isFinite(id) || id <= 0) {
      return new Response(
        JSON.stringify({ error: "id_surveyor tidak valid." }, null, 2),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const existing = await Prisma.pengguna.findUnique({
      where: { id_pengguna: id },
      select: { id_pengguna: true, nip: true },
    });
    
    if (!existing) {
      return new Response(
        JSON.stringify({ error: "Surveyor tidak ditemukan." }, null, 2),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const validate = z.object({
      nama: z.string().min(3, { message: "Nama minimal 3 karakter." }).optional(),
      nip: z
        .string()
        .regex(/^[0-9]+$/, { message: "NIP hanya boleh angka!" })
        .min(5, { message: "NIP minimal 5 digit." })
        .optional(),
      nomor_telepon: z
        .string()
        .regex(/^[0-9]+$/, { message: "Nomor Telepon hanya boleh angka!" })
        .min(10, { message: "Nomor Telepon minimal 10 digit!" })
        .optional(),
      id_kecamatan: z.number().optional(),
      kata_sandi: z.string().min(7, { message: "Kata sandi minimal 7 karakter." }).optional(),
    });

    const body = await req.json();
    const parsed = validate.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return new Response(JSON.stringify({ errors }, null, 2), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { nama, nip, nomor_telepon, id_kecamatan, kata_sandi } = parsed.data;

    if (nip && nip !== existing.nip) {
      const nipClash = await Prisma.pengguna.findUnique({ where: { nip } });
      if (nipClash) {
        return new Response(
          JSON.stringify(
            { errors: [{ field: "nip", message: "NIP sudah terdaftar!" }] },
            null,
            2,
          ),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    if (typeof id_kecamatan === "number") {
      const kec = await Prisma.kecamatan.findUnique({ where: { id_kecamatan } });
      if (!kec) {
        return new Response(
          JSON.stringify(
            { errors: [{ field: "id_kecamatan", message: "District not found!" }] },
            null,
            2,
          ),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    const dataToUpdate: any = {};
    if (nama !== undefined) dataToUpdate.nama_lengkap = nama;
    if (nip !== undefined) dataToUpdate.nip = nip;
    if (nomor_telepon !== undefined) dataToUpdate.nomor_telepon = nomor_telepon;
    if (id_kecamatan !== undefined) dataToUpdate.id_kecamatan = id_kecamatan;
    if (kata_sandi !== undefined) {
      dataToUpdate.kata_sandi = await bcrypt.hash(kata_sandi, 10);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return new Response(
        JSON.stringify({ message: "Tidak ada perubahan data." }, null, 2),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }


    const updated = await Prisma.pengguna.update({
      where: { id_pengguna: id },
      data: dataToUpdate,
      include: {
        kecamatan: { select: { id_kecamatan: true, nama_kecamatan: true } },
      },
    });


    return new Response(
      JSON.stringify(
        {
          message: "Surveyor berhasil diperbarui.",
          data: {
            id: updated.id_pengguna,
            nama: updated.nama_lengkap,
            nip: updated.nip,
            nomor_telepon: updated.nomor_telepon,
            kecamatan: updated.kecamatan
              ? {
                  id: updated.kecamatan.id_kecamatan,
                  nama: updated.kecamatan.nama_kecamatan,
                }
              : null,
          },
        },
        null,
        2,
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    console.error("❌ Error PUT /api/admin/surveyor/[id_surveyor]:", err);
    return new Response(
      JSON.stringify({ error: "Gagal memperbarui surveyor." }, null, 2),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}