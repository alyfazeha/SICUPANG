import type { Metadata } from "next";
import { ADMIN_DASHBOARD } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import Page from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dasbor | SICUPANG",
  description: "",
  openGraph: {
    title: "Dasbor | SICUPANG",
    description: "",
  },
  twitter: {
    title: "Dasbor | SICUPANG",
    description: "",
  },
};

export default async function DasborAdmin() {
  try {
    const [districts, familiesCount, graphic, villages, years] =
      await Promise.all([
        Prisma.keluarga.groupBy({ by: ["id_kecamatan"], _count: { id_keluarga: true }}),
        Prisma.keluarga.count(),
        Prisma.keluarga.groupBy({ by: ["id_kecamatan"], _count: { id_keluarga: true }}),
        Prisma.keluarga.groupBy({ by: ["id_desa"], _count: { id_keluarga: true }}),
        Prisma.keluarga.findMany({ select: { created_at: true }, orderBy: { created_at: "desc" }}),
      ]);

    const listOfYears = Array.from(new Set(years.map((item) => new Date(item.created_at).getFullYear()))).sort((a, b) => b - a);

    const districtsGraphic = await Promise.all(graphic.map(async (item) => {
      const district = (await Prisma.kecamatan.findUnique({ where: { id_kecamatan: item.id_kecamatan }, select: { nama_kecamatan: true }})) as { nama_kecamatan: string };
      return { x: district.nama_kecamatan ?? "Tidak Diketahui", y: item._count.id_keluarga };
    }));

    return <Page district={districts.length} family={familiesCount} graphic={districtsGraphic} villages={villages.length} years={listOfYears} />;
  } catch (err: unknown) {
    console.error(`❌ Error GET ${ADMIN_DASHBOARD}: ${err}`);
    throw err;
  }
}