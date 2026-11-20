import {
  ArrowLeft, Armchair, Calendar, Car, Check, ChevronRight, CircleAlert, CircleDot, Clock, Info,
  LogOut, MapPin, Minus, Pencil, Plus, Search, Ticket, User, X, type LucideIcon,
} from "lucide-react";

export type IconName =
  | "search" | "car" | "user" | "ticket" | "steering" | "plus" | "minus" | "seat"
  | "chevron-right" | "arrow-left" | "alert" | "info" | "check" | "x" | "clock"
  | "pin" | "pencil" | "calendar" | "log-out";

// The design system names its icons by idea; these are the Lucide icons that match.
const ICONS: Record<IconName, LucideIcon> = {
  search: Search,
  car: Car,
  user: User,
  ticket: Ticket,
  steering: CircleDot, // Lucide has no steering wheel yet.
  plus: Plus,
  minus: Minus,
  seat: Armchair,
  "chevron-right": ChevronRight,
  "arrow-left": ArrowLeft,
  alert: CircleAlert,
  info: Info,
  check: Check,
  x: X,
  clock: Clock,
  pin: MapPin,
  pencil: Pencil,
  calendar: Calendar,
  "log-out": LogOut,
};

export interface IconProps {
  name: IconName;
  /** Pixels, default 20. */
  size?: number;
  /** Set only when the icon carries meaning on its own. */
  label?: string;
  className?: string;
}

export function Icon({ name, size = 20, label, className }: IconProps) {
  const Svg = ICONS[name];
  return (
    <Svg
      className={["cr-icon", className].filter(Boolean).join(" ")}
      size={size}
      strokeWidth={2}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    />
  );
}
