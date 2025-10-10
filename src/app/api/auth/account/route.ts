import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";
import { AUTH_TOKEN } from "@/constants/token";
import type { Auth } from "@/types/auth";

export async function GET(): Promise<NextResponse> {
  try {
    const token = (await cookies()).get(AUTH_TOKEN)?.value;

    if (!token) {
      return NextResponse.json({ error: "Pengguna tidak terautentikasi" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    const pengguna = await Prisma.pengguna.findUnique({
      where: { id_pengguna: decoded.id_pengguna },
      select: { nama_lengkap: true, nip: true },
    });

    return NextResponse.json({ data: pengguna }, { status: 200 });
  } catch (err: unknown) {
    console.error(`Server gagal mengambil data pengguna karena ${err}`);
    return NextResponse.json({ error: "Gagal mengambil data pengguna" }, { status: 500 });
  }
}