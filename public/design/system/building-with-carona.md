# Building with Carona

A guide for whoever turns this system into the real app. It assumes React with Vite and TypeScript.

## 1. Load the fonts

Put this in `index.html`, inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap">
```

## 2. Use tokens, never raw values

Every token is a CSS variable with the token's name:

```css
.trip-summary {
  background: var(--surface-raised);
  color: var(--ink);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  font-family: var(--font-sans);
}
```

If you find yourself typing a hex code or a pixel value that isn't 1px, stop and find the token. If no token fits, that's a conversation about the design system, not something to fix in a single component.

**Dark mode.** The light values sit on `:root`. The dark values switch on with `data-theme="dark"` on `<html>`. To follow the computer's setting:

```ts
const media = window.matchMedia("(prefers-color-scheme: dark)");
const apply = () => document.documentElement.dataset.theme = media.matches ? "dark" : "light";
apply();
media.addEventListener("change", apply);
```

## 3. Rebuild the components, keep the props

The components in this system are reference versions in plain React. In the app, rewrite each one as a `.tsx` file in `src/components/`, keeping the props from `index.d.ts`. That way the pages on the Carona Screens canvas match what you build.

Start in this order. Each step unlocks pages you can build against the API as it is today:

1. Button, TextField, Alert: Create account and Sign in.
2. TopNav, Avatar and a `Layout` component: the frame every page sits in, and Profile.
3. VehicleCard, PlateNumber, EmptyState, Skeleton: My vehicles and Add vehicle.
4. StatusBadge, RouteLine, RideCard, SeatStepper: once the rides API exists.

AppBar and TabBar are for a phone layout later. Skip them for now.

## 3a. One layout for every page

Every page sits in the same frame, so build it once:

```tsx
export function Layout({ active, children }: { active?: string; children: React.ReactNode }) {
  const { user } = useAuth(); // from GET /users/me, or null when signed out
  const navigate = useNavigate();
  return (
    <div className="cr-page">
      <TopNav user={user} active={active}
        onNavigate={(id, e) => { e.preventDefault(); navigate((e.currentTarget as HTMLAnchorElement).getAttribute("href")!); }} />
      <main className="cr-page__main">{children}</main>
    </div>
  );
}
```

Inside `main`, pick one of the four layouts from the brand book: a `cr-grid` of cards, a `cr-split` with a side panel, a narrow form column (`cr-page__main--form`), or the sign-in card (`cr-page__main--auth`). Routes: `/` Welcome, `/register`, `/sign-in`, `/find`, `/rides/:id`, `/trips`, `/offer`, `/profile`, `/vehicles`, `/vehicles/new`, `/vehicles/:id/edit`.

## 4. Which API fields feed which component

| Component | Field | Endpoint |
| --- | --- | --- |
| Avatar, Profile header | `first_name`, `last_name`, `email`, `phone_number` | `GET /users/me` |
| VehicleCard | `make`, `model`, `colour`, `capacity`, `plate_number` | `GET /vehicles/` |
| RideCard, RouteLine | `origin`, `destination`, `departure_time`, `arrival_time`, `fare`, `status` | `GET /rides` (planned) |
| RideCard | `seats_left`, `driver`, `vehicle` | Not in any endpoint yet |
| SeatStepper | `seats_left` as `max` | `GET /rides/{id}` (planned) |
| StatusBadge | `status` | rides and bookings |

Never show `password`, `role` or `deleted_at`, even though the user endpoints currently return them.

## 5. Format values in one place

```ts
export const naira = (n: number) =>
  "₦" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const time = (iso: string) => {
  const d = new Date(iso);
  const h = d.getHours() % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`;
};

export const seatsLeft = (n: number) => (n <= 0 ? "Full" : `${n} seat${n === 1 ? "" : "s"} left`);
```

## 6. Turn API errors into UI

The API returns errors in two shapes. One helper turns both into something a form can show:

```ts
type FormErrors = { form?: string; fields: Record<string, string> };

export function readError(status: number, body: any): FormErrors {
  if (status === 422 && Array.isArray(body?.detail)) {
    const fields: Record<string, string> = {};
    for (const e of body.detail) {
      const field = e.loc?.[e.loc.length - 1];
      if (field && !fields[field]) fields[field] = friendly(e.type, e.msg);
    }
    return { fields };
  }
  if (typeof body?.detail === "string") return { form: rewrite(body.detail), fields: {} };
  return { form: "We couldn't reach Carona. Check your connection and try again.", fields: {} };
}
```

`rewrite` looks the message up in the copy table in the brand book. `friendly` turns Pydantic error types into short sentences, for example `string_too_short` into "Enter at least 2 characters." Field errors go to `TextField error`. `form` goes into an `Alert` above the form. A 401 anywhere except Sign in clears the token and goes to Sign in.

## 7. Before you call a screen done

- [ ] It uses only tokens: no hex codes, no stray pixel values.
- [ ] It has loading, empty, error and content states.
- [ ] It looks right at 1280px wide, still works in a 360px window, and looks right in dark mode.
- [ ] You can reach and use everything with a keyboard, and the focus ring shows.
- [ ] Every input has a label, and errors show on the right field.
- [ ] The copy follows the voice rules: sentence case, buttons that name the outcome, ₦ with no decimals.
