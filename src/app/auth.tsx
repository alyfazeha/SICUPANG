"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AUTH_PAGES } from "@/constants/routes";
import type { Roles } from "@/types/auth";
import Footer from "@/components/shared/footer";
import Sidebar from "@/components/shared/sidebar";

export default function Auth({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));
  const role: Roles | null = isAuthPage && pathname.startsWith("/admin") ? "ADMIN" : isAuthPage && pathname.startsWith("/surveyor") ? "SURVEYOR" : null;

  return (
    <>
      {children}
      {role && <Sidebar role={role} isOpen={false} />}
      {!isAuthPage && <Footer />}
    </>
  );
}