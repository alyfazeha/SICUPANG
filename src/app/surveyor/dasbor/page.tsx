import type { Metadata } from "next";
import { Prisma } from "@/lib/prisma";
import Page from "@/app/surveyor/dasbor/client";

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

export default async function DasborSurveyor() {
  const families = await Prisma.keluarga.findMany({
    select: {
      nama_kepala_keluarga: true,
      nomor_kartu_keluarga: true,
      desa: { select: { nama_desa: true } },
    },
  });

  return (
    <Page
      family={families.map((value) => ({
        name: value.nama_kepala_keluarga,
        family_card_number: value.nomor_kartu_keluarga,
        village: value.desa.nama_desa,
      }))}
    />
  );
}