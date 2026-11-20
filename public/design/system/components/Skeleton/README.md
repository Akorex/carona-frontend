Skeleton shows grey shapes in place of content while it loads, matching the layout that will replace them.

**Props the consumer provides:** `variant` (`card` for ride and vehicle lists, `text` for paragraphs) and `lines` for text.

**Do**
- Show Skeletons straight away for lists, and keep the app bar and tab bar visible.
- Swap to content, an EmptyState or an Alert as soon as the request settles.

**Don't**
- Don't use a full-screen spinner for lists. Use the Button's `loading` state for actions.
