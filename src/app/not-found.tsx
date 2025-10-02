import type { Metadata } from "next";
import Page from "@/app/client/not-found";

export const metadata: Metadata = {
  title: "404 | SICUPANG",
  description: "Oops, halaman yang kamu cari tidak ditemukan.",
  openGraph: {
    title: "404 | SICUPANG",
    description: "Oops, halaman yang kamu cari tidak ditemukan",
  },
  twitter: {
    title: "404 | SICUPANG",
    description: "Oops, halaman yang kamu cari tidak ditemukan",
  },
};

export default function NotFound() {
  return <Page />;
}