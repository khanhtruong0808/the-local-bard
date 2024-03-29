"use client";

import Link from "next/link";
import { useState } from "react";

import signInWithEmail from "@/actions/signInWithEmail";
import ErrorMessage from "@/components/ErrorMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/SubmitButton";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const res = await signInWithEmail(formData);
    if (res.error) {
      setError(res.error);
    }
  };

  return (
    <form className="space-y-6" action={handleSubmit}>
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="mt-2">
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            aria-label="Email address"
            className="w-full"
            required
            tabIndex={1}
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <div className="text-sm">
            <Link
              href="/reset-password"
              className="font-semibold text-zinc-300 hover:text-zinc-200"
              tabIndex={4}
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <div className="mt-2">
          <Input
            type="password"
            placeholder="Password"
            aria-label="Password"
            className="w-full"
            name="password"
            required
            tabIndex={2}
          />
        </div>
      </div>
      <SubmitButton
        size="lg"
        className="flex w-full justify-center"
        tabIndex={3}
      >
        Sign In
      </SubmitButton>
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
