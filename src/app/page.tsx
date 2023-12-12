import { Poster } from "@/components/Poster";
import SearchInput from "@/components/SearchInput";
import { Tables } from "@/lib/supabase/dbHelperTypes";
import { createClient } from "@/lib/supabase/server";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  const { data: upcomingProductions, error } = await supabase
    .from("productions")
    .select("*, stages(addresses(*))")
    .filter("start_date", "gte", formattedDate)
    .not("name", "is", null)
    .not("poster_url", "is", null)
    .not("start_date", "is", null)
    .not("stages.addresses.street_address", "is", null)
    .order("start_date", { ascending: true })
    .limit(4);

  if (error) throw new Error(error.message);

  return (
    <div className="flex h-full w-full flex-col items-center font-serif">
      <div className="w-full">
        <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-16 text-center sm:text-left">
          <h1 className="text-4xl font-medium text-white sm:text-5xl">
            Find spectactular stage productions near you.
          </h1>
          <p className="text-sm text-zinc-400 sm:text-base">
            Uncover nearby theaters swiftly. User-friendly interface. No more
            tedious searches. Embrace cinematic delight. Your go-to for an
            unforgettable movie experience. Discover now!
          </p>
          <div className="relative mt-4 w-full self-center">
            <SearchInput />
            <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-300">
        <div className="max-w-7xl py-20">
          <p className="text-center text-2xl font-semibold text-zinc-300">
            Showing Soon
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {upcomingProductions ? (
              upcomingProductions.map((production) => {
                // TODO: add better type checking?
                return (
                  <Poster
                    key={production.id}
                    name={production.name as string}
                    src={production.poster_url as string}
                    date={new Date(production.start_date as string)}
                    address={
                      production?.stages?.addresses as Tables<"addresses">
                    }
                    url={production.url}
                  />
                );
              })
            ) : (
              <div className="text-zinc-400">
                No upcoming productions. Check back again later.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
