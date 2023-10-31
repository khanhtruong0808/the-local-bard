import { UpdatePasswordForm } from "@/components/UpdatePasswordForm";

export default async function PasswordPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
