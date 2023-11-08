// There are two update password forms:
// One once you are already logged in and enter in your old password and new password.
// The other is when you forgot your password and you enter in your email address to
// receive a password reset link.
// This is the password reset link version.

"use client";

import toast from "react-hot-toast";

import Input from "@/components/Input";
import Label from "@/components/Label";
import SubmitButton from "@/components/SubmitButton";
import updatePasswordAfterReset from "./action";

export const UpdatePasswordAfterResetForm = () => {
  const handleSubmit = async (formData: FormData) => {
    toast.promise(
      updatePasswordAfterReset(formData),
      {
        loading: "Updating password...",
        success: "Password updated!",
        error: (err: Error) => err.message,
      },
      {
        style: {
          minWidth: "250px",
        },
      },
    );
  };

  return (
    <form action={handleSubmit}>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
        <div className="col-span-full">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="mt-2">
            <Input
              type="password"
              name="newPassword"
              id="newPassword"
              className="w-full"
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
          <div className="mt-2">
            <Input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              className="w-full"
            />
          </div>
        </div>
      </div>
      <SubmitButton>Update Password</SubmitButton>
    </form>
  );
};
