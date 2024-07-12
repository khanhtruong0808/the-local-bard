import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Show this the user's account has not been verified as a theater manager yet. */
export function NotVerified() {
  return (
    <>
      <p className="text-xl font-semibold text-zinc-300">
        Your account has not been verified as a theater manager yet.
      </p>
      <p className="text-base/7 text-zinc-400">
        Please contact us to request verification.
      </p>
      <Button asChild className="mt-4">
        <Link href="/contact">Contact Us</Link>
      </Button>
    </>
  );
}
