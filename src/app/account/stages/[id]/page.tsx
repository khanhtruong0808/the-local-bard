import Button from "@/components/Button";
import Input from "@/components/Input";

export default async function EditStagePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <form className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            Stage {params.id}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Make changes to your stage here.
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
              htmlFor="address"
            >
              Address
            </label>
            <div className="mt-2">
              <Input
                type="text"
                name="address"
                id="address"
                className="w-full"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="stageType"
            >
              Stage Type
            </label>
            <div className="mt-2">
              <select
                id="stageType"
                name="stageType"
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
              htmlFor="seatCount"
            >
              Seat Count
            </label>
            <div className="mt-2">
              <Input
                type="number"
                name="seatCount"
                id="seatCount"
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
                defaultValue={""}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Include anything else you&apos;d like to add.
            </p>
          </div>
        </div>
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}
