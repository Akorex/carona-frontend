Carona is a carpooling web app for daily commuters in Lagos. Drivers offer the empty seats on trips they already make, and passengers book them. It is designed first for a laptop browser, and every page also works in a narrow, phone-width window. Every ride page answers three questions fast: when, where and how much.

## Principles

1. **Time, place, price first.** On any ride surface, the departure time (`time`), the route (RouteLine) and the fare (`fare`) are the largest things after the page title.
2. **Make the car easy to find.** Passengers meet a stranger's car at the roadside. Once a booking is confirmed, show the car's colour, make and model and its PlateNumber together.
3. **One main action per page.** One `primary` Button per page: at the end of a form (right-aligned, with Cancel as `ghost` to its left), or at the bottom of the side panel on a detail page.
4. **Say what happened and what to do next.** Every error names the cause and the fix.
5. **Comfortable on a laptop, usable anywhere.** Click and tap targets are at least `tap-min` (48px), no text is smaller than `caption` (12px), text contrast is at least 4.5:1 in both themes, and layouts reflow to one column in a narrow window.

## Voice and copy

- Plain, warm and short. Speak to the person as "you". The app doesn't say "I" or "we" unless it is apologising for its own failure.
- Sentence case everywhere, buttons and titles included: "Offer a ride", not "Offer A Ride" or "OFFER RIDE".
- Buttons name the outcome: "Book 2 seats", "Save vehicle", "Cancel booking". Avoid "Submit", "OK" and "Continue" when a specific verb exists.
- Money: the naira sign, no decimals, commas for thousands: **₦2,500**. Fares are labelled "per seat".
- Times: 12-hour with AM or PM: **7:30 AM**. Dates: **Tue 12 Nov**. Use "Today" and "Tomorrow" when they apply.
- Seats: "1 seat left", "3 seats left", "Full".
- Places are written the way people say them: "Ikeja City Mall", "Lekki Phase 1".
- No emoji in the interface.

**Never show the API's `detail` text as it is.** Rewrite it in the person's terms:

| The API says | The app says |
| --- | --- |
| A user with this email already exists | That email already has an account. Sign in instead. |
| A user with this phonenumber already exists | That phone number is already on another account. |
| This account does not exist. Please register | Email or password is incorrect. |
| Incorrect password | Email or password is incorrect. |
| Vehicle already exists | A vehicle with this plate number is already registered. |
| You can only update your own vehicle | You can only edit vehicles you added. |
| Token has expired. Pleasse log in again | Your session ended. Sign in again to continue. |
| 422 `string_too_short` | Enter at least 2 characters. |
| Network failure or 500 | We couldn't reach Carona. Check your connection and try again. |

## Colour

The palette comes from the road: **lane green** for the brand, **road-marking amber** for highlights, and asphalt-tinted neutrals.

- `surface` is the page. `surface-raised` holds cards, side panels, dialogs and the top navigation. `surface-sunken` is for wells inside a card: the seat stepper, skeletons, icon discs.
- `ink` is for text and icons. `ink-muted` is for labels, meta lines and hints. Both read on all three surfaces.
- `brand` is for primary buttons, the current page in the top navigation, route markers and links. Put `on-brand` text on a brand fill. `brand-soft` is for selected rows, avatars and secondary buttons.
- `marking` (amber) appears **once per screen at most**: the dashed lane in RouteLine, or a banner for an active trip. It is never text. Put `on-marking` on it. For amber text, such as "1 seat left", use `marking-ink`.
- Status tones `info`, `success`, `warning` and `danger` each have a `-soft` background. A status always comes with a word, never colour alone.
- `line` is for hairline dividers and card borders. `line-strong` is for the borders of inputs and controls, and holds 3:1.
- `focus` is the keyboard focus ring: 2px solid with a 2px offset, on everything you can tap.

**Ride and booking states**

| State | Badge | Tone |
| --- | --- | --- |
| Ride `scheduled` | Scheduled | `info` |
| Ride `in_progress` | On the road | `warning` |
| Ride `completed` | Completed | `success` |
| Ride `cancelled` | Cancelled | `danger` |
| Booking `confirmed` | Booked | `success` |
| No seats left | Full | neutral (`surface-sunken`, `ink-muted`) |

## Type

Three families, each with one job:

- **Bricolage Grotesque** (`display`) sets page titles, card titles and the big numbers: times and fares. Its narrow, slightly quirky shapes give the brand its voice.
- **Figtree** (`sans`) sets everything else. It is open and easy to read at small sizes.
- **JetBrains Mono** (`mono`) is for plate numbers only.

