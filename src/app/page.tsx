import { BarChart3, CheckCircle, Circle, Star, Users } from "lucide-react";
import type { Metadata } from "next";
import type { Benefit } from "@/types/home";

export const metadata: Metadata = {
  title: "Beranda | SICUPANG",
  description: "",
  openGraph: {
    title: "Beranda | SICUPANG",
    description: "",
  },
  twitter: {
    title: "Beranda | SICUPANG",
    description: "",
  },
};

export default function Beranda() {
  const benefits: Benefit[] = [
    {
      icon: <CheckCircle className="text-primary h-7 w-7" />,
      title: "Validasi Data Akurat",
      description: "Data pangan dicatat secara sistematis untuk memastikan keakuratan informasi yang mendukung kebijakan pangan.",
    },
    {
      icon: <BarChart3 className="text-primary h-7 w-7" />,
      title: "Monitoring & Analisis",
      description: "Memudahkan analisis pola konsumsi pangan di masyarakat untuk mendukung program peningkatan gizi.",
    },
    {
      icon: <Users className="text-primary h-7 w-7" />,
      title: "Kolaborasi Masyarakat",
      description: "Mendorong keterlibatan aktif keluarga dan surveyor dalam pencatatan serta pelaporan data pangan.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative mx-auto max-w-5xl cursor-default px-6 pt-40 pb-20 text-center">
        <div className="bg-primary/10 absolute top-[-60px] left-[-60px] z-0 h-[180px] w-[180px] rounded-full blur-xl" />
        <div className="bg-accent/20 absolute right-[-80px] bottom-[-80px] z-0 h-[220px] w-[220px] rounded-full blur-xl" />
        <div className="absolute top-24 right-8 z-0 grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => <span key={i} className="bg-primary block h-2 w-2 animate-pulse rounded-full opacity-30" />)}
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1 className="text-primary text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            SICUPANG
          </h1>
          <h2 className="text-lg leading-snug font-semibold text-gray-800 md:text-2xl lg:text-3xl">
            Sistem Cerdas untuk Kebutuhan
            <br />
            Pangan di Kabupaten Malang
          </h2>
          <p className="text-text-secondary max-w-xl text-sm leading-relaxed md:text-base lg:text-lg">
            Platform digital untuk pencatatan, pemantauan, dan analisis data
            konsumsi pangan, mendukung upaya peningkatan gizi masyarakat
            Kabupaten Malang.
          </p>
        </div>
      </section>

      {/* Manfaat */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="bg-primary/10 absolute -top-10 -left-10 h-32 w-32 rounded-full blur-2xl" />
        <div className="bg-accent/20 absolute right-0 -bottom-12 h-40 w-40 rounded-full blur-3xl" />
        <Star className="text-primary/20 absolute top-12 right-16 h-8 w-8 animate-pulse" />
        <Circle className="text-accent/30 absolute bottom-4 left-16 h-6 w-6" />
        <h2 className="cursor-default text-center text-2xl font-bold text-gray-800 md:text-4xl">
          Manfaat SICUPANG
        </h2>
        <p className="mx-auto mt-3 max-w-2xl cursor-default text-center text-gray-600">
          Tiga manfaat utama yang membantu pemerintah, surveyor, dan masyarakat.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {benefits.map((item, index) => {
            return (
              <figure key={index} className="group relative flex cursor-pointer flex-col items-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:scale-105 hover:shadow-lg">
                <span className="bg-primary/10 mb-6 flex h-14 w-14 items-center justify-center rounded-full">
                  {item.icon}
                </span>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="mt-3 text-center text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
                <span className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
              </figure>
            );
          })}
        </div>
      </section>
    </>
  );
}