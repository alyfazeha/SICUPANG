"use client";

import { Camera, CookingPot, Home, UserCheck2 } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FAMILY_ATTRIBUTES, KEYS_TO_EXCLUDE } from "@/constants/family";
import { SURVEYOR_DASHBOARD, SURVEYOR_FAMILY } from "@/constants/routes";
import type { Family } from "@/types/family";
import { Text } from "@/utils/text";
import Table from "@/components/shared/table";
import Image from "next/image";

export default function Page({ family }: { family: Omit<Family, "created_at" | "updated_at"> }) {
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
              {Text.truncate(`${family.name}`, 15, 50)}
            </h5>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ul className="pt-4">
        <h5 className="text-primary my-6 flex cursor-default items-center text-lg font-semibold">
          <UserCheck2 className="mr-4 h-5 w-5" /> Daftar Keluarga
        </h5>
        {Object.entries(family).filter(([key]) => !KEYS_TO_EXCLUDE.includes(key as keyof Family) && FAMILY_ATTRIBUTES[key as keyof typeof FAMILY_ATTRIBUTES]).map(([key, value]) => (
          <li key={key} className="grid grid-cols-1 border-b border-gray-100 text-sm transition-all duration-200 last:border-b-0 hover:bg-emerald-50/50 md:grid-cols-2">
            <div className="flex items-center py-4 pr-5 md:py-5 md:pr-5">
              <span className="bg-primary mr-4 h-12 w-1.5 rounded-full" />
              <h5 className="text-primary cursor-default font-medium">
                {FAMILY_ATTRIBUTES[key as keyof typeof FAMILY_ATTRIBUTES]}
              </h5>
            </div>
            <div className="flex items-center p-4 text-gray-800 md:justify-end md:p-5 md:text-right">
              {value !== null && value !== undefined && value !== "" ? (
                <h5 className="cursor-default font-medium">
                  {String(value).toUpperCase() === "YA" ? "Ya" : String(value).toUpperCase() === "TIDAK" ? "Tidak" : String(value)}
                </h5>
              ) : (
                <h5 className="text-gray-400">—</h5>
              )}
            </div>
          </li>
        ))}
      </ul>
      <h5 className="text-primary my-6 flex cursor-default items-center text-lg font-semibold">
        <CookingPot className="mr-4 h-5 w-5" /> Daftar Olahan Pangan
      </h5>
      <Table
        headers={["No", "Nama Olahan Pangan", "Porsi"]}
        rows={family.foodstuff.map((foodstuff, index) => [index + 1, foodstuff.name, `${foodstuff.portion} porsi`])}
        sortable={["Nama Olahan Pangan"]}
      />
      <h5 className="text-primary my-6 flex cursor-default items-center text-lg font-semibold">
        <Camera className="mr-4 h-5 w-5" /> Dokumentasi
      </h5>
      <Image
        src={family.photo as string}
        alt="Family"
        width={1920}
        height={1080}
        className="h-100 w-full rounded-2xl border border-gray-200 bg-no-repeat object-cover object-center p-6"
      />
    </figure>
  );
}