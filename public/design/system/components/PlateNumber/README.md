PlateNumber shows a vehicle's plate in monospace capitals so passengers can match it at the roadside.

**Props the consumer provides:** `children`, the `plate_number` string. It is uppercased for display.

**Do**
- Show it on every confirmed booking, next to the car's colour and model.
- Show the plate exactly as the driver entered it, apart from case.

**Don't**
- Don't show it in search results. Passengers only need it after they book.
