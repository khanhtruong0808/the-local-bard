import Image from "next/image";

interface Props {
  src: string;
  name: string;
  date: string;
  location: string;
}

export const Poster = ({ src, name, date, location }: Props) => {
  return (
    <div>
      <Image
        height={200}
        width={200}
        src={src}
        alt=""
        className="h-[200px] w-[200px] overflow-hidden rounded"
      />
      <div className="mt-2 flex justify-between text-sm">
        <p className="text-zinc-300">{name}</p>
        <p className="text-zinc-400">{date}</p>
      </div>
      <p className="text-xs text-zinc-400">{location}</p>
    </div>
  );
};
