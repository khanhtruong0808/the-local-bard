import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    className = cn(
      "block border-0 rounded-md sm:text-sm sm:leading-6",
      "bg-transparent py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-zinc-500 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-100",
      className,
    );

    return <input type={type} className={className} ref={ref} {...props} />;
  },
);

Input.displayName = "Input";

export { Input };
