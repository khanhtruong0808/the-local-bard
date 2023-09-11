"use client";
import { ShieldExclamationIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

const secondaryNavigation = [
  {
    name: "General",
    href: "/account/general",
    segment: "general",
    icon: UserCircleIcon,
  },
  {
    name: "Password",
    href: "/account/password",
    segment: "password",
    icon: ShieldExclamationIcon,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-5xl lg:flex lg:gap-x-16">
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
                    className={classNames(
                      segment === item.segment
                        ? "bg-zinc-800 text-zinc-100"
                        : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200",
                      "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6",
                    )}
                  >
                    <item.icon
                      className={classNames(
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
        {children}
      </div>
    </div>
  );
}
