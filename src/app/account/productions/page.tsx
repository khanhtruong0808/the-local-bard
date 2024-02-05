import { cookies } from "next/headers";

import { Button } from "@/components/ui/button";
import { getTheaterForProductionsPage } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function ProductionsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data: theater } = await getTheaterForProductionsPage(
    supabase,
    user.id,
  );

  if (!theater) throw new Error("No theater associated with user");

  // sort productions to list most recently updated first
  const productions = theater.productions.sort((a, b) => {
    const dateA = new Date(a.updated_at || 0);
    const dateB = new Date(b.updated_at || 0);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
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
                <div className="font-medium text-zinc-300">
                  {production.name}
                </div>
                <a href={`productions/${production.id}`}>
                  <Button type="button" variant="secondary" size="sm">
                    Update
                  </Button>
                </a>
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
    </div>
  );
}
