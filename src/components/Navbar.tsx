"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Database } from "@/lib/database.types";
import Link from "next/link";

export const Navbar = () => {
  // Maybe this auth part can be done on server side?
  const supabase = createClientComponentClient<Database>();

  type UserResponse = Awaited<ReturnType<typeof supabase.auth.getUser>>;
  const [user, setUser] = useState<UserResponse["data"]["user"]>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    };
    fetchUser().then((user) => setUser(user));
  }, [supabase.auth]);
  const signedIn = user !== null;
  // TODO: Delete this after testing
  console.log("User:", user);

  const [open, setOpen] = useState(false);
  const links = [
    { href: "#", label: "Add a theater" },
    { href: "#", label: "Claim a theater" },
  ];
  return (
    <nav className="bg-yellow-300">
      {/* Desktop Navbar */}
      <div className="max-w-5xl w-full justify-between p-3 mx-auto items-center hidden md:flex">
        <a href="/" className="flex items-center gap-2 font-medium">
          <Image width={40} height={40} alt="" src="/logo.jpg" /> The Local Bard
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
          <button className="flex items-center">
            {signedIn ? (
              <span className="inline-block h-8 w-8 ml-2 overflow-hidden rounded-full bg-gray-100">
                <svg
                  className="h-full w-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            ) : (
              <Link
                href="/login"
                className="hover:bg-yellow-400 px-3 py-2 rounded"
              >
                Sign In
              </Link>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="max-w-5xl w-full justify-between p-3 mx-auto items-center flex md:hidden">
        <button onClick={() => setOpen(!open)}>
          {open ? (
            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
        <a href="/" className="flex items-center gap-2 font-medium">
          <Image width={40} height={40} alt="" src="/logo.jpg" /> The Local Bard
        </a>
        <div className="flex text-sm items-center text-yellow-950">
          <button className="flex items-center">
            {signedIn ? (
              <span className="inline-block h-8 w-8 ml-2 overflow-hidden rounded-full bg-gray-100">
                <svg
                  className="h-full w-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            ) : (
              <Link
                href="/login"
                className="hover:bg-yellow-400 px-3 py-2 rounded"
              >
                Sign In
              </Link>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
