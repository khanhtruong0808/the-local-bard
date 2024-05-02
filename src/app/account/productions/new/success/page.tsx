import Link from "next/link";

import { Button } from "@/components/ui/button";

export default async function Success() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-zinc-200">Submitted!</h3>
      <p className="text-base/7 text-zinc-300">
        Your production has been submitted! You will receive an email when it is
        approved.
      </p>
      <Button asChild className="mt-4">
        <Link href="/account/productions">Back to Productions</Link>
      </Button>
    </div>
  );
}
