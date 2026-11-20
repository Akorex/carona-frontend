# Carona frontend

The web app for Carona, built with **React + Vite + TypeScript**. It follows the Carona design system and the Carona Screens canvas.

## Run it

1. Install the packages (once):

   ```bash
   npm install
   ```

2. Tell the app where the API lives. Copy `.env.example` to `.env` and set `VITE_API_URL`:

   ```
   VITE_API_URL=http://localhost:8000
   ```

   The address is never written in the code. Change `.env` to point at another computer or a deployed API, then restart the dev server.

3. Start it:

   ```bash
   npm run dev
   ```

   Open http://localhost:5173.

**The API must allow the browser in.** The frontend runs on a different port from the API, so FastAPI needs `CORSMiddleware` with the frontend's address in `allow_origins`. Without it, every request fails and the forms say "We couldn't reach Carona."

## The designs

The designs live in this repo, in `public/design/`, so nothing depends on claude.ai any more. With `npm run dev` running, open **http://localhost:5173/design** (or click the **Design** button at the bottom left of the app):

- **Screens**: all 21 laptop screens from the Carona Screens canvas. Click through them as in the canvas's Play mode. The bar at the bottom moves to the previous or next screen (← →), shows the canvas note for that screen (which endpoint it uses and what to handle) and switches light/dark. Press H to hide the bar.
- **Design system**: the brand book, the Building with Carona guide, colours, type, spacing, and every component with a live preview, its usage notes and its props.

```
public/design/
  index.html                  List of all screens, grouped like the canvas rows
  screens/*.dc.html           The canvas files, unchanged except for the <head>
  screens/canvas.json         The canvas index (positions, titles, notes)
  system/index.html           Design system page
  system/README.md            Brand book
  system/building-with-carona.md   How to build the app from the system
  system/tokens.json, tokens.css   Tokens (src/styles/tokens.css is a copy)
  system/components/          Reference components (bundle.js/.css), index.d.ts with every prop, one README + preview per component
  runtime/                    What renders the screens outside claude.ai: dc-lite.js, the viewer bar, React 18 and marked
```

To change a screen, edit its `.dc.html`. `{{name}}` values come from `renderVals()` in the `<script type="text/x-dc">` block at the bottom. The pages must be opened through the dev server; opening the files straight from disk won't work.

## What's built

| Route | Page | API |
| --- | --- | --- |
| `/` | Welcome | none. If a saved token still works (`GET /users/me`), it goes to `/find` |
| `/register` | Create account | `POST /users/register`, then signs in straight away |
| `/sign-in` | Sign in | `POST /users/login`, then `GET /users/me` |
| `/profile` | Profile | `GET /users/me` (already loaded at sign-in), `GET /vehicles/` for the vehicle count |
| `/profile/edit` | Edit profile | `PATCH /users/me` with only the changed fields (first name, last name, phone), then `GET /users/me` |
| `/find`, `/trips`, `/offer`, `/vehicles` | Placeholder with a Sign out button | none |

## Where things are

```
src/
  components/   Design-system components as TSX (same props as the design system's index.d.ts)
  pages/        One file per page
  lib/
    config.ts   Reads VITE_API_URL from .env
    api.ts      Every call to the API goes through here
    auth.tsx    Who is signed in; keeps the token in localStorage
    errors.ts   Turns API errors into friendly messages (the copy table from the brand book)
    format.ts   Naira, times, dates and seat counts
  styles/
    tokens.css      Colours, spacing and type from the design system. Don't edit by hand.
    components.css  Styles for the components
    global.css      Page-level styles
```

Rules from the design system: use tokens (`var(--brand)`, `var(--space-4)`), never raw hex codes or pixel values; never show the API's `detail` text as it is; never show `password`, `role` or ids.
