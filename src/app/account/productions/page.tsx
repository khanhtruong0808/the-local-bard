import Button from "@/components/Button";
import { Tables } from "@/lib/supabase/dbHelperTypes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function ProductionsPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data: theater } = await supabase
    .from("theaters")
    .select("*, theater_managers(user_id, theater_id), productions(*)")
    .eq("theater_managers.user_id", user.id)
    .order("updated_at")
    .limit(1)
    .single();

  if (!theater) throw new Error("No theater associated with user");

  const { productions } = theater;

  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            My Productions
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Add productions to your theater.
          </p>
        </div>
        <div className="mt-12">
          <ul
            role="list"
            className="mt-4 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
          >
            {productions.map((production: Tables<"productions">) => (
              <li
                className="flex justify-between gap-x-6 py-6"
                key={production.id}
              >
                <div className="font-medium text-zinc-300">
                  {production.name}
                </div>
                <a href={`productions/${production.id}`}>
                  <Button type="button" variant="secondary" size="small">
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
