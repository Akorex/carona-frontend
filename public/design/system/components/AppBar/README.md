AppBar is a compact title bar with a back button for a future phone layout; laptop pages use TopNav plus a back link instead.

On laptop pages, put the page title (`page-title`) in the content and, on inner pages, a small back link above it that names where it goes: "My vehicles", "Back to results", "My trips".

**Props the consumer provides:** `title`, `onBack` on screens below a main area, and `action`, an icon button with an `aria-label`.

**Do**
- Keep titles short: "My vehicles", "Ride details", "Offer a ride".
- Make the back button return to where the person came from, not always to Home.

**Don't**
- Don't use it on laptop pages.
- Don't put more than one action in it. Extra actions go on the page itself.
