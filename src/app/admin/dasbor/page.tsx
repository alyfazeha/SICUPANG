import type { Metadata } from "next";
import Page from "@/client/admin/dasbor";

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

export default function DasborAdmin() {
  return (
    <>
      <Page />
    </>
  );
}