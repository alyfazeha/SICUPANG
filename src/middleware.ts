import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_DASHBOARD,
  AUTH_PAGES,
  LOGIN,
  SURVEYOR_DASHBOARD,
} from "@/constants/routes";
import { AUTH_TOKEN } from "@/constants/token";
import { Auth } from "@/types/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAPI = pathname.startsWith("/api");

  // Ambil token: API -> Authorization, Page -> Cookie
  let token: string | undefined;
  if (isAPI) {
    const authHeader = request.headers.get("authorization"); // case-insensitive
    if (authHeader?.startsWith("Bearer ")) token = authHeader.slice(7).trim();
  } else {
    token = request.cookies.get(AUTH_TOKEN)?.value;
  }

  const redirectOrJson = (
    status: number,
    location?: string,
    body?: unknown,
  ) => {
    if (isAPI)
      return NextResponse.json(body ?? { error: "Unauthorized" }, { status });
    return NextResponse.redirect(new URL(location ?? LOGIN, request.url));
  };

  // Belum login tapi akses area terlindungi
  if (
    !token &&
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/api/admin") ||
      pathname.startsWith("/surveyor") ||
      pathname.startsWith("/api/surveyor"))
  ) {
    return redirectOrJson(401, LOGIN, { error: "Unauthorized" });
  } else if (!token) {
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.id_pengguna.toString());
    requestHeaders.set("x-user-role", decoded.peran);

    // Cross-role access 
    if (
      decoded.peran === "ADMIN" &&
      (pathname.startsWith("/surveyor") || pathname.startsWith("/api/surveyor"))
    ) {
      // API -> 403 JSON, Page -> redirect ke dashboardnya
      return redirectOrJson(isAPI ? 403 : 302, ADMIN_DASHBOARD, {
        error: "Forbidden",
      });
    } else if (
      decoded.peran === "SURVEYOR" &&
      (pathname.startsWith("/admin") || pathname.startsWith("/api/admin"))
    ) {
      return redirectOrJson(isAPI ? 403 : 302, SURVEYOR_DASHBOARD, {
        error: "Forbidden",
      });
    }

    // Sudah login, cegah akses halaman auth
    if (AUTH_PAGES.includes(pathname)) {
      const target =
        decoded.peran === "ADMIN" ? ADMIN_DASHBOARD : SURVEYOR_DASHBOARD;
      return NextResponse.redirect(new URL(target, request.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
  } catch (err: unknown) {
    console.error(`Token tidak valid: ${err}`);
    if (isAPI)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const response = NextResponse.redirect(new URL(LOGIN, request.url));
    response.cookies.set(AUTH_TOKEN, "", { maxAge: 0 });
    return response;
  }
}

export const config = {
  matcher: [
    "/masuk",
    "/admin/:path*",
    "/surveyor/:path*",
    "/api/admin/:path*",
    "/api/surveyor/:path*",
  ],
};
