import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import Image from "next/image";

export default async function ResetPassword() {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto w-auto"
          width={40}
          height={40}
          alt="The Local Bard Logo"
          src="/logo.jpg"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Reset Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <ResetPasswordForm />
      </div>
    </>
  );
}
