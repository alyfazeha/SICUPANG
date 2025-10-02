import { CalendarDays, MapPin, FileDown } from "lucide-react";
import type { Metadata } from "next";
import { FaCircleInfo } from "react-icons/fa6";
import { Prisma } from "@/lib/prisma";

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

export default async function RekapPph() {
  const districts = await Prisma.kecamatan.findMany({ orderBy: { id_kecamatan: "asc" }, take: 3 });
  const year = new Date().getFullYear();

  return (
    <>
      <figure className="mb-6 flex w-full flex-col items-start rounded-lg border border-l-6 border-blue-200 bg-blue-50 p-4 pl-6 text-sm text-blue-800 shadow-sm">
        <span className="flex cursor-default items-center gap-3">
          <FaCircleInfo className="mt-0.75 text-lg text-blue-500" />
          <h5 className="text-lg font-semibold text-blue-600">
            Apa Itu Rekap PPH?
          </h5>
        </span>
        <h5 className="mt-2.5 hidden cursor-default text-sm leading-7 font-normal text-blue-800 lg:inline">
          Pola Pangan Harapan (PPH) adalah indikator yang digunakan pemerintah
          melalui Badan Pangan Nasional (Bapanas) dan Badan Pusat Statistik
          (BPS) untuk mengukur kualitas konsumsi pangan masyarakat. Skor PPH
          menunjukkan seberapa dekat pola konsumsi masyarakat dengan komposisi
          pangan ideal sesuai pedoman gizi seimbang. Data diperoleh melalui
          survei konsumsi rumah tangga—biasanya metode recall 24 jam atau
          pencatatan makanan— kemudian dikonversi ke satuan standar dan dihitung
          skornya.
        </h5>
        {/* Mobile */}
        <h5 className="mt-2.5 inline cursor-default text-sm leading-7 font-normal text-blue-800 lg:hidden">
          PPH (Pola Pangan Harapan) dipakai Bapanas & BPS untuk mengukur
          kualitas konsumsi pangan masyarakat. Skornya menunjukkan seberapa
          dekat pola makan dengan komposisi pangan ideal sesuai pedoman gizi
          seimbang.
        </h5>
      </figure>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {districts.map((district) => (
          <figure key={district.id_kecamatan} className="bg-primary relative overflow-hidden rounded-lg text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="bg-opacity-10 absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white"></div>
            <div className="bg-opacity-5 absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-white"></div>
            <figcaption className="relative z-10 cursor-default p-6 pb-4">
              <span className="mb-4 flex items-center justify-between">
                <CalendarDays className="text-opacity-80 h-6 w-6 text-white" />
                <h5 className="bg-secondary rounded-full px-3 py-1 text-sm font-medium text-white">
                  {year}
                </h5>
              </span>
              <h2 className="mb-2 text-2xl font-bold">Rekap Tahun {year}</h2>
              <p className="text-opacity-80 text-justify text-sm leading-6 text-white">
                Berikut merupakan rekap PPH {district.nama_kecamatan} untuk
                tahun {year}.
              </p>
            </figcaption>
            <div className="relative z-10 cursor-default px-6 pb-4">
              <span className="text-opacity-90 flex items-center space-x-2 text-white">
                <MapPin className="h-4 w-4" />
                <h5 className="text-sm">
                  Kecamatan {district.nama_kecamatan}
                </h5>
              </span>
            </div>
            <div className="relative z-10 p-6 pt-4 text-sm">
              <button type="button" className="text-primary flex w-full items-center justify-center space-x-2 rounded-lg bg-white px-4 py-3 font-semibold transition-all duration-200 hover:bg-slate-100">
                <FileDown className="h-4 w-4" />
                <h5>Unduh PPH</h5>
              </button>
            </div>
          </figure>
        ))}
      </section>
    </>
  );
}