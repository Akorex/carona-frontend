import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export interface EmptyStateProps {
  icon: IconName;
  title: ReactNode;
  /** One or two sentences: what's missing and what to do about it. */
  children?: ReactNode;
  /** Usually one Button or a link styled as one. */
  action?: ReactNode;
}

export function EmptyState({ icon, title, children, action }: EmptyStateProps) {
  return (
    <div className="cr-empty">
      <span className="cr-empty__icon" aria-hidden="true">
        <Icon name={icon} size={28} />
      </span>
      <h2 className="cr-empty__title">{title}</h2>
      {children && <p className="cr-empty__text">{children}</p>}
      {action}
    </div>
  );
}
