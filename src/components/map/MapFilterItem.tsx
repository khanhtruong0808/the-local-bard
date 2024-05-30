"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function DateSearchItem() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initSearchDate = searchParams.get("searchDate") || "";

  const [searchDate, setSearchDate] = useState(initSearchDate);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("searchDate");
    if (searchDate) newParams.set("searchDate", searchDate);
    router.push(createUrl(pathname, newParams));
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        type="date"
        name="searchDate"
        value={searchDate}
        onChange={(e) => {
          setSearchDate(e.target.value);
        }}
        className="mt-2 rounded border-slate-500 bg-slate-500 px-2 py-1 text-white"
      />
      <Button
        type="submit"
        size="sm"
        className="mt-2 rounded border-slate-500 bg-slate-500 px-2 py-1 text-white"
      >
        Search
      </Button>
    </form>
  );
}
