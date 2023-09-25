import Button from "@/components/Button";
import Input from "@/components/Input";
import { Poster } from "@/components/Poster";

export default async function NewProductionPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <form className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
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
                defaultValue={""}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Include a few details about your production.
            </p>
          </div>
          <div className="sm:col-span-3 sm:col-start-1">
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="playwright"
            >
              Playwright
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="playwright"
                id="playwright"
                className="w-full"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="director"
            >
              Director
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="director"
                id="director"
                className="w-full"
              />
            </div>
          </div>
          {/* TODO: Make this a list of composers, allowing user to add, edit and remove ? */}
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
                id="genre"
                name="genre"
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
              htmlFor="costRange"
            >
              Cost Range
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="costRange"
                id="costRange"
                className="w-full"
              />
            </div>
          </div>
          {/* TODO: Make this a time selector */}
          <div className="col-span-full">
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="duration"
            >
              Duration
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="duration"
                id="duration"
                className="w-full"
              />
            </div>
          </div>
          {/* TODO: File upload for poster? */}
          <div className="sm:col-span-3">
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="poster"
            >
              Poster
            </label>
            <div className="mt-2">
              <Input
                type="file"
                name="poster"
                id="poster"
                className="w-full p-0 text-sm text-zinc-400 file:mr-2 file:cursor-pointer file:rounded-md file:rounded-r-none file:border-none file:bg-transparent file:bg-zinc-700 file:px-2.5 file:py-1.5 file:text-zinc-100 file:hover:bg-zinc-600 file:active:bg-zinc-700 file:active:text-zinc-100/70"
              />
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-fit sm:col-span-3">
            <Poster
              name={"Macbeth"}
              src={"/macbeth.jpg"}
              date={"July 12, 2022"}
              location={"123 Broadway St"}
            />
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
                defaultValue={""}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Include anything else you&apos;d like to add.
            </p>
          </div>
          {/* TODO: Make this a datetime input that is pretty */}
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
          {/* TODO: Make this a datetime input that is pretty */}
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
        <Button type="submit">Create new production</Button>
      </form>
    </div>
  );
}
