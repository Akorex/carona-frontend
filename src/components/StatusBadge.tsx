import type { ReactNode } from "react";
import { cx } from "./cx";

/** Ride status values the API stores, plus booking and derived states. */
export type RideStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type BadgeStatus = RideStatus | "confirmed" | "full";
export type Tone = "info" | "success" | "warning" | "danger" | "neutral";

export interface StatusBadgeProps {
  status: BadgeStatus;
  /** Overrides the colour picked from status. */
  tone?: Tone;
  /** Overrides the label picked from status. */
  children?: ReactNode;
}

const STATUS: Record<BadgeStatus, [string, Tone]> = {
  scheduled: ["Scheduled", "info"],
  in_progress: ["On the road", "warning"],
  completed: ["Completed", "success"],
  cancelled: ["Cancelled", "danger"],
  confirmed: ["Booked", "success"],
  full: ["Full", "neutral"],
};

export function StatusBadge({ status, tone, children }: StatusBadgeProps) {
  const [label, defaultTone] = STATUS[status];
  return (
    <span className={cx("cr-badge", `cr-badge--${tone ?? defaultTone}`)}>
      <span className="cr-badge__dot" aria-hidden="true" />
      {children ?? label}
    </span>
  );
}
