"use client";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { Fragment, useActionState } from "react";

import signOut from "@/actions/signOut";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormServerState } from "@/lib/types";

export const ProfileDropdown = ({
  name,
  profileUrl,
}: {
  name: string | undefined;
  profileUrl: string | undefined;
}) => {
  const [signOutError, signOutAction] = useActionState<
    FormServerState,
    FormData
  >(signOut, { status: "idle" });

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="ml-2 inline-block h-8 w-8 cursor-pointer overflow-hidden rounded-full bg-gray-100">
        {profileUrl ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={profileUrl} />
            <AvatarFallback>{name || ""}</AvatarFallback>
          </Avatar>
        ) : (
          <svg
            className="text-muted-foreground h-full w-full"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="ring-opacity-5 absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black focus:outline-hidden">
          <div>
            <MenuItem>
              <div className="group flex items-center px-4 py-2 text-sm">
                <h3 className="text-secondary font-semibold">
                  Welcome{name ? `, ${name}` : ""}!
                </h3>
              </div>
            </MenuItem>
          </div>
          <div className="py-1">
            <MenuItem>
              <Link
                href="/account/theater"
                className="group text-secondary flex items-center px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                <UserCircleIcon
                  className="text-muted-foreground mr-3 h-5 w-5 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                My Theater
              </Link>
            </MenuItem>
          </div>
          <div className="py-1">
            <form action={signOutAction} className="flex w-full">
              <MenuItem
                as="button"
                type="submit"
                className="group text-secondary flex w-full cursor-pointer items-center px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                <ArrowRightStartOnRectangleIcon
                  className="text-muted-foreground mr-3 h-5 w-5 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                Log out
              </MenuItem>
            </form>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};
