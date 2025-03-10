"use client";

import {
  DateSearchItem,
  FilterItem,
  MultiFilterItem,
} from "@/components/map/filter-item";
import { genres } from "@/lib/constants";
import { ProductionSearch } from "./search";

export default function MapFilters() {
  return (
    <div className="px-4 sm:p-0">
      <div className="mt-4">
        <ProductionSearch />
      </div>
      <fieldset className="mt-4">
        <legend className="sr-only">Price</legend>
        <h4 className="text-md leading-6 font-medium text-white">Price</h4>
        <div className="mt-2 space-y-2">
          <MultiFilterItem
            name="oneDollar"
            label="$"
            field="cost_range"
            value="$"
          />
          <MultiFilterItem
            name="twoDollar"
            label="$$"
            field="cost_range"
            value="$$"
          />
          <MultiFilterItem
            name="threeDollar"
            label="$$$"
            field="cost_range"
            value="$$$"
          />
          <MultiFilterItem
            name="fourDollar"
            label="$$$$"
            field="cost_range"
            value="$$$$"
          />
        </div>
      </fieldset>
      <hr className="my-4 border-slate-500" />
      <fieldset className="mt-4">
        <legend className="sr-only">Genre</legend>
        <h4 className="text-md leading-6 font-medium text-white">Genre</h4>
        <div className="mt-2 space-y-2">
          {genres.map((genre) => (
            <MultiFilterItem
              key={genre}
              name={genre}
              label={genre}
              field="genres"
              value={genre}
            />
          ))}
        </div>
      </fieldset>
      <hr className="my-4 border-slate-500" />
      <fieldset className="mt-4">
        <legend className="sr-only">Misc.</legend>
        <h4 className="text-md leading-6 font-medium text-white">Misc.</h4>
        <div className="mt-2 space-y-2">
          <FilterItem
            name="kidFriendly"
            label="Kid Friendly?"
            field="kid_friendly"
            value="TRUE"
          />
        </div>
      </fieldset>
      <hr className="my-4 border-slate-500" />
      <fieldset className="mt-4">
        <legend className="sr-only">Date</legend>
        <h4 className="text-md leading-6 font-medium text-white">Date</h4>
        <DateSearchItem />
      </fieldset>
    </div>
  );
}
