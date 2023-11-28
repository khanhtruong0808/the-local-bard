import type { Metadata } from "next";
import Image from "next/image";

import "@/app/globals.css";
import { Auth } from "@/components/Auth";
import { Navbar } from "@/components/Navbar";
import Toaster from "@/components/toaster";
import { GlobalDialog } from "@/components/GlobalDialog";

export const metadata: Metadata = {
  title: "The Local Bard",
  description: "Local theaters near you",
};

// TODO: figure why this is necessary to avoid following error:
// Dynamic server usage: Page couldn't be rendered statically because it used `cookies`.
// See more info here: https://nextjs.org/docs/messages/dynamic-server-error
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex h-full flex-col overscroll-none bg-fixed">
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
      </body>
    </html>
  );
}
