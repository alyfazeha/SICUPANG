import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_DASHBOARD, AUTH_PAGES, LOGIN, SURVEYOR_DASHBOARD } from "@/constants/routes";
import { AUTH_TOKEN, AUTHORIZATION } from "@/constants/token";
import { Auth } from "@/types/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAPI = pathname.startsWith("/api");

  // Ambil token: API -> Authorization header, Page -> Cookie
  const authHeader = request.headers.get(AUTHORIZATION);
  const cookieToken = (await cookies()).get(AUTH_TOKEN)?.value;
  const token = isAPI ? authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : cookieToken : cookieToken;

  // Kalau belum masuk ke akun sesuai peran tapi mau ke halaman yang butuh autentikasi.
  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/surveyor") || pathname.startsWith("/api/admin") || pathname.startsWith("/api/surveyor"))) {
    if (isAPI) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL(LOGIN, request.url));
  } else if (!token) {
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    // Larangan silang akses peran admin dan surveyor.
    if (decoded.peran === "ADMIN" && (pathname.startsWith("/surveyor") || pathname.startsWith("/api/surveyor"))) {
      if (isAPI) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      return NextResponse.redirect(new URL(ADMIN_DASHBOARD, request.url));
    } else if (decoded.peran === "SURVEYOR" && (pathname.startsWith("/admin") || pathname.startsWith("/api/admin"))) {
      if (isAPI) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      return NextResponse.redirect(new URL(SURVEYOR_DASHBOARD, request.url));
    }

    // Kalau sudah login, cegah akses halaman auth.
    if (AUTH_PAGES.includes(pathname)) {
      const target = decoded.peran === "ADMIN" ? ADMIN_DASHBOARD : SURVEYOR_DASHBOARD;
      return NextResponse.redirect(new URL(target, request.url));
    }

    return NextResponse.next();
  } catch (err: unknown) {
    const response = NextResponse.redirect(new URL(LOGIN, request.url));

    console.error(`Token tidak valid: ${err}`);
    if (isAPI) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    response.cookies.set(AUTH_TOKEN, "", { maxAge: 0 });
    return response;
  }
}

export const config: { matcher: string[] } = {
  matcher: ["/masuk", "/admin/:path*", "/surveyor/:path*", "/api/admin/:path*", "/api/surveyor/:path*"],
};