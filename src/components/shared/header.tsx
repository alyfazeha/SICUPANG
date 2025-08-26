"use client";

import { LOGIN, REGISTER } from "@/constants/routes";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  if (pathname === LOGIN || pathname === REGISTER) return null;

  return <header></header>;
}