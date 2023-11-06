/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
