import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_DASHBOARD, AUTH_PAGES, LOGIN, SURVEYOR_DASHBOARD } from "@/constants/routes";
import { AUTH_TOKEN } from "@/constants/token";
import { Auth } from "@/types/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = (await cookies()).get(AUTH_TOKEN)?.value;

  // Kalau belum masuk ke akun sesuai peran tapi mau ke halaman yang butuh autentikasi.
  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/surveyor"))) {
    return NextResponse.redirect(new URL(LOGIN, request.url));
  } else if (!token) {
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;
    
    // Larangan silang akses peran admin dan surveyor.
    if (decoded.peran === "ADMIN" && pathname.startsWith("/surveyor")) {
      return NextResponse.redirect(new URL(ADMIN_DASHBOARD, request.url));
    } else if (decoded.peran === "SURVEYOR" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL(SURVEYOR_DASHBOARD, request.url));
    }

    // Kalau sudah login, cegah akses halaman auth.
    if (AUTH_PAGES.includes(pathname)) {
      const target = decoded.peran === "ADMIN" ? ADMIN_DASHBOARD : SURVEYOR_DASHBOARD;
      return NextResponse.redirect(new URL(target, request.url));
    }

    return NextResponse.next();
  } catch (err: unknown) {
    console.error(`Token tidak valid: ${err}`);
    const response = NextResponse.redirect(new URL(LOGIN, request.url));
    response.cookies.set(AUTH_TOKEN, "", { maxAge: 0 });
    return response;
  }
}

export const config: { matcher: string[] } = {
  matcher: ["/daftar", "/lupa-kata-sandi", "/masuk", "/admin/:path*", "/surveyor/:path*"],
};