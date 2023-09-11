import Button from "@/components/Button";
import Input from "@/components/Input";

export default async function ContactPage() {
  return (
    <div className="h-screen w-screen">
      <form className="mx-auto mt-16 flex w-full max-w-7xl flex-col">
        <h2 className="mb-12 text-center text-5xl font-semibold text-zinc-200">
          CONTACT US
        </h2>
        <p></p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="name"
            >
              Name
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              className="mt-2 w-full bg-zinc-100 text-zinc-800"
            />
          </div>
          <div>
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="Email"
            >
              Email
            </label>
            <Input
              type="text"
              name="email"
              id="email"
              className="mt-2 w-full bg-zinc-100 text-zinc-800"
            />
          </div>
          <div className="col-span-2">
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <Input
              type="tel"
              name="phone"
              id="phone"
              className="mt-2 w-full bg-zinc-100 text-zinc-800"
            />
          </div>
          <div className="col-span-2">
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={8}
              className="mt-2 block w-full rounded-md border-0 bg-transparent bg-zinc-100 py-1.5 text-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <Button size="large" className="mt-4 self-start px-7" type="submit">
          Send
        </Button>
      </form>
    </div>
  );
}