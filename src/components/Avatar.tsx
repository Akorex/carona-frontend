import { initials } from "../lib/format";
import { cx } from "./cx";

export interface AvatarProps {
  /** Full name; the initials are taken from the first and last word. */
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <span className={cx("cr-avatar", `cr-avatar--${size}`, className)} role="img" aria-label={name}>
      {initials(name)}
    </span>
  );
}
