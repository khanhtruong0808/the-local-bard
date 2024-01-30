import { ReadonlyURLSearchParams } from "next/navigation";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) return true;

  if (
    obj1 === null ||
    obj2 === null ||
    typeof obj1 !== "object" ||
    typeof obj2 !== "object"
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ynToBool(yn: string | undefined | null) {
  return yn === "Yes" ? true : yn === "No" ? false : undefined;
}

export function boolToYN(bool: boolean | undefined | null) {
  return bool === true ? "Yes" : bool === false ? "No" : undefined;
}
