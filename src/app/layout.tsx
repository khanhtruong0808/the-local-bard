import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import Image from "next/image";

import "@/app/globals.css";
import { Auth } from "@/components/Auth";
import { Footer } from "@/components/Footer";
import { GlobalDialog } from "@/components/GlobalDialog";
import { Navbar } from "@/components/Navbar";
import Providers from "@/components/providers";
import Toaster from "@/components/toaster";

export const metadata: Metadata = {
  title: "The Local Bard",
  description: "Local theaters near you",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Only dark mode enabled for now.
    <html lang="en" className="dark h-full">
      <body className="flex h-full flex-col overscroll-none bg-fixed">
        <Providers>
          <Image
            src="/spotlights.png"
            alt="Spotlights"
            style={{
              objectFit: "cover",
              zIndex: -1,
              position: "fixed",
              height: "100vh",
              width: "100vw",
            }}
            height={1080}
            width={1920}
          />
          <Navbar>
            <Auth />
          </Navbar>
          <main className="mt-20 flex grow">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "10px",
                background: "#27272a",
                color: "#fff",
              },
            }}
          />
          <GlobalDialog />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
