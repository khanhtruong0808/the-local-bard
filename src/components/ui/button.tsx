import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: [
          "font-semibold",
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90", // light mode
          "dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70", // dark mode
        ],
        destructive: [
          "bg-red-500 text-zinc-50 hover:bg-red-500/90", // light mode
          "dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90", // dark mode
        ],
        outline: [
          "border",
          "border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900", // light mode
          "dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50", // dark mode
        ],
        secondary: [
          "font-medium",
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80", // light mode
          "dark:bg-zinc-700/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70", // dark mode
        ],
        ghost: [
          "hover:bg-zinc-100 hover:text-zinc-900", // light mode
          "dark:hover:bg-zinc-800 dark:hover:text-zinc-50", // dark mode
        ],
        link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
