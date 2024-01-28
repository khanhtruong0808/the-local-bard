import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm", // base
          "disabled:cursor-not-allowed disabled:opacity-50", // disabled
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", // focus
          "file:border-0 file:bg-transparent file:text-sm file:font-medium", // file input
          "border-zinc-200 bg-white ring-offset-white placeholder:text-zinc-500 focus-visible:ring-zinc-950", // light mode
          // "dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300", // shadcn default dark mode
          "dark:border-zinc-500 dark:bg-transparent dark:text-zinc-300 dark:ring-offset-zinc-500 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-100", // custom dark mode
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
