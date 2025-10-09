import { Home } from "lucide-react";
import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FOOD_RECORD_ATTRIBUTES } from "@/constants/admin";
import { ADMIN_DASHBOARD, ADMIN_FOOD_RECORD } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import { CapitalizeEachWord, Truncate } from "@/utils/text";
import Image from "next/image";
import Table from "@/components/shared/table";

export const dynamic = "force-dynamic";

// prettier-ignore
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const family = await Prisma.keluarga.findFirstOrThrow({ where: { id_keluarga: parseInt(id, 10) } });

    return {
      title: `Rekap Pangan ${family.nama_kepala_keluarga ?? ""} | SICUPANG`,
      description: "",
      openGraph: {
        title: `Rekap Pangan ${family.nama_kepala_keluarga ?? ""} | SICUPANG`,
        description: "",
      },
      twitter: {
        title: `Rekap Pangan ${family.nama_kepala_keluarga ?? ""} | SICUPANG`,
        description: "",
      },
    };
  } catch (err: unknown) {
    console.error(`❌ [metadata] Error GET /api/admin/rekap-pangan/${id}: ${err}`);
    return {
      title: "Rekap Pangan | SICUPANG",
      description: "",
      openGraph: { title: "Rekap Pangan | SICUPANG", description: "" },
      twitter: { title: "Rekap Pangan | SICUPANG", description: "" },
    };
  }
}

export default async function DetailRekapPangan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const family = await Prisma.keluarga.findFirstOrThrow({
    where: { id_keluarga: parseInt(id, 10) },
    include: {
      desa: true,
      pendapatan: true,
      pengeluaran: true,
      pangan_keluarga: {
        include: { pangan: { include: { takaran: true } } },
      },
    },
  });

  return (
    <section className="flex flex-col rounded-lg bg-white p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={ADMIN_DASHBOARD} className="lg:hover:text-foreground/72 flex items-center font-semibold">
              <Home className="mr-2 h-4 w-4" />
              Dasbor
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={ADMIN_FOOD_RECORD} className="lg:hover:text-foreground/72 flex items-center font-semibold">
              Rekap Pangan
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <h5 className="flex cursor-default items-center font-semibold">
              {Truncate(family.nama_kepala_keluarga ?? "Detail Rekap Pangan")}
            </h5>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ul>
        {Object.entries(FOOD_RECORD_ATTRIBUTES).map(([key, label]) => {
          const value = family[key as keyof typeof family];
          if (value === null || value === undefined || value === "") return null;

          return (
            <li key={key} className="grid grid-cols-1 border-b border-gray-100 text-sm transition-all duration-200 last:border-b-0 hover:bg-emerald-50/50 md:grid-cols-2">
              <div className="flex items-center py-4 pr-5 md:py-5 md:pr-5">
                <span className="bg-primary mr-4 h-12 w-1.5 rounded-full" />
                <h5 className="text-primary cursor-default font-medium">
                  {label}
                </h5>
              </div>
              <div className="flex items-center py-4 pl-5 md:py-5 md:pl-5">
                <h5 className="cursor-default font-medium">
                  {typeof value === "boolean" ? value ? "Ya" : "Tidak" : String(value)}
                </h5>
              </div>
            </li>
          );
        })}
      </ul>
      <h5 className="text-primary mt-6 mb-4 flex items-center font-semibold">
        <span className="bg-primary mr-4 h-12 w-1.5 rounded-full" />
        Dokumentasi
      </h5>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-md">
        <Image
          height={1920}
          width={1080}
          src={family.gambar}
          alt={`Dokumentasi kegiatan survey ${family.nama_kepala_keluarga ?? ""}`}
          className="h-[28rem] w-full object-cover"
        />
      </div>
      <h5 className="text-primary mt-6 mb-4 flex items-center font-semibold">
        <span className="bg-primary mr-4 h-12 w-1.5 rounded-full" />
        Daftar Pangan Keluarga
      </h5>
      <Table
        headers={["No", "Nama Pangan", "Takaran URT"]}
        rows={family.pangan_keluarga.map((food, index) => [
          index + 1,
          CapitalizeEachWord(food.pangan.nama_pangan.toUpperCase()),
          `${food.urt} ${food.pangan.takaran?.nama_takaran ?? ""}`,
        ])}
        sortable={[]}
      />
    </section>
  );
}