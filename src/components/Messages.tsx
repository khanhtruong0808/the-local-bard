"use client";

import { useSearchParams } from "next/navigation";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";

export default function Messages({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  if (!error && !message) return null;

  return (
    <div className={twMerge("rounded-md bg-red-50 p-4", className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc space-y-1 pl-5">
              {error && <li>{error}</li>}
              {message && <li>{message}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
