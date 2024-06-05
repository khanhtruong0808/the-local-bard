"use client";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

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
              "mx-auto hidden h-20 w-full max-w-5xl items-center p-8 md:flex",
              isSearchPage && "bg-zinc-900",
            )}
          >
            <Link
              href="/"
              className="mr-14 flex items-center gap-2 whitespace-nowrap font-medium"
            >
              <img alt="" src="/logo.png" className="h-[55px] w-[55px]" />
              The Local Bard
            </Link>
            <div className="flex w-full justify-between">
              <div className="flex items-center gap-x-4 text-sm">
                {links.map(
                  (link) =>
                    !link.hidden && (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={twMerge(
                          "rounded px-3 py-2 text-zinc-400 hover:bg-white/10 hover:text-white",
                          isSearchPage && "hover:bg-zinc-700",
                        )}
                      >
                        {link.label}
                      </Link>
                    ),
                )}
              </div>
              {children}
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
              <img alt="" src="/logo.png" className="h-[55px] w-[55px]" /> The
              Local Bard
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
