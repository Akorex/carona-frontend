import type { MouseEvent } from "react";
import { Avatar } from "./Avatar";
import { cx } from "./cx";

export interface TopNavLink {
  id: string;
  label: string;
  href: string;
}

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
  onNavigate?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void;
}

const DEFAULT_LINKS: TopNavLink[] = [
  { id: "find", label: "Find a ride", href: "/find" },
  { id: "trips", label: "My trips", href: "/trips" },
  { id: "offer", label: "Offer a ride", href: "/offer" },
];

export function TopNav({
  user,
  active,
  links = DEFAULT_LINKS,
  profileHref = "/profile",
  signInHref = "/sign-in",
  registerHref = "/register",
  homeHref = "/",
  onNavigate,
}: TopNavProps) {
  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => onNavigate?.(id, e);
  const profileOn = active === "profile";

  return (
    <header className="cr-topnav">
      <div className="cr-topnav__inner">
        <a className="cr-topnav__brand" href={user ? links[0].href : homeHref} onClick={go("home")}>
          <span className="cr-topnav__mark" aria-hidden="true">
            <span className="cr-topnav__ring" />
            <span className="cr-topnav__dash" />
            <span className="cr-topnav__dash" />
            <span className="cr-topnav__dot" />
          </span>
          <span>Carona</span>
        </a>

        {user ? (
          <>
            <nav className="cr-topnav__links" aria-label="Main">
              {links.map((l) => {
                const on = l.id === active;
                return (
                  <a
                    key={l.id}
                    href={l.href}
                    className={cx("cr-topnav__link", on && "is-active")}
                    aria-current={on ? "page" : undefined}
                    onClick={go(l.id)}
                  >
                    {l.label}
                  </a>
                );
              })}
            </nav>
            <a
              className={cx("cr-topnav__me", profileOn && "is-active")}
              href={profileHref}
              aria-current={profileOn ? "page" : undefined}
              onClick={go("profile")}
            >
              <Avatar name={`${user.first_name} ${user.last_name}`.trim()} size="sm" />
              <span>{user.first_name}</span>
            </a>
          </>
        ) : (
          <div className="cr-topnav__auth">
            <a className="cr-btn cr-btn--ghost cr-btn--md" href={signInHref} onClick={go("sign-in")}>
              Sign in
            </a>
            <a className="cr-btn cr-btn--primary cr-btn--md" href={registerHref} onClick={go("register")}>
              Create account
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
