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

    const [totalVillages, totalFamilies, familiesData] = await Promise.all([
      Prisma.keluarga.findMany({
        where: { id_pengguna: decoded.id_pengguna },
        select: { id_desa: true },
        distinct: ["id_desa"],
      }),
      Prisma.keluarga.count({ where: { id_pengguna: decoded.id_pengguna } }),
      Prisma.keluarga.findMany({
        where: { id_pengguna: decoded.id_pengguna },
        include: { desa: true },
        take: 10,
        orderBy: { created_at: "desc" },
      }),
    ]);

    const formattedData = familiesData.map((item) => ({
      id_keluarga: item.id_keluarga,
      nama_kepala_keluarga: item.nama_kepala_keluarga,
      nomor_kartu_keluarga: item.nomor_kartu_keluarga,
      desa: item.desa,
    }));

    return NextResponse.json({ jumlah_desa: totalVillages.length, jumlah_keluarga: totalFamilies, data: formattedData }, { status: 200 });
  } catch (err: unknown) {
    console.error(`❌ Error GET /api/surveyor/dashboard: ${err}`);
    return NextResponse.json({ error: "Gagal mengambil data keluarga." }, { status: 500 });
  }
}