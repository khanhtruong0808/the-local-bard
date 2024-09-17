import Link from "next/link";

import { Button } from "@/components/ui/button";

// Show this if the user's account is verified but their theater is not verified yet
export function TheaterNotVerified() {
  return (
    <>
      <p className="text-xl font-semibold text-zinc-300">
        Your theater has not been verified yet.
      </p>
      <p className="text-base/7 text-zinc-400">
        Thank you for your patience while we review and authenticate your
        theater information.
      </p>
      <Button asChild className="mt-4">
        <Link href="/contact">Contact Us</Link>
      </Button>
    </>
  );
}
