VehicleCard shows one of the user's vehicles with a paint swatch, make and model, colour, seats and plate.

**Props the consumer provides:** `vehicle` (the object from `GET /vehicles/`) and optional `onEdit`.

The swatch reads the free-text `colour` field and matches common names (silver, black, white, grey, red, blue, green and so on). Anything it doesn't know, such as "Champagne", gets a neutral swatch with a car icon.

**Do**
- Show "passenger seats" with the capacity, so drivers know the number excludes them.
- Put a secondary "Add vehicle" button above the list, and an EmptyState when there are none.

**Don't**
- Don't let people delete from the card. Removal goes in the edit screen with a confirmation.
