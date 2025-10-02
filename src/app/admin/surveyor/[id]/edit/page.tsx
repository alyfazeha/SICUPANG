import { Home } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ADMIN_DASHBOARD, ADMIN_MANAGE_SURVEYORS } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";
import { Truncate } from "@/utils/text";
import Page from "./client";
import { Surveyor } from "@/types/surveyor";
import { District } from "@/types/region";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const district = await Prisma.pengguna.findUniqueOrThrow({ where: { id_pengguna: parseInt(id, 10) } });

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
      title: "Edit Surveyor | SICUPANG",
      description: "",
      openGraph: { title: "Edit Surveyor | SICUPANG", description: "" },
      twitter: { title: "Edit Surveyor | SICUPANG", description: "" },
    };
  }
}

export default async function EditSurveyor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [rawDistricts, rawSurveyor] = await Promise.all([
    Prisma.kecamatan.findMany({ select: { id_kecamatan: true, nama_kecamatan: true } }),
    Prisma.pengguna.findFirstOrThrow({
      where: { id_pengguna: parseInt(id, 10), peran: "SURVEYOR" },
      select: {
        id_pengguna: true,
        nama_lengkap: true,
        nip: true,
        nomor_telepon: true,
        kecamatan: { select: { id_kecamatan: true, nama_kecamatan: true } },
      },
    }),
  ]);

  const districts = rawDistricts.map((district) => ({
    id: district.id_kecamatan,
    name: district.nama_kecamatan,
  })) as District[];

  const surveyor: Surveyor = {
    full_name: rawSurveyor.nama_lengkap,
    nip: rawSurveyor.nip,
    phone_number: rawSurveyor.nomor_telepon ?? "",
    password: "",
    district: rawSurveyor.kecamatan ? { id: rawSurveyor.kecamatan.id_kecamatan, name: rawSurveyor.kecamatan.nama_kecamatan } : { id: 0, name: "" },
  };

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
              {Truncate(surveyor?.full_name ?? "Detail Surveyor")}
            </h5>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Page districts={districts} params={params} surveyor={surveyor} />
    </section>
  );
}