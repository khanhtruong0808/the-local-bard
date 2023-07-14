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
        className="overflow-hidden w-[200px] h-[200px] rounded"
      />
      <div className="flex justify-between text-sm mt-2">
        <p>{name}</p>
        <p>{date}</p>
      </div>
      <p className="text-xs text-gray-500">{location}</p>
    </div>
  );
};
