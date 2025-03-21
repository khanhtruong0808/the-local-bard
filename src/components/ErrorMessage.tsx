import { XCircleIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
  error?: string | null;
}

export default function ErrorMessage({ className, error }: Props) {
  if (!error) return null;

  return (
    <div className={twMerge("rounded-md bg-red-50 p-4", className)}>
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
