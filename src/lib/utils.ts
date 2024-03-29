import { ReadonlyURLSearchParams } from "next/navigation";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse } from "date-fns";

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

export function ynToBool(yn: "Yes" | "No" | "") {
  return yn === "Yes" ? true : yn === "No" ? false : undefined;
}

export function boolToYN(bool: boolean | undefined | null) {
  return bool === true ? "Yes" : bool === false ? "No" : "";
}

export type SchemaToFormType<T> = {
  [P in keyof T]: T[P] extends number
    ? T[P] | ""
    : T[P] extends boolean
      ? T[P] | ""
      : T[P];
};

/**
 * Convert a date string to a Date object without timezone offset.
 * "2024-01-01" will be converted to local timezone midnight of that date.
 */
export function parseDateString(dateStr: string) {
  return parse(dateStr, "yyyy-MM-dd", new Date());
}

/**
 * Get a Date object for today at midnight local time.
 */
export function getTodayAtMidnight() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export const urlRegex =
  /^(https?:\/\/)[A-Za-z0-9.-]+(?::\d+)?(?:\/[\+~%\/.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[.\!\/\\\w]*)?$/;
