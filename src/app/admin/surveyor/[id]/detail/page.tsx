import { Home } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ADMIN_DASHBOARD, ADMIN_MANAGE_SURVEYORS } from "@/constants/routes";
import { SURVEYOR_ATTRIBUTES } from "@/constants/admin";
import { Prisma } from "@/lib/prisma";
import { Truncate } from "@/utils/text";

// prettier-ignore
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const district = await Prisma.pengguna.findUniqueOrThrow({ where: { id_pengguna: parseInt(id, 10) }});

    return {
      title: `${district?.nama_lengkap ?? ""} | SICUPANG`,
      description: "",
      openGraph: {
        title: `${district?.nama_lengkap ?? ""} | SICUPANG`,
        description: "",
      },
      twitter: {
        title: `${district?.nama_lengkap ?? ""} | SICUPANG`,
        description: "",
      },
    };
  } catch (err: unknown) {
    console.error(`❌ [metadata] Error GET /api/admin/surveyor/${id}/get: ${err}`);
    return {
      title: "Detail Surveyor | SICUPANG",
      description: "",
      openGraph: { title: "Detail Surveyor | SICUPANG", description: "" },
      twitter: { title: "Detail Surveyor | SICUPANG", description: "" },
    };
  }
}

export default async function DetailSurveyor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const surveyor = await Prisma.pengguna.findFirstOrThrow({
    where: { AND: [{ peran: "SURVEYOR" }, { id_pengguna: parseInt(id, 10) }] },
    select: {
      nama_lengkap: true,
      nip: true,
      nomor_telepon: true,
      kecamatan: { select: { nama_kecamatan: true } },
    },
  });

  return (
    <section className="flex flex-col rounded-lg bg-white p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={ADMIN_DASHBOARD} className="lg:hover:text-foreground/72 flex items-center font-semibold">
              <Home className="mr-2 h-4 w-4" />
              Dasbor
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={ADMIN_MANAGE_SURVEYORS} className="lg:hover:text-foreground/72 flex items-center font-semibold">
              Surveyor
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <h5 className="flex cursor-default items-center font-semibold">
              {Truncate(surveyor?.nama_lengkap ?? "Detail Surveyor")}
            </h5>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ul className="pt-4">
        <h5 className="text-primary my-6 flex cursor-default items-center text-lg font-semibold">
          <Home className="mr-4 h-5 w-5" /> Data Surveyor
        </h5>
        {Object.entries(surveyor).map(([key, value]) => (
          <li key={key} className="grid grid-cols-1 border-b border-gray-100 text-sm transition-all duration-200 last:border-b-0 hover:bg-emerald-50/50 md:grid-cols-2">
            <div className="flex items-center py-4 pr-5 md:py-5 md:pr-5">
              <span className="bg-primary mr-4 h-12 w-1.5 rounded-full" />
              <h5 className="text-primary cursor-default font-medium">
                {key in SURVEYOR_ATTRIBUTES ? SURVEYOR_ATTRIBUTES[key as keyof typeof SURVEYOR_ATTRIBUTES] : key.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </h5>
            </div>
            <div className="flex items-center py-4 pl-5 md:py-5 md:pl-5">
              {value !== null && value !== undefined && value !== "" && (
                <h5 className="cursor-default font-medium">
                  {key === "kecamatan" ? (value as { nama_kecamatan: string }).nama_kecamatan : String(value)}
                </h5>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}