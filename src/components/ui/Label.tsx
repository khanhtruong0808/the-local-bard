import { twMerge } from "tailwind-merge";

// TODO: Add more input styles depending on need
const variantStyles = {
  primary: "block text-sm/6 font-medium text-white",
};

type LabelProps = {
  variant?: keyof typeof variantStyles;
} & React.ComponentPropsWithoutRef<"label">;

export default function Label({
  variant = "primary",
  className,
  ...props
}: LabelProps) {
  className = twMerge(variantStyles[variant], className);

  return <label className={className} {...props} />;
}
