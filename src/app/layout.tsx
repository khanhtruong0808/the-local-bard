import { Auth } from "@/components/Auth";
import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";
import Image from "next/image";
import spotlights from "../../public/spotlights.svg";
import "./globals.css";

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
      <body className="flex h-full flex-col bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-zinc-600 via-zinc-900 to-zinc-800 bg-fixed">
        <Image
          src={spotlights}
          alt="Spotlights"
          style={{
            objectFit: "cover",
            zIndex: -1,
            position: "fixed",
            height: "100vh",
            width: "100vw",
          }}
        />
        <Navbar>
          <Auth />
        </Navbar>
        <main className="flex grow">{children}</main>
      </body>
    </html>
  );
}
