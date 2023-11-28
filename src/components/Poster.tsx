import { Tables } from "@/lib/supabase/dbHelperTypes";
import Image from "next/image";

interface Props {
  src: string;
  name: string;
  date: Date;
  address: Tables<"addresses">;
}

export const Poster = ({ src, name, date, address }: Props) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };
  return (
    <div>
      <Image
        height={250}
        width={250}
        src={src}
        alt=""
        className="h-[250px] w-[250px] overflow-hidden rounded"
      />
      <div className="mt-2 flex max-w-[250px] flex-wrap justify-between text-sm">
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
  );
};
