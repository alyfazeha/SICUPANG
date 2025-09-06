import { TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { API_ADMIN_READ_DISTRICT_DATA } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import Page from "./client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const district = await Prisma.kecamatan.findUniqueOrThrow({ where: { id_kecamatan: parseInt(id, 10) } });

    return {
      title: `${district?.nama_kecamatan ?? ""} | SICUPANG`,
      description: "",
      openGraph: {
        title: `${district?.nama_kecamatan ?? ""} | SICUPANG`,
        description: "",
      },
      twitter: {
        title: `${district?.nama_kecamatan ?? ""} | SICUPANG`,
        description: "",
      },
    };
  } catch (err: unknown) {
    console.error(`❌ [metadata] Error GET ${API_ADMIN_READ_DISTRICT_DATA(id)}: ${err}`);
    return {
      title: "Detail Kecamatan | SICUPANG",
      description: "",
      openGraph: { title: "Detail Kecamatan | SICUPANG", description: "" },
      twitter: { title: "Detail Kecamatan | SICUPANG", description: "" },
    };
  }
}

export default async function DetailDataKecamatan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const district = await Prisma.kecamatan.findUniqueOrThrow({
      where: { id_kecamatan: parseInt(id, 10) },
      select: {
        id_kecamatan: true,
        kode_wilayah: true,
        nama_kecamatan: true,
      },
    });

    if (!district) {
      return (
        <main className="flex h-screen flex-col items-center justify-center">
          <TriangleAlert className="text-yellow-500" size={40} />
          <p className="mt-2 text-sm font-semibold text-gray-600">
            Data tidak ditemukan.
          </p>
        </main>
      );
    }

    return <Page district={{ id: district.id_kecamatan, code: district.kode_wilayah, name: district.nama_kecamatan }} />;
  } catch (err: unknown) {
    console.error(`❌ [pages] Error GET ${API_ADMIN_READ_DISTRICT_DATA(id)}: ${err}`);
    return (
      <section className="flex h-screen flex-col items-center justify-center">
        <TriangleAlert className="text-yellow-500" size={40} />
        <p className="mt-2 text-sm font-semibold text-gray-600">
          Data tidak ditemukan.
        </p>
      </section>
    );
  }
}