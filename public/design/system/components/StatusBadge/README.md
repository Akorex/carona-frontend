StatusBadge shows the state of a ride or booking as a coloured label with a word.

**Props the consumer provides:** `status`, one of the API values. Optional `children` to override the label, `tone` to override the colour.

| API status | Label | Tone |
| --- | --- | --- |
| ride `scheduled` | Scheduled | info |
| ride `in_progress` | On the road | warning |
| ride `completed` | Completed | success |
| ride `cancelled` | Cancelled | danger |
| booking `confirmed` | Booked | success |
| seats left is 0 | Full | neutral |

**Do**
- Show it where state changes what someone can do: My trips, ride details, the driver dashboard.
- Hide it on scheduled rides in search results. Every result is scheduled, so the badge adds noise.

**Don't**
- Don't rely on the colour alone. The word is required.
- Don't invent labels in a screen. Add the state to this table first.
