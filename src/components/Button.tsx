import Link from "next/link";
import { twMerge } from "tailwind-merge";

const variantStyles = {
  primary:
    "bg-zinc-700 font-semibold text-zinc-100 hover:bg-zinc-600 active:bg-zinc-700 active:text-zinc-100/70",
  secondary:
    "bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-700/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70",
  alert: "bg-red-600 text-white hover:bg-red-500",
};

const sizeStyles = {
  small: "rounded px-2 py-1 text-xs",
  medium: "rounded-md px-2.5 py-1.5 text-sm",
  large: "rounded-md px-3.5 py-2.5 text-sm",
};

type ButtonProps = {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
} & (
  | (React.ComponentPropsWithoutRef<"button"> & { href?: undefined })
  | React.ComponentPropsWithoutRef<typeof Link>
);

export default function Button({
  variant = "primary",
  size = "medium",
  className,
  ...props
}: ButtonProps) {
  className = twMerge(
    "font-semibold shadow-sm outline-offset-2 transition active:transition-none disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  return typeof props.href === "undefined" ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  );
}
