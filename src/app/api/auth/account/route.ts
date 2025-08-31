// src/app/api/auth/account/route.ts
import { Prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { AUTH_TOKEN } from "@/constants/token";
import type { Auth } from "@/types/auth";

export async function GET(): Promise<Response> {
  try {
    const token = (await cookies()).get(AUTH_TOKEN)?.value;

    if (!token) {
      return new Response(JSON.stringify({ data: null }), { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    const pengguna = await Prisma.pengguna.findUnique({
      where: { id_pengguna: decoded.id_pengguna },
      select: { nama_lengkap: true, nip: true },
    });

    return new Response(JSON.stringify({ data: pengguna }), { status: 200 });
  } catch (err: unknown) {
    console.error(`Server gagal mengambil data pengguna karena ${err}`);
    return new Response(JSON.stringify({ error: "Gagal mengambil data pengguna" }), { status: 500 });
  }
}