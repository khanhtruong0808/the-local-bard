"use client";
import signUp from "@/actions/signUp";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import Input from "./Input";
import SubmitButton from "./SubmitButton";

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const { pending } = useFormStatus();

  const handleSubmit = async (formData: FormData) => {
    const res = await signUp(formData);
    if (res.error) {
      setError(res.error);
    }
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
      <SubmitButton size="large" className="flex w-full justify-center">
        Sign Up
      </SubmitButton>
      <ErrorMessage error={error} />
    </form>
  );
}
