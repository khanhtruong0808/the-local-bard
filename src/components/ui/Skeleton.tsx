// Copied from shadcn-ui's skeleton component

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-600", className)}
      {...props}
    />
  );
}
