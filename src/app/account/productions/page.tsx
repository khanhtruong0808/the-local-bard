import { cookies } from "next/headers";

import { NoTheater } from "@/components/NoTheater";
import { Button } from "@/components/ui/button";
import { getTheaterForProductionsPage, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { parse } from "date-fns";
import { getTodayAtMidnight, parseDateString } from "@/lib/utils";

export default async function ProductionsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const user = await getUser(supabase);

  const { data: theater, error } = await getTheaterForProductionsPage(
    supabase,
    user.id,
  );
  if (error) throw new Error(error.message);
  if (!theater) return <NoTheater />;

  // filter out productions that have ended
  // sort productions to list most recently updated first
  const productions = theater.productions
    .filter((p) => parseDateString(p.end_date) >= getTodayAtMidnight())
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || 0);
      const dateB = new Date(b.updated_at || 0);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
      <div>
        <h2 className="text-base font-semibold leading-7 text-zinc-200">
          {theater.name} Productions
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Manage your theater&apos;s productions.
        </p>
      </div>
      <div className="mt-12">
        <ul
          role="list"
          className="mt-4 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
        >
          {productions.map((production) => (
            <li
              className="flex justify-between gap-x-6 py-6"
              key={production.id}
            >
              <div className="font-medium text-zinc-300">{production.name}</div>
              <div className="flex items-center">
                {production.approved ? (
                  <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                    Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                    Pending approval
                  </span>
                )}
                <Button
                  className="ml-4"
                  type="button"
                  variant="secondary"
                  size="sm"
                  asChild
                >
                  <Link href={`productions/${production.id}`}>Update</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex border-t border-gray-100 pt-6">
          <a href="productions/new">
            <Button type="button" variant="secondary">
              <span aria-hidden="true">+</span> Add another production
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
