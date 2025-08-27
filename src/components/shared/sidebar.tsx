"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SidebarMenus } from "@/constants/sidebar";
import type { Sidebar } from "@/types/components";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar({ isOpen, role }: Pick<Sidebar, "isOpen" | "role">) {
  const pathname = usePathname();
  const [openSubMenuId, setOpenSubMenuId] = useState<string | null>(null);
  const handleSubMenuToggle = (label: string) => setOpenSubMenuId(openSubMenuId === label ? null : label);

  return (
    <aside className={`bg-primary fixed top-0 left-0 z-50 h-screen w-64 transform text-white shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <section className="mb-5 flex items-center gap-3 px-5 py-6">
        <Image height={1920} width={1080} src="/images/polinema.jpg" alt="Logo" className="w-14" />
        <span>
          <h4 className="text-sm font-bold lg:text-base">SIREPANG</h4>
          <h6 className="text-xs text-white/80 italic">
            Sistem Recall Pangan
          </h6>
        </span>
      </section>
      <nav className="flex h-full flex-col gap-1 overflow-y-auto px-3 pb-20">
        {SidebarMenus[role].map((menu) => {
          if (menu.subMenu) {
            return (
              <div key={menu.label} className="flex flex-col">
                <button onClick={() => handleSubMenuToggle(menu.label)} className={`flex cursor-pointer items-center gap-4 rounded-lg px-5 py-3 transition-all duration-300 ${openSubMenuId === menu.label ? "bg-white/20 text-white" : "text-white hover:bg-white/10"}`}>
                  {menu.icon}
                  <span className="text-sm">{menu.label}</span>
                  <span className="ml-auto">
                    {openSubMenuId === menu.label ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>
                {openSubMenuId === menu.label && (
                  <div className="mt-1 ml-6 flex flex-col gap-1">
                    {menu.subMenu.map((sub) => {
                      return (
                        <Link key={sub.href} href={sub.href || ""} className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all duration-300 ${sub.href && pathname === sub.href ? "text-primary bg-white font-semibold" : "text-white/80 hover:bg-white/10"}`}>
                          {sub.icon}
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link key={menu.href} href={menu.href || ""} className={`flex items-center gap-4 rounded-lg px-5 py-3 transition-all duration-300 ${menu.href && pathname === menu.href ? "text-primary bg-white font-semibold" : "text-white hover:bg-white/10"}`}>
              {menu.icon}
              <span className="text-sm">{menu.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}