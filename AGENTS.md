# Carona frontend: notes for whoever works on this next (person or AI)

Read this and `README.md` first. The README covers running the app, the routes and the folder layout; this file holds the background.

## What this is

Carona is a carpooling app for daily commuters in Lagos: drivers offer the empty seats on trips they already make, and passengers book them. This is the **React + Vite + TypeScript** web app. The FastAPI backend is the sibling folder `../carona`. Its `AGENTS.md` has the API status, open backend issues and the lesson pages.

It's a **teaching project**: the owner (Akorede) teaches a student to build the backend, and this frontend was built for them to use against it. Keep the code plain and readable.

## The designs are in this repo

Everything that used to live on claude.ai is in `public/design/`. With `npm run dev` running, open http://localhost:5173/design:

- **21 laptop screens** (`public/design/screens/*.dc.html`). They are the original canvas files, rendered by a small local runtime (`public/design/runtime/dc-lite.js`) and linked together so you can click through them. Each screen has a note saying which endpoint it uses and what to handle. Some notes are dated: `PATCH /users/me` and `PATCH /vehicles/{id}` work now.
- **The design system** (`public/design/system/`): `README.md` (brand book: principles, voice and copy table, colour, type, layout, states), `building-with-carona.md` (how to build the app from it), `tokens.json` / `tokens.css`, and reference components in `components/` with `index.d.ts` holding every prop.

Build new pages from those screens and that system. Don't redesign.

## Decisions (the owner's; don't change them without asking)

- **Laptop-first** web app: 1440px designs, 1120px content column, but every page must still work in a narrow window. TopNav at the top, not a bottom tab bar.
- **The API address is never hardcoded.** It comes from `VITE_API_URL` in `.env` (`src/lib/config.ts`). Every call goes through `src/lib/api.ts`.
- Components in `src/components/` are TSX rebuilds of the design-system components and **keep the same props** as `public/design/system/components/index.d.ts`.
- Use tokens (`var(--brand)`, `var(--space-4)`), never raw hex or pixel values. `src/styles/tokens.css` is a copy of the design system's tokens; don't edit it by hand.
- Never show the API's `detail` text as it is. `src/lib/errors.ts` rewrites it using the brand book's copy table. Never show `password`, `role` or ids.
- Login errors always show the same message, "Email or password is incorrect", so the page doesn't reveal who has an account.
- **Being a driver comes from owning a vehicle**, not from `role`. Offer a ride asks for a vehicle first.
- **Users can't change their email.** Edit profile covers first name, last name and phone (an empty phone sends `null`).
- Naira, fare per seat, cash at pickup, instant booking, Lagos sample data.

## Where things stand (20 Nov 2026)

Built: Welcome, Create account, Sign in, Profile, Edit profile, Offer a ride (`/offer`), Find a ride (`/find`), Search results (`/find/results`), Ride details (`/rides/:id`).

- The ride pages call `POST /rides/`, `GET /rides/` and `GET /rides/{id}`. The backend only has `POST /rides/` so far, and its router isn't registered in `main.py` yet, so these pages fail until the student finishes the "Rides, part 2" lesson.
- The booking button on Ride details says "Booking opens soon" until bookings exist in the API.
- `/trips` and `/vehicles` are placeholders (`ComingSoon`). Next to build: My vehicles, Add vehicle and Edit vehicle (the API for them works today), then My trips, Booking confirmed and the driver's ride page once bookings exist.
- The design-system components VehicleCard, PlateNumber and SeatStepper have styles in `components.css` but no TSX yet. Build them when the vehicles and booking pages need them.

## Before calling a page done

From the design system's checklist: tokens only; loading, empty, error and content states; looks right at 1280px wide, works at 360px and in dark mode; usable by keyboard with a visible focus ring; every input labelled, errors on the right field; copy in sentence case, buttons that name the outcome, ₦ with no decimals.
