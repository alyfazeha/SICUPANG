import { Search } from "lucide-react";
import { jwtVerify } from "jose";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Table from "@/components/shared/table";
import { AUTH_TOKEN } from "@/constants/token";
import { Prisma } from "@/lib/prisma";
import type { Auth } from "@/types/auth";

export const metadata: Metadata = {
  title: "Dasbor | SICUPANG",
  description: "",
  openGraph: {
    title: "Dasbor | SICUPANG",
    description: "",
  },
  twitter: {
    title: "Dasbor | SICUPANG",
    description: "",
  },
};

export default async function DasborSurveyor() {
  const token = (await cookies()).get(AUTH_TOKEN)?.value;
  if (!token) {
    throw new Error("Pengguna tidak terautentikasi");
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
  const { payload } = await jwtVerify(token, secret);
  const decoded = payload as unknown as Auth;

  const surveyor = await Prisma.pengguna.findUnique({
    where: { id_pengguna: decoded.id_pengguna },
    select: { id_kecamatan: true },
  });

  if (!surveyor?.id_kecamatan) {
    throw new Error("Surveyor tidak punya kecamatan.");
  }

  const families = await Prisma.keluarga.findMany({
    where: { id_kecamatan: surveyor.id_kecamatan },
    select: {
      nama_kepala_keluarga: true,
      nomor_kartu_keluarga: true,
      desa: { select: { nama_desa: true } },
    },
  });

  const [totalVillages, totalFamilies] = await Promise.all([
    Prisma.keluarga.findMany({
      where: { id_kecamatan: surveyor.id_kecamatan },
      select: { id_desa: true },
      distinct: ["id_desa"],
    }),
    Prisma.keluarga.count({
      where: { id_kecamatan: surveyor.id_kecamatan },
    }),
  ]);

  return (
    <>
      <section className="grid cursor-default grid-cols-1 gap-4 lg:grid-cols-2">
        <figure className="bg-primary relative overflow-hidden rounded-xl p-4 text-white lg:p-6">
          <h3 className="mb-2 text-sm opacity-80">Jumlah Desa</h3>
          <h5 className="relative z-10 text-xl font-bold lg:text-2xl">
            {totalVillages.length}
          </h5>
          <div className="bg-secondary absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-30"></div>
        </figure>
        <figure className="bg-primary relative overflow-hidden rounded-xl p-4 text-white lg:p-6">
          <h3 className="mb-2 text-sm opacity-80">Jumlah Keluarga</h3>
          <h5 className="relative z-10 text-xl font-bold lg:text-2xl">
            {totalFamilies}
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
          rows={families.map((family) => [family.nama_kepala_keluarga, family.nomor_kartu_keluarga, family.desa.nama_desa])}
          sortable={["Nama", "Desa"]}
        />
      </section>
      <section className="absolute -bottom-10 left-72 z-0 grid grid-cols-3 gap-2">
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
    </>
  );
}