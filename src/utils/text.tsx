"use client";

import { Badge } from "@/components/ui/badge";
import type { Status } from "@/types/family";

export class Text {
  public static truncate(text?: string, mobileLength?: number, maxLength: number = 30) {
    if (!text) return "";

    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

    if (text.length > (isMobile && mobileLength ? mobileLength : maxLength)) {
      return text.substring(0, maxLength - 5) + " ...";
    }

    return text;
  }

  public static familyStatusBadge(text: Status) {
    switch (text) {
      case "DITERIMA":
        return <Badge className="bg-green-500 transition-all duration-300 ease-in-out hover:bg-green-600">Diterima</Badge>;
      case "DITOLAK":
        return <Badge className="bg-red-500 transition-all duration-300 ease-in-out hover:bg-red-600">Ditolak</Badge>;
      case "MENUNGGU":
        return <Badge className="bg-yellow-500 transition-all duration-300 ease-in-out hover:bg-yellow-600">Menunggu</Badge>;
      default:
        return <Badge className="bg-gray-400 transition-all duration-300 ease-in-out">Tidak Diketahui</Badge>;
    }
  }
}