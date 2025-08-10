import { NextRequest } from "next/server";
import { Auth } from "@/types/auth";

export default async function POST(request: NextRequest) {
  try {
    const { surel, kata_sandi }: Auth = request.body;

    if (!surel || !kata_sandi) {
      return new Response(JSON.stringify({ message: "Surel dan kata sandi harus diisi." }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Berhasil masuk ke akun Anda." }), { status: 201 });
  } catch (err: unknown) {
    console.error(`Terjadi kesalahan saat masuk ke akun Anda: ${err}`);
    throw err;
  }
}