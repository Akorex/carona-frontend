Alert is an inline message inside a screen: errors from the API, warnings and confirmations.

**Props the consumer provides:** `tone` (`danger`, `warning`, `info`, `success`), an optional `title`, `children` for the detail, and an optional `action` element such as a "Try again" Button.

**Do**
- Put form-level errors (for example a wrong password) at the top of the form, above the first field.
- Write the title as what happened and the body as what to do.
- Use `danger` for things that stopped the task, `warning` for things that will stop it soon.

**Don't**
- Don't show the API's `detail` text as it is. Rewrite it (see the copy table in the brand book).
- Don't use an Alert for field errors. Those go on the TextField.
