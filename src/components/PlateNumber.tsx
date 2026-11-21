import { cx } from "./cx";

export interface PlateNumberProps {
  children: string;
  className?: string;
}

export function PlateNumber({ children, className }: PlateNumberProps) {
  return (
    <span className={cx("cr-plate", className)} aria-label={`Plate number ${children}`}>
      {String(children || "").toUpperCase()}
    </span>
  );
}
