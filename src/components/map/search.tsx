"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { createUrl } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export function ProductionSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");

  const newParams = new URLSearchParams(searchParams);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    newParams.set("q", q);
    router.push(createUrl(pathname, newParams));
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        placeholder="Search productions"
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="absolute inset-y-0 top-0 right-0 mr-1 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 w-4 text-zinc-300" />
      </div>
    </form>
  );
}
