"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { API_SURVEYOR_DASHBOARD } from "@/constants/routes";
import type { Dashboard } from "@/types/dashboard";
import type { Family } from "@/types/family";
import axios, { type AxiosError } from "axios";
import Table from "@/components/shared/table";

export default function Page({ family }: { family: Pick<Family, "name" | "family_card_number" | "village">[] }) {
  const [data, setData] = useState<Pick<Dashboard, "family" | "villages">>({ family: 0, villages: 0 });

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<Dashboard>(API_SURVEYOR_DASHBOARD, { withCredentials: true });
        setData(response.data);
      } catch (err: unknown) {
        console.error(`Terjadi kesalahan saat mengambil data keluarga: ${(err as AxiosError).message}`);
        throw err;
      }
    })();
  }, []);

  return (
    <main>
      <section className="grid cursor-default grid-cols-1 gap-4 lg:grid-cols-2">
        <figure className="bg-primary relative overflow-hidden rounded-xl p-4 text-white lg:p-6">
          <h3 className="mb-2 text-sm opacity-80">Jumlah Desa</h3>
          <h5 className="relative z-10 text-xl font-bold lg:text-2xl">
            {data.villages ?? 0}
          </h5>
          <div className="bg-secondary absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-30"></div>
        </figure>
        <figure className="bg-primary relative overflow-hidden rounded-xl p-4 text-white lg:p-6">
          <h3 className="mb-2 text-sm opacity-80">Jumlah Keluarga</h3>
          <h5 className="relative z-10 text-xl font-bold lg:text-2xl">
            {data.family ?? 0}
          </h5>
          <div className="bg-secondary absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-30"></div>
        </figure>
      </section>
      <section className="bg-primary mt-8 flex items-center justify-between gap-10 overflow-x-auto rounded-xl px-6 py-4 whitespace-nowrap">
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
      <section className="mt-8">
        <Table
          headers={["Nama", "Nomor Kartu Keluarga", "Desa"]}
          rows={family.map((family) => [family.name, family.family_card_number, family.village])}
          sortable={["Nama", "Desa"]}
        />
      </section>
      <section className="absolute left-72 -bottom-10 z-0 grid grid-cols-3 gap-2">
        <span className="bg-primary block h-2 w-2 animate-pulse rounded-full opacity-40" />
        <span className="bg-primary block h-2 w-2 rounded-full opacity-30" />
        <span className="bg-primary block h-2 w-2 animate-pulse rounded-full opacity-40" />
        <span className="bg-primary block h-2 w-2 rounded-full opacity-20" />
        <span className="bg-primary block h-2 w-2 animate-pulse rounded-full opacity-40" />
        <span className="bg-primary block h-2 w-2 rounded-full opacity-30" />
        <span className="bg-primary block h-2 w-2 animate-pulse rounded-full opacity-40" />
        <span className="bg-primary block h-2 w-2 rounded-full opacity-20" />
        <span className="bg-primary block h-2 w-2 animate-pulse rounded-full opacity-40" />
      </section>
    </main>
  );
}