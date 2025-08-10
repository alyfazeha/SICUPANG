import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_TOKEN } from "@/constants/token";

async function Logout() {
  try {
    const token = (await cookies()).get(AUTH_TOKEN)?.value;
    const response = NextResponse.json({ message: "Berhasil keluar dari akun Anda." }, { status: 200 });

    if (token) {
      response.cookies.set(AUTH_TOKEN, "", { maxAge: 0, path: "/" });
    }

    return response;
  } catch (err: unknown) {
    console.error(`Terjadi kesalahan saat keluar dari akun Anda: ${err}`);
    return NextResponse.json({ message: "Terjadi kesalahan saat keluar dari akun Anda." }, { status: 500 });
  }
}

export { Logout as GET, Logout as POST };