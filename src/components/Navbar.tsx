"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import React from "react";

import { Disclosure } from "@headlessui/react";

export const Navbar = ({ children }: { children: React.ReactNode }) => {
  // TODO: remove this TempLink type once we have some actual links.
  // I had to do this because TypeScript didn't like links being empty.
  type TempLink = { href: string; label: string };
  const links: TempLink[] = [
    // { href: "", label: "" },
    // { href: "#", label: "Add a theater" },
    // { href: "#", label: "Claim a theater" },
  ];
  return (
    <Disclosure as="nav" className="bg-zinc-800/90 text-zinc-200 shadow-2xl">
      {({ open }) => (
        <>
          {/* Desktop Navbar */}
          <div className="mx-auto hidden w-full max-w-5xl items-center justify-between p-3 md:flex">
            <a href="/" className="flex items-center gap-2 font-medium">
              <Image width={40} height={40} alt="" src="/logo.jpg" />
              The Local Bard
            </a>
            <div className="flex items-center gap-x-4 text-sm">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded px-3 py-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              {children}
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between p-3 md:hidden">
            <Disclosure.Button>
              {open ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </Disclosure.Button>
            <a href="/" className="flex items-center gap-2 font-medium">
              <Image width={40} height={40} alt="" src="/logo.jpg" /> The Local
              Bard
            </a>
            <div className="flex items-center text-sm text-yellow-950">
              {children}
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {links.map((item) => (
                <Disclosure.Button
                  key={item.label}
                  as="a"
                  href={item.href}
                  className="block rounded-md bg-yellow-300 px-3 py-2 text-base font-medium text-black"
                >
                  {item.label}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
