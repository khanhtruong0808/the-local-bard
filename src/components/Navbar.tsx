"use client";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";

export const Navbar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

  const links = [{ href: "/search", label: "Map", hidden: false }];

  return (
    <Disclosure
      as="nav"
      className={twMerge(
        "text-zinc-200",
        isSearchPage
          ? "fixed top-0 z-50 w-full shrink-0 bg-zinc-900"
          : "bg-transparent",
      )}
    >
      {({ open }) => (
        <>
          {/* Desktop Navbar */}
          <div
            className={twMerge(
              "mx-auto hidden h-20 w-full max-w-5xl p-8 md:block",
              isSearchPage && "bg-zinc-900",
            )}
          >
            <div className="relative flex h-20 justify-between">
              <div className="relative z-10 flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <Link
                    href="/"
                    className="mr-14 flex items-center gap-2 whitespace-nowrap font-medium"
                  >
                    <Image width={40} height={40} alt="" src="/logo.jpg" />
                    The Local Bard
                  </Link>
                </div>
              </div>
              <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                <div className="w-full sm:max-w-xs">
                  <div className="flex items-center justify-center gap-x-4 text-sm">
                    {links.map(
                      (link) =>
                        !link.hidden && (
                          <Link
                            key={link.label}
                            href={link.href}
                            className={twMerge(
                              "rounded px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/10 hover:text-white",
                              isSearchPage && "hover:bg-zinc-700",
                            )}
                          >
                            {link.label}
                          </Link>
                        ),
                    )}
                  </div>
                </div>
              </div>
              {/* Profile dropdown slot */}
              <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                {children}
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div
            className={twMerge(
              "flex w-full max-w-5xl items-center justify-between p-3 md:hidden",
              open && "bg-zinc-700",
            )}
          >
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
            <div className="space-y-1 divide-none bg-zinc-700 px-2 pb-3 pt-2">
              {/* {links.map((item) => (
                <Disclosure.Button
                  key={item.label}
                  as={Button}
                  asChild
                  className="block bg-transparent text-zinc-200 shadow-none"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Disclosure.Button>
              ))} */}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
