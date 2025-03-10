import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "border-input ring-offset-background flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm", // base
        "placeholder:text-muted-foreground", // placeholder
        "disabled:cursor-not-allowed disabled:opacity-50", // disabled
        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none", // focus
        "file:border-0 file:bg-transparent file:text-sm file:font-medium", // file input
        className,
      )}
      {...props}
    />
  );
}

export { Input };
