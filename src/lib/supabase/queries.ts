import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

import type { Database } from "./database.types";
import type { DbResultOk, Tables } from "./dbHelperTypes";
import type { RouteSearchParams } from "../types";
import { format } from "date-fns";

export const getTheaterForNewProduction = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  return await client
    .from("theaters")
    .select("*, productions(*), stages(*, addresses(*))")
    .eq("manager_id", userId)
    .order("id")
    .limit(1)
    .maybeSingle();
};

export type TheaterForNewProduction = DbResultOk<
  ReturnType<typeof getTheaterForNewProduction>
>;

export const getTheaterForProductionsPage = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  return await client
    .from("theaters")
    .select("*, productions(*)")
    .eq("manager_id", userId)
    .limit(1)
    .maybeSingle();
};

export type TheaterForProductionsPage = DbResultOk<
  ReturnType<typeof getTheaterForProductionsPage>
>;

export const getTheaterForStagesPage = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  return await client
    .from("theaters")
    .select("*, stages(*)")
    .eq("manager_id", userId)
    .order("updated_at")
    .limit(1)
    .maybeSingle();
};

export type TheaterForStagesPage = DbResultOk<
  ReturnType<typeof getTheaterForStagesPage>
>;

export const getProductionForUpdate = async (
  client: SupabaseClient<Database>,
  productionId: number,
) => {
  return await client
    .from("productions")
    .select("*, theaters(*, stages(*, addresses(*))), stages(*, addresses(*))")
    .eq("id", productionId)
    .limit(1)
    .maybeSingle();
};

export type ProductionForUpdate = DbResultOk<
  ReturnType<typeof getProductionForUpdate>
>;

export const getProduction = async (
  client: SupabaseClient<Database>,
  productionId: number,
) => {
  return await client
    .from("productions")
    .select("*")
    .eq("id", productionId)
    .limit(1)
    .maybeSingle();
};

export type Production = DbResultOk<ReturnType<typeof getProduction>>;

/**
 * Get all productions that are approved and have not ended yet.
 * Includes stage with address and theater.
 * Filters comes from searchParams on the map/search page.
 */
export const getFullProductions = cache(
  async (
    client: SupabaseClient<Database>,
    filters?: RouteSearchParams,
    search?: string | string[],
    searchDate?: string | string[],
  ) => {
    const query = client
      .from("productions")
      .select("*, stages (*, addresses (*)), theaters (*)")
      .eq("approved", true)
      .gte("end_date", format(new Date(), "yyyy-MM-dd"));

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined) {
          return; // Skip undefined values
        } else if (
          ["genres", "directors", "composers", "playwrights"].includes(key)
        ) {
          // Hard-code these array-type columns for now
          if (Array.isArray(value)) {
            query.contains(key, value);
          } else {
            query.contains(key, [value]);
          }
        } else if (Array.isArray(value)) {
          query.in(key, value);
          return;
        } else {
          query.eq(key, value);
        }
      });
    }

    // If search is provided like ?q=foo, search for productions using fuzzy
    // search. The search_production_ids function has been implemented in
    // Supabase, so we can call it with RPC to get all the production IDs that
    // match the search term and use them to filter the query.
    // TODO: Implement multi search, and possibly implement this whole query
    // as a function so that we can just do RPC instead of query + RPC.
    if (search) {
      if (Array.isArray(search)) {
        throw new Error("multi search not implemented");
      }

      const { data, error } = await client.rpc("search_production_ids", {
        search_term: search,
      });
      if (error) throw error;

      // ids that match our fuzzy search
      const ids = data.map((d) => d.id);

      // representation of OR clauses in our supabase query
      const queryStr = `id.in.(${ids.join(",")}), directors.cs.{"${search}"}, composers.cs.{"${search}"}, playwrights.cs.{"${search}"}, genres.cs.{"${search}"}`;
      query.or(queryStr);
    }

    // Filter by productions that end after the search start date
    if (searchDate) {
      if (Array.isArray(searchDate)) {
        throw new Error("multi search date not implemented");
      }
      query.lte("start_date", searchDate);
      query.gte("end_date", searchDate);
    }

    return await query;
  },
);

export type FullProductions = DbResultOk<ReturnType<typeof getFullProductions>>;
export type FullProduction = FullProductions[number];

/**
 * formattedDate should be in the format "YYYY-MM-DD"
 */
export const getUpcomingProductions = async (
  client: SupabaseClient<Database>,
  formattedDate: string,
) => {
  return await client
    .from("productions")
    .select("*, stages(addresses(*))")
    .filter("start_date", "gte", formattedDate)
    .not("name", "is", null)
    .not("poster_url", "is", null)
    .not("start_date", "is", null)
    .not("stages.addresses.street_address", "is", null)
    .order("start_date", { ascending: true })
    .limit(4);
};

export const getStageWithAddress = async (
  client: SupabaseClient<Database>,
  stageId: number,
) => {
  return await client
    .from("stages")
    .select("*, addresses(*), theaters(*)")
    .eq("id", stageId)
    .limit(1)
    .maybeSingle();
};

// I manually defined this because the query above says addresses is an array
// when it shouldn't be
export type StageWithAddress = Tables<"stages"> & {
  addresses: Tables<"addresses">;
};

export const getTheaterForTheaterPage = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  return await client
    .from("theaters")
    .select("*, addresses(*)")
    .eq("manager_id", userId)
    .order("id")
    .limit(1)
    .maybeSingle();
};

export type TheaterForTheaterPage = DbResultOk<
  ReturnType<typeof getTheaterForTheaterPage>
>;

export const getProfile = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  return await client
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
};

export type Profile = DbResultOk<ReturnType<typeof getProfile>>;

/**
 * Gets user from Supabase Auth or throws an error.
 * This circumvents the issue where we DO get a user response, but there is also
 * an error saying that the sub claim is missing.
 */
export const getUser = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.auth.getUser();

  if (data.user) return data.user;
  if (error) throw new Error(error.message);
  throw new Error("No user found");
};

/**
 * Same as above, but user isn't required.
 * Returns null if no user is found.
 */
export const getMaybeUser = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.auth.getUser();
  if (data.user) return data.user;

  if (error) {
    if (
      error.name === "AuthApiError" &&
      error.code === "bad_jwt" &&
      error.message.includes("missing sub claim")
    ) {
      return null;
    }

    if (error.name === "AuthSessionMissingError") {
      return null;
    }

    if (error.message.includes("User from sub claim in JWT does not exist")) {
      return null;
    }

    throw new Error(error.message);
  }

  return null;
};
