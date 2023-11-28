"use client";

import { type FullProductions } from "@/lib/supabase/queries";
import Image from "next/image";

interface MapProductionsListProps {
  productions: FullProductions;
  handleActiveProduction: (production: FullProductions[number]) => void;
}

export default function MapProductionsList({
  productions,
  handleActiveProduction,
}: MapProductionsListProps) {
  return (
    <div className="flex h-full w-full flex-col gap-y-4">
      {productions.map((production) => {
        const theater = production.theaters;
        const address = theater?.addresses;
        return (
          <>
            <div
              key={production.id}
              className="w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-700 shadow hover:bg-zinc-600"
              onClick={() => handleActiveProduction(production)}
            >
              <div className="sm:flex">
                <div className="ml-2 flex-shrink-0 self-center pl-4 sm:mb-0 sm:mr-4">
                  {production.poster_url && (
                    <Image
                      src={production.poster_url}
                      alt={production.name || "Production poster"}
                      width={100}
                      height={100}
                    />
                  )}
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-zinc-200">
                    {production.name}
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-zinc-400">
                    <p>{theater?.name}</p>
                    <p>{address?.street_address}</p>
                    <p>
                      {address?.city}, {address?.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              key={production.id}
              className="w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-700 shadow hover:bg-zinc-600"
              onClick={() => handleActiveProduction(production)}
            >
              <div className="sm:flex">
                <div className="ml-2 flex-shrink-0 self-center pl-4 sm:mb-0 sm:mr-4">
                  {production.poster_url && (
                    <Image
                      src={production.poster_url}
                      alt={production.name || "Production poster"}
                      width={100}
                      height={100}
                    />
                  )}
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-zinc-200">
                    {production.name}
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-zinc-400">
                    <p>{theater?.name}</p>
                    <p>{address?.street_address}</p>
                    <p>
                      {address?.city}, {address?.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              key={production.id}
              className="w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-700 shadow hover:bg-zinc-600"
              onClick={() => handleActiveProduction(production)}
            >
              <div className="sm:flex">
                <div className="ml-2 flex-shrink-0 self-center pl-4 sm:mb-0 sm:mr-4">
                  {production.poster_url && (
                    <Image
                      src={production.poster_url}
                      alt={production.name || "Production poster"}
                      width={100}
                      height={100}
                    />
                  )}
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-zinc-200">
                    {production.name}
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-zinc-400">
                    <p>{theater?.name}</p>
                    <p>{address?.street_address}</p>
                    <p>
                      {address?.city}, {address?.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              key={production.id}
              className="w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-700 shadow hover:bg-zinc-600"
              onClick={() => handleActiveProduction(production)}
            >
              <div className="sm:flex">
                <div className="ml-2 flex-shrink-0 self-center pl-4 sm:mb-0 sm:mr-4">
                  {production.poster_url && (
                    <Image
                      src={production.poster_url}
                      alt={production.name || "Production poster"}
                      width={100}
                      height={100}
                    />
                  )}
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-zinc-200">
                    {production.name}
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-zinc-400">
                    <p>{theater?.name}</p>
                    <p>{address?.street_address}</p>
                    <p>
                      {address?.city}, {address?.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              key={production.id}
              className="w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-700 shadow hover:bg-zinc-600"
              onClick={() => handleActiveProduction(production)}
            >
              <div className="sm:flex">
                <div className="ml-2 flex-shrink-0 self-center pl-4 sm:mb-0 sm:mr-4">
                  {production.poster_url && (
                    <Image
                      src={production.poster_url}
                      alt={production.name || "Production poster"}
                      width={100}
                      height={100}
                    />
                  )}
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-zinc-200">
                    {production.name}
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-zinc-400">
                    <p>{theater?.name}</p>
                    <p>{address?.street_address}</p>
                    <p>
                      {address?.city}, {address?.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}
