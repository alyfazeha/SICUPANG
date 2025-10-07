import { Badge } from "@/components/ui/badge";
import type { Status } from "@/types/family";

class Text {
  public static capitalizeEachWord(sentence: string) {
    if (typeof sentence !== "string" || sentence.length === 0) return "";
    return sentence.toLowerCase().split(" ").map((word) => {
      if (word.length === 0) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  }

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

export const CapitalizeEachWord = Text.capitalizeEachWord;
export const Truncate = Text.truncate;
export const FamilyStatusBadge = Text.familyStatusBadge;
export { Text };