// Turn API errors into something a form can show.
// Never show the API's `detail` text as it is: rewrite it in the person's terms.

export type FormErrors = {
  /** Shown in an Alert above the form. */
  form?: string;
  /** Shown under the matching field, keyed by the API field name. */
  fields: Record<string, string>;
};

export const NETWORK_ERROR = "We couldn't reach Carona. Check your connection and try again.";
export const BAD_CREDENTIALS = "Email or password is incorrect";

/** The copy table from the design system's brand book. */
const REWRITES: Record<string, string> = {
  "A user with this email already exists": "That email already has an account. Sign in instead.",
  "A user with this phonenumber already exists": "That phone number is already on another account.",
  "This account does not exist. Please register": BAD_CREDENTIALS,
  "Incorrect password": BAD_CREDENTIALS,
  "Vehicle already exists": "A vehicle with this plate number is already registered.",
  "You can only update your own vehicle": "You can only edit vehicles you added.",
  "Token has expired. Pleasse log in again": "Your session ended. Sign in again to continue.",
  "Vehicle not found": "We couldn't find that vehicle. Refresh the page and pick it again.",
  "You can only offer rides in your own vehicle": "You can only offer rides in a vehicle you added.",
  "You can't offer more seats than your vehicle has": "That's more seats than this car has.",
  "Departure time must be in the future": "Pick a time that hasn't passed yet.",
  "Ride not found": "This ride doesn't exist or was removed.",
};

export function rewrite(detail: string): string {
  return REWRITES[detail] ?? NETWORK_ERROR;
}

type PydanticError = { type?: string; msg?: string; loc?: (string | number)[]; ctx?: Record<string, unknown> };

/** Pydantic error types -> short sentences. */
function friendly(e: PydanticError): string {
  switch (e.type) {
    case "string_too_short": {
      const min = Number(e.ctx?.min_length ?? 2);
      return `Enter at least ${min} characters.`;
    }
    case "string_too_long": {
      const max = Number(e.ctx?.max_length ?? 100);
      return `Use ${max} characters or fewer.`;
    }
    case "missing":
      return "This is required.";
    case "value_error":
      // EmailStr reports bad emails as value_error.
      return "Enter an email address like name@mail.ng.";
    default:
      return "Check this field.";
  }
}

/** Read an error response (status + parsed JSON body) into form errors. */
export function readError(status: number, body: unknown): FormErrors {
  const detail = (body as { detail?: unknown } | null)?.detail;

  if (status === 422 && Array.isArray(detail)) {
    const fields: Record<string, string> = {};
    for (const e of detail as PydanticError[]) {
      const field = e.loc?.[e.loc.length - 1];
      if (typeof field === "string" && !fields[field]) fields[field] = friendly(e);
    }
    return { fields };
  }

  if (typeof detail === "string") return { form: rewrite(detail), fields: {} };

  return { form: NETWORK_ERROR, fields: {} };
}
