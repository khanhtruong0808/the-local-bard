import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300",
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
