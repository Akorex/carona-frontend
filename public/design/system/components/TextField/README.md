TextField is a labelled single-line input with room for a hint or an error under it.

**Props the consumer provides:** a unique `id`, `label`, and the usual input props (`type`, `value`, `onChange`, `autoComplete`, `inputMode`). Optional `hint`, `error`, `prefix` (for example `₦`) and `optional` to add "(optional)" to the label.

**Validation rules mirror the API** so people see problems before the request:

| Field | Rule in the API | Message |
| --- | --- | --- |
| First and last name | 2 to 100 characters | "Enter at least 2 characters." |
| Email | valid email, unique | "Enter an email like name@example.com." |
| Password | 6 to 100 characters | "Use at least 6 characters." |
| Phone number | optional, up to 15 characters, unique | "Phone numbers are at most 15 digits." |
| Make, model, colour, plate | 2 to 100 characters | "Enter at least 2 characters." |

**Do**
- Validate when the field loses focus, and again on submit.
- Map 422 errors from the API onto the field named in `loc` (see Building with Carona).
- Use `type="email"`, `type="tel"`, `inputMode="numeric"` so phones show the right keyboard.

**Don't**
- Don't use placeholder text as the label. It disappears as soon as someone types.
- Don't show both a hint and an error. The error replaces the hint.
