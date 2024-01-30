import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm", // base
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", // focus base
          "disabled:cursor-not-allowed disabled:opacity-50", // disabled
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
Textarea.displayName = "Textarea";

export { Textarea };
