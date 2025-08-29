import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AUTH_TOKEN } from "@/constants/token";
import { Prisma } from "@/lib/prisma";
import type { Auth } from "@/types/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const validate = z.object({
      nip: z.string().min(5, { message: "NIP minimal 5 karakter." }),
      kata_sandi: z.string().min(7, { message: "Kata sandi minimal 7 karakter." }),
    });

    const body = await request.json() as Auth;
    const parsed = validate.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    const { nip, kata_sandi } = parsed.data as Auth;

    if (!nip) {
      console.warn("NIP wajib diisi.");
      return NextResponse.json({ message: "NIP wajib diisi." }, { status: 400 });
    } 

    const pengguna = await Prisma.pengguna.findFirst({ where: { nip } });

    if (!pengguna) {
      console.warn(`Pengguna dengan NIP ${nip} tidak ditemukan.`);
      return NextResponse.json({ message: `Pengguna dengan NIP ${nip} tidak ditemukan.` }, { status: 404 });
    }

    const passwordValid = await compare(kata_sandi, pengguna.kata_sandi);

    if (!passwordValid) {
      console.warn("Kata sandi yang Anda masukkan salah.");
      return NextResponse.json({ message: "Kata sandi yang Anda masukkan salah." }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id_pengguna: pengguna.id_pengguna, nip: pengguna.nip, peran: pengguna.peran }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1d").sign(secret);

    const response = NextResponse.json({
      message: "Berhasil masuk ke akun Anda",
      data: {
        id_pengguna: pengguna.id_pengguna,
        nip: pengguna.nip,
        peran: pengguna.peran,
      },
    });

    response.cookies.set({
      name: AUTH_TOKEN,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    console.error(`Terjadi kesalahan saat masuk ke akun Anda: ${err}`);
    return NextResponse.json({ message: "Terjadi kesalahan saat masuk ke akun Anda." }, { status: 500 });
  }
}