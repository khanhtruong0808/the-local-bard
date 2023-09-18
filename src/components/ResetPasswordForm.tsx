"use client";

import resetPassword from "@/actions/resetPassword";
import { useState } from "react";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import ErrorMessage from "./ErrorMessage";

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const res = await resetPassword(formData);
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
            name="email"
            placeholder="Email address"
            aria-label="Email address"
            className="w-full"
            required
          />
        </div>
      </div>
      <SubmitButton size="large" className="flex w-full justify-center">
        Reset Password
      </SubmitButton>
      <ErrorMessage error={error} />
    </form>
  );
}
