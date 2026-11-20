// Where the API lives comes from .env (VITE_API_URL), never from the code.
// That way the same build can talk to a laptop, another computer or a server.

const raw = import.meta.env.VITE_API_URL;

if (!raw) {
  throw new Error(
    "VITE_API_URL is not set. Copy .env.example to .env, set the API address, then restart `npm run dev`.",
  );
}

/** Base URL of the Carona API, without a trailing slash. */
export const API_URL = raw.replace(/\/+$/, "");
