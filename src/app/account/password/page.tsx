import { UpdatePasswordForm } from "@/components/forms/UpdatePasswordForm";

export default async function PasswordPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <UpdatePasswordForm />
    </div>
  );
}
