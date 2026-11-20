import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Icon } from "../components/Icon";
import { Layout } from "../components/Layout";
import { RideCard } from "../components/RideCard";
import { Skeleton } from "../components/Skeleton";
import { TextField } from "../components/TextField";
import { ApiError, getMyVehicles, offerRide, type User, type Vehicle } from "../lib/api";
import { useAuth } from "../lib/auth";
import { NETWORK_ERROR, readError } from "../lib/errors";
import { lagosDate, lagosDateTime } from "../lib/format";
import { cx } from "../components/cx";

type Fields = { origin: string; destination: string; day: string; time: string; seats: string; fare: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

/** "loading" while GET /vehicles/ runs, "error" if it failed. */
type VehicleState = "loading" | "error" | Vehicle[];

export default function OfferRide() {
  const { user, token, status, signOut } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleState>("loading");
  const [attempt, setAttempt] = useState(0);

  // You can only offer a ride in a car you added, so load the vehicles first.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setVehicles("loading");
    getMyVehicles(token)
      .then((list) => !cancelled && setVehicles(list))
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          signOut();
          navigate("/sign-in", { replace: true });
          return;
        }
        setVehicles("error");
      });
    return () => {
      cancelled = true;
    };
  }, [token, attempt, signOut, navigate]);

  if (status === "signed-out") return <Navigate to="/sign-in" replace />;

  let body;
  if (vehicles === "loading" || !user) {
    body = (
      <div className="offer">
        <div className="offer__form">
          <Skeleton lines={5} />
        </div>
        <div className="offer__aside">
          <Skeleton variant="card" />
        </div>
      </div>
    );
  } else if (vehicles === "error") {
    body = (
      <Alert
        title="We couldn't load your vehicles"
        action={
          <Button variant="secondary" size="sm" onClick={() => setAttempt((n) => n + 1)}>
            Try again
          </Button>
        }
      >
        {NETWORK_ERROR}
      </Alert>
    );
  } else if (vehicles.length === 0) {
    body = (
      <div className="empty-panel">
        <EmptyState
          icon="steering"
          title="Add a vehicle to start driving"
          action={
            <Link to="/vehicles" className="cr-btn cr-btn--primary cr-btn--md">
              <Icon name="plus" />
              Add a vehicle
            </Link>
          }
        >
          Passengers need to know which car to look for. Add yours once and use it for every ride you offer.
        </EmptyState>
      </div>
    );
  } else {
    body = <OfferForm user={user} vehicles={vehicles} />;
  }

  return (
    <Layout active="offer">
      <div className="page-intro">
        <h1 className="page-title">Offer a ride</h1>
        <p className="body">Share the empty seats on a trip you're already making.</p>
      </div>
      {body}
    </Layout>
  );
}

/** The same rules as RideCreate in the API, checked before sending. */
function validate(values: Fields, vehicle: Vehicle): FieldErrors {
  const errors: FieldErrors = {};
  if (values.origin.trim().length < 2) errors.origin = "Enter where you're leaving from.";
  if (values.destination.trim().length < 2) errors.destination = "Enter where you're going.";
  if (!values.day) errors.day = "Pick a day.";
  if (!values.time) errors.time = "Pick a time.";
  if (values.day && values.time && new Date(lagosDateTime(values.day, values.time)).getTime() <= Date.now()) {
    errors.time = "Pick a time that hasn't passed yet.";
  }
  const seats = Number(values.seats);
  if (!Number.isInteger(seats) || seats < 1) errors.seats = "Offer at least 1 seat.";
  else if (seats > vehicle.capacity) errors.seats = `This car has ${vehicle.capacity} passenger seats.`;
  const fare = Number(values.fare);
  if (!values.fare || !Number.isFinite(fare) || fare <= 0) errors.fare = "Enter a fare, like 2500.";
  return errors;
}

/** A copy of the errors without one field's message. */
function without(errors: FieldErrors, name: keyof Fields): FieldErrors {
  const next = { ...errors };
  delete next[name];
  return next;
}

/** Which form field an API error message belongs to. */
const FIELD_FOR_DETAIL: Record<string, keyof Fields> = {
  "You can't offer more seats than your vehicle has": "seats",
  "Departure time must be in the future": "time",
};

