import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./cx";

type AlertTone = "danger" | "warning" | "info" | "success";

export interface AlertProps {
  /** Default "danger". */
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Usually a small Button such as "Try again". */
  action?: ReactNode;
  className?: string;
}

const ICON_FOR: Record<AlertTone, IconName> = { danger: "alert", warning: "alert", info: "info", success: "check" };

export function Alert({ tone = "danger", title, children, action, className }: AlertProps) {
  return (
    <div className={cx("cr-alert", `cr-alert--${tone}`, className)} role={tone === "danger" ? "alert" : "status"}>
      <Icon name={ICON_FOR[tone]} size={20} />
      <div className="cr-alert__body">
        {title && <p className="cr-alert__title">{title}</p>}
        {children && <div className="cr-alert__text">{children}</div>}
      </div>
      {action}
    </div>
  );
}
