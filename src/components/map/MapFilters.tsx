"use server";

import { FilterItem } from "@/components/map/MapFilterItem";
import { ProductionSearch } from "./ProductionSearch";

export default async function MapFilters() {
  const genres = [
    "Comedy",
    "Classic",
    "Contemporary/Original",
    "Fantasy/Science",
    "Fiction",
    "Historical",
    "Tragedy",
    "Romance",
    "Mystery/Thriller",
    "Drama",
    "Play",
    "Musical",
  ];
  return (
    <>
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
              field="type"
              value={genre}
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
    </>
  );
}
