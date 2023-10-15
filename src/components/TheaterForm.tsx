"use client";
import updateTheater from "@/actions/updateTheater";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import toast from "react-hot-toast";

interface TheaterFormProps {
  theater: any;
  addresses: any;
}

export const TheaterForm = ({ theater, addresses }: TheaterFormProps) => {
  const updateTheaterWithIds = updateTheater.bind(
    null,
    theater.id,
    theater.address_id,
  );

  const handleSubmit = async (formData: FormData) => {
    toast.promise(
      updateTheaterWithIds(formData),
      {
        loading: "Updating Theater...",
        success: "Theater Updated!",
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
    <form action={handleSubmit}>
      <h2 className="text-base font-semibold leading-7 text-zinc-200">
        My Theater
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        This information will be displayed publicly so be careful what you
        share.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
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
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="name"
          >
            Theater Name
          </label>
          <div className="mt-2">
            <Input
              type="text"
              name="name"
              id="name"
              className="w-full"
              defaultValue={theater.name}
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
              name="street_address"
              id="street_address"
              className="w-full"
              defaultValue={addresses.street_address}
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
              className="w-full"
              defaultValue={addresses.city}
            />
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
            <Input
              type="text"
              name="state"
              id="state"
              className="w-full"
              defaultValue={addresses.state}
            />
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
              defaultValue={addresses.postal_code}
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
            <Input
              type="text"
              name="phone"
              id="phone"
              className="w-full"
              defaultValue={theater.phone}
            />
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
            <Input
              type="text"
              name="email"
              id="email"
              className="w-full"
              defaultValue={theater.email}
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
              defaultValue={theater.notes}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Write a few sentences about yourself.
          </p>
        </div>

        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="parking_instructions"
          >
            Parking Instructions
          </label>
          <div className="mt-2">
            <textarea
              id="parking_instructions"
              name="parking_instructions"
              rows={3}
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={theater.parking_instructions}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            List any parking instructions here.
          </p>
        </div>
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="url"
          >
            Website URL
          </label>
          <div className="mt-2">
            <Input
              type="text"
              name="url"
              id="url"
              className="w-full"
              placeholder="www.example.com"
              defaultValue={theater.url}
            />
          </div>
        </div>
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="type"
          >
            Theater Type
          </label>
          <div className="mt-2">
            <select
              id="type"
              name="type"
              className="block w-full rounded-md border-0 bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
              defaultValue={theater.type}
            >
              <option>High School</option>
              <option>Junior College</option>
              <option>Equity Theater</option>
              <option>Play House</option>
            </select>
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
              defaultValue={theater.concessions}
            />
          </div>
        </div>
      </div>
      <SubmitButton>Update Theater</SubmitButton>
    </form>
  );
};
