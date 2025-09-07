import type { Metadata } from "next";
import { API_ADMIN_READ_SURVEYOR_DATA } from "@/constants/routes";
import { Prisma } from "@/lib/prisma";

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
    console.error(`❌ [metadata] Error GET ${API_ADMIN_READ_SURVEYOR_DATA(id)}: ${err}`);
    return {
      title: "Edit Surveyor | SICUPANG",
      description: "",
      openGraph: { title: "Edit Surveyor | SICUPANG", description: "" },
      twitter: { title: "Edit Surveyor | SICUPANG", description: "" },
    };
  }
}