function OfferForm({ user, vehicles }: { user: User; vehicles: Vehicle[] }) {
  const navigate = useNavigate();
  const { token, signOut } = useAuth();
  const [vehicleId, setVehicleId] = useState(vehicles[0].id);
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? vehicles[0];
  const [values, setValues] = useState<Fields>({
    origin: "",
    destination: "",
    day: lagosDate(1),
    time: "07:30",
    seats: String(Math.min(3, vehicles[0].capacity)),
    fare: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (name: keyof Fields) => (e: ChangeEvent<HTMLInputElement>) => {
    // Fare is money: keep digits only, so "2,500" becomes "2500".
    const value = name === "fare" ? e.target.value.replace(/[^0-9]/g, "") : e.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    setFieldErrors((errors) => without(errors, name));
  };

  function pickVehicle(v: Vehicle) {
    setVehicleId(v.id);
    // Keep the seats inside what the new car can hold.
    setValues((old) => ({ ...old, seats: String(Math.min(Number(old.seats) || 1, v.capacity)) }));
    setFieldErrors((errors) => without(errors, "seats"));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const errors = validate(values, vehicle);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const ride = await offerRide(token!, {
        vehicle_id: vehicle.id,
        origin: values.origin.trim(),
        destination: values.destination.trim(),
        departure_time: lagosDateTime(values.day, values.time),
        seats_offered: Number(values.seats),
        fare: Number(values.fare),
      });
      navigate(`/rides/${ride.id}`, { state: { offered: true } });
    } catch (err) {
      setSaving(false);
      if (!(err instanceof ApiError) || err.status === 0) return setFormError(NETWORK_ERROR);
      if (err.status === 401) {
        signOut();
        navigate("/sign-in", { replace: true });
        return;
      }
      const detail = (err.body as { detail?: unknown } | null)?.detail;
      const field = typeof detail === "string" ? FIELD_FOR_DETAIL[detail] : undefined;
      const { form, fields } = readError(err.status, err.body);
      if (field && form) return setFieldErrors({ [field]: form });
      // 422 field names from the API: seats_offered -> seats, departure_time -> time.
      const mapped: FieldErrors = {};
      for (const [key, message] of Object.entries(fields)) {
        const name = key === "seats_offered" ? "seats" : key === "departure_time" ? "time" : key;
        if (name in values) mapped[name as keyof Fields] = message;
      }
      setFieldErrors(mapped);
      setFormError(form ?? (Object.keys(mapped).length ? null : NETWORK_ERROR));
    }
  }

  // What passengers will see, built from what's typed so far.
  const preview = {
    id: "preview",
    origin: values.origin.trim() || "Starting point",
    destination: values.destination.trim() || "Destination",
    departure_time: values.day && values.time ? lagosDateTime(values.day, values.time) : lagosDateTime(lagosDate(1), "07:30"),
    arrival_time: null,
    fare: Number(values.fare) || 0,
    status: "scheduled" as const,
    seats_left: Math.max(1, Math.min(vehicle.capacity, Number(values.seats) || 1)),
    driver: { first_name: user.first_name, last_name: user.last_name },
    vehicle: { make: vehicle.make, model: vehicle.model, colour: vehicle.colour },
  };

  return (
    <div className="offer">
      <form className="offer__form" onSubmit={onSubmit} noValidate>
        {formError && <Alert title="Your ride wasn't offered">{formError}</Alert>}

        <fieldset className="offer__vehicles">
          <legend className="label">Vehicle</legend>
          <div className="vehicle-choices">
            {vehicles.map((v) => (
              <label key={v.id} className={cx("vehicle-choice", v.id === vehicle.id && "is-selected")}>
                <input
                  type="radio"
                  name="vehicle"
                  checked={v.id === vehicle.id}
                  onChange={() => pickVehicle(v)}
                />
                <span className="vehicle-choice__text">
                  <span className="body-strong">{`${v.colour} ${v.make} ${v.model}`}</span>
                  <span className="caption">{`${v.plate_number} · ${v.capacity} passenger seat${v.capacity === 1 ? "" : "s"}`}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field-row field-row--wide">
          <TextField id="origin" label="From" placeholder="Ikeja City Mall" maxLength={255}
            value={values.origin} onChange={set("origin")} error={fieldErrors.origin} />
          <TextField id="destination" label="To" placeholder="Victoria Island" maxLength={255}
            value={values.destination} onChange={set("destination")} error={fieldErrors.destination} />
          <TextField id="day" label="Day" type="date" min={lagosDate()}
            value={values.day} onChange={set("day")} error={fieldErrors.day} />
          <TextField id="time" label="Leaving at" type="time"
            value={values.time} onChange={set("time")} error={fieldErrors.time} />
          <TextField id="seats" label="Seats to offer" type="number" min={1} max={vehicle.capacity}
            hint={`Up to ${vehicle.capacity} in this car.`}
            value={values.seats} onChange={set("seats")} error={fieldErrors.seats} />
          <TextField id="fare" label="Fare per seat" prefix="₦" inputMode="numeric" placeholder="2500"
            value={values.fare} onChange={set("fare")} error={fieldErrors.fare} />
        </div>

        <div className="form-actions">
          <Button type="submit" loading={saving}>
            Offer ride
          </Button>
        </div>
      </form>

      <aside className="offer__aside" aria-label="Preview">
        <p className="label offer__aside-label">Passengers will see</p>
        <RideCard ride={preview} />
        <p className="caption offer__aside-label">Your plate number is only shown to people who book.</p>
      </aside>
    </div>
  );
}
