"use client";

import { FaFileExcel } from "react-icons/fa6";
import { District as D } from "@/services/admin/district";
import type { FoodData } from "@/types/family";
import type { District } from "@/types/region";
import Table from "@/components/shared/table";

export default function DownloadExcel({ districts, foodList, page }: { districts: District[]; foodList: FoodData[], page: number }) {
  return (
    <Table
      headers={["No", "Nama Kecamatan", "Kode Wilayah", "Aksi"]}
      rows={districts.map((district, i) => [
        (page - 1) * 10 + (i + 1),
        district.name,
        district.code,
        <button
          type="button"
          onClick={() => D.downloadExcel(district, foodList)}
          key={i}
          className="bg-primary flex cursor-pointer items-center justify-center rounded-lg px-4 py-3 text-white"
        >
          <FaFileExcel className="mr-3 h-4 w-4" /> Unduh
        </button>,
      ])}
      sortable={[]}
    />
  );
}