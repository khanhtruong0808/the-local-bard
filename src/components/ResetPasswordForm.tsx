"use client";

import resetPasswordEmail from "@/actions/resetPasswordEmail";
import { useState } from "react";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import ErrorMessage from "./ErrorMessage";
import Label from "./Label";

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const res = await resetPasswordEmail(formData);
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
