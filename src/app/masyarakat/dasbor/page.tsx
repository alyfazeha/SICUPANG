import { Metadata } from "next";
import Sidebar from "@/components/shared/sidebar";

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

export default function DasborMasyarakat() {
  return (
    <>
      <Sidebar type="MASYARAKAT" />
    </>
  );
}