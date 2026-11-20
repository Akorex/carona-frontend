Button starts an action; its label says what will happen ("Book 2 seats", "Save vehicle").

**Variants**
- `primary`: the one main action on a screen. `brand` fill with `on-brand` text.
- `secondary`: a supporting action next to a primary, such as "Add vehicle" in a list header.
- `ghost`: low-emphasis actions inside cards ("Edit") and "Skip for now".
- `danger`: confirms something destructive inside a confirmation sheet ("Cancel ride").
- `danger-ghost`: opens that confirmation. Never let one tap destroy something.

**Props the consumer provides:** `children` (the label), `onClick`, optional `variant`, `size` (`md` 48px, `sm` 36px), `icon` (an Icon name), `block` for full width, `loading` while a request is in flight, `type="submit"` inside forms.

**Do**
- Put the primary button at the bottom of the screen, `block`, inside the thumb zone.
- Set `loading` from the moment the request starts until it settles. It also disables the button, which stops double bookings.
- Keep labels to a verb and its object, in sentence case.

**Don't**
- Don't put two primary buttons on one screen.
- Don't disable a submit button to show a form is invalid. Let people press it and show the field errors.
- Don't use a small button outside a card: it is below `tap-min`.
