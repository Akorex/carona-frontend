import { day, naira, seats } from "../lib/format";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { RouteLine } from "./RouteLine";
import { StatusBadge, type RideStatus } from "./StatusBadge";
import { cx } from "./cx";

/** The shape RideCard expects. Fields marked "not yet" need backend work. */
export interface RideSummary {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time?: string | null;
  /** Per seat, in naira. */
  fare: number;
  status: RideStatus;
  /** Not yet in the API. */
  seats_left?: number;
  /** Not yet in the API: embed in the ride response. */
  driver?: { first_name: string; last_name: string };
  /** Not yet in the API: embed in the ride response. */
  vehicle?: { make: string; model: string; colour: string; plate_number?: string };
}

export interface RideCardProps {
  ride: RideSummary;
  /** Makes the whole card a button that opens ride details. */
  onSelect?: () => void;
}

export function RideCard({ ride, onSelect }: RideCardProps) {
  const { driver, vehicle, status } = ride;
  const seatsLeft = typeof ride.seats_left === "number" ? ride.seats_left : null;
  const badge =
    status !== "scheduled" ? <StatusBadge status={status} /> : seatsLeft === 0 ? <StatusBadge status="full" /> : null;

  const content = (
    <>
      <span className="cr-ride__top">
        <span className="cr-ride__day">{day(ride.departure_time)}</span>
        {badge}
      </span>
      <span className="cr-ride__main">
        <RouteLine
          origin={ride.origin}
          destination={ride.destination}
          departure={ride.departure_time}
          arrival={ride.arrival_time}
        />
        <span className="cr-ride__fare">
          <span className="cr-ride__amount">{naira(ride.fare)}</span>
          <span className="cr-ride__unit">per seat</span>
        </span>
      </span>
      <span className="cr-ride__foot">
        {driver && <Avatar name={`${driver.first_name} ${driver.last_name}`} size="sm" />}
        <span className="cr-ride__who">
          <span className="cr-ride__driver">{driver ? `${driver.first_name} ${driver.last_name.charAt(0)}.` : ""}</span>
          {vehicle && <span className="cr-ride__car">{`${vehicle.colour} ${vehicle.make} ${vehicle.model}`}</span>}
        </span>
        {seatsLeft !== null && status === "scheduled" && (
          <span className={cx("cr-ride__seats", seatsLeft === 1 && "is-low")}>
            <Icon name="seat" size={16} />
            {seats(seatsLeft)}
          </span>
        )}
      </span>
    </>
  );

  const className = cx("cr-ride", onSelect && "cr-ride--action", status === "cancelled" && "is-muted");
  return onSelect ? (
    <button type="button" className={className} onClick={onSelect}>
      {content}
    </button>
  ) : (
    <article className={className}>{content}</article>
  );
}
