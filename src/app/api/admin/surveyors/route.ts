import { Prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function GET(): Promise<Response> {
  try {
    const q = undefined;
    const page = 1;
    const limit = 25;
    const skip = (page - 1) * limit;

    const where = {
      peran: "SURVEYOR" as const,
      ...(q
        ? {
            OR: [
              { nama_lengkap: { contains: q, mode: "insensitive" as const } },
              { nip: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const totalSurveyors = await Prisma.pengguna.count({ where });
    const surveyors = await Prisma.pengguna.findMany({
      where,
      skip,
      take: limit,
      orderBy: { nama_lengkap: "asc" },
      include: {
        kecamatan: {
          select: { id_kecamatan: true, nama_kecamatan: true },
        },
      },
    });

    const formattedData = surveyors.map((item) => ({
      id: item.id_pengguna,
      nama: item.nama_lengkap,
      nip: item.nip ?? null,
      kecamatan: item.kecamatan
        ? {
            id: item.kecamatan.id_kecamatan,
            nama: item.kecamatan.nama_kecamatan,
          }
        : null,
    }));

    return new Response(
      JSON.stringify(
        {
          total: totalSurveyors,
          total_pages: Math.ceil(totalSurveyors / limit),
          data: formattedData,
        },
        null,
        2,
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err: unknown) {
    console.error(`Terjadi kesalahan saat mengambil data surveyor: ${err}`);
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data surveyor." }),
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const validate = z.object({
      nip: z.string().min(5, { message: "NIP minimal 16 karakter." }),
      kata_sandi: z
        .string()
        .min(7, { message: "Kata sandi minimal 7 karakter." }),
      nomor_telepon: z
        .string()
        .regex(/^[0-9]+$/, { message: "Nomor Telepon hanya boleh angka!" })
        .min(10, { message: "Nomor Telepon minimal 10 digit!" }),

      id_kecamatan: z.number({ message: "id_kecamatan wajib diisi." }),
    });

    const body = await request.json();
    const parsed = validate.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return NextResponse.json({ errors }, { status: 400 });
    }
    const { nip, kata_sandi, nomor_telepon, id_kecamatan } = parsed.data;

    const existing = await Prisma.pengguna.findUnique({
      where: { nip },
    });
    if (existing) {
      return NextResponse.json(
        { errors: [{ field: "nip", message: "NIP sudah terdaftar!" }] },
        { status: 400 },
      );
    }

    const kecamatan = await Prisma.kecamatan.findUnique({
      where: { id_kecamatan: id_kecamatan },
    });

    if (!kecamatan) {
      return NextResponse.json(
        { errors: "District not found!" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(kata_sandi, 10);

    const newSurveyor = await Prisma.pengguna.create({
      data: {
        nama_lengkap: body.nama,
        nip: nip,
        peran: "SURVEYOR",
        id_kecamatan: id_kecamatan,
        nomor_telepon: nomor_telepon,
        kata_sandi: hashedPassword,
      },
    });

    return new Response(JSON.stringify(newSurveyor, null, 2), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error(`❌ Error POST /api/admin/surveyors:`, err);
    return new Response(
      JSON.stringify({ error: "Gagal menambahkan surveyor." }),
      { status: 500 },
    );
  }
}