import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LOGIN } from "@/constants/routes";
import { AUTH_TOKEN } from "@/constants/token";

async function Logout(): Promise<NextResponse> {
  try {
    if (!process.env.NEXT_PUBLIC_APP_URL) throw new Error("NEXT_PUBLIC_APP_URL belum di-set di environment!");

    const token = (await cookies()).get(AUTH_TOKEN)?.value;
    const response = NextResponse.redirect(new URL(LOGIN, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));

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