import { Pencil, Trash, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { FaCircleInfo } from "react-icons/fa6";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ADMIN_DELETE_SURVEYORS, ADMIN_DETAIL_SURVEYORS, ADMIN_EDIT_SURVEYORS, ADMIN_MANAGE_SURVEYORS } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import Link from "next/link";
import Table from "@/components/shared/table";

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

export default async function KelolaSurveyor({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const page = Number(id) || 1;

  const surveyors = await Prisma.pengguna.findMany({
    skip: (page - 1) * 10,
    take: 10,
    where: { peran: "SURVEYOR" },
    select: {
      id_pengguna: true,
      nip: true,
      nama_lengkap: true,
      kecamatan: { select: { nama_kecamatan: true } },
    },
  });

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
        <Table
          headers={["NIP", "Nama Surveyor", "Kecamatan", "Aksi"]}
          rows={surveyors.map((surveyor) => [
            surveyor.nip,
            surveyor.nama_lengkap,
            surveyor.kecamatan?.nama_kecamatan || "-",
            <span key={surveyor.id_pengguna} className="flex gap-2.5">
              <a href={ADMIN_DETAIL_SURVEYORS(surveyor.id_pengguna)} className="rounded-md bg-blue-600 p-2.5 text-white transition hover:bg-blue-700">
                <FaCircleInfo className="h-3.5 w-3.5" />
              </a>
              <a href={ADMIN_EDIT_SURVEYORS(surveyor.id_pengguna)} className="rounded-md bg-yellow-600 p-2.5 text-white transition hover:bg-yellow-700">
                <Pencil className="h-3.5 w-3.5" />
              </a>
              <a href={ADMIN_DELETE_SURVEYORS(surveyor.id_pengguna)} className="rounded-md bg-red-600 p-2.5 text-white transition hover:bg-red-700">
                <Trash className="h-3.5 w-3.5" />
              </a>
            </span>,
          ])}
          sortable={["Nama Surveyor", "Kecamatan"]}
        />
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