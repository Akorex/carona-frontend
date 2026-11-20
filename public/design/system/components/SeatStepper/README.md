SeatStepper chooses how many seats to book, between 1 and the seats left on the ride.

**Props the consumer provides:** `value`, `onChange(next)`, `max` (the ride's seats left), optional `min` (default 1), `label` and `id`.

**Do**
- Set `max` from the latest `seats_left`. If a booking fails because seats ran out, refresh the ride and lower `max`.
- Update the primary button label with the count: "Book 2 seats", fare total beside it.

**Don't**
- Don't use it when seats left is 0. Show the Full badge and hide the booking action.
