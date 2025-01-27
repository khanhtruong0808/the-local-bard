"use client";

import Link from "next/link";

export default function Error() {
  return (
    <main className="mx-auto grid min-h-full place-items-center">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-300 sm:text-6xl">
          Whoops!
        </h1>
        <h2 className="mt-1 text-xl font-light text-zinc-300 sm:text-3xl">
          Something went wrong.
        </h2>
        <p className="mt-6 text-base leading-7 text-zinc-400">
          If this problem persists, please let us know.
        </p>
        <div className="mt-7 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-zinc-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
          <a href="/contact" className="text-sm font-semibold text-zinc-200">
            Notify us <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
