"use client";

import updatePassword from "@/actions/updatePassword";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Input from "./Input";
import Label from "./Label";
import SubmitButton from "./SubmitButton";

export default function UpdatePasswordForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const res = await updatePassword(formData);
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
      <div>
        <Label htmlFor="password">New Password</Label>
        <div className="mt-2">
          <Input
            type="password"
            placeholder="Password"
            aria-label="Password"
            className="w-full"
            name="password"
            required
          />
        </div>
      </div>
      <SubmitButton size="large" className="flex w-full justify-center">
        Update Password
      </SubmitButton>
      <ErrorMessage error={error} />
    </form>
  );
}
