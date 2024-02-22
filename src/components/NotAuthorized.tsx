import Link from "next/link";

import { Button } from "@/components/ui/button";

// Show this if a user tries to modify a stage or production that is not
// associated with their theater.
export function NotAuthorized() {
  return (
    <>
      <p className="text-xl font-semibold text-zinc-300">
        You are not authorized to modify this.
      </p>
      <p className="text-base/7 text-zinc-400">
        Please contact us if you believe this is an error.
      </p>
      <Button asChild className="mt-4">
        <Link href="/contact">Contact Us</Link>
      </Button>
    </>
  );
}
