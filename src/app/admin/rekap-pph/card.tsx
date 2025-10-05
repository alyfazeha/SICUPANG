"use client";

import { CalendarDays, FileDown, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_ADMIN_PPH_EXPORT } from "@/constants/routes";

export default function Card({ district, year }: { district: { id_kecamatan: number; nama_kecamatan: string }; year: number }) {
  const router = useRouter();

  return (
    <figure className="from-primary to-primary/75 relative overflow-hidden rounded-lg bg-gradient-to-br text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="bg-opacity-10 absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white" />
      <div className="bg-opacity-5 absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-white" />
      <figcaption className="relative z-10 cursor-default p-6 pb-4">
        <div className="mb-4 flex items-center justify-between">
          <CalendarDays className="text-opacity-80 h-6 w-6 text-white" />
          <h5 className="bg-opacity-20 rounded-full bg-white px-3 py-1 text-sm font-medium text-white">
            {year}
          </h5>
        </div>
        <h2 className="mb-2 text-2xl font-bold">Rekap Tahun {year}</h2>
        <p className="text-opacity-80 text-sm leading-6 text-white">
          Berikut merupakan rekap PPH {district.nama_kecamatan} untuk tahun{" "}
          {year}.
        </p>
      </figcaption>
      <div className="relative z-10 cursor-default px-6 pb-4">
        <span className="text-opacity-90 flex items-center space-x-2 text-white">
          <MapPin className="h-4 w-4" />
          <h5 className="text-sm">Kecamatan {district.nama_kecamatan}</h5>
        </span>
      </div>
      <div className="relative z-10 p-6 pt-4 text-sm">
        <button onClick={() => router.push(API_ADMIN_PPH_EXPORT(district.id_kecamatan, year))} type="button" className="text-primary flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-white px-4 py-3 font-semibold transition-all duration-300 ease-in-out hover:bg-slate-100">
          <FileDown className="h-4 w-4" />
          <h5>Unduh PPH</h5>
        </button>
      </div>
    </figure>
  );
}