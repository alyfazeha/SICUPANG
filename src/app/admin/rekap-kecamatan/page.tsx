import type { Metadata } from "next";
import { FaCircleInfo } from "react-icons/fa6";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ADMIN_SUBDISTRICT_RECORD } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import type { FoodData } from "@/types/family";
import type { District } from "@/types/region";
import Link from "next/link";
import DownloadExcel from "./download-excel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rekap Kecamatan | SICUPANG",
  description: "",
  openGraph: {
    title: "Rekap Kecamatan | SICUPANG",
    description: "",
  },
  twitter: {
    title: "Rekap Kecamatan | SICUPANG",
    description: "",
  },
};

export default async function DataKecamatanAdmin({ searchParams }: { searchParams: Promise<{ data?: string }> }) {
  const { data } = await searchParams;
  const page = Number(data) || 1;

  const [districts, totalDistricts] = await Promise.all([
    Prisma.kecamatan.findMany({ skip: (page - 1) * 10, take: 10 }),
    Prisma.kecamatan.count(),
  ]);

  const totalPages = Math.ceil(totalDistricts / 10);

  const foodList = await Prisma.pangan.findMany({
    include: { pangan_keluarga: true, jenis_pangan: true },
  });

  const formattedDistricts = districts.map((district) => ({
    id: district.id_kecamatan,
    code: district.kode_wilayah,
    name: district.nama_kecamatan,
  }) as District);

  const formattedFoodList = foodList.map((food) => ({
    id: food.id_pangan,
    name: food.nama_pangan,
    unit: food.referensi_urt,
    energy: food.kalori,
    protein: food.protein,
    fat: food.lemak,
    carbohydrate: food.karbohidrat,
    weight: food.referensi_gram_berat,
    amount: food.pangan_keluarga.length,
    total_family: new Set(food.pangan_keluarga.map((family) => family.id_keluarga)).size,
    conversion: "",
    category: food.jenis_pangan?.nama_jenis ?? "",
    calories: food.kalori,
  }) as FoodData);

  return (
    <>
      <figure className="mb-6 flex w-full flex-col items-start rounded-lg border border-l-6 border-blue-200 bg-blue-50 p-4 pl-6 text-sm text-blue-800 shadow-sm">
        <span className="flex cursor-default items-center gap-3">
          <FaCircleInfo className="mt-0.75 text-lg text-blue-500" />
          <h5 className="text-lg font-semibold text-blue-600">
            Apa Isi dari Rekap Kecamatan?
          </h5>
        </span>
        <h5 className="mt-2.5 hidden cursor-default text-sm leading-7 font-normal text-blue-800 lg:inline">
          Halaman ini menampilkan ringkasan data kecamatan di Kabupaten Malang.
          Informasi yang disajikan meliputi jumlah keluarga, jumlah desa, serta
          jumlah anggota keluarga. Data tersebut membantu Anda dalam memahami
          bagaimana distribusi keluarga dan anggota keluarga tersebar di
          Kabupaten Malang.
        </h5>
        <h5 className="mt-2.5 inline cursor-default text-sm leading-7 font-normal text-blue-800 lg:hidden">
          Halaman ini menyajikan ringkasan data kecamatan di Kabupaten Malang,
          yang dapat membantu Anda memahami distribusi keluarga dan anggota
          keluarga di wilayah tersebut.
        </h5>
      </figure>
      <DownloadExcel districts={formattedDistricts} foodList={formattedFoodList} page={page} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {page > 1 ? (
              <PaginationPrevious href={page - 1 === 1 ? ADMIN_SUBDISTRICT_RECORD : `?data=${page - 1}`} />
            ) : (
              <PaginationPrevious aria-disabled="true" className="pointer-events-none opacity-50" />
            )}
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, page - 2), // mulai 2 halaman sebelum current
              Math.min(totalPages, page + 1 + 2), // sampai 2 halaman setelah current
            )
            .map((p) => (
              <PaginationItem key={p}>
                <PaginationLink asChild isActive={p === page}>
                  <Link href={p === 1 ? ADMIN_SUBDISTRICT_RECORD : `?data=${p}`}>
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
              <PaginationNext href={page + 1 === 1 ? ADMIN_SUBDISTRICT_RECORD : `?data=${page + 1}`} />
            ) : (
              <PaginationNext aria-disabled="true" className="pointer-events-none opacity-50" />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}