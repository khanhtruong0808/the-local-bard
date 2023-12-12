"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { createUrl } from "@/lib/utils";

interface FilterItemProps {
  name: string;
  label: string;
  field: string;
  value: string;
  multi?: boolean;
}

export function FilterItem({
  name,
  label,
  field,
  value,
  multi,
}: FilterItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const active = multi
    ? searchParams.getAll(field).includes(value)
    : searchParams.get(field) === value;

  // If the user clicks the filter, set search params to newParams.
  const newParams = new URLSearchParams(searchParams);
  if (active) {
    newParams.delete(field, value);
  } else {
    if (multi) {
      newParams.append(field, value);
    } else {
      newParams.set(field, value);
    }
  }

  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          className={twMerge(
            "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600",
          )}
          checked={active}
          onChange={() => {
            router.push(createUrl(pathname, newParams));
          }}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor={name} className="font-medium text-white">
          {label}
        </label>
      </div>
    </div>
  );
}
