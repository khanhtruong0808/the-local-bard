import { Poster } from "@/components/Poster";
import SearchInput from "@/components/SearchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { getMaybeUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center font-serif">
      <div className="w-full">
        <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-16 text-center sm:text-left">
          <h1 className="text-4xl font-medium text-white sm:text-5xl">
            Find spectactular stage productions near you.
          </h1>
          <p className="text-sm text-zinc-300 sm:text-base">
            Professional, educational, or community, there&quot;s a show for
            everyone. Now you can easily find your favorite plays and musicals
            performing near you. Buy tickets. Support local theaters. Discover
            new productions. And embrace the joys of Live Theatre.
          </p>
          <p className="text-xs text-zinc-300 sm:text-sm">
            The Local Bard is currently in Beta and will be receiving frequent
            updates. Thank you for your support.
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
          <Suspense fallback={<UpcomingProductionsSkeleton />}>
            <UpcomingProductions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function UpcomingProductions() {
  const supabase = await createClient();

  // This line is required for supabase to stop complaining about getSession
  await getMaybeUser(supabase);

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

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      {upcomingProductions ? (
        upcomingProductions.map((production) => {
          return (
            <Poster
              key={production.id}
              name={production.name}
              src={production.poster_url as string} // checked above
              startDate={new Date(production.start_date)}
              endDate={new Date(production.end_date)}
              address={production.stages.addresses!} // checked above
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
  );
}

async function UpcomingProductionsSkeleton() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      {[1, 2, 3, 4].map((index) => (
        <Skeleton key={index} className="h-[300px] w-[225px]" />
      ))}
    </div>
  );
}
