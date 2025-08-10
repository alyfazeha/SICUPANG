"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_PROFILE, CITIZEN_PROFILE } from "@/constants/routes";
import { adminMenuItems, citizenMenuItems } from "@/constants/sidebar";
import type { Roles } from "@/types/auth";
import type { SidebarConfig, SidebarMenuItem } from "@/types/components";
import Link from "next/link";

export default function Sidebar({ type }: { type: Roles }) {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems = type === "ADMIN" ? adminMenuItems : citizenMenuItems;
  const config: SidebarConfig = type === "ADMIN" ? { initial: "A", name: "Administrator", email: "admin@sicupang.com", type: "ADMIN" } : { initial: "M", name: "Masyarakat", email: "masyarakat@sicupang.com", type: "MASYARAKAT" };

  useEffect(() => {
    for (const item of menuItems) {
      if (item.subMenu?.some((sub) => pathname.startsWith(sub.link || ""))) {
        setOpenSubMenu(item.id);
        break;
      }
    }
  }, [menuItems, pathname]);

  const handleMenuClick = (item: SidebarMenuItem) => {
    if (item.subMenu?.length) setOpenSubMenu(openSubMenu === item.id ? null : item.id);
    else if (item.action) item.action();
  };

  return (
    <aside className="fixed top-0 left-0 z-50 h-screen w-auto bg-white shadow-lg">
      <section className="flex flex-col items-center gap-3 px-6 py-8">
        <div className="flex w-full items-center gap-3">
          <h5 className="text-primary bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold">
            {config.initial}
          </h5>
          <span>
            <h5 className="text-primary text-base font-semibold">
              {config.name}
            </h5>
            <h6 className="text-primary/70 mt-0.5 text-xs">{config.email}</h6>
          </span>
        </div>
        <Link
          href={config.type === "ADMIN" ? ADMIN_PROFILE : CITIZEN_PROFILE}
          className="bg-primary/10 text-primary hover:bg-primary/20 mt-2 flex w-[92%] items-center justify-center gap-2 rounded px-2 py-2 text-sm font-semibold transition-all duration-300 ease-in-out"
        >
          <i className="fas fa-user text-base"></i> Profil
        </Link>
      </section>
      <hr className="mx-6 border-b border-gray-100" />
      <nav className="space-y-1 px-4 pb-6">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.subMenu ? (
              <button type="button" className="group flex w-full items-center rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50" onClick={() => handleMenuClick(item)}>
                <span className="bg-primary absolute top-0 bottom-0 left-0 w-1 rounded-r-full opacity-0 group-hover:opacity-40"></span>
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
                {openSubMenu === item.id ? <ChevronUp className="ml-auto h-3 w-3" /> : <ChevronDown className="ml-auto h-3 w-3" />}
              </button>
            ) : (
              <Link
                href={item.link || ""}
                className={`group flex w-full items-center rounded-lg px-4 py-3 text-gray-600 transition-all duration-300 ease-in-out hover:bg-gray-50 ${item.link && pathname.startsWith(item.link) ? "bg-primary/20 text-primary font-bold" : ""}`}
                onClick={() => handleMenuClick(item)}
              >
                <span className="bg-primary absolute top-0 bottom-0 left-0 w-1 rounded-r-full opacity-0 group-hover:opacity-40"></span>
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )}
            {item.subMenu && openSubMenu === item.id && (
              <div className="mt-1 ml-8 space-y-1">
                {item.subMenu.map((sub) => (
                  <Link
                    key={sub.id}
                    href={sub.link || ""}
                    className={`flex items-center rounded px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 ${sub.link && pathname.startsWith(sub.link) ? "bg-primary/20 text-primary font-bold" : ""}`}
                  >
                    <i className={`${sub.icon}`}></i>
                    <span>{sub.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}