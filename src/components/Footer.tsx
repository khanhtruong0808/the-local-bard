"use server";

import Link from "next/link";

import { getMaybeUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

const navigation = [
  { name: "Contact", href: "/contact" },
  { name: "Theater Company Login", href: "/login" },
];

export async function Footer() {
  const supabase = await createClient();
  const user = await getMaybeUser(supabase);
  const loggedIn = user !== null;

  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-4 sm:py-10 lg:px-8">
        <nav
          className="-mb-6 flex columns-2 justify-center space-x-12"
          aria-label="Footer"
        >
          {navigation.map((item) => {
            if (loggedIn && item.href === "/login") {
              return null;
            }
            return (
              <div key={item.name} className="pb-6">
                <Link
                  href={item.href}
                  className="text-sm leading-6 text-zinc-400 hover:text-white"
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
        </nav>
        <p className="mt-6 text-center text-xs leading-5 text-zinc-900">
          &copy; {new Date().getFullYear()} The Local Bard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
