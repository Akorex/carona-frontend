import { time } from "../lib/format";
import { cx } from "./cx";

export interface RouteLineProps {
  origin: string;
  destination: string;
  /** ISO date-time. Leave out both times for the compact version. */
  departure?: string | null;
  arrival?: string | null;
}

// Built from spans so it can sit inside a button (RideCard).
export function RouteLine({ origin, destination, departure, arrival }: RouteLineProps) {
  const showTimes = Boolean(departure || arrival);

  const stop = (kind: "start" | "end", at: string | null | undefined, place: string) => (
    <span className="cr-route__stop">
      {showTimes && <span className="cr-route__time">{time(at)}</span>}
      <span className={`cr-route__marker cr-route__marker--${kind}`} aria-hidden="true" />
      <span className="cr-route__place">
        <span className="cr-sr">{kind === "start" ? "From " : "To "}</span>
        {place}
      </span>
    </span>
  );

  return (
    <span className={cx("cr-route", showTimes && "cr-route--timed")}>
      {stop("start", departure, origin)}
      <span className="cr-route__lane" aria-hidden="true">
        {showTimes && <span />}
        <span className="cr-route__dash" />
      </span>
      {stop("end", arrival, destination)}
    </span>
  );
}
