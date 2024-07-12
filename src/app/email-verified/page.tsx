import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmailVerifiedPage() {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-200">
        Your email has been verified!
      </h1>
      <p className="mt-6 text-center text-zinc-300">
        We will review your theater information and reach out for full
        verification.
      </p>

      <div className="flex justify-center">
        <Link href="/">
          <Button className="mt-10">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
