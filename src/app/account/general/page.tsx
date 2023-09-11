"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { UserCircleIcon } from "@heroicons/react/20/solid";

export default function GeneralPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            My Theater
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="photo"
              >
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <UserCircleIcon
                  className="h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <Button type="button">Change</Button>
              </div>
            </div>
            <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="theaterName"
              >
                Theater Name
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="theaterName"
                  id="theaterName"
                  className="w-full"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="street-address"
              >
                Street address
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="street-address"
                  id="street-address"
                  className="w-full"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="city"
              >
                City
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="w-full"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="region"
              >
                State / Province
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="w-full"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="postal-code"
              >
                ZIP / Postal Code
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="w-full"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="phone"
              >
                Phone
              </label>
              <div className="mt-2">
                <Input type="text" name="phone" id="phone" className="w-full" />
              </div>
            </div>
            <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="email"
              >
                Contact Email
              </label>
              <div className="mt-2">
                <Input type="text" name="email" id="email" className="w-full" />
              </div>
            </div>

            <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="notes"
              >
                Notes
              </label>
              <div className="mt-2">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Write a few sentences about yourself.
              </p>
            </div>

            <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="parkingInstructions"
              >
                Parking Instructions
              </label>
              <div className="mt-2">
                <textarea
                  id="parkingInstructions"
                  name="parkingInstructions"
                  rows={3}
                  className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                List any parking instructions here.
              </p>
            </div>
            <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="website"
              >
                Website URL
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="website"
                  id="website"
                  className="w-full"
                  placeholder="www.example.com"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="theaterType"
              >
                Theater Type
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="theaterType"
                  id="theaterType"
                  className="w-full"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="concessions"
              >
                Concessions
              </label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="concessions"
                  id="concessions"
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button type="submit">Update Theater</Button>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            Stages
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            Add stages to your theater.
          </p>

          <ul
            role="list"
            className="mt-4 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
          >
            <li className="flex justify-between gap-x-6 py-6">
              <div className="font-medium text-zinc-300">Stage 1</div>
              <Button type="button" variant="secondary" size="small">
                Update
              </Button>
            </li>
            <li className="flex justify-between gap-x-6 py-6">
              <div className="font-medium text-zinc-300">Stage 2</div>
              <Button type="button" variant="secondary" size="small">
                Update
              </Button>
            </li>
          </ul>

          <div className="flex border-t border-gray-100 pt-6">
            <Button type="button" variant="secondary">
              <span aria-hidden="true">+</span> Add another application
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            Productions
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            Add productions to your theater.
          </p>

          <ul
            role="list"
            className="mt-4 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
          >
            <li className="flex justify-between gap-x-6 py-6">
              <div className="font-medium text-zinc-300">Production 1</div>
              <Button type="button" variant="secondary" size="small">
                Update
              </Button>
            </li>
          </ul>

          <div className="flex border-t border-gray-100 pt-6">
            <Button type="button" variant="secondary">
              <span aria-hidden="true">+</span> Add another application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
