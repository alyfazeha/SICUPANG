import { Briefcase, Heart, Info, Mail, MapPin, MessageCircleQuestionMark, Newspaper } from "lucide-react";
import { FaSignInAlt, FaShieldAlt } from "react-icons/fa";
import { FaClipboardCheck, FaComments, FaFacebookF, FaInstagram, FaNotesMedical, FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400"></div>
      <section className="container mx-auto w-[92%] px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <article className="flex flex-col items-start space-y-4 lg:col-span-1">
            <div className="relative">
              <Image height={1920} width={1080} src="/images/sehatin.svg" alt="SICUPANG Logo" className="h-12 w-auto" />
              <div className="from-primary absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-gradient-to-r to-cyan-400"></div>
            </div>
            <p className="text-text-secondary mt-2 text-sm leading-relaxed">
              Sistem terintegrasi untuk pencegahan dan monitoring PTM (Penyakit
              Tidak Menular) di Kabupaten Malang.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <MapPin className="text-primary h-4 w-4" />
                </span>
                <span className="text-xs">Kabupaten Malang, Jawa Timur</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <Mail className="text-primary h-4 w-4" />
                </span>
                <span className="text-xs">info&#64;sicupang.go.id</span>
              </div>
            </div>
          </article>
          <nav aria-label="Layanan" className="group">
            <h3 className="text-text-primary relative mb-4 text-base font-bold md:text-lg">
              Layanan
              <span className="absolute -bottom-1 left-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/masuk" className="text-text-secondary hover:text-primary group/item flex items-center gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover/item:bg-blue-100">
                    <FaNotesMedical className="h-4 w-4 text-blue-600" />
                  </span>
                  <span>Rekap Kesehatan</span>
                </Link>
              </li>
              <li>
                <Link href="/masuk" className="text-text-secondary hover:text-primary group/item flex items-center gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50 transition-colors group-hover/item:bg-green-100">
                    <FaClipboardCheck className="h-4 w-4 text-green-600" />
                  </span>
                  <span>Skrining PTM</span>
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Perusahaan" className="group">
            <h3 className="text-text-primary relative mb-4 text-base font-bold md:text-lg">
              Perusahaan
              <span className="absolute -bottom-1 left-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/fitur" className="text-text-secondary hover:text-primary group/item flex items-center gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 transition-colors group-hover/item:bg-purple-100">
                    <Info className="h-4 w-4 text-purple-600" />
                  </span>
                  <span>Tentang Kami</span>
                </Link>
              </li>
              <li>
                <Link href="/karir" className="text-text-secondary hover:text-primary group/item flex items-center gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 transition-colors group-hover/item:bg-orange-100">
                    <Briefcase className="h-4 w-4 text-orange-600" />
                  </span>
                  <span>Karir</span>
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="text-text-secondary hover:text-primary group/item flex items-center gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 transition-colors group-hover/item:bg-indigo-100">
                    <Newspaper className="h-4 w-4 text-indigo-600" />
                  </span>
                  <span>Artikel</span>
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Dukungan" className="group">
            <h3 className="text-text-primary relative mb-4 text-base font-bold md:text-lg">
              Dukungan
              <span className="absolute -bottom-1 left-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/pusat-bantuan" className="text-text-secondary hover:text-primary group/item flex items-center gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 transition-colors group-hover/item:bg-teal-100">
                    <MessageCircleQuestionMark className="h-4 w-4 text-teal-600" />
                  </span>
                  <span>Pusat Bantuan</span>
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="text-text-secondary hover:text-primary group/item flex items-center gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 transition-colors group-hover/item:bg-red-100">
                    <FaShieldAlt className="h-4 w-4 text-red-600" />
                  </span>
                  <span>Kebijakan Privasi</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text-secondary hover:text-primary group/item flex items-center gap-3 transition-all duration-200 hover:translate-x-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-50 transition-colors group-hover/item:bg-yellow-100">
                    <FaComments className="h-4 w-4 text-yellow-600" />
                  </span>
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 p-8 text-center shadow-xl">
          <h3 className="mb-2 text-xl font-bold text-white lg:text-2xl">
            Mulai Monitoring Kesehatan Anda
          </h3>
          <p className="mb-6 text-sm text-white/90">
            Bergabunglah dengan ribuan pengguna untuk hidup lebih sehat
          </p>
          <Link href="/masuk" className="hover:text-primary inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white">
            <FaSignInAlt />
            <span>Masuk</span>
          </Link>
        </div>
      </section>
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto w-[92%] px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center gap-1 md:items-start">
              <p className="text-sm font-medium text-gray-700">
                © 2025 SICUPANG - Sistem Monitoring PTM Kabupaten Malang
              </p>
              <p className="flex items-center justify-center text-xs text-gray-500">
                Dibuat dengan <Heart className="mx-1 h-4 w-4 text-red-500" />{" "}
                oleh&nbsp;
                <span className="text-primary font-semibold">
                  Tim Gatranova
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="https://instagram.com/sicupang" target="_blank" className="group hover:border-primary hover:bg-primary flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-all duration-200">
                <FaInstagram className="text-gray-600 transition-colors group-hover:text-white" />
              </Link>
              <Link href="https://facebook.com/sicupang" target="_blank" className="group hover:border-primary hover:bg-primary flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-all duration-200">
                <FaFacebookF className="text-gray-600 transition-colors group-hover:text-white"/>
              </Link>
              <Link href="https://twitter.com/sicupang" target="_blank" className="group hover:border-primary hover:bg-primary flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-all duration-200">
                <FaXTwitter className="text-gray-600 transition-colors group-hover:text-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}