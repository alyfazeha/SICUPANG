import { Home, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { API_SURVEYOR_EDIT_DATA_FAMILY, SURVEYOR_DASHBOARD, SURVEYOR_FAMILY } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import Page from "./client";
import { Family } from "@/types/family";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const family = await Prisma.keluarga.findUniqueOrThrow({ where: { id_keluarga: parseInt(id, 10) } });

    return {
      title: `${family?.nama_kepala_keluarga ?? ""} | SICUPANG`,
      description: "",
      openGraph: {
        title: `${family?.nama_kepala_keluarga ?? ""} | SICUPANG`,
        description: "",
      },
      twitter: {
        title: `${family?.nama_kepala_keluarga ?? ""} | SICUPANG`,
        description: "",
      },
    };
  } catch (err: unknown) {
    console.error(`❌ [metadata] Error GET ${API_SURVEYOR_EDIT_DATA_FAMILY(id)}: ${err}`);
    return {
      title: "Detail Keluarga | SICUPANG",
      description: "",
      openGraph: { title: "Detail Keluarga | SICUPANG", description: "" },
      twitter: { title: "Detail Keluarga | SICUPANG", description: "" },
    };
  }
}

export default async function EditDataKeluarga({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const families = await Prisma.keluarga.findUniqueOrThrow({
      where: { id_keluarga: parseInt(id, 10) },
      include: {
        desa: { include: { kecamatan: true } },
        pangan_keluarga: { include: { pangan: true } },
        pendapatan: true,
        pengeluaran: true,
      },
    });

    if (!families) {
      return (
        <main className="flex h-screen flex-col items-center justify-center">
          <TriangleAlert className="text-yellow-500" size={40} />
          <p className="mt-2 text-sm font-semibold text-gray-600">
            Data tidak ditemukan.
          </p>
        </main>
      );
    }

    const family:  Omit<Family, "created_at" | "status" | "updated_at">  = {
      id_district: families.id_kecamatan,
      id_family: families.id_keluarga,
      id_surveyor: families.id_pengguna,
      name: families.nama_kepala_keluarga,
      family_card_number: families.nomor_kartu_keluarga,
      village: families.id_desa,
      address: families.alamat,
      members: families.jumlah_keluarga,
      income: families.rentang_pendapatan.toString(),
      spending: families.rentang_pengeluaran.toString(),
      pregnant: families.hamil === "Ya" ? "YA" : "TIDAK",
      breastfeeding: families.menyusui === "Ya" ? "YA" : "TIDAK",
      toddler: families.balita === "Ya" ? "YA" : "TIDAK",
      photo: families.gambar,
      foodstuff: (families.pangan_keluarga ?? []).map((food) => ({ id: food.id_pangan_keluarga, name: food.pangan.nama_pangan, portion: Number(food.urt) })),
    };

    return (
      <figure className="flex w-auto flex-col rounded-xl bg-white p-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={SURVEYOR_DASHBOARD} className="lg:hover:text-foreground/72 flex items-center font-semibold">
                <Home className="mr-2 h-4 w-4" />
                Dasbor
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={SURVEYOR_FAMILY} className="lg:hover:text-foreground/72 flex items-center font-semibold">
                Keluarga
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <h5 className="flex cursor-default items-center font-semibold">
                Tambah Data
              </h5>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Page family={family} />
      </figure>
    );
  } catch (err: unknown) {
    console.error(`❌ [pages] Error GET ${`/api/surveyor/family/${id}/get`}: ${err}`);
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