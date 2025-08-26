"use client";

import { Menu, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRightFromBracket } from "react-icons/fa6";
import { AUTH_PAGES, LOGIN, REGISTER } from "@/constants/routes";
import type { Auth } from "@/types/auth";
import Image from "next/image";
import axios from "axios";

export default function Header({ title }: { title?: string | null }) {
  const [name, setName] = useState<string | null>(null);
  const [nip, setNip] = useState<string | null>(null);
  const pathname = usePathname();
  const isAuthenticatedPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<{ data: Auth | null }>("/api/header", { withCredentials: true });

        if (response.data.data) {
          setName(response.data.data.nama_lengkap);
          setNip(response.data.data.nip);
        }
      } catch (err: unknown) {
        console.error("Terjadi kesalahan saat mengambil data NIP:", err);
        throw err;
      }
    })();
  }, []);
  
  if (pathname === LOGIN || pathname === REGISTER) return null;

  return (
    <>
      {isAuthenticatedPage ? (
        <header className="mb-6 flex items-center justify-between border-b border-[#d3d3d3] px-10 py-4 pl-80 transition-all duration-300 ease-in-out">
          <section className="flex items-center gap-6">
            <Menu className="h-4 w-4 cursor-pointer lg:h-5 lg:w-5" />
            <h4 className="cursor-default text-lg font-semibold text-[#2d2d2d]">
              {title}
            </h4>
          </section>
          <figure className="relative flex cursor-pointer items-center gap-4 font-medium text-[#585858]">
            <figcaption className="hidden flex-col text-right text-sm tracking-wider sm:flex">
              {name ?? "Surveyor"}
              <br />
              {nip ?? "N/A"}
            </figcaption>
            <Image height={1920} width={1080} src="/images/profile-photo.png" alt="Foto Profil" id="profile-picture" className="h-12 w-12 rounded-full object-cover" loading="lazy" />
            <section className="absolute top-14 right-0 z-50 hidden flex-col gap-2.5 rounded border border-[#d3d3d3] bg-white px-5 py-3 text-sm shadow">
              <a href="" className="flex items-center gap-3 transition-all duration-300 ease-in-out hover:text-blue-500">
                <User className="h-4 w-4 lg:h-5 lg:w-5" />
                <h6>Profil</h6>
              </a>
              <hr className="border border-[#cecece50]" />
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="flex items-center gap-3 transition-all duration-300 ease-in-out hover:text-red-500">
                  <FaRightFromBracket />
                  <h6>Keluar</h6>
                </button>
              </form>
            </section>
          </figure>
        </header>
      ) : (
        <header className="fixed top-0 right-0 left-0 z-50 container mx-auto pt-8">
          <section className="border-primary/20 mx-auto flex w-[92%] items-center justify-between rounded-lg border bg-white/95 px-8 py-4 backdrop-blur-lg transition-all duration-300"></section>
        </header>
      )}
    </>
  );
}