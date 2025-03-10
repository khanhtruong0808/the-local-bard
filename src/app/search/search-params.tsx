import {
  parseAsInteger,
  parseAsString,
  parseAsIsoDate,
  parseAsArrayOf,
  createLoader,
  parseAsBoolean,
  parseAsStringEnum,
} from "nuqs/server";

import { defaultMapCenter } from "@/lib/constants";

export const mapPageSearchParams = {
  q: parseAsString, // catch-all for fuzzy searching production names, playwrights, directors, etc.
  productionId: parseAsInteger,
  stageId: parseAsInteger,
  lat: parseAsInteger.withDefault(defaultMapCenter.lat),
  lng: parseAsInteger.withDefault(defaultMapCenter.lng),
  cost_range: parseAsArrayOf(parseAsStringEnum(["$", "$$", "$$$", "$$$$"])),
  genres: parseAsArrayOf(parseAsString),
  kid_friendly: parseAsBoolean,
  searchDate: parseAsIsoDate,
};

export const loadMapPageSearchParams = createLoader(mapPageSearchParams);
