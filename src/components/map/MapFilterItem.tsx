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

  const initSearchStartDate = searchParams.get("searchStartDate") || "";
  const initSearchEndDate = searchParams.get("searchEndDate") || "";

  const [searchStartDate, setSearchStartDate] = useState(initSearchStartDate);
  const [searchEndDate, setSearchEndDate] = useState(initSearchEndDate);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("searchStartDate");
    newParams.delete("searchEndDate");
    if (searchStartDate) newParams.set("searchStartDate", searchStartDate);
    if (searchEndDate) newParams.set("searchEndDate", searchEndDate);
    router.push(createUrl(pathname, newParams));
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="flex gap-2">
        <Label htmlFor="searchStartDate" className="text-white" />
        <Input
          type="date"
          name="searchStartDate"
          value={searchStartDate}
          onChange={(e) => {
            setSearchStartDate(e.target.value);
          }}
          className="rounded border-slate-500 bg-slate-500 px-2 py-1 text-white"
        />
        <Label htmlFor="searchEndDate" className="text-white" />
        <Input
          type="date"
          name="searchEndDate"
          value={initSearchEndDate}
          onChange={(e) => {
            setSearchEndDate(e.target.value);
          }}
          className="rounded border-slate-500 bg-slate-500 px-2 py-1 text-white"
        />
        <Button
          type="submit"
          size="sm"
          className="rounded border-slate-500 bg-slate-500 px-2 py-1 text-white"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
