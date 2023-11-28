"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { createUrl } from "@/lib/utils";

interface FilterItemProps {
  name: string;
  label: string;
  field: string;
  value: string;
}

function FilterItem({ name, label, field, value }: FilterItemProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get(field) === value;

  // If the user clicks the filter, set search params to newParams.
  const newParams = new URLSearchParams(searchParams);
  if (active) {
    newParams.delete(field);
  } else {
    newParams.set(field, value);
  }

  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <Link href={createUrl(pathname, newParams)} prefetch={false}>
          <input
            id={name}
            name={name}
            type="checkbox"
            className={twMerge(
              "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600",
            )}
            checked={active}
          />
        </Link>
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor={name} className="font-medium text-white">
          {label}
        </label>
      </div>
    </div>
  );
}

export default function MapFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <>
      <fieldset className="mt-4">
        <legend className="sr-only">Price</legend>
        <h4 className="text-md font-medium leading-6 text-white">Price</h4>
        <div className="mt-2 space-y-2">
          <FilterItem name="oneDollar" label="$" field="cost_range" value="$" />
          <FilterItem
            name="twoDollar"
            label="$$"
            field="cost_range"
            value="$$"
          />
          <FilterItem
            name="threeDollar"
            label="$$$"
            field="cost_range"
            value="$$$"
          />
          <FilterItem
            name="fourDollar"
            label="$$$$"
            field="cost_range"
            value="$$$$"
          />
        </div>
      </fieldset>
      <hr className="my-4 border-slate-500" />
      <fieldset className="mt-4">
        <legend className="sr-only">Duration</legend>
        <h4 className="text-md font-medium leading-6 text-white">Type</h4>
        <div className="mt-2 space-y-2">
          <FilterItem
            name="musical"
            label="Musical"
            field="type"
            value="Musical"
          />
          <FilterItem
            name="comedy"
            label="Comedy"
            field="type"
            value="Comedy"
          />
          <FilterItem
            name="tragedy"
            label="Tragedy"
            field="type"
            value="Tragedy"
          />
        </div>
      </fieldset>
      <hr className="my-4 border-slate-500" />
      <fieldset className="mt-4">
        <legend className="sr-only">Something else</legend>
        <h4 className="text-md font-medium leading-6 text-white">
          Something else
        </h4>
        <div className="mt-2 space-y-2">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="option1"
                name="option1"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="option1" className="font-medium text-white">
                option1
              </label>
            </div>
          </div>
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="option2"
                name="option2"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="option2" className="font-medium text-white">
                option2
              </label>
            </div>
          </div>
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="option3"
                name="option3"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="option3" className="font-medium text-white">
                option3
              </label>
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );
}
