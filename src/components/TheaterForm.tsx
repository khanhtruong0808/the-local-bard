"use client";

import toast from "react-hot-toast";

import updateTheater from "@/actions/updateTheater";
import { TheaterForTheaterPage } from "@/lib/supabase/queries";
import Input from "./ui/Input";
import Label from "./ui/Label";
import SubmitButton from "./ui/SubmitButton";

interface TheaterFormProps {
  theater: TheaterForTheaterPage;
}

export const TheaterForm = ({ theater }: TheaterFormProps) => {
  const address = theater.addresses;

  const handleSubmit = async (formData: FormData) => {
    toast.promise(
      updateTheater(formData),
      {
        loading: "Updating Theater...",
        success: "Theater Updated!",
        error: (error: Error) => error.message,
      },
      {
        style: {
          minWidth: "250px",
        },
      },
    );
  };

  return (
    <form action={handleSubmit}>
      <h2 className="text-base font-semibold leading-7 text-zinc-200">
        My Theater
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        This information will be displayed publicly so be careful what you
        share.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
        <input type="hidden" name="id" id="id" defaultValue={theater.id} />
        <input
          type="hidden"
          name="address_id"
          id="address_id"
          defaultValue={address?.id || ""}
        />
        {/* Possibly implement later if that is a feature we'd like? */}
        {/* <div className="col-span-full">
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
            </div> */}
        <div className="col-span-full">
          <Label htmlFor="name">Theater Name</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="name"
              id="name"
              className="w-full"
              defaultValue={theater.name || ""}
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="street_address">Street Address</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="street_address"
              id="street_address"
              className="w-full"
              defaultValue={address?.street_address || ""}
            />
          </div>
        </div>

        <div className="sm:col-span-2 sm:col-start-1">
          <Label htmlFor="city">City</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="city"
              id="city"
              className="w-full"
              defaultValue={address?.city || ""}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="state">State / Province</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="state"
              id="state"
              className="w-full"
              defaultValue={address?.state || ""}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="postal_code">ZIP / Postal Code</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="postal_code"
              id="postal_code"
              autoComplete="postal_code"
              className="w-full"
              defaultValue={address?.postal_code || ""}
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="phone">Phone</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="phone"
              id="phone"
              className="w-full"
              defaultValue={theater.phone || ""}
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="email">Contact Email</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="email"
              id="email"
              className="w-full"
              defaultValue={theater.email || ""}
            />
          </div>
        </div>

        <div className="col-span-full">
          <Label htmlFor="notes">Notes</Label>
          <div className="mt-2">
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={theater.notes || ""}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Write a few sentences about yourself.
          </p>
        </div>

        <div className="col-span-full">
          <Label htmlFor="parking_instructions">Parking Instructions</Label>
          <div className="mt-2">
            <textarea
              id="parking_instructions"
              name="parking_instructions"
              rows={3}
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={theater.parking_instructions || ""}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            List any parking instructions here.
          </p>
        </div>
        <div className="col-span-full">
          <Label htmlFor="url">Website URL</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="url"
              id="url"
              className="w-full"
              placeholder="www.example.com"
              defaultValue={theater.url || ""}
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="type">Theater Type</Label>
          <div className="mt-2">
            <select
              id="type"
              name="type"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={theater.type || ""}
            >
              <option>High School</option>
              <option>Junior College</option>
              <option>Equity Theater</option>
              <option>Play House</option>
            </select>
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="concessions">Concessions</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="concessions"
              id="concessions"
              className="w-full"
              defaultValue={theater.concessions || ""}
            />
          </div>
        </div>
      </div>
      <SubmitButton>Update Theater</SubmitButton>
    </form>
  );
};
