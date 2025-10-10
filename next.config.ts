import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uc994n45k9myctla.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;