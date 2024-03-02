import Link from "next/link";

import { Button } from "@/components/ui/button";

export default async function Success() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-zinc-300">Submitted!</h3>
      <p className="text-base/7 text-zinc-400">
        Your production has been successfully submitted and has been sent to the
        administrator for approval.
      </p>
      <Button asChild className="mt-4">
        <Link href="/account/productions">Back to Productions</Link>
      </Button>
    </div>
  );
}
