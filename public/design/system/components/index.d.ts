/** Carona components. Reference implementations in plain React; rebuild them as TSX in the app with these props as the contract. */
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";

export type IconName =
  | "search" | "car" | "user" | "ticket" | "steering" | "plus" | "minus" | "seat"
  | "chevron-right" | "arrow-left" | "alert" | "info" | "check" | "x" | "clock"
  | "pin" | "pencil" | "calendar" | "log-out";

/** Ride status values the API stores, plus booking and derived states. */
export type RideStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type BadgeStatus = RideStatus | "confirmed" | "full";
export type Tone = "info" | "success" | "warning" | "danger" | "neutral";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Default "primary". One primary per screen. */
  variant?: "primary" | "secondary" | "ghost" | "danger" | "danger-ghost";
  /** "md" is 48px tall, "sm" is 36px and only for use inside cards. */
  size?: "md" | "sm";
  /** Stretch to the container width. */
  block?: boolean;
  /** Shows a spinner and disables the button while a request runs. */
  loading?: boolean;
  icon?: IconName;
  children?: ReactNode;
}

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  /** Required: ties the label, hint and error to the input. */
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  /** Replaces the hint and marks the input invalid. */
  error?: ReactNode;
  /** Fixed text before the value, for example "₦". */
  prefix?: ReactNode;
  /** Adds "(optional)" after the label. */
  optional?: boolean;
}

export interface SeatStepperProps {
  value: number;
  onChange: (next: number) => void;
  /** Seats left on the ride. */
  max: number;
  /** Default 1. */
  min?: number;
  label?: ReactNode;
  id?: string;
}

export interface StatusBadgeProps {
  status: BadgeStatus;
  /** Overrides the colour picked from status. */
  tone?: Tone;
  /** Overrides the label picked from status. */
  children?: ReactNode;
}

export interface PlateNumberProps { children: string }

export interface AvatarProps {
  /** Full name; the initials are taken from the first and last word. */
  name: string;
  size?: "sm" | "md" | "lg";
}

export interface IconProps {
  name: IconName;
  /** Pixels, default 20. */
  size?: number;
  /** Set only when the icon carries meaning on its own. */
  label?: string;
}

export interface RouteLineProps {
  origin: string;
  destination: string;
  /** ISO date-time. Leave out both times for the compact version. */
  departure?: string | null;
  arrival?: string | null;
}

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
  vehicle?: { make: string; model: string; colour: string; plate_number: string };
}

export interface RideCardProps {
  ride: RideSummary;
  /** Makes the whole card a button that opens ride details. */
  onSelect?: () => void;
}

/** Matches a vehicle from GET /vehicles/. */
export interface Vehicle {
  id?: string;
  make: string;
  model: string;
  colour: string;
  capacity: number;
  plate_number: string;
}

export interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: () => void;
}

export interface AlertProps {
  /** Default "danger". */
  tone?: "danger" | "warning" | "info" | "success";
  title?: ReactNode;
  children?: ReactNode;
  /** Usually a small Button such as "Try again". */
  action?: ReactNode;
}

export interface EmptyStateProps {
  icon?: IconName;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}

export interface SkeletonProps {
  variant?: "text" | "card";
  /** Text variant only. Default 3. */
  lines?: number;
}

export interface AppBarProps {
  title: ReactNode;
  /** Shows a back button when set. */
  onBack?: () => void;
  backLabel?: string;
  /** One icon button with an aria-label. */
  action?: ReactNode;
}

export interface TopNavLink { id: string; label: string; href: string }

export interface TopNavProps {
  /** Signed-in user from GET /users/me. Leave out to show Sign in and Create account. */
  user?: { first_name: string; last_name: string } | null;
  /** The current page: "find", "trips", "offer" or "profile". */
  active?: string;
  /** Default: Find a ride (/find), My trips (/trips), Offer a ride (/offer). */
  links?: TopNavLink[];
  profileHref?: string;
  signInHref?: string;
  registerHref?: string;
  /** Where the name links when signed out. Default "/". */
  homeHref?: string;
  /** Called on every link click with its id ("home", "profile", "sign-in", "register" or a link id). Call event.preventDefault() to route in the app. */
  onNavigate?: (id: string, event: MouseEvent) => void;
}

export interface TabBarItem { id: string; label: string; icon: IconName }

export interface TabBarProps {
  active: string;
  onChange: (id: string) => void;
  /** Default: Find, Trips, Offer, Profile. */
  items?: TabBarItem[];
}

export declare function Button(props: ButtonProps): JSX.Element;
export declare function TextField(props: TextFieldProps): JSX.Element;
export declare function SeatStepper(props: SeatStepperProps): JSX.Element;
export declare function StatusBadge(props: StatusBadgeProps): JSX.Element;
export declare function PlateNumber(props: PlateNumberProps): JSX.Element;
export declare function Avatar(props: AvatarProps): JSX.Element;
export declare function Icon(props: IconProps): JSX.Element;
export declare function RouteLine(props: RouteLineProps): JSX.Element;
export declare function RideCard(props: RideCardProps): JSX.Element;
export declare function VehicleCard(props: VehicleCardProps): JSX.Element;
export declare function Alert(props: AlertProps): JSX.Element;
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
export declare function Skeleton(props: SkeletonProps): JSX.Element;
export declare function TopNav(props: TopNavProps): JSX.Element;
export declare function AppBar(props: AppBarProps): JSX.Element;
export declare function TabBar(props: TabBarProps): JSX.Element;

/** Formatting helpers used by the components. */
export declare const format: {
  /** 2500 -> "₦2,500" */
  naira(amount: number): string;
  /** ISO -> "7:30 AM" */
  time(iso: string): string;
  /** ISO -> "Tue 12 Nov" */
  day(iso: string): string;
  /** 1 -> "1 seat left", 0 -> "Full" */
  seats(n: number): string;
  initials(name: string): string;
};
