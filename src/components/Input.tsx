import { twMerge } from "tailwind-merge";

// TODO: Add more input styles depending on need
const variantStyles = {
  primary:
    "bg-transparent py-1.5 text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100",
};

type InputProps = {
  variant?: keyof typeof variantStyles;
} & React.ComponentPropsWithoutRef<"input">;

export default function Input({
  variant = "primary",
  className,
  ...props
}: InputProps) {
  className = twMerge(
    "block border-0 rounded-md sm:text-sm sm:leading-6",
    variantStyles[variant],
    className,
  );

  return <input className={className} {...props} />;
}
