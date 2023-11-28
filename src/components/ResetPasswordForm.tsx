"use client";

import { useState } from "react";

import resetPasswordEmail from "@/actions/resetPasswordEmail";
import ErrorMessage from "./ErrorMessage";
import Input from "./ui/Input";
import Label from "./ui/Label";
import SubmitButton from "./ui/SubmitButton";

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
