"use server";

import Image from "next/image";

import LoginForm from "@/components/forms/LoginForm";

export default async function Login() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-[90px] w-[90px]"
          alt="The Local Bard Logo"
          src="/logo.png"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign In to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
