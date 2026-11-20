RideCard summarises one ride: day, departure time, route, fare per seat, driver, car and seats left.

**Props the consumer provides:** `ride` and, for tappable cards, `onSelect`. With `onSelect` the whole card is one button that opens ride details.

The `ride` object needs these fields:

| Field | From the API | Notes |
| --- | --- | --- |
| `origin`, `destination`, `departure_time`, `arrival_time`, `fare`, `status` | Ride table | Exists today |
| `seats_left` | Not yet | Calculate on the server: seats offered minus booked seats |
| `driver.first_name`, `driver.last_name` | Not yet | Embed in the ride response so the list needs one request |
| `vehicle.make`, `model`, `colour`, `plate_number` | Not yet | Embed in the ride response |

**States:** scheduled rides show seats left (amber at 1, "Full" badge at 0). Other states show their StatusBadge. A cancelled ride is greyed and not tappable.

**Do**
- Sort search results by departure time.
- Show three to five cards as Skeleton while results load.

**Don't**
- Don't put buttons inside a tappable card. Booking happens on ride details.
- Don't show the plate number here. It belongs to a confirmed booking.
