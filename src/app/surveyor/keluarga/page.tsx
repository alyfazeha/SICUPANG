import type { Metadata } from "next";
import { FaCircleInfo } from "react-icons/fa6";
import { SURVEYOR_ADD_DATA_FAMILY } from "@/constants/routes";
import Link from "next/link";
import Page from "./client";

export const metadata: Metadata = {
  title: "Keluarga | SICUPANG",
  description: "",
  openGraph: {
    title: "Keluarga | SICUPANG",
    description: "",
  },
  twitter: {
    title: "Keluarga | SICUPANG",
    description: "",
  },
};

export default function Keluarga() {
  return (
    <>
      <figure className="flex w-full flex-col items-start rounded-lg border border-l-6 border-blue-200 bg-blue-50 p-4 pl-6 text-sm text-blue-800 shadow-sm">
        <span className="flex cursor-default items-center gap-3">
          <FaCircleInfo className="mt-0.75 text-lg text-blue-500" />
          <h5 className="text-lg font-semibold text-blue-600">
            Kenapa Perlu Rekap Data Keluarga?
          </h5>
        </span>
        <h5 className="mt-2.5 hidden cursor-default text-sm leading-7 font-normal text-blue-800 lg:inline">
          Sebagai surveyor, Anda berperan penting dalam mencatat informasi
          setiap keluarga secara rinci dan konsisten. Data yang terkumpul dengan
          baik tidak hanya memudahkan proses analisis di aplikasi SICUPANG,
          tetapi juga menjadi dasar penting dalam mendukung ketahanan pangan di
          Kabupaten Malang secara berkelanjutan.
        </h5>
        <h5 className="mt-2.5 inline cursor-default text-sm leading-7 font-normal text-blue-800 lg:hidden">
          Sebagai surveyor, Anda berperan penting dalam mencatat informasi
          keluarga. Data yang konsisten akan mendukung ketahanan pangan di
          Kabupaten Malang.
        </h5>
        <span className="mt-5 ml-auto flex gap-2 text-xs font-medium">
          <Link href={SURVEYOR_ADD_DATA_FAMILY} className="rounded-md bg-blue-500 px-5 py-2.5 text-white transition hover:bg-blue-600">
            Isi Sekarang
          </Link>
          <Link href="/pengguna/rekap-kesehatan/lihat-panduan" className="rounded-md border border-blue-400 px-5 py-2.5 text-blue-500 transition hover:bg-blue-100">
            Lihat Panduan
          </Link>
        </span>
      </figure>
      <Page />
    </>
  );
}