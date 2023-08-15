import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Cog8ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const ProfileDropdown = () => {
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-block h-8 w-8 ml-2 overflow-hidden rounded-full bg-gray-100">
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
              {({ active }) => (
                <a
                  href="/account/general"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <UserCircleIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  My Theater
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/login"
                  onClick={handleSignOut}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm w-full"
                  )}
                >
                  <ArrowRightOnRectangleIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Log out
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
