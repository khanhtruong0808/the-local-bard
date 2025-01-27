import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Next.js to serve images from any domain
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
