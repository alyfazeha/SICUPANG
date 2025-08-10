import { Metadata } from "next";
import Page from "@/client/errors/not-found";

export const metadata: Metadata = {
  title: "404 | SICUPANG",
  description: "",
  openGraph: {
    title: "404 | SICUPANG",
    description: "",
  },
  twitter: {
    title: "404 | SICUPANG",
    description: "",
  },
};

export default function NotFound() {
  return <Page />;
}