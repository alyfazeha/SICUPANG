"use client";

import { Menu, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { FaRightFromBracket } from "react-icons/fa6";
import { ADMIN_PROFILE, API_ACCOUNT, API_LOGOUT, AUTH_PAGES, LOGIN, SURVEYOR_PROFILE } from "@/constants/routes";
import type { Auth } from "@/types/auth";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function Header({ isOpen, setIsOpen, title }: { isOpen: boolean; setIsOpen?: Dispatch<SetStateAction<boolean>>; title?: string | null }) {
  const [name, setName] = useState<string | null>(null);
  const [nip, setNip] = useState<string | null>(null);
  const [isOpenMenus, setIsOpenMenus] = useState<boolean>(false);
  const pathname = usePathname();
  const isAuthenticatedPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  const handleLogout = () => {
    axios.post(API_LOGOUT, null, { withCredentials: true }).then(() => window.location.href = LOGIN).catch((err) => console.error(`Terjadi kesalahan saat keluar dari akun Anda: ${err}`));
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<{ data: Auth | null }>(API_ACCOUNT, { withCredentials: true });

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

  if (pathname === LOGIN) return null;

  return (
    <>
      {isAuthenticatedPage ? (
        <header className={`flex items-center justify-between border-b border-[#d3d3d3] px-10 py-4 transition-all duration-300 ease-in-out sm:px-10 ${isOpen ? "lg:pl-72" : "lg:pl-10"}`}>
          <section className="flex items-center gap-6">
            <Menu className="h-4 w-4 cursor-pointer lg:h-5 lg:w-5" onClick={() => setIsOpen?.((previous) => !previous)} />
            <h4 className="cursor-default text-lg font-semibold text-[#2d2d2d]">
              {title}
            </h4>
          </section>
          <figure className="relative flex cursor-pointer items-center gap-4 font-medium text-[#585858]" onClick={() => setIsOpenMenus((previous) => !previous)}>
            <figcaption className="hidden flex-col text-right text-sm tracking-wider sm:flex">
              {name ?? "Surveyor"}
              <br />
              {nip ?? "N/A"}
            </figcaption>
            <Image height={1920} width={1080} src="/images/profile-photo.png" alt="Foto Profil" className="h-12 w-12 rounded-full object-cover" loading="lazy" />
            {isOpenMenus && (
              <section className="absolute top-14 right-0 z-50 flex flex-col gap-2.5 rounded border border-[#d3d3d3] bg-white px-5 py-3 text-sm shadow">
                <Link href={pathname.startsWith("/admin") ? ADMIN_PROFILE : SURVEYOR_PROFILE} className="flex items-center gap-4 transition-all duration-300 ease-in-out hover:text-blue-500">
                  <User className="h-3.5 w-3.5" />
                  <h6>Profil</h6>
                </Link>
                <hr className="border border-[#cecece50]" />
                <button type="submit" onClick={handleLogout} className="flex cursor-pointer items-center gap-4 transition-all duration-300 ease-in-out hover:text-red-500">
                  <FaRightFromBracket className="h-3 w-3" />
                  <h6>Keluar</h6>
                </button>
              </section>
            )}
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