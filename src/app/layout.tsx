import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import Auth from "@/client/auth";
import "@/app/globals.css";

const fonts = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: "/images/favicon.svg",
  metadataBase: new URL("https://sicupang.vercel.app/"),
  openGraph: {
    images: "/images/favicon.svg",
    siteName: "SICUPANG",
  },
  twitter: {
    images: "/images/favicon.svg",
    card: "summary_large_image",
    site: "https://sicupang.vercel.app",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`scroll-py-10 ${fonts.variable} max-[8192px]:opacity-0 max-[3120px]:m-0 max-[3120px]:box-border max-[3120px]:p-0 max-[3120px]:[font-family:'Plus_Jakarta_Sans',Times,sans-serif,serif] max-[3120px]:opacity-100 max-[324px]:hidden`}>
      <body className="flex h-full min-h-screen flex-col overflow-x-hidden">
        <Auth>{children}</Auth>
      </body>
    </html>
  );
}