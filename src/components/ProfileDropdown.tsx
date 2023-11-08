"use client";

import { Menu, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { Fragment } from "react";

import signOut from "@/actions/signOut";

export const ProfileDropdown = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="ml-2 inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
        <svg
          className="h-full w-full text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              <Link
                href="/account/theater"
                className="group flex items-center px-4 py-2 text-sm ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700"
              >
                <UserCircleIcon
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                My Theater
              </Link>
            </Menu.Item>
          </div>
          <div className="py-1">
            <form action={signOut} className="flex w-full">
              <Menu.Item
                as="button"
                type="submit"
                className="group flex w-full items-center px-4 py-2 text-sm ui-active:bg-gray-100 ui-active:text-gray-900 ui-not-active:text-gray-700"
              >
                <ArrowRightOnRectangleIcon
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                Log out
              </Menu.Item>
            </form>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
