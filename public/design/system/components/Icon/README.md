Icon draws one of the system's line icons at 24px with a 2px stroke in the current text colour.

**Props the consumer provides:** `name` (see the preview), optional `size` (default 20) and `label`. Without a label the icon is hidden from screen readers, which is right when text sits next to it.

**Do**
- Give an icon-only button an `aria-label` on the button, such as "Add vehicle".
- When building the real app, use the Lucide icon with the same idea: `search` is Search, `car` is Car, `ticket` is Ticket, `seat` is Armchair, `pin` is MapPin. For `steering`, CarFront is the closest match.

**Don't**
- Don't fill icons or mix stroke widths.
- Don't use emoji as icons.
