import { Search } from "lucide-react";
import Table from "@/components/shared/table";

export default function Page() {
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
        rows={[]}
        sortable={["Nama Kepala Keluarga", "Desa"]}
      />
    </>
  );
}