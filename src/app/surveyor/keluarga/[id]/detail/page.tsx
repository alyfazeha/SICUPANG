import { TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { API_SURVEYOR_READ_DATA_FAMILY } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import type { Family } from "@/types/family";
import Page from "./client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const family = await Prisma.keluarga.findUnique({ where: { id_keluarga: parseInt(id, 10) } });

    return {
      title: `Detail Keluarga ${family?.nama_kepala_keluarga ?? ""} | SICUPANG`,
      description: "",
      openGraph: {
        title: `Detail Keluarga ${family?.nama_kepala_keluarga ?? ""} | SICUPANG`,
        description: "",
      },
      twitter: {
        title: `Detail Keluarga ${family?.nama_kepala_keluarga ?? ""} | SICUPANG`,
        description: "",
      },
    };
  } catch (err: unknown) {
    console.error(`❌ [metadata] Error GET ${API_SURVEYOR_READ_DATA_FAMILY(id)}: ${err}`);
    return {
      title: "Detail Keluarga | SICUPANG",
      description: "",
      openGraph: { title: "Detail Keluarga | SICUPANG", description: "" },
      twitter: { title: "Detail Keluarga | SICUPANG", description: "" },
    };
  }
}

export default async function DetailDataKeluarga({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const families = await Prisma.keluarga.findUnique({
      where: { id_keluarga: parseInt(id, 10) },
      include: { pangan_keluarga: { include: { pangan: true } } },
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

    const family: Family = {
      id_district: families.id_kecamatan,
      id_family: families.id_keluarga,
      id_surveyor: families.id_pengguna ?? null,
      name: families.nama_kepala_keluarga,
      family_card_number: families.nomor_kartu_keluarga ?? null,
      village: families.id_desa,
      address: families.alamat,
      members: families.jumlah_keluarga,
      income: families.rentang_pendapatan,
      spending: families.rentang_pengeluaran,
      pregnant: families.hamil === "Ya" ? "YA" : "TIDAK",
      breastfeeding: families.menyusui === "Ya" ? "YA" : "TIDAK",
      toddler: families.balita === "Ya" ? "YA" : "TIDAK",
      photo: undefined,
      foodstuff: (families.pangan_keluarga ?? []).map((food) => ({ id: food.id_pangan, name: food.pangan.nama_pangan, portion: Number(food.urt) })),
      status: families.status ?? undefined,
      comment: families.komentar ?? null,
      created_at: families.created_at,
      updated_at: families.updated_at,
    };

    return <Page family={family} />;
  } catch (err: unknown) {
    console.error(`❌ [pages] Error GET ${API_SURVEYOR_READ_DATA_FAMILY(id)}: ${err}`);
    return (
      <main className="flex h-screen flex-col items-center justify-center">
        <TriangleAlert className="text-yellow-500" size={40} />
        <p className="mt-2 text-sm font-semibold text-gray-600">
          Data tidak ditemukan.
        </p>
      </main>
    );
  }
}