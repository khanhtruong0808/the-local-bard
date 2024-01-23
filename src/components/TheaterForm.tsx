"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";

import updateTheater from "@/actions/updateTheater";
import { updateTheaterSchema } from "@/lib/form-schemas/theaters";
import { useFormAction } from "@/lib/hooks";
import { TheaterForTheaterPage } from "@/lib/supabase/queries";
import { useState } from "react";
import Button from "./ui/Button";
import { Input } from "./ui/Input";
import Label from "./ui/Label";
import SubmitButton from "./ui/SubmitButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TheaterFormProps {
  theater: TheaterForTheaterPage;
}

type UpdateTheaterSchema = z.infer<typeof updateTheaterSchema>;

export const TheaterForm = ({ theater }: TheaterFormProps) => {
  const [touched, setTouched] = useState(false);
  const address = theater.addresses;

  const form = useFormAction<UpdateTheaterSchema>({
    resolver: zodResolver(updateTheaterSchema),
    defaultValues: {
      id: theater.id.toString(),
      address_id: address?.id.toString() || "",
      name: theater.name || "",
      street_address: address?.street_address || "",
      city: address?.city || "",
      state: address?.state || "",
      // Skip postal_code for now because it is numeric
      notes: theater.notes || "",
      parking_instructions: theater.parking_instructions || "",
      url: theater.url || "",
      type: theater.type || "",
      concessions: theater.concessions || "",
    },
  });

  const handleSubmit = async (formData: UpdateTheaterSchema) => {
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
    <form
      action={() => form.handleAction(handleSubmit)}
      onReset={() => setTouched(false)}
    >
      <h2 className="text-base font-semibold leading-7 text-zinc-200">
        {theater.name || "My Theater"}
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        This information will be displayed publicly so be careful what you
        share.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
        <input type="hidden" {...form.register("id")} />
        <input type="hidden" {...form.register("address_id")} />
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
            <Input type="text" className="w-full" {...form.register("name")} />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="street_address">Street Address</Label>
          <div className="mt-2">
            <Input
              type="text"
              className="w-full"
              {...form.register("street_address")}
            />
          </div>
        </div>

        <div className="sm:col-span-2 sm:col-start-1">
          <Label htmlFor="city">City</Label>
          <div className="mt-2">
            <Input type="text" className="w-full" {...form.register("city")} />
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="state">State / Province</Label>
          <div className="mt-2">
            <Input type="text" className="w-full" {...form.register("state")} />
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="postal_code">ZIP / Postal Code</Label>
          <div className="mt-2">
            <Input
              type="text"
              className="w-full"
              {...form.register("postal_code")}
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="notes">Notes</Label>
          <div className="mt-2">
            <textarea
              id="notes"
              rows={3}
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              {...form.register("notes")}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Other theater characteristics useful to the attendee.
          </p>
        </div>

        <div className="col-span-full">
          <Label htmlFor="parking_instructions">Parking Instructions</Label>
          <div className="mt-2">
            <textarea
              id="parking_instructions"
              rows={3}
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              {...form.register("parking_instructions")}
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
              className="w-full"
              placeholder="www.example.com"
              {...form.register("url")}
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="type">Theater Type</Label>
          <div className="mt-2">
            <Select {...form.register("type")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a theater type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High School">High School</SelectItem>
                <SelectItem value="Junior College">Junior College</SelectItem>
                <SelectItem value="Equity Theater">Equity Theater</SelectItem>
                <SelectItem value="Play House">Play House</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="concessions">Concessions</Label>
          <div className="mt-2">
            <Input
              type="text"
              className="w-full"
              {...form.register("concessions")}
            />
          </div>
        </div>
      </div>
      {touched && (
        <Button
          type="reset"
          variant="secondary"
          className="mr-4"
          // onClick={(reset) => handleReset(reset)}
        >
          Cancel
        </Button>
      )}
      <SubmitButton>Update Theater</SubmitButton>
    </form>
  );
};
