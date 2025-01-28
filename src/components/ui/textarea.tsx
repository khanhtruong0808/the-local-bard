import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "border-input flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 md:text-sm", // base
          "placeholder:text-muted-foreground", // placeholder
          "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none", // focus
          "disabled:cursor-not-allowed disabled:opacity-50", // disabled
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
