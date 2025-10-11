import { NextResponse } from "next/server";
import { API_SURVEYOR_FAMILY } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { AUTH_TOKEN } from "@/constants/token";
import type { Family as F } from "@/types/family";
import type { Auth } from "@/types/auth";

type Family = Pick<F, "id_family" | "name" | "family_card_number" | "village" | "status" | "comment">;

export async function GET(): Promise<NextResponse> {
  try {
    const token = (await cookies()).get(AUTH_TOKEN)?.value;
    if (!token) {
      return NextResponse.json({ error: "Pengguna tidak terautentikasi" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    if (!decoded.id_pengguna) {
      return NextResponse.json({ message: "Token surveyor tidak valid" }, { status: 401 });
    }

    const surveyor = await Prisma.pengguna.findUnique({
      where: { id_pengguna: decoded.id_pengguna },
      select: { id_kecamatan: true },
    });

    if (!surveyor?.id_kecamatan) {
      return NextResponse.json({ error: "Surveyor tidak punya kecamatan." }, { status: 403 });
    }

    const family = await Prisma.keluarga.findMany({
      where: { id_kecamatan: surveyor.id_kecamatan },
      select: {
        id_keluarga: true,
        nama_kepala_keluarga: true,
        nomor_kartu_keluarga: true,
        desa: { select: { nama_desa: true } },
        status: true,
        komentar: true,
      },
    });

    if (family.length === 0) {
      return NextResponse.json({ message: "Data keluarga tidak ditemukan." }, { status: 404 });
    }

    const formattedData: Family[] = family.map((value) => ({
      id_family: value.id_keluarga,
      name: value.nama_kepala_keluarga,
      family_card_number: value.nomor_kartu_keluarga,
      village: value.desa.nama_desa,
      status: value.status,
      comment: value.komentar,
    }));

    return NextResponse.json({ family: formattedData }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET ${API_SURVEYOR_FAMILY}: ${err}`);
    return NextResponse.json({ error: "Gagal dalam mengambil data keluarga." }, { status: 500 });
  }
}