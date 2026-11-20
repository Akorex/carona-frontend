import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { TopNav } from "./TopNav";
import { cx } from "./cx";

export interface LayoutProps {
  /** Which TopNav link is the current page. */
  active?: string;
  /** "auth" for Sign in and Create account (480px card), "form" for 640px forms. */
  width?: "auth" | "form";
  /** Extra classes on <main>. */
  className?: string;
  children: ReactNode;
}

/** The frame every page sits in: TopNav, then one centred content column. */
export function Layout({ active, width, className, children }: LayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="cr-page">
      <TopNav
        user={user}
        active={active}
        onNavigate={(_id, e) => {
          // Let people open links in a new tab with Ctrl/Cmd/middle click.
          if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          navigate(e.currentTarget.getAttribute("href")!);
        }}
      />
      <main className={cx("cr-page__main", width && `cr-page__main--${width}`, className)}>{children}</main>
    </div>
  );
}
