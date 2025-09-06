import { NextResponse } from "next/server";
import { API_ADMIN_DASHBOARD } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const [districts, familiesCount, graphic, villages, years] = await Promise.all([
      Prisma.keluarga.groupBy({ by: ["id_kecamatan"], _count: { id_keluarga: true } }),
      Prisma.keluarga.count(),
      Prisma.keluarga.groupBy({ by: ["id_kecamatan"], _count: { id_keluarga: true } }),
      Prisma.keluarga.groupBy({ by: ["id_desa"], _count: { id_keluarga: true } }),
      Prisma.keluarga.findMany({ select: { created_at: true }, orderBy: { created_at: "desc" } }),
    ]);

    const listOfYears = Array.from(new Set(years.map((item) => new Date(item.created_at).getFullYear()))).sort((a, b) => b - a);

    const districtsGraphic = await Promise.all(
      graphic.map(async (item) => {
        const district = await Prisma.kecamatan.findUnique({ where: { id_kecamatan: item.id_kecamatan }, select: { nama_kecamatan: true } }) as { nama_kecamatan: string };
        return { x: district.nama_kecamatan ?? "Tidak Diketahui", y: item._count.id_keluarga } as { x: string, y: number };
      }),
    );

    return NextResponse.json(
      { district: districts.length, family: familiesCount, graphic: districtsGraphic, villages: villages.length, years: listOfYears },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error(`❌ Error GET ${API_ADMIN_DASHBOARD}: ${err}`);
    return NextResponse.json({ error: "Gagal mengambil data keluarga." }, { status: 500 });
  }
}