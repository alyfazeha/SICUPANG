"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AUTH_PAGES } from "@/constants/routes";
import { setTitleHeader } from "@/utils/header";
import type { Roles } from "@/types/auth";
import Footer from "@/components/shared/footer";
import Sidebar from "@/components/shared/sidebar";
import Header from "@/components/shared/header";

export default function Auth({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));
  const role: Roles | null = isAuthPage && pathname.startsWith("/admin") ? "ADMIN" : isAuthPage && pathname.startsWith("/surveyor") ? "SURVEYOR" : null;

  useEffect(() => {
    if (window.innerWidth >= 1024) setIsOpen(true);
  }, []);

  return (
    <>
      <Header isOpen={isOpen} setIsOpen={setIsOpen} title={setTitleHeader(pathname, role)} />
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}
      <main className={`p-10 transition-all duration-300 ease-in-out ${role && (isOpen ? "lg:ml-62" : "ml-0")}`}>
        {children}
      </main>
      {role && <Sidebar role={role} isOpen={isOpen} />}
      {!isAuthPage && <Footer />}
    </>
  );
}