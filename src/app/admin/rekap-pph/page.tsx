import { Filter as FilterIcon } from "lucide-react";
import type { Metadata } from "next";
import { FaExclamationTriangle } from "react-icons/fa";
import { Prisma } from "@/lib/prisma";
import Card from "@/app/admin/rekap-pph/card";
import Filter from "@/app/admin/rekap-pph/filter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rekap PPH | SICUPANG",
  description: "",
  openGraph: {
    title: "Rekap PPH | SICUPANG",
    description: "",
  },
  twitter: {
    title: "Rekap PPH | SICUPANG",
    description: "",
  },
};

export default async function RekapPph({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const idDistrict = (await searchParams).kecamatan;

  const districts = await Prisma.kecamatan.findMany({
    select: { id_kecamatan: true, nama_kecamatan: true },
    orderBy: { nama_kecamatan: "asc" },
  });

  let years: number[] = [];
  if (idDistrict) {
    years = await Prisma.keluarga.findMany({
      where: { id_kecamatan: Number(idDistrict) },
      distinct: ["created_at"],
      select: { created_at: true },
      orderBy: { created_at: "desc" },
    }).then((rows) => Array.from(new Set(rows.map((r) => new Date(r.created_at).getFullYear()))));
  }

  return (
    <>
      <form className="mb-6 flex items-center space-x-4 text-sm">
        <span className="flex cursor-default items-center space-x-2 text-slate-800">
          <FilterIcon className="h-2 w-2 lg:h-4 lg:w-4" />
          <h6 className="font-medium">Filter:</h6>
        </span>
        <fieldset className="relative">
          <Filter districts={districts} selected={idDistrict} />
        </fieldset>
      </form>
      {idDistrict && years.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {years.map((year) => (
            <Card key={year} district={districts.find((district) => district.id_kecamatan === Number(idDistrict))!} year={year} />
          ))}
        </section>
      ) : (
        <section className="mt-32 flex cursor-default flex-col items-center justify-center space-y-4 text-gray-600">
          <FaExclamationTriangle className="h-6 w-6 text-yellow-500 lg:h-10 lg:w-10" />
          <h5 className="text-center text-xs lg:text-sm">
            Kecamatan belum dipilih atau data pangan
            <br />
            keluarga belum tercatat di sistem.
          </h5>
        </section>
      )}
    </>
  );
}