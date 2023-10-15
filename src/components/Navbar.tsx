"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import React from "react";

import { Disclosure } from "@headlessui/react";
import Button from "./Button";

export const Navbar = ({ children }: { children: React.ReactNode }) => {
  const links = [
    { href: "#", label: "Add a theater" },
    { href: "#", label: "Claim a theater" },
    { href: "/contact", label: "Contact us" },
  ];

  return (
    <Disclosure as="nav" className="bg-transparent text-zinc-200">
      {({ open }) => (
        <>
          {/* Desktop Navbar */}
          <div className="mx-auto hidden w-full max-w-5xl items-center justify-between p-8 md:flex">
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
            <div className="flex items-center text-sm">{children}</div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {links.map((item) => (
                <Disclosure.Button
                  key={item.label}
                  as={Button}
                  variant="secondary"
                  href={item.href}
                  className="block"
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
