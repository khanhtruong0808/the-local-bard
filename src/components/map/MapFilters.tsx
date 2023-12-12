"use server";

import { FilterItem } from "@/components/map/MapFilterItem";

export default async function MapFilters() {
  return (
    <>
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
