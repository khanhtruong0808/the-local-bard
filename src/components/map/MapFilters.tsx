"use server";

import { FilterItem } from "@/components/map/MapFilterItem";
import { ProductionSearch } from "./ProductionSearch";
import { genres } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function MapFilters() {
  return (
    <div className="px-4 sm:p-0">
      <div className="mt-4">
        <ProductionSearch />
      </div>
      <fieldset className="mt-4">
        <legend className="sr-only">Price</legend>
        <h4 className="text-md font-medium leading-6 text-white">Price</h4>
        <div className="mt-2 space-y-2">
          <FilterItem
            name="oneDollar"
            label="$"
            field="cost_range"
            value="$"
            multi={true}
          />
          <FilterItem
            name="twoDollar"
            label="$$"
            field="cost_range"
            value="$$"
            multi={true}
          />
          <FilterItem
            name="threeDollar"
            label="$$$"
            field="cost_range"
            value="$$$"
            multi={true}
          />
          <FilterItem
            name="fourDollar"
            label="$$$$"
            field="cost_range"
            value="$$$$"
            multi={true}
          />
        </div>
      </fieldset>
      <hr className="my-4 border-slate-500" />
      <fieldset className="mt-4">
        <legend className="sr-only">Genre</legend>
        <h4 className="text-md font-medium leading-6 text-white">Genre</h4>
        <div className="mt-2 space-y-2">
          {genres.map((genre) => (
            <FilterItem
              key={genre}
              name={genre}
              label={genre}
              field="genres"
              value={genre}
              multi={true}
            />
          ))}
        </div>
      </fieldset>
      <hr className="my-4 border-slate-500" />
      <fieldset className="mt-4">
        <legend className="sr-only">Misc.</legend>
        <h4 className="text-md font-medium leading-6 text-white">Misc.</h4>
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
        <legend className="sr-only">Date Range</legend>
        <h4 className="text-md font-medium leading-6 text-white">Date Range</h4>
        <form>
          <Label htmlFor="searchStartDate" />
          <Input type="date" name="searchStartDate" className="mt-2" />
          <Label htmlFor="searchEndDate" />
          <Input type="date" name="searchEndDate" className="mt-2" />
          <Button type="submit" className="mt-2">
            Search
          </Button>
        </form>
      </fieldset>
    </div>
  );
}
