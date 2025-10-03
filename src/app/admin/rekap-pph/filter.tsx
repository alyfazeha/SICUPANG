"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function Filter({ districts, selected }: { districts: { id_kecamatan: number; nama_kecamatan: string }[]; selected?: string }) {
  const router = useRouter();

  return (
    <div className="relative inline-block w-64">
      <select
        name="kecamatan"
        value={selected || ""}
        onChange={(e) => router.push(e.target.value ? `?kecamatan=${e.target.value}` : "?")}
        className="w-full cursor-pointer appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-800 shadow-sm transition-all duration-200 hover:border-slate-400 hover:shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
      >
        <option value="">🌍 Pilih Kecamatan</option>
        {districts.map((district) => (
          <option key={district.id_kecamatan} value={district.id_kecamatan}>
            {district.nama_kecamatan}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </span>
    </div>
  );
}