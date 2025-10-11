import { TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { Prisma } from "@/lib/prisma";
import type { Family } from "@/types/family";
import { Truncate } from "@/utils/text";
import Page from "@/app/surveyor/keluarga/[id]/detail/client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const family = await Prisma.keluarga.findUniqueOrThrow({ where: { id_keluarga: parseInt(id, 10) } });

    return {
      title: `Data ${family?.nama_kepala_keluarga ?? ""} | SICUPANG`,
      description: "",
      openGraph: {
        title: `Data ${family?.nama_kepala_keluarga ?? ""} | SICUPANG`,
        description: "",
      },
      twitter: {
        title: `Data ${family?.nama_kepala_keluarga ?? ""} | SICUPANG`,
        description: "",
      },
    };
  } catch (err: unknown) {
    console.error(`❌ [metadata] Error GET ${`/api/surveyor/family/${id}/get`}: ${err}`);
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

    const family: Omit<Family, "created_at" | "updated_at"> = {
      id_district: families.id_kecamatan,
      id_family: families.id_keluarga,
      id_surveyor: families.id_pengguna,
      name: Truncate(families.nama_kepala_keluarga, 15, 50),
      family_card_number: families.nomor_kartu_keluarga,
      village: families.desa.nama_desa,
      address: families.alamat,
      members: families.jumlah_keluarga,
      income:  `${families.pendapatan.batas_bawah} - ${families.pendapatan.batas_atas}`,
      spending: `${families.pengeluaran.batas_bawah} - ${families.pengeluaran.batas_atas}`,
      pregnant: families.hamil === "Ya" ? "YA" : "TIDAK",
      breastfeeding: families.menyusui === "Ya" ? "YA" : "TIDAK",
      toddler: families.balita === "Ya" ? "YA" : "TIDAK",
      photo: families.gambar,
      foodstuff: (families.pangan_keluarga ?? []).map((food) => ({ id: food.id_pangan, name: food.pangan.nama_pangan, portion: Number(food.urt), unit: food.pangan.referensi_urt })),
    };

    return <Page family={family} />;
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