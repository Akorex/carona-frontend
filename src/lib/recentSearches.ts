// The last few ride searches, kept in this browser only (no API for it).
import type { RideSearch } from "./api";

const RECENT_KEY = "carona.recent-searches";

/** The last three searches, newest first. */
export function readRecentSearches(): RideSearch[] {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(list) ? list.slice(0, 3) : [];
  } catch {
    return [];
  }
}

/** Put a search first; the same route searched again moves to the top instead of repeating. */
export function saveRecentSearch(search: RideSearch) {
  const same = (a: RideSearch) =>
    (a.origin ?? "").toLowerCase() === (search.origin ?? "").toLowerCase() &&
    (a.destination ?? "").toLowerCase() === (search.destination ?? "").toLowerCase();
  const list = [search, ...readRecentSearches().filter((s) => !same(s))].slice(0, 3);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Storage blocked: recent searches just won't show.
  }
}

/** /find/results?origin=..&destination=..&day=.. */
export function resultsUrl(search: RideSearch): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) if (value) params.set(key, value);
  return `/find/results?${params.toString()}`;
}
