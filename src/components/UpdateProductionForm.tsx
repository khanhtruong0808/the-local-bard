"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

import deleteProduction from "@/actions/deleteProduction";
import updateProduction from "@/actions/updateProduction";
import type {
  Production,
  TheaterForUpdateProduction,
} from "@/lib/supabase/queries";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Label from "./ui/Label";
import SubmitButton from "./ui/SubmitButton";
import { ConfirmDeleteForm } from "./ConfirmDeleteForm";
import useDialog from "@/utils/dialogStore";

interface ProductionFormProps {
  production: Production;
  theater: TheaterForUpdateProduction;
}

export const UpdateProductionForm = ({
  production,
  theater,
}: ProductionFormProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(
    production.poster_url,
  );
  const [imageKey, setImageKey] = useState(0);
  const { openDialog, closeDialog } = useDialog();

  const handlePosterChange = (file: any) => {
    const url = file ? URL.createObjectURL(file) : "";
    if (!file) setImageKey(imageKey + 1);
    setPosterUrl(url);
  };

  const handleSubmit = async (formData: FormData) => {
    toast.promise(
      updateProduction(formData),
      {
        loading: "Updating Production...",
        success: "Production Updated!",
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
    await toast.promise(
      deleteProduction(production.id),
      {
        loading: "Deleting Production...",
        success: "Production Deleted!",
        error: (error: Error) => error.message,
      },
      {
        style: {
          minWidth: "250px",
        },
      },
    );
    setIsDeleting(false);
    closeDialog();
  };

  const handleConfirmDelete = () => {
    openDialog({
      title: "Delete production",
      content: <ConfirmDeleteForm handleDelete={handleDelete} />,
    });
  };

  return (
    <form
      className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
      action={handleSubmit}
    >
      <div>
        <h2 className="text-base font-semibold leading-7 text-zinc-200">
          {production.name}
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Make changes to your production here.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
        <input type="hidden" name="id" id="id" value={production.id} />
        <div className="col-span-full">
          <Label htmlFor="title">Title</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="title"
              id="title"
              className="w-full"
              defaultValue={production.name || ""}
              required
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="summary">Summary</Label>
          <div className="mt-2">
            <textarea
              id="summary"
              name="summary"
              rows={3}
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={production.summary || ""}
            />
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Include a few details about your production.
          </p>
        </div>
        <div className="col-span-full">
          <Label htmlFor="stage">Stage</Label>
          <div className="mt-2">
            <select
              id="stage"
              name="stage"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={
                theater.stages.find((stage) => stage.id === production.stage_id)
                  ?.id
              }
            >
              <option></option>
              {theater.stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sm:col-span-3 sm:col-start-1">
          <Label htmlFor="playwrights">Playwrights</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="playwrights"
              id="playwrights"
              className="w-full"
              defaultValue={production.writers?.join(", ") || ""}
            />
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Seperate multiple playwrights with commas.
            </p>
          </div>
        </div>
        <div className="sm:col-span-3">
          <Label htmlFor="directors">Directors</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="directors"
              id="directors"
              className="w-full"
              defaultValue={production.directors?.join(", ") || ""}
            />
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Seperate multiple directors with commas.
            </p>
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="composers">Composers</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="composers"
              id="composers"
              className="w-full"
              defaultValue={production.composers?.join(", ") || ""}
            />
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Seperate multiple composers with commas.
            </p>
          </div>
        </div>
        <div className="sm:col-span-3 sm:col-start-1">
          <Label htmlFor="genre">Genre</Label>
          <div className="mt-2">
            <select
              id="genre"
              name="genre"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={production.type || ""}
            >
              <option></option>
              <option>Musical</option>
              <option>Tragedy</option>
              <option>Comedy</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-3">
          <Label htmlFor="kidFriendly">Kid Friendly</Label>
          <div className="mt-2">
            <select
              id="kidFriendly"
              name="kidFriendly"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={production.kid_friendly ? "Yes" : "No"}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-3">
          <Label htmlFor="costRange">Cost Range</Label>
          <div className="mt-2">
            <select
              id="costRange"
              name="costRange"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={production.cost_range || "$"}
            >
              <option>$</option>
              <option>$$</option>
              <option>$$$</option>
              <option>$$$$</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-3">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <div className="mt-2">
            <Input
              type="number"
              name="duration"
              id="duration"
              className="w-full"
              defaultValue={production.duration_minutes || 0}
            />
          </div>
        </div>
        <div className="h-full sm:col-span-3">
          <Label htmlFor="poster">Poster</Label>
          <div className="mt-2 flex h-full flex-col justify-between">
            <div>
              <Input
                type="file"
                key={imageKey}
                name="poster"
                id="poster"
                accept={"image/jpeg, image/png, image/webp, image/svg+xml"}
                className="h-min w-full cursor-pointer p-0 text-sm text-zinc-400 file:mr-2 file:cursor-pointer file:rounded-md file:rounded-r-none file:border-none file:bg-transparent file:bg-zinc-700 file:px-2.5 file:py-1.5 file:text-zinc-100 file:hover:bg-zinc-600 file:active:bg-zinc-700 file:active:text-zinc-100/70"
                onChange={(e) => handlePosterChange(e.target.files?.[0])}
              />
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                jpeg, png, webp, svg, and xml only!
              </p>
            </div>
            {posterUrl && (
              <Button
                variant="secondary"
                className="mb-8 self-start"
                onClick={() => handlePosterChange("")}
              >
                Undo
              </Button>
            )}
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-fit sm:col-span-3">
          <div className="overflow-hidden rounded-lg bg-zinc-700 shadow">
            <div className="sm:flex">
              <div className="ml-2 flex-shrink-0 self-center pl-4 sm:mb-0 sm:mr-4">
                {posterUrl && (
                  <Image
                    src={posterUrl}
                    alt={production.name || "Production poster"}
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-zinc-200">
                  {production.name}
                </h3>
                <div className="mt-2 max-w-xl text-sm text-zinc-400">
                  <p>{theater?.name}</p>
                  <p>{theater.addresses?.street_address}</p>
                  <p>
                    {theater.addresses?.city}, {theater.addresses?.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="url">URL</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="url"
              id="url"
              className="w-full"
              defaultValue={production.url || ""}
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
              defaultValue={production.notes || ""}
            />
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Include anything else you&apos;d like to add.
          </p>
        </div>
        <div className="sm:col-span-3">
          <Label htmlFor="openingNight">Opening Night</Label>
          <div className="mt-2">
            <Input
              type="date"
              name="openingNight"
              id="openingNight"
              className="w-full"
              defaultValue={production.start_date || ""}
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <Label htmlFor="closingNight">Closing Night</Label>
          <div className="mt-2">
            <Input
              type="date"
              name="closingNight"
              id="closingNight"
              className="w-full"
              defaultValue={production.end_date || ""}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <SubmitButton>Update</SubmitButton>
        <Button
          type="button"
          variant="alert"
          onClick={handleConfirmDelete}
          disabled={isDeleting}
        >
          Delete Production
        </Button>
      </div>
    </form>
  );
};
