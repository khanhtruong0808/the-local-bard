import { Poster } from "@/components/Poster";
import SearchInput from "@/components/SearchInput";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

const posters = [
  {
    name: "Macbeth",
    src: "/macbeth.jpg",
    date: "July 12, 2022",
    location: "123 Broadway St",
  },
  {
    name: "Les Miserables",
    src: "/les-miserables.jpg",
    date: "July 24, 2022",
    location: "5353 Downtown Ave",
  },
  {
    name: "Lion King",
    src: "/lion-king.jpg",
    date: "July 15, 2022",
    location: "2352 September Ct",
  },
  {
    name: "Hamilton",
    src: "/hamilton.jpg",
    date: "July 19, 2022",
    location: "6262 West St",
  },
];
export default function Home() {
  return (
    <main className="flex w-full flex-col items-center font-serif">
      <div className="w-full">
        <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-20 text-center sm:text-left">
          <h1 className="text-4xl font-medium text-white sm:text-5xl">
            Find spectactular stage productions near you.
          </h1>
          <p className="text-sm text-zinc-400 sm:text-base">
            Uncover nearby theaters swiftly. User-friendly interface. No more
            tedious searches. Embrace cinematic delight. Your go-to for an
            unforgettable movie experience. Discover now!
          </p>
          <div className="relative mt-6 w-full self-center">
            <SearchInput />
            <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-300">
        <div className="max-w-5xl py-20">
          <p className="text-center text-2xl font-semibold text-zinc-300">
            Showing Soon
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {posters.map((poster) => (
              <Poster
                key={poster.name}
                name={poster.name}
                src={poster.src}
                date={poster.date}
                location={poster.location}
              />
            ))}
          </div>
        </div>
        <div className="max-w-5xl py-20">
          <p className="text-center text-2xl font-semibold text-zinc-300">
            Categories
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {posters.map((poster) => (
              <Poster
                key={poster.name}
                name={poster.name}
                src={poster.src}
                date={poster.date}
                location={poster.location}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
