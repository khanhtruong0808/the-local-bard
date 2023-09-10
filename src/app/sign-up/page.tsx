import signUp from "@/actions/signUp";
import Button from "@/components/Button";
import Messages from "@/components/Messages";

export default function SignUpPage() {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign Up
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action={signUp}>
          <div>
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="email"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white placeholder:text-white/30 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                name="email"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label
              className="block text-sm/6 font-medium text-white"
              htmlFor="password"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white placeholder:text-white/30 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                type="password"
                name="password"
              />
            </div>
          </div>
          <Button type="submit">Submit</Button>
        </form>
        <Messages className="mt-6" />
      </div>
    </>
  );
}
