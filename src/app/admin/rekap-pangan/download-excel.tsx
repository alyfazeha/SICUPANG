"use client";

import { FaFileExcel } from "react-icons/fa6";
import { DownloadExcel as downloadExcel } from "@/services/admin/food-record";
import { FamilyWithRegion } from "@/types/region";
import Table from "@/components/shared/table";

export default function DownloadExcel({ dataFamilies }: { dataFamilies: FamilyWithRegion[] }) {
  return (
    <Table
      headers={["Kecamatan", "Desa", "Kode Wilayah", "Nama Keluarga", "Aksi"]}
      rows={dataFamilies.map((family, index) => [
        family.district?.name ?? "-",
        family.village?.name ?? "-",
        family.district && family.village && `${family.district.code} - ${family.village.code}`,
        family.name ?? "-",
        <button
          type="button"
          onClick={() => {}}
          key={index}
          className="bg-primary flex cursor-pointer items-center justify-center rounded-lg px-4 py-3 text-white"
        >
          <FaFileExcel className="mr-3 h-4 w-4" /> Unduh
        </button>,
      ])}
      sortable={["Desa", "Nama Keluarga"]}
    />
  );
}