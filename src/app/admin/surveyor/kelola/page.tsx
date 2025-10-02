import { Search, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { FaCircleInfo } from "react-icons/fa6";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ADMIN_MANAGE_SURVEYORS } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import { Surveyor } from "@/types/surveyor";
import Link from "next/link";
import Input from "@/components/shared/input";
import Client from "@/app/admin/surveyor/kelola/client";

export const metadata: Metadata = {
  title: "Kelola Surveyor | SICUPANG",
  description: "",
  openGraph: {
    title: "Kelola Surveyor | SICUPANG",
    description: "",
  },
  twitter: {
    title: "Kelola Surveyor | SICUPANG",
    description: "",
  },
};

export default async function KelolaSurveyor({ searchParams }: { searchParams: Promise<{ data?: string }> }) {
  const { data } = await searchParams;
  const page = Number(data) || 1;

  const rawSurveyors = await Prisma.pengguna.findMany({
    skip: (page - 1) * 10,
    take: 10,
    where: { peran: "SURVEYOR" },
    select: {
      id_pengguna: true,
      nama_lengkap: true,
      nip: true,
      kecamatan: { select: { id_kecamatan: true, nama_kecamatan: true } },
    },
  });

  const surveyors: Surveyor[] = rawSurveyors.map((surveyor) => ({
    id: surveyor.id_pengguna,
    full_name: surveyor.nama_lengkap,
    nip: surveyor.nip,
    district: { 
      id: surveyor.kecamatan?.id_kecamatan ?? 0, 
      name: surveyor.kecamatan?.nama_kecamatan ?? "" 
    },
  }));

  const totalPages = Math.ceil(Number(await Prisma.pengguna.count({ where: { peran: "SURVEYOR" } })) / 10);

  try {
    return (
      <>
        <figure className="mb-6 flex w-full flex-col items-start rounded-lg border border-l-6 border-blue-200 bg-blue-50 p-4 pl-6 text-sm text-blue-800 shadow-sm">
          <span className="flex cursor-default items-center gap-3">
            <FaCircleInfo className="mt-0.75 text-lg text-blue-500" />
            <h5 className="text-lg font-semibold text-blue-600">
              Siapa saja yang bertugas sebagai surveyor?
            </h5>
          </span>
          <h5 className="mt-2.5 hidden cursor-default text-sm leading-7 font-normal text-blue-800 lg:inline">
            Halaman ini menampilkan daftar surveyor yang bertugas di
            Kabupaten Malang, lengkap dengan NIP, nama lengkap, dan kecamatan
            tempat mereka bertugas. Anda dapat mengelola data surveyor melalui
            halaman ini. Data surveyor dapat membantu Anda dalam mengelola
            keluarga dan anggota keluarga di wilayah Kabupaten Malang.
          </h5>
          <h5 className="mt-2.5 inline cursor-default text-sm leading-7 font-normal text-blue-800 lg:hidden">
            Halaman ini menyajikan daftar surveyor yang bertugas di
            Kabupaten Malang. Anda dapat mengelola data surveyor melalui
            halaman ini.
          </h5>
        </figure>
        <form action="" method="GET" className="mb-6 flex w-full items-end gap-3">
          <Input
            type="text"
            icon={<Search className="h-4 w-4 text-gray-400" />}
            label={""}
            name="nama"
            placeholder="Cari nama surveyor..."
            required={false}
            variant="form"
          />
          <button type="submit" className="hover:bg-primary/80 focus:ring-primary bg-primary inline-flex cursor-pointer items-center gap-2 rounded-lg px-12 py-4 text-sm font-medium text-white shadow transition focus:ring-2 focus:ring-offset-2 focus:outline-none">
            Cari
          </button>
        </form>
        <Client surveyors={surveyors} />
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page > 1 ? (
                <PaginationPrevious href={page - 1 === 1 ? ADMIN_MANAGE_SURVEYORS : `?data=${page - 1}`} />
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
                    <Link href={p === 1 ? ADMIN_MANAGE_SURVEYORS : `?data=${p}`}>
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
                <PaginationNext href={page + 1 === 1 ? ADMIN_MANAGE_SURVEYORS : `?data=${page + 1}`} />
              ) : (
                <PaginationNext aria-disabled="true" className="pointer-events-none opacity-50" />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </>
    );
  } catch (err: unknown) {
    console.error(`Terjadi kesalahan pada halaman kelola surveyor:`, err);
    return (
      <section className="flex h-screen cursor-default flex-col items-center justify-center p-4">
        <TriangleAlert className="h-8 w-8 text-red-500 lg:h-12 lg:w-12" />
        <p className="mt-2 text-sm font-medium lg:text-base">
          Terjadi kesalahan pada halaman kelola surveyor.
        </p>
      </section>
    );
  }
}