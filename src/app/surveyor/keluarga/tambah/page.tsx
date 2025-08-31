import type { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SURVEYOR_DASHBOARD, SURVEYOR_FAMILY } from "@/constants/routes";
import { Home } from "lucide-react";
import Page from "./client";

export const metadata: Metadata = {
  title: "Tambah Data Keluarga | SICUPANG",
  description: "",
  openGraph: {
    title: "Tambah Data Keluarga | SICUPANG",
    description: "",
  },
  twitter: {
    title: "Tambah Data Keluarga | SICUPANG",
    description: "",
  },
};

export default function TambahDataKeluarga() {
  return (
    <figure className="flex w-auto flex-col rounded-xl bg-white p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={SURVEYOR_DASHBOARD} className="lg:hover:text-foreground/72 flex items-center font-semibold">
              <Home className="mr-2 h-4 w-4" />
              Dasbor
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={SURVEYOR_FAMILY} className="lg:hover:text-foreground/72 flex items-center font-semibold">
              Keluarga
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <h5 className="flex cursor-default items-center font-semibold">
              Tambah Data
            </h5>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Page />
    </figure>
  );
}