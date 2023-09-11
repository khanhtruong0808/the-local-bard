import signUp from "@/actions/signUp";
import Button from "@/components/Button";
import Input from "@/components/Input";
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
              <Input
                type="email"
                placeholder="Email address"
                aria-label="Email address"
                className="w-full"
                name="email"
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
              <Input
                type="password"
                placeholder="Password"
                aria-label="Password"
                className="w-full"
                name="password"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="flex w-full justify-center"
            size="large"
          >
            Sign Up
          </Button>
        </form>
        <Messages className="mt-6" />
      </div>
    </>
  );
}
