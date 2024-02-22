import Link from "next/link";

import { Button } from "@/components/ui/button";

// Show this if there is no theater associated with the user's account
export function NoTheater() {
  return (
    <>
      <p className="text-xl font-semibold text-zinc-300">
        There is no theater associated your account.
      </p>
      <p className="text-base/7 text-zinc-400">
        Please contact us to request a theater be added to your account.
      </p>
      <Button asChild className="mt-4">
        <Link href="/contact">Contact Us</Link>
      </Button>
    </>
  );
}
