"use client";
import Input from "./Input";
import SubmitButton from "./SubmitButton";

export const PasswordForm = () => {
  return (
    <form>
      <h2 className="text-base font-semibold leading-7 text-zinc-200">
        Change password
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
        <div className="col-span-full">
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="oldPassword"
          >
            Old Password
          </label>
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
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="newPassword"
          >
            New Password
          </label>
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
          <label
            className="block text-sm/6 font-medium text-white"
            htmlFor="confirmNewPassword"
          >
            Confirm New Password
          </label>
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
