EmptyState fills a list that has nothing in it yet, says what will appear there and offers the first step.

**Props the consumer provides:** `icon`, `title`, `children` (one sentence) and an optional `action`, usually a primary Button.

**Examples**
- My vehicles: "No vehicles yet" / "Add the car you drive so you can offer rides in it." / Add a vehicle
- My trips: "No trips yet" / "Rides you book or offer will show up here." / Find a ride
- Search: "No rides match" / "Try a nearby place or another day." / Change search

**Don't**
- Don't use an EmptyState for an error. If the request failed, show an Alert with "Try again".
