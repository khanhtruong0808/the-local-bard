import Image from "next/image";
import Link from "next/link";

import type { Tables } from "@/lib/supabase/dbHelperTypes";

interface Props {
  src: string;
  name: string;
  date: Date;
  address: Tables<"addresses">;
  url: string | null;
}

export const Poster = ({ src, name, date, address, url }: Props) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };
  return (
    <Link
      href={url || ""}
      prefetch={false}
      target={url ? "_blank" : "_self"}
      className={!url ? "cursor-default" : ""}
    >
      <div>
        <Image
          height={300}
          width={225}
          src={src}
          alt=""
          className="h-[300px] w-[225px] overflow-hidden rounded"
        />
        <div className="mt-2 flex max-w-[225px] flex-wrap justify-between text-sm">
          <p className="text-zinc-300">{name}</p>
          <p className="text-zinc-400">
            {date.toLocaleDateString("en-us", options)}
          </p>
        </div>
        <p className="text-xs text-zinc-400">{address.street_address}</p>
        <p className="text-xs text-zinc-400">
          {address.city}, {address.state} {address.postal_code}
        </p>
      </div>
    </Link>
  );
};
