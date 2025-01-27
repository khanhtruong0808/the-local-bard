"use client";

import { AlertCircle, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/SubmitButton";
import { FormServerState } from "@/lib/types";
import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const UpdatePasswordForm = ({
  action,
}: {
  action: (
    currentState: FormServerState,
    formData: FormData,
  ) => Promise<FormServerState>;
}) => {
  const [state, formAction] = useActionState<FormServerState, FormData>(
    action,
    {
      status: "idle",
    },
  );

  return (
    <form action={formAction}>
      <h2 className="text-base font-semibold leading-7 text-zinc-200">
        Change password
      </h2>
      <div className="mt-6 space-y-4 border-t border-gray-200 py-6">
        <div>
          {state.status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state.status === "success" && (
            <Alert variant="success">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Password updated.</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input type="password" name="newPassword" required minLength={8} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
          <Input
            type="password"
            name="confirmNewPassword"
            required
            minLength={8}
          />
        </div>
      </div>
      <SubmitButton>Update Password</SubmitButton>
    </form>
  );
};
