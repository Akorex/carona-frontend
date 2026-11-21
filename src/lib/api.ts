// Every call to the Carona API goes through here.
import { API_URL } from "./config";

/** The shape every Carona endpoint answers with. */
type Envelope<T> = { success: boolean; message: string; data: T };

/** A user as the app uses it. The API also sends password, role and ids: never show those. */
export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  /** ISO date-time the account was made, for "Member since". */
  created_at: string;
};

/** A vehicle from GET /vehicles/. */
export type Vehicle = {
  id: string;
  make: string;
  model: string;
  colour: string;
  capacity: number;
  plate_number: string;
};

export type RegisterInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  password: string;
};

export type LoginInput = { email: string; password: string };

/** Thrown for any response that isn't 2xx. `status` is 0 when the API couldn't be reached. */
export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`Request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, options: RequestInit & { token?: string | null } = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    // Network down, wrong VITE_API_URL, or the API refused the browser (CORS).
    throw new ApiError(0, null);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, body);
  return body as T;
}

/** Keep only the fields the app is allowed to use. */
function pickUser(raw: User): User {
  return {
    id: raw.id,
    first_name: raw.first_name,
    last_name: raw.last_name,
    email: raw.email,
    phone_number: raw.phone_number ?? null,
    created_at: raw.created_at,
  };
}

/** POST /users/register */
export async function register(input: RegisterInput): Promise<User> {
  const res = await request<Envelope<User>>("/users/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return pickUser(res.data);
}

/** POST /users/login -> the access token. */
export async function login(input: LoginInput): Promise<string> {
  const res = await request<Envelope<{ access_token: string; token_type: string }>>("/users/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.data.access_token;
}

/** GET /users/me */
export async function getMe(token: string): Promise<User> {
  const res = await request<Envelope<User>>("/users/me", { token });
  return pickUser(res.data);
}

/** The fields a person may change about themselves. Email can't be changed. */
export type ProfileChanges = Partial<Pick<User, "first_name" | "last_name">> & {
  /** null removes the saved phone number. */
  phone_number?: string | null;
};

/** PATCH /users/me -> send only the fields that changed. */
export async function updateMe(token: string, changes: ProfileChanges): Promise<User> {
  const res = await request<Envelope<User>>("/users/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(changes),
  });
  return pickUser(res.data);
}

/** A ride from /rides/. The API leaves out the driver's email, phone and the plate number. */
export type Ride = {
  id: string;
  origin: string;
  destination: string;
  /** ISO date-time with timezone. */
  departure_time: string;
  arrival_time: string | null;
  /** Per seat, in naira. */
  fare: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  seats_offered: number;
  /** Equal to seats_offered until bookings exist. */
  seats_left: number;
  driver: { id: string; first_name: string; last_name: string };
  vehicle: { make: string; model: string; colour: string; capacity: number };
};

export type OfferRideInput = {
  vehicle_id: string;
  origin: string;
  destination: string;
  /** Must include the timezone, e.g. 2026-11-20T07:30:00+01:00 */
  departure_time: string;
  seats_offered: number;
  fare: number;
};

export type RideSearch = {
  origin?: string;
  destination?: string;
  /** YYYY-MM-DD, in Lagos time. */
  day?: string;
};

/** POST /rides/ -> the new ride. */
export async function offerRide(token: string, input: OfferRideInput): Promise<Ride> {
  const res = await request<Envelope<Ride>>("/rides/", { method: "POST", token, body: JSON.stringify(input) });
  return res.data;
}

/** GET /rides/?origin=&destination=&day= -> upcoming scheduled rides, earliest first. */
export async function searchRides(search: RideSearch): Promise<Ride[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (value && value.trim()) params.set(key, value.trim());
  }
  const query = params.toString();
  const res = await request<Envelope<Ride[]>>(`/rides/${query ? `?${query}` : ""}`);
  return res.data;
}

/** GET /rides/{id} */
export async function getRide(id: string): Promise<Ride> {
  const res = await request<Envelope<Ride>>(`/rides/${encodeURIComponent(id)}`);
  return res.data;
}

/** GET /vehicles/ -> only the signed-in user's vehicles. Keep the trailing slash: without it FastAPI redirects. */
export async function getMyVehicles(token: string): Promise<Vehicle[]> {
  const res = await request<Envelope<Vehicle[]>>("/vehicles/", { token });
  return res.data;
}

export type VehicleInput = {
  make: string;
  model: string;
  colour: string;
  capacity: number;
  plate_number: string;
};

export type VehicleChanges = Partial<VehicleInput>;

/** POST /vehicles/ -> the newly registered vehicle. */
export async function createVehicle(token: string, input: VehicleInput): Promise<Vehicle> {
  const res = await request<Envelope<Vehicle>>("/vehicles/", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
  return res.data;
}

/** GET /vehicles/{id} */
export async function getVehicle(id: string, token?: string | null): Promise<Vehicle> {
  const res = await request<Envelope<Vehicle>>(`/vehicles/${encodeURIComponent(id)}`, { token });
  return res.data;
}

/** PATCH /vehicles/{id} -> send only the fields that changed. */
export async function updateVehicle(token: string, id: string, changes: VehicleChanges): Promise<Vehicle> {
  const res = await request<Envelope<Vehicle>>(`/vehicles/${encodeURIComponent(id)}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(changes),
  });
  return res.data;
}
