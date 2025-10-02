import { Pencil, Trash } from "lucide-react";
import { FaCircleInfo } from "react-icons/fa6";
import {
  ADMIN_DELETE_SURVEYORS,
  ADMIN_DETAIL_SURVEYORS,
  ADMIN_EDIT_SURVEYORS,
} from "@/constants/routes";
import { Surveyor } from "@/types/surveyor";
import Link from "next/link";
import Table from "@/components/shared/table";

export default function Client({ surveyors }: { surveyors: Surveyor[] }) {
  return (
    <Table
      headers={["NIP", "Nama Surveyor", "Kecamatan", "Aksi"]}
      rows={surveyors.map((surveyor) => [
        surveyor.nip,
        surveyor.full_name,
        surveyor.district.name || "-",
        <span key={surveyor.id} className="flex gap-2.5">
          <Link href={ADMIN_DETAIL_SURVEYORS(surveyor.id)} className="rounded-md bg-blue-600 p-2.5 text-white transition hover:bg-blue-700">
            <FaCircleInfo className="h-3.5 w-3.5" />
          </Link>
          <Link href={ADMIN_EDIT_SURVEYORS(surveyor.id)} className="rounded-md bg-yellow-600 p-2.5 text-white transition hover:bg-yellow-700">
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <a href={ADMIN_DELETE_SURVEYORS(surveyor.id)} className="rounded-md bg-red-600 p-2.5 text-white transition hover:bg-red-700">
            <Trash className="h-3.5 w-3.5" />
          </a>
        </span>,
      ])}
      sortable={["Nama Surveyor", "Kecamatan"]}
    />
  );
}