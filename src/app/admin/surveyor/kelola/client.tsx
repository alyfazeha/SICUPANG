"use client";

import { LoaderCircle, Pencil, Search as ISearch, Trash } from "lucide-react";
import { useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { ADMIN_DELETE_SURVEYORS, ADMIN_DETAIL_SURVEYORS, ADMIN_EDIT_SURVEYORS } from "@/constants/routes";
import { Surveyor } from "@/types/surveyor";
import Link from "next/link";
import Input from "@/components/shared/input";
import CTable from "@/components/shared/table";

export default function Client({ surveyors }: { surveyors: Surveyor[] }) {
  const [filtered, setFiltered] = useState<Surveyor[]>(surveyors);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    setLoading(true);

    setTimeout(() => {
      let result = surveyors;
      if (query.trim() !== "") result = surveyors.filter((surveyor) => (surveyor.full_name as string).toLowerCase().includes(query.toLowerCase()));
      setFiltered(result);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      <div className="mb-4 flex w-full items-end gap-3 lg:mb-6">
        <Input
          label=""
          name="search"
          type="text"
          placeholder="Cari surveyor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<ISearch className="h-4 w-4" />}
          required={false}
          variant="form"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="bg-primary hover:bg-primary/80 flex cursor-pointer items-center justify-center gap-2 rounded-md px-10 py-3.5 text-white transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Mencari...
            </>
          ) : (
            "Cari"
          )}
        </button>
      </div>
      <CTable
        headers={["NIP", "Nama Surveyor", "Kecamatan", "Aksi"]}
        rows={filtered.map((surveyor) => [
          surveyor.nip,
          surveyor.full_name,
          surveyor.district?.name || "-",
          <span key={surveyor.id} className="flex gap-2.5">
            <Link href={ADMIN_DETAIL_SURVEYORS(surveyor.id as number)} className="rounded-md bg-blue-600 p-2.5 text-white transition hover:bg-blue-700">
              <FaCircleInfo className="h-3.5 w-3.5" />
            </Link>
            <Link href={ADMIN_EDIT_SURVEYORS(surveyor.id as number)} className="rounded-md bg-yellow-600 p-2.5 text-white transition hover:bg-yellow-700">
              <Pencil className="h-3.5 w-3.5" />
            </Link>
            <a href={ADMIN_DELETE_SURVEYORS(surveyor.id as number)} className="rounded-md bg-red-600 p-2.5 text-white transition hover:bg-red-700">
              <Trash className="h-3.5 w-3.5" />
            </a>
          </span>,
        ])}
        sortable={["Nama Surveyor", "Kecamatan"]}
      />
    </>
  );
}