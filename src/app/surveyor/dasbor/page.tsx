import type { Metadata } from "next";
import Page from "@/client/surveyor/dasbor";

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

export default function DasborSurveyor() {
  return <Page />;
}