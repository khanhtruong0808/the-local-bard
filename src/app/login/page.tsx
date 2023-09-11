"use server";

import signInWithEmail from "@/actions/signInWithEmail";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Messages from "@/components/Messages";
import Image from "next/image";
import Link from "next/link";

export default async function Login() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto w-auto"
          width={40}
          height={40}
          alt="The Local Bard Logo"
          src="/logo.jpg"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign In to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action={signInWithEmail} method="post">
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
          <Button className="flex w-full justify-center" size="large">
            Sign In
          </Button>
          <p className="mt-6 text-center text-sm text-neutral-400">
            Don&apos;t have an account?
            {/* Fake button, looks like a link */}
            <Link className="pl-1.5 text-zinc-300 underline" href="/sign-up">
              Sign Up
            </Link>
          </p>
        </form>

        {/* Google Auth isn't working for some reason. I'll figure it out later. */}
        {/* <div>
          <div className="relative mt-10">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-blue-950 px-6 text-white">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4">
            <GoogleSignInButton />
          </div>
        </div> */}
        <Messages className="mt-6" />
      </div>
    </div>
  );
}
