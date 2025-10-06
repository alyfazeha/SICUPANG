import { Info } from "lucide-react";
import { FaCircleInfo } from "react-icons/fa6";
import type { Metadata } from "next";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ADMIN_FOOD_RECORD, ADMIN_FOOD_RECORD_DETAIL } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import type { TopCards } from "@/types/dashboard";
import type { FamilyWithRegion } from "@/types/region";
import Table from "@/components/shared/table";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rekap Pangan | SICUPANG",
  description: "",
  openGraph: {
    title: "Rekap Pangan | SICUPANG",
    description: "",
  },
  twitter: {
    title: "Rekap Pangan | SICUPANG",
    description: "",
  },
};

export default async function RekapPangan({ searchParams }: { searchParams: Promise<{ data?: string }> }) {
  const { data } = await searchParams;
  const page = data ? parseInt(data, 10) : 1;

  const [countDistricts, countFamily, countVillages, dataFamilies] =
    await Promise.all([
      Prisma.keluarga.groupBy({ by: ["id_kecamatan"], _count: { id_keluarga: true } }),
      Prisma.keluarga.count(),
      Prisma.keluarga.groupBy({ by: ["id_desa"], _count: { id_keluarga: true } }),
      Prisma.keluarga.findMany({
        skip: (page - 1) * 10,
        take: 10,
        orderBy: { id_keluarga: "asc" },
        select: {
          id_keluarga: true,
          nama_kepala_keluarga: true,
          desa: { select: { nama_desa: true, kode_wilayah: true } },
          kecamatan: { select: { nama_kecamatan: true, kode_wilayah: true } },
        },
      }),
    ]);

  const totalPages = Math.ceil(countFamily / 10);

  const cards: TopCards[] = [
    { title: "Jumlah Kecamatan", value: countDistricts.length },
    { title: "Jumlah Keluarga", value: countFamily },
    { title: "Jumlah Desa", value: countVillages.length },
  ];

  const formattedDataFamilies: FamilyWithRegion[] = dataFamilies.map(
    (family) => ({
      id: family.id_keluarga,
      name: family.nama_kepala_keluarga,
      district: family.kecamatan && {
        name: family.kecamatan.nama_kecamatan,
        code: family.kecamatan.kode_wilayah,
      },
      village: family.desa && {
        name: family.desa.nama_desa,
        code: family.desa.kode_wilayah,
      },
    }),
  );

  return (
    <>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((data, index) => (
          <figure key={index} className="bg-primary relative overflow-hidden rounded-2xl p-6 text-white shadow-lg">
            <h3 className="mb-2 cursor-default text-sm opacity-80">
              {data.title}
            </h3>
            <h5 className="relative z-10 text-2xl font-bold">
              {data.value ?? 0}
            </h5>
            <div className="bg-secondary absolute -right-6 -bottom-6 h-28 w-28 rounded-full opacity-30" />
          </figure>
        ))}
      </section>
      <figure className="my-6 flex w-full flex-col items-start rounded-lg border border-l-6 border-blue-200 bg-blue-50 p-4 pl-6 text-sm text-blue-800 shadow-sm">
        <span className="flex cursor-default items-center gap-3">
          <FaCircleInfo className="mt-0.75 text-lg text-blue-500" />
          <h5 className="text-lg font-semibold text-blue-600">
            Mengapa Perlu Rekap Data Pangan?
          </h5>
        </span>
        <h5 className="mt-2.5 hidden cursor-default text-sm leading-7 font-normal text-blue-800 lg:inline">
          Ketika mengelola data pangan di SICUPANG, kami mengumpulkan informasi
          tentang jenis dan jumlah makanan yang dikonsumsi oleh keluarga di
          berbagai wilayah Kabupaten Malang. Data ini membantu kami dalam
          mengelola pangan di Kabupaten Malang secara lebih efektif dan efisien.
        </h5>
        <h5 className="mt-2.5 inline cursor-default text-sm leading-7 font-normal text-blue-800 lg:hidden">
          Ketika mengelola data pangan di SICUPANG, kami mengumpulkan informasi
          tentang jenis dan jumlah makanan yang dikonsumsi oleh keluarga di
          berbagai wilayah Kabupaten Malang.
        </h5>
      </figure>
      <Table
        headers={["Kecamatan", "Desa", "Kode Wilayah", "Nama Keluarga", "Aksi"]}
        rows={formattedDataFamilies.map((family, index) => [
          family.district?.name ?? "-",
          family.village?.name ?? "-",
          family.district && family.village && `${family.district.code} - ${family.village.code}`,
          family.name ?? "-",
          <Link
            key={index}
            href={ADMIN_FOOD_RECORD_DETAIL(family.id)}
            className="rounded-lg bg-blue-500 p-2.5 text-white transition-all duration-300 ease-in-out hover:bg-blue-600"
          >
            <Info className="h-4 w-4 text-white" />
          </Link>,
        ])}
        sortable={["Desa", "Nama Keluarga"]}
      />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {page > 1 ? (
              <PaginationPrevious href={page - 1 === 1 ? ADMIN_FOOD_RECORD : `?data=${page - 1}`} />
            ) : (
              <PaginationPrevious aria-disabled="true" className="pointer-events-none opacity-50" />
            )}
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink asChild isActive={p === page}>
                <Link href={p === 1 ? ADMIN_FOOD_RECORD : `?data=${p}`}>
                  {p}
                </Link>
              </PaginationLink>
            </PaginationItem>
          ))}
          {page + 2 < totalPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            {page < totalPages ? (
              <PaginationNext href={page + 1 === 1 ? ADMIN_FOOD_RECORD : `?data=${page + 1}`} />
            ) : (
              <PaginationNext aria-disabled="true" className="pointer-events-none opacity-50" />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}