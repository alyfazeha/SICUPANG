import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_TOKEN, AUTHORIZATION } from "@/constants/token";
import { Prisma } from "@/lib/prisma";
import type { Auth } from "@/types/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get(AUTHORIZATION);
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : (await cookies()).get(AUTH_TOKEN)?.value;

    if (!token) {
      return NextResponse.json({ error: "Pengguna tidak terautentikasi" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const decoded = payload as unknown as Auth;

    const [totalVillages, totalFamilies] = await Promise.all([
      Prisma.keluarga.findMany({
        where: { id_pengguna: decoded.id_pengguna },
        select: { id_desa: true },
        distinct: ["id_desa"],
      }),
      Prisma.keluarga.count({
        where: { id_pengguna: decoded.id_pengguna }
      }),
    ]);

    return NextResponse.json({ family: totalFamilies, village: totalVillages.length }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET /api/surveyor/dashboard: ${err}`);
    return NextResponse.json({ error: "Gagal mengambil data keluarga." }, { status: 500 });
  }
}