import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { DbResultOk, Tables } from "./dbHelperTypes";

export const getTheaterForNewProduction = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  return await client
    .from("theaters")
    .select(
      "*, theater_managers(user_id), addresses(*), productions(*), stages(*)",
    )
    .eq("theater_managers.user_id", userId)
    .order("id")
    .limit(1)
    .single();
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
    .select("*, theater_managers(user_id, theater_id), productions(*)")
    .eq("theater_managers.user_id", userId)
    .order("updated_at")
    .limit(1)
    .single();
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
    .select("*, theater_managers(user_id, theater_id), stages(*)")
    .eq("theater_managers.user_id", userId)
    .order("updated_at")
    .limit(1)
    .single();
};

export type TheaterForStagesPage = DbResultOk<
  ReturnType<typeof getTheaterForStagesPage>
>;

export const getTheaterForUpdateProduction = async (
  client: SupabaseClient<Database>,
  userId: string,
  productionId: string,
) => {
  return await client
    .from("theaters")
    .select(
      "*, theater_managers(user_id), addresses(*), productions(*), stages(*)",
    )
    .eq("theater_managers.user_id", userId)
    .eq("productions.id", productionId)
    .order("id")
    .limit(1)
    .single();
};

export type TheaterForUpdateProduction = DbResultOk<
  ReturnType<typeof getTheaterForUpdateProduction>
>;

export const getProduction = async (
  client: SupabaseClient<Database>,
  productionId: string,
) => {
  return await client
    .from("productions")
    .select("*")
    .eq("id", productionId)
    .limit(1)
    .single();
};

export type Production = DbResultOk<ReturnType<typeof getProduction>>;

/**
 * Only eq filter on the production table is implemented for now
 * filters comes from searchParams on the map/search page
 */
export const getFullProductions = async (
  client: SupabaseClient<Database>,
  filters?: Record<string, string | number>,
) => {
  const query = client
    .from("productions")
    .select("*, theaters (*, addresses (*)), stages (*)");

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query.eq(key, value);
    });
  }

  return await query;
};

export type FullProductions = DbResultOk<ReturnType<typeof getFullProductions>>;
export type FullProduction = FullProductions[number];

export const getStageWithAddress = async (
  client: SupabaseClient<Database>,
  stageId: number,
) => {
  return await client
    .from("stages")
    .select("*, addresses(*)")
    .eq("id", stageId)
    .limit(1)
    .single();
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
    .select("*, theater_managers(user_id), addresses(*)")
    .eq("theater_managers.user_id", userId)
    .order("id")
    .limit(1)
    .single();
};

export type TheaterForTheaterPage = DbResultOk<
  ReturnType<typeof getTheaterForTheaterPage>
>;
