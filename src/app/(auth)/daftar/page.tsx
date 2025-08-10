import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Form from "@/client/auth/daftar";

export const metadata: Metadata = {
  title: "Daftar | SICUPANG",
  description: "",
  openGraph: {
    title: "Daftar | SICUPANG",
    description: "",
  },
  twitter: {
    title: "Daftar | SICUPANG",
    description: "",
  },
};

export default function Daftar() {
  return (
    <>
      <Link href="/" className="bg-primary lg:hover:bg-primary/90 absolute top-6 left-6 z-30 flex cursor-pointer items-center gap-2 rounded-lg px-5 py-3 text-slate-50 transition-all duration-300 ease-in-out">
        <ArrowLeft className="mr-2 h-4 w-4" aria-label="Kembali ke halaman sebelumnya" />
        <h5 className="text-sm font-bold">Kembali</h5>
      </Link>
      <main className="grid h-screen min-h-fit grid-cols-1 items-center bg-gradient-to-br from-[#f4f8fb] to-[#e0f2fe] px-6 py-16 lg:grid-cols-2 lg:px-32 lg:py-40">
        <Form />
        <aside className="hidden h-full items-center justify-center lg:flex" aria-hidden="true">
          <figure className="relative h-80 w-80">
            <Image
              height={1920}
              width={1080}
              src="/images/joyful-farmer-in-lush-bengkulu-rice-fields.jpeg"
              alt="Ilustrasi 1"
              className="absolute bottom-60 left-8 z-10 h-70 w-70 rotate-[-8deg] rounded-2xl border-4 border-white object-cover shadow-xl"
            />
            <Image
              height={1920}
              width={1080}
              src="/images/traditional-market-selling-various-types-of-fruits-and-vegetables.jpg"
              alt="Ilustrasi 2"
              className="absolute left-20 z-20 h-70 w-70 rotate-6 rounded-2xl border-4 border-white object-cover shadow-xl"
            />
            <Image
              height={1920}
              width={1080}
              src="/images/prabowo-subianto-visiting-ricefield.jpeg"
              alt="Ilustrasi 3"
              className="absolute top-50 left-12 z-30 h-70 w-70 rotate-2 rounded-2xl border-4 border-white object-cover shadow-xl"
            />
          </figure>
        </aside>
      </main>
    </>
  );
}