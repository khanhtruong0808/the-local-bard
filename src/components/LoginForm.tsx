"use client";
import signInWithEmail from "@/actions/signInWithEmail";
import Link from "next/link";
import { useState } from "react";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import Input from "./Input";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    const res = await signInWithEmail(formData);
    if (res.error) {
      setError(res.error);
    }
    setPending(false);
  };

  return (
    <form className="space-y-6" action={handleSubmit}>
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
        disabled={pending}
        type="submit"
        className="flex w-full justify-center"
        size="large"
      >
        Sign In
      </Button>
      <p className="mt-6 text-center text-sm text-neutral-400">
        Don&apos;t have an account?
        {/* Fake button, looks like a link */}
        <Link className="pl-1.5 text-zinc-300 underline" href="/sign-up">
          Sign Up
        </Link>
      </p>
      <ErrorMessage error={error} />
    </form>
  );
}