| Style | Use |
| --- | --- |
| `display-lg` 56/60 | The Welcome headline only |
| `display` 48/52 | The Find a ride headline |
| `page-title` 32/38 | The h1 of every other page |
| `title-lg` 24/30 | Large section headings, such as "4 rides on Thu 12 Nov" |
| `title-md` 18/24 | Card titles and section headings |
| `body-lg` 17/26 | Intro and empty-state text |
| `body` 15/22 | Default text, input values, place names |
| `body-strong` 15/22 | Names, emphasis |
| `label` 13/18 | Field labels, badges, back links |
| `caption` 12/16 | Units ("per seat") and meta lines |
| `time`, `fare` 20/24 | Departure times and prices, with tabular figures |
| `plate` 13/16 | Plate numbers |

In a window narrower than 640px, `display-lg` steps down to 40/44 and `display` to 32/38. Inputs use 16px text so phones don't zoom in when a field is focused. Anything that lines up in a column (times, fares, seat counts) uses `font-variant-numeric: tabular-nums`.

## Page layout

Every page has the same frame: TopNav across the top, then one centred content column on `surface`.

- **The column** is `content-max` (1120px) wide with a `space-8` gutter, `space-10` below the navigation and `space-16` at the bottom. The bundle's `cr-page__main` class sets this up.
- **Inner pages** start with a back link in `label` style that names where it goes ("My vehicles", "Back to results"), then the h1 in `page-title`, then a one-line description in `body`, `ink-muted`.
- **Page actions** that belong to the whole page (Add vehicle, Start trip) sit on the title row, right-aligned, and wrap under the title when space runs out.

Four layouts cover every page:

| Layout | Used for | How |
| --- | --- | --- |
| Grid | Search results, My trips, My vehicles | `cr-grid`: cards at least 340px wide (420px for ride cards), `space-4` apart |
| Split | Ride details, Offer a ride, Profile, Driver's ride | `cr-split`: main content plus a side panel of about `aside-w` (340px); the panel holds the page's main action |
| Form | Add or edit vehicle, Booking confirmed | `cr-page__main--form`: a `form-max` (640px) column, the form in a `surface-raised` card with `space-8` padding; fields sit two to a row where they're short |
| Sign in | Sign in, Create account | `cr-page__main--auth`: an `auth-max` (480px) card, title above it, the switch link below it |

**Narrow windows.** Below 640px the gutter drops to `space-4`, grids and splits fall to one column (the side panel goes under the main content), and TopNav wraps its links onto a second line. Nothing scrolls sideways.

Base unit is 4px. Inside cards: `space-4` padding, `space-3` between rows. Form fields sit `space-5` apart, page sections `space-6` to `space-10`.

**Phone layout, later.** AppBar and TabBar stay in the system for a phone-first layout or native app. They aren't used on the web pages.

## Shape and elevation

- `radius-sm` for badges and plates, `radius-md` for buttons, inputs and alerts, `radius-lg` for cards, panels and dialogs, `radius-pill` for avatars and the seat stepper.
- Cards are `surface-raised` with a 1px `line` border. Only cards you can click get `shadow-card`, so a shadow tells people "this opens something". The booking panel on Ride details also gets it, as the page's focal point.
- Empty states sit in a `surface-raised` box with a dashed `line-strong` border, so they read as a space waiting to be filled.
- Dialogs use `shadow-sheet` and dim the page with `scrim`.

## Motion

- `duration-fast` (120ms) for hovers, presses and colour changes, `duration-base` (200ms) for dialogs and alerts, both with `ease-standard`.
- Nothing moves just to look lively. With `prefers-reduced-motion`, spinners and skeletons stop moving and transitions are switched off.

## Page states

Every page that loads data is designed in four states:

1. **Loading:** Skeleton shapes in the final layout. TopNav, the back link and the page title stay put.
2. **Empty:** an EmptyState that says what will appear and offers the first step.
3. **Error:** an Alert with "Try again". Keep anything that already loaded.
4. **Content.**

Forms: the submit Button shows `loading` while the request runs. Field errors from the API (422) appear on their fields. Other errors appear as an Alert above the form.

## Iconography

- The Icon component holds the set drawn for Carona: 24px grid, 2px stroke, round caps and joins, `currentColor`, never filled.
- In the real app, use **Lucide** (`lucide-react`), which has the same style. The Icon guide lists the matching names. These icons are stand-ins drawn to match Lucide, not a custom icon family.
- An icon next to text is hidden from screen readers. An icon-only button needs an `aria-label`.

## Logo

Carona has no logo yet. Until it does, set the name "Carona" in Bricolage Grotesque 700 in `brand`. TopNav puts a small route motif before it (a `brand` ring, two `marking` dashes, a `brand` dot), built from the RouteLine shapes. That motif is the only mark: don't draw another.

## Accessibility

- Text holds at least 4.5:1 on its surface in both themes. Borders, icons and the focus ring hold 3:1.
- Every input has a visible label. Errors are linked to their input with `aria-describedby` and announced.
- Statuses carry a word as well as a colour.
- Click and tap targets are at least 48 by 48px. A small button inside a card gets extra hit area around it.
- Links that move between pages are real `<a href>` links, so they open in a new tab and work with the keyboard. TopNav marks the current page with `aria-current="page"`.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
