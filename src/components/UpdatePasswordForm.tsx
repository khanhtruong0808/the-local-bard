"use client";

import toast from "react-hot-toast";

import updatePassword from "@/actions/updatePassword";
import { Input } from "./ui/Input";
import Label from "./ui/Label";
import SubmitButton from "./ui/SubmitButton";

export const UpdatePasswordForm = () => {
  const handleSubmit = async (formData: FormData) => {
    toast.promise(
      updatePassword(formData),
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
      <h2 className="text-base font-semibold leading-7 text-zinc-200">
        Change password
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
        <div className="col-span-full">
          <Label htmlFor="oldPassword">Old Password</Label>
          <div className="mt-2">
            <Input
              type="password"
              name="oldPassword"
              id="oldPassword"
              className="w-full"
            />
          </div>
        </div>
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
