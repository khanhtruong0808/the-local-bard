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
    <Disclosure as="nav" className="bg-yellow-300">
      {({ open }) => (
        <>
          {/* Desktop Navbar */}
          <div className="max-w-5xl w-full justify-between p-3 mx-auto items-center hidden md:flex">
            <a href="/" className="flex items-center gap-2 font-medium">
              <Image width={40} height={40} alt="" src="/logo.jpg" />
              The Local Bard
            </a>
            <div className="flex text-sm items-center text-yellow-950">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:bg-yellow-400 px-3 py-2 rounded"
                >
                  {link.label}
                </a>
              ))}
              {children}
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div className="max-w-5xl w-full justify-between p-3 mx-auto items-center flex md:hidden">
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
            <div className="flex text-sm items-center text-yellow-950">
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
                  className="bg-yellow-300 text-black block rounded-md px-3 py-2 text-base font-medium"
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
