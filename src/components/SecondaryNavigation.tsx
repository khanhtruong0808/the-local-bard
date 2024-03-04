"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  BuildingLibraryIcon,
  FilmIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

const secondaryNavigation = [
  {
    name: "Theater Company",
    href: "/account/theater",
    segment: "theater",
    icon: UserCircleIcon,
  },
  {
    name: "Stages",
    href: "/account/stages",
    segment: "stages",
    icon: BuildingLibraryIcon,
  },
  {
    name: "Productions",
    href: "/account/productions",
    segment: "productions",
    icon: FilmIcon,
  },
  {
    name: "Password",
    href: "/account/password",
    segment: "password",
    icon: ShieldExclamationIcon,
  },
];

export const SecondaryNavigation = () => {
  const segment = useSelectedLayoutSegment();

  return (
    <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
      <nav className="flex-none px-4 sm:px-6 lg:px-0">
        <ul
          role="list"
          className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
        >
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={twMerge(
                  segment === item.segment
                    ? "bg-zinc-700 text-zinc-100"
                    : "text-zinc-300 hover:bg-zinc-700 hover:text-zinc-200",
                  "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6",
                )}
              >
                <item.icon
                  className={twMerge(
                    segment === item.segment
                      ? "text-zinc-100"
                      : "text-gray-400 group-hover:text-zinc-200",
                    "h-6 w-6 shrink-0",
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
