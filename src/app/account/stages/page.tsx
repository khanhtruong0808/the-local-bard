"use client";
import Button from "@/components/Button";

export default function StagesPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            My Stages
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Add stages to your theater.
          </p>
        </div>
        <div className="mt-12">
          <ul
            role="list"
            className="mt-4 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
          >
            <li className="flex justify-between gap-x-6 py-6">
              <div className="font-medium text-zinc-300">Stage 1</div>
              <a href="stages/1">
                <Button type="button" variant="secondary" size="small">
                  Update
                </Button>
              </a>
            </li>{" "}
            <li className="flex justify-between gap-x-6 py-6">
              <div className="font-medium text-zinc-300">Stage 2</div>
              <a href="stages/2">
                <Button type="button" variant="secondary" size="small">
                  Update
                </Button>
              </a>
            </li>
          </ul>

          <div className="flex border-t border-gray-100 pt-6">
            <a href="stages/new">
              <Button type="button" variant="secondary">
                <span aria-hidden="true">+</span> Add another stage
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}