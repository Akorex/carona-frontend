import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./cx";

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

export function Button({
  variant = "primary",
  size = "md",
  block,
  loading,
  icon,
  children,
  className,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={cx("cr-btn", `cr-btn--${variant}`, `cr-btn--${size}`, block && "cr-btn--block", loading && "is-loading", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <span className="cr-spinner" aria-hidden="true" />
      ) : icon ? (
        <Icon name={icon} size={size === "sm" ? 16 : 20} />
      ) : null}
      {children != null && <span className="cr-btn__label">{children}</span>}
    </button>
  );
}
