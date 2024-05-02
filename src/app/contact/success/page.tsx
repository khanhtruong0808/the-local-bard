import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ContactSuccessPage() {
  return (
    <div className="mx-auto flex h-full flex-col justify-center px-4 align-middle sm:px-6">
      <p className="mb-12 text-center text-xl text-zinc-300">
        Thank you for your feedback!
      </p>
      <Button asChild>
        <Link href="/">Back</Link>
      </Button>
    </div>
  );
}
