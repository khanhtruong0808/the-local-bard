"use client";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import createProduction from "@/actions/createProduction";
import Image from "next/image";
import SubmitButton from "./SubmitButton";
import toast from "react-hot-toast";

interface ProductionFormProps {
  theater: any;
  addresses: any;
  stages: any;
}

export const CreateProductionForm = ({
  theater,
  addresses,
  stages,
}: ProductionFormProps) => {
  const [posterUrl, setPosterUrl] = useState<string>();
  const [imageKey, setImageKey] = useState(0);
  const createProductionWithTheaterId = createProduction.bind(null, theater.id);

  const handlePosterChange = (file: any) => {
    const url = file ? URL.createObjectURL(file) : "";
    if (!file) setImageKey(imageKey + 1);
    setPosterUrl(url);
  };

  const handleSubmit = async (formData: FormData) => {
    toast.promise(
      createProductionWithTheaterId(formData),
      {
        loading: "Creating Production...",
        success: "Production Created!",
        error: "Something went wrong",
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
      className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
      action={handleSubmit}
    >
      <div>
        <h2 className="text-base font-semibold leading-7 text-zinc-200">
          Create a production
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Add a production to your theater.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="title"
          >
            Title
          </label>
          <div className="mt-2">
            <Input type="text" name="title" id="title" className="w-full" />
          </div>
        </div>
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="summary"
          >
            Summary
          </label>
          <div className="mt-2">
            <textarea
              id="summary"
              name="summary"
              rows={3}
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Include a few details about your production.
          </p>
        </div>
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="stage"
          >
            Stage
          </label>
          <div className="mt-2">
            <select
              id="stage"
              name="stage"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={stages[0].id || ""}
            >
              <option></option>
              {stages.map((stage: any) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sm:col-span-3 sm:col-start-1">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="playwrights"
          >
            Playwrights
          </label>
          <div className="mt-2">
            <Input
              type="text"
              name="playwrights"
              id="playwrights"
              className="w-full"
            />
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Seperate multiple playwrights with commas.
            </p>
          </div>
        </div>
        <div className="sm:col-span-3">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="directors"
          >
            Directors
          </label>
          <div className="mt-2">
            <Input
              type="text"
              name="directors"
              id="directors"
              className="w-full"
            />
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Seperate multiple directors with commas.
            </p>
          </div>
        </div>
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="composers"
          >
            Composers
          </label>
          <div className="mt-2">
            <Input
              type="text"
              name="composers"
              id="composers"
              className="w-full"
            />
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Seperate multiple composers with commas.
            </p>
          </div>
        </div>
        <div className="sm:col-span-3 sm:col-start-1">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="genre"
          >
            Genre
          </label>
          <div className="mt-2">
            <select
              id="genre"
              name="genre"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
            >
              <option></option>
              <option>Musical</option>
              <option>Tragedy</option>
              <option>Comedy</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-3">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="kidFriendly"
          >
            Kid Friendly
          </label>
          <div className="mt-2">
            <select
              id="kidFriendly"
              name="kidFriendly"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-3">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="costRange"
          >
            Cost Range
          </label>
          <div className="mt-2">
            <select
              id="costRange"
              name="costRange"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
            >
              <option>$</option>
              <option>$$</option>
              <option>$$$</option>
              <option>$$$$</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-3">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="duration"
          >
            Duration (minutes)
          </label>
          <div className="mt-2">
            <Input
              type="number"
              name="duration"
              id="duration"
              className="w-full"
            />
          </div>
        </div>
        <div className="h-full sm:col-span-3">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="poster"
          >
            Poster
          </label>
          <div className="mt-2 flex h-full flex-col justify-between">
            <Input
              type="file"
              key={imageKey}
              name="poster"
              id="poster"
              className="h-min w-full cursor-pointer p-0 text-sm text-zinc-400 file:mr-2 file:cursor-pointer file:rounded-md file:rounded-r-none file:border-none file:bg-transparent file:bg-zinc-700 file:px-2.5 file:py-1.5 file:text-zinc-100 file:hover:bg-zinc-600 file:active:bg-zinc-700 file:active:text-zinc-100/70"
              onChange={(e) => handlePosterChange(e.target.files?.[0])}
            />
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
          <div className="cursor-pointer overflow-hidden rounded-lg bg-zinc-700 shadow">
            <div className="sm:flex">
              <div className="ml-2 flex-shrink-0 self-center pl-4 sm:mb-0 sm:mr-4">
                {posterUrl && (
                  <Image
                    src={posterUrl || ""}
                    alt={"Production poster"}
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-zinc-200">
                  {"Production Title"}
                </h3>
                <div className="mt-2 max-w-xl text-sm text-zinc-400">
                  <p>{theater?.name}</p>
                  <p>{addresses?.street_address}</p>
                  <p>
                    {addresses?.city}, {addresses?.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="url"
          >
            URL
          </label>
          <div className="mt-2">
            <Input type="text" name="url" id="url" className="w-full" />
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
            />
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Include anything else you&apos;d like to add.
          </p>
        </div>
        <div className="sm:col-span-3">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="openingNight"
          >
            Opening Night
          </label>
          <div className="mt-2">
            <Input
              type="date"
              name="openingNight"
              id="openingNight"
              className="w-full"
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="closingNight"
          >
            Closing Night
          </label>
          <div className="mt-2">
            <Input
              type="date"
              name="closingNight"
              id="closingNight"
              className="w-full"
            />
          </div>
        </div>
      </div>
      <SubmitButton>Create new production</SubmitButton>
    </form>
  );
};
