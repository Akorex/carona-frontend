TabBar is a bottom navigation bar for a future phone layout; the web app uses TopNav instead.

Carona is built first as a web app for laptops, where TopNav carries navigation. Keep TabBar for the day the app gets a phone-first layout or a native shell, and don't use it on laptop pages.

**Props the consumer provides:** `active` (the current tab id), `onChange(id)`, and optional `items` (`{id, label, icon}`) if the set changes.

**Do**
- If you use it, mirror TopNav's areas: Find, Trips, Offer and Profile.
- Add the bottom safe-area inset under it on phones with a home indicator.

**Don't**
- Don't show TopNav and TabBar on the same page.
- Don't add a fifth tab. Vehicles live under Profile; ride history lives under Trips.
