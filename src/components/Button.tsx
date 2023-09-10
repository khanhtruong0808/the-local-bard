import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary" | "alert";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

const sizeStyles = {
  small: "rounded px-2 py-1 text-xs",
  medium: "rounded-md px-2.5 py-1.5 text-sm",
  large: "rounded-md px-3.5 py-2.5 text-sm",
};

const variantStyles = {
  primary: "bg-yellow-400 text-black hover:bg-yellow-500",
  secondary: "bg-white text-gray-900 hover:bg-gray-50",
  alert: "bg-red-600 text-white hover:bg-red-500",
};

export default function Button({
  variant = "primary",
  size = "medium",
  children,
  className,
  ...props
}: ButtonProps) {
  className = twMerge(
    "font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
