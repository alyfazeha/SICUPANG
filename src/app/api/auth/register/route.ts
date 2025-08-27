import { NextRequest } from "next/server";
import { Auth } from "@/types/auth";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { surel, kata_sandi } = request.body as unknown as Auth;

    if (!surel || !kata_sandi) {
      return new Response(JSON.stringify({ message: "Surel dan kata sandi harus diisi." }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Akun Anda berhasil dibuat." }), { status: 201 });
  } catch (err: unknown) {
    console.error(`Terjadi kesalahan saat mendaftarkan akun Anda: ${err}`);
    throw err;
  }
}