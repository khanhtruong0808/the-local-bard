"use client";
import createStage from "@/actions/createStage";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import toast from "react-hot-toast";

export const CreateStageForm = () => {
  const handleSubmit = async (formData: FormData) => {
    toast.promise(
      createStage(formData),
      {
        loading: "Creating Stage...",
        success: "Stage Created!",
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
          Create a stage
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Add a stage to your theater
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="name"
          >
            Name
          </label>
          <div className="mt-2">
            <Input type="text" name="name" id="name" className="w-full" />
          </div>
        </div>
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="street_address"
          >
            Street address
          </label>
          <div className="mt-2">
            <Input
              type="text"
              name="street_address"
              id="street_address"
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
            <Input type="text" name="city" id="city" className="w-full" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="state"
          >
            State / Province
          </label>
          <div className="mt-2">
            <Input type="text" name="state" id="state" className="w-full" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="postal_code"
          >
            ZIP / Postal Code
          </label>
          <div className="mt-2">
            <Input
              type="text"
              name="postal_code"
              id="postal_code"
              autoComplete="postal_code"
              className="w-full"
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="type"
          >
            Stage Type
          </label>
          <div className="mt-2">
            <select
              id="type"
              name="type"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
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
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="wheelChairAccessible"
          >
            Wheel Chair Accessible
          </label>
          <div className="mt-2">
            <select
              id="wheelChairAccessible"
              name="wheelChairAccessible"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="seating_capacity"
          >
            Seating Capacity
          </label>
          <div className="mt-2">
            <Input
              type="number"
              name="seating_capacity"
              id="seating_capacity"
              className="w-full"
            />
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
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Include anything else you&apos;d like to add.
          </p>
        </div>
      </div>
      <SubmitButton>Update</SubmitButton>
    </form>
  );
};
