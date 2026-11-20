RouteLine draws a trip from origin to destination: a hollow green start, an amber dashed lane, a filled green end.

**Props the consumer provides:** `origin`, `destination` (strings from the ride), and optional `departure` and `arrival` ISO times. Leave out both times for a compact version.

**Do**
- Use it everywhere a trip appears: ride cards, ride details, the booking summary, the Offer a ride review step.
- Let long place names wrap. Don't truncate them.

**Don't**
- Don't use the amber lane colour anywhere else on the same card.
- Don't show an arrival time the driver didn't enter. `arrival_time` is optional in the API.
