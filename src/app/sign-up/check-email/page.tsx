import Button from "@/components/Button";
import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
        Please check your email to verify your account.
      </h1>

      <div className="flex justify-center">
        <Link href="/">
          <Button className="mt-10">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
