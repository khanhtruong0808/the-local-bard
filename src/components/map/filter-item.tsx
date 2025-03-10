"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUrl } from "@/lib/utils";

interface FilterItemProps {
  name: string;
  label: string;
  field: string;
  value: string;
}

export function MultiFilterItem({
  name,
  label,
  field,
  value,
}: FilterItemProps) {
  const [param, setParam] = useQueryState(field, parseAsArrayOf(parseAsString));

  const active = param?.includes(value);

  /** If already active, remove the value, otherwise add it to the param array */
  const handleChange = () => {
    console.log("handleChange", active);
    setParam(
      active
        ? (param || []).filter((v) => v !== value)
        : [...(param || []), value],
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={name} checked={active} onCheckedChange={handleChange} />
      <Label htmlFor={name}>{label}</Label>
    </div>
  );
}

export function FilterItem({ name, label, field, value }: FilterItemProps) {
  const [param, setParam] = useQueryState(field, parseAsString);

  const active = param === value;

  const handleChange = () => {
    setParam(active ? null : value);
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={name} checked={active} onCheckedChange={handleChange} />
      <Label htmlFor={name}>{label}</Label>
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
        className="mt-2 rounded-sm border-slate-500 px-2 py-1 text-white"
      />
      <Button
        type="submit"
        size="sm"
        className="mt-2 rounded-sm border-slate-500 bg-slate-500 px-2 py-1 text-white"
      >
        Search
      </Button>
    </form>
  );
}
