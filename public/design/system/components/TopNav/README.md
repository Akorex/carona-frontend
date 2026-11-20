TopNav is the header across the top of every page: the Carona name, the three main areas, and the signed-in person's avatar linking to Profile.

**Props the consumer provides:** `user` (`first_name`, `last_name` from `GET /users/me`), `active` (`find`, `trips`, `offer` or `profile`), and `onNavigate(id, event)` to route inside the app. Without `user` it shows Sign in and Create account instead of the links. `links`, `profileHref`, `signInHref`, `registerHref` and `homeHref` override the default paths.

**Where things live**

| Link | Page | Holds |
| --- | --- | --- |
| Find a ride | `/find` | Search, results, ride details, booking |
| My trips | `/trips` | Rides you booked and rides you drive, upcoming and past |
| Offer a ride | `/offer` | Offer form; asks for a vehicle first if you have none |
| Avatar and first name | `/profile` | Contact details, My vehicles, Sign out |

**Do**
- Render it once, in the app's layout component, so every page gets the same header.
- Set `active` from the current route. Detail pages count as their area: Ride details is `find`, the driver's ride page is `trips`, My vehicles is `profile`.
- With React Router, call `event.preventDefault()` in `onNavigate` and `navigate(href)` yourself, or swap the `<a>` for `<Link>` when you rebuild it.

**Don't**
- Don't add a fourth link. Vehicles live under Profile; ride history lives under My trips.
- Don't hide Offer a ride from people without a car. The Offer page asks them to add one.
- Don't make the header sticky with a fixed height. It wraps onto two lines in a narrow window.
