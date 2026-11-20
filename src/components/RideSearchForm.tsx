import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { RideSearch } from "../lib/api";
import { lagosDate } from "../lib/format";
import { resultsUrl, saveRecentSearch } from "../lib/recentSearches";
import { Button } from "./Button";
import { TextField } from "./TextField";
import { cx } from "./cx";

export interface RideSearchFormProps {
  initial?: RideSearch;
  /** "primary" on Find a ride, "secondary" above results. */
  variant?: "primary" | "secondary";
  className?: string;
}

/** From, To, Day and a search button. Submitting opens the results page. */
export function RideSearchForm({ initial, variant = "primary", className }: RideSearchFormProps) {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState(initial?.origin ?? "");
  const [destination, setDestination] = useState(initial?.destination ?? "");
  const [day, setDay] = useState(initial?.day ?? lagosDate());

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const search = { origin: origin.trim(), destination: destination.trim(), day };
    if (search.origin || search.destination) saveRecentSearch({ origin: search.origin, destination: search.destination });
    navigate(resultsUrl(search));
  }

  return (
    <form className={cx("search-form", variant === "primary" && "search-form--hero", className)} onSubmit={onSubmit} role="search">
      <TextField id="search-origin" label="From" placeholder="Ikeja City Mall" value={origin} onChange={(e) => setOrigin(e.target.value)} />
      <TextField id="search-destination" label="To" placeholder="Victoria Island" value={destination} onChange={(e) => setDestination(e.target.value)} />
      <TextField id="search-day" label="Day" type="date" min={lagosDate()} value={day} onChange={(e) => setDay(e.target.value)}
        hint={day ? undefined : "Any day"} />
      <Button type="submit" variant={variant} icon="search" block>
        {variant === "primary" ? "Search rides" : "Update search"}
      </Button>
    </form>
  );
}
