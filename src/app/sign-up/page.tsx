import SignUpForm from "@/components/forms/SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign Up
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <SignUpForm />
      </div>
    </>
  );
}
