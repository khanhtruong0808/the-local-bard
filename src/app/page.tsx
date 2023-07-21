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
    <main className="w-full flex flex-col items-center font-serif">
      <div className="bg-blue-950 w-full">
        <div className="max-w-xl py-20 px-6 mx-auto flex flex-col gap-6 text-center sm:text-left">
          <h1 className="text-white text-4xl sm:text-5xl font-medium">
            Find spectactular stage productions near you.
          </h1>
          <p className="text-blue-100/70 sm:text-base text-sm">
            Uncover nearby theaters swiftly. User-friendly interface. No more
            tedious searches. Embrace cinematic delight. Your go-to for an
            unforgettable movie experience. Discover now!
          </p>
          <div className="w-full self-center relative mt-6">
            <SearchInput />
            <div className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-300">
        <div className="max-w-5xl py-20">
          <p className="text-2xl font-semibold text-center">Showing Soon</p>
          <div className="flex gap-4 mt-8 flex-wrap justify-center">
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
          <p className="text-2xl font-semibold text-center">Categories</p>
          <div className="flex gap-4 mt-8 flex-wrap justify-center">
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
