"use client";

import { Pencil, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { API_SURVEYOR_FAMILY, SURVEYOR_DETAIL_DATA_FAMILY, SURVEYOR_EDIT_DATA_FAMILY } from "@/constants/routes";
import { DeleteFamiliesData as DF } from "@/services/family/delete/surveyor";
import type { Family, Status } from "@/types/family";
import { FamilyStatusBadge } from "@/utils/text";
import axios from "axios";
import Link from "next/link";
import Table from "@/components/shared/table";

export default function Page() {
  const [data, setData] = useState<Family[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<{ family: Family[] }>(API_SURVEYOR_FAMILY);
        setData(response.data.family);
      } catch (err: unknown) {
        console.error(`❌ Error GET ${API_SURVEYOR_FAMILY}: ${err}`);
        throw err;
      }
    })();
  }, []);

  return (
    <>
      <section className="bg-primary mt-8 mb-4 flex items-center justify-between gap-10 overflow-x-auto rounded-xl px-6 py-4 whitespace-nowrap">
        <h3 className="inline cursor-default font-bold text-white">
          Riwayat Data Keluarga
        </h3>
        <Search className="text-primary h-8 w-8 cursor-pointer rounded-lg bg-white p-2" />
        <span className="relative hidden items-center">
          <label htmlFor="cari-kepala-keluarga" className="hidden"></label>
          <Search className="absolute left-3 text-sm text-gray-400" />
          <input
            type="search"
            name="cari-kepala-keluarga"
            className="rounded-lg bg-white py-2 pr-3 pl-10 text-sm text-gray-800 focus:outline-none lg:py-3"
            placeholder="Cari Nama Kepala Keluarga..."
          />
        </span>
      </section>
      <Table
        headers={["Nama Kepala Keluarga", "Nomor Kartu Keluarga", "Desa", "Status", "Komentar", "Aksi"]}
        rows={data.map((family, index) => [
          family.name,
          family.family_card_number,
          family.village,
          FamilyStatusBadge(family.status as Status),
          family.comment ?? "-",
          <span key={index} className="flex items-center gap-4">
            <Link href={SURVEYOR_DETAIL_DATA_FAMILY(family.id_family as number)} className="cursor-pointer flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg transition-colors duration-150 shadow-sm hover:bg-blue-600 text-xs">
              <FaCircleInfo className="h-3.5 w-3.5" />
            </Link>
            <Link href={SURVEYOR_EDIT_DATA_FAMILY(family.id_family as number)} className="cursor-pointer flex items-center justify-center p-3 bg-yellow-500 text-white rounded-lg transition-colors duration-150 shadow-sm hover:bg-yellow-600 text-xs">
              <Pencil className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={async () => { await DF.delete(family.id_family as number); setData((prev) => prev.filter((f) => f.id_family !== family.id_family))}}
              type="button"
              className="cursor-pointer flex items-center justify-center p-3 bg-red-500 text-white rounded-lg transition-colors duration-150 shadow-sm hover:bg-red-600 text-xs"
            >
              <Trash className="h-3.5 w-3.5" />
            </button>
          </span>,
        ])}
        sortable={["Nama Kepala Keluarga", "Desa"]}
      />
    </>
  );
}