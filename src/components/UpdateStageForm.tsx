"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import deleteStage from "@/actions/deleteStage";
import updateStage from "@/actions/updateStage";
import type { StageWithAddress } from "@/lib/supabase/queries";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Label from "./ui/Label";
import SubmitButton from "./ui/SubmitButton";

export const UpdateStageForm = ({ stage }: { stage: StageWithAddress }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  // Not sure why addresses is typed as an array
  const address = stage.addresses;

  const handleSubmit = async (formData: FormData) => {
    toast.promise(
      updateStage(formData),
      {
        loading: "Updating Stage...",
        success: "Stage Updated!",
        error: (error: Error) => error.message,
      },
      {
        style: {
          minWidth: "250px",
        },
      },
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    toast.promise(
      deleteStage(stage.id),
      {
        loading: "Deleting Stage...",
        success: "Stage Deleted!",
        error: (error: Error) => error.message,
      },
      {
        style: {
          minWidth: "250px",
        },
      },
    );
    setIsDeleting(false);
  };

  return (
    <form
      className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
      action={handleSubmit}
    >
      <div>
        <h2 className="text-base font-semibold leading-7 text-zinc-200">
          {stage.name}
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Make changes to your stage here.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
        <input type="hidden" name="id" id="id" defaultValue={stage.id} />
        <input
          type="hidden"
          name="address_id"
          id="address_id"
          defaultValue={address.id}
        />
        <div className="col-span-full">
          <Label htmlFor="name">Name</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="name"
              id="name"
              className="w-full"
              defaultValue={stage.name || ""}
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
              defaultValue={address.street_address || ""}
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
              defaultValue={address.city || ""}
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
              defaultValue={address.state || ""}
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
              defaultValue={address.postal_code || ""}
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <Label htmlFor="type">Stage Type</Label>
          <div className="mt-2">
            <select
              id="type"
              name="type"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={stage.type || ""}
            >
              <option>Proscenium</option>
              <option>Thrust</option>
              <option>In-The-Round</option>
              <option>Black-Box</option>
              <option>Open-Air</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-3">
          <Label htmlFor="wheelchair_accessible">Wheel Chair Accessible</Label>
          <div className="mt-2">
            <select
              id="wheelchair_accessible"
              name="wheelchair_accessible"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={
                stage.wheelchair_accessible === true
                  ? "Yes"
                  : stage.wheelchair_accessible === false
                    ? "No"
                    : "" // If null, don't default to anything
              }
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="seating_capacity">Seating Capacity</Label>
          <div className="mt-2">
            <Input
              type="number"
              name="seating_capacity"
              id="seating_capacity"
              className="w-full"
              defaultValue={stage.seating_capacity || ""}
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
              defaultValue={stage.notes || ""}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Include anything else you&apos;d like to add.
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <SubmitButton>Update</SubmitButton>
        {/* TODO: Create a confirmation modal for deleting a stage */}
        <Button
          type="button"
          variant="alert"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          Delete Stage
        </Button>
      </div>
    </form>
  );
};
