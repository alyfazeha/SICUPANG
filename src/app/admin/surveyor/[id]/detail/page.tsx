import { Home } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { API_ADMIN_READ_SURVEYOR_DATA } from "@/constants/routes";
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
    console.error(`❌ [metadata] Error GET ${API_ADMIN_READ_SURVEYOR_DATA(id)}: ${err}`);
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
    select: { nama_lengkap: true, nip: true, nomor_telepon: true },
  });

  return (
    <section className="flex flex-col rounded-lg bg-white p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="" className="lg:hover:text-foreground/72 flex items-center font-semibold">
              <Home className="mr-2 h-4 w-4" />
              Dasbor
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="" className="lg:hover:text-foreground/72 flex items-center font-semibold">
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
    </section>
  );
}