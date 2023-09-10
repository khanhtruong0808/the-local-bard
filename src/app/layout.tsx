import { Auth } from "@/components/Auth";
import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col">
        <Navbar>
          <Auth />
        </Navbar>
        <main className="flex grow">{children}</main>
      </body>
    </html>
  );
}
