import { NextResponse } from "next/server";
import { SURVEYOR_FAMILY } from "@/constants/routes";

export async function PATCH() {
  try {
    if (!process.env.NEXT_PUBLIC_APP_URL) throw new Error("NEXT_PUBLIC_APP_URL belum di-set di environment!");
    return NextResponse.redirect(new URL(SURVEYOR_FAMILY, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (err: unknown) {
    console.error(`Gagal mengedit data keluarga: ${err}`);
    return NextResponse.json({ message: "Gagal mengedit data keluarga" }, { status: 500 });
  }
}