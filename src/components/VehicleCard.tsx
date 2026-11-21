import { Button } from "./Button";
import { Icon } from "./Icon";
import { PlateNumber } from "./PlateNumber";
import { cx } from "./cx";

export interface VehicleCardData {
  id?: string;
  make: string;
  model: string;
  colour: string;
  capacity: number;
  plate_number: string;
}

export interface VehicleCardProps {
  vehicle: VehicleCardData;
  onEdit?: () => void;
  className?: string;
}

/* Paint colours for the swatch. These are content (car paint), not theme tokens. */
const PAINT: Record<string, string> = {
  silver: "#c3c7cb",
  grey: "#8b9095",
  gray: "#8b9095",
  black: "#1d1f21",
  white: "#f7f7f4",
  red: "#b3261e",
  wine: "#6d1f2b",
  maroon: "#6d1f2b",
  blue: "#2f5bb7",
  navy: "#1f2f5c",
  green: "#2e7d4f",
  yellow: "#e8c547",
  gold: "#c8a24a",
  brown: "#6b4a32",
  orange: "#e07a1f",
  beige: "#d9c7a5",
};

function paintFor(colour: string): string | null {
  const key = String(colour || "").trim().toLowerCase().split(/\s+/).pop() ?? "";
  return PAINT[key] ?? null;
}

export function VehicleCard({ vehicle, onEdit, className }: VehicleCardProps) {
  const paint = paintFor(vehicle.colour);
  const seats = Number(vehicle.capacity) || 0;

  return (
    <article className={cx("cr-vehicle", className)}>
      <span
        className={cx("cr-vehicle__swatch", !paint && "is-unknown")}
        style={paint ? { background: paint } : undefined}
        aria-hidden="true"
      >
        {paint ? null : <Icon name="car" size={20} />}
      </span>
      <div className="cr-vehicle__body">
        <h3 className="cr-vehicle__title">
          {vehicle.make} {vehicle.model}
        </h3>
        <p className="cr-vehicle__meta">
          {vehicle.colour} · {seats} {seats === 1 ? "passenger seat" : "passenger seats"}
        </p>
        <PlateNumber>{vehicle.plate_number}</PlateNumber>
      </div>
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          icon="pencil"
          onClick={onEdit}
          aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
        >
          Edit
        </Button>
      )}
    </article>
  );
}
