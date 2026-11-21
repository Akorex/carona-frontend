import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Icon } from "../components/Icon";
import { Layout } from "../components/Layout";
import { PlateNumber } from "../components/PlateNumber";
import { Skeleton } from "../components/Skeleton";
import { TextField } from "../components/TextField";
import { ApiError, getVehicle, updateVehicle, type Vehicle, type VehicleChanges } from "../lib/api";
import { useAuth } from "../lib/auth";
import { NETWORK_ERROR, readError } from "../lib/errors";

type VehicleState = "loading" | "error" | "not-found" | Vehicle;
type Fields = {
  make: string;
  model: string;
  colour: string;
  capacity: string;
  plate_number: string;
};
type FieldErrors = Partial<Record<keyof Fields, string>>;

function validate(values: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (values.make.trim().length < 2) errors.make = "Enter at least 2 characters.";
  if (values.model.trim().length < 2) errors.model = "Enter at least 2 characters.";
  if (values.colour.trim().length < 2) errors.colour = "Enter at least 2 characters.";
  const cap = Number(values.capacity);
  if (!Number.isInteger(cap) || cap < 1 || cap > 8) {
    errors.capacity = "Enter a number from 1 to 8.";
  }
  if (values.plate_number.trim().length < 2) errors.plate_number = "Enter at least 2 characters.";
  return errors;
}

function changedFields(values: Fields, vehicle: Vehicle): VehicleChanges {
  const changes: VehicleChanges = {};
  const make = values.make.trim();
  const model = values.model.trim();
  const colour = values.colour.trim();
  const capacity = Number(values.capacity);
  const plate = values.plate_number.trim().toUpperCase();

  if (make !== vehicle.make) changes.make = make;
  if (model !== vehicle.model) changes.model = model;
  if (colour !== vehicle.colour) changes.colour = colour;
  if (capacity !== vehicle.capacity) changes.capacity = capacity;
  if (plate !== vehicle.plate_number.trim().toUpperCase()) changes.plate_number = plate;
  return changes;
}

export default function EditVehicle() {
  const { id = "" } = useParams();
  const { token, status, signOut } = useAuth();
  const navigate = useNavigate();
  const nav = useLocation().state as { vehicle?: Vehicle } | null;
  const preloaded = nav?.vehicle && nav.vehicle.id === id ? nav.vehicle : null;

  const [vehicle, setVehicle] = useState<VehicleState>(preloaded ?? "loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!token) return;
    if (preloaded && attempt === 0) return;
    let cancelled = false;
    setVehicle("loading");
    getVehicle(id, token)
      .then((v) => {
        if (!cancelled) setVehicle(v);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          signOut();
          navigate("/sign-in", { replace: true });
          return;
        }
        const missing = err instanceof ApiError && (err.status === 404 || err.status === 422);
        setVehicle(missing ? "not-found" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, token, attempt, preloaded, signOut, navigate]);

  if (status === "signed-out") return <Navigate to="/sign-in" replace />;

  if (vehicle === "loading") {
    return (
      <Layout active="profile" width="form">
        <Link to="/vehicles" className="label back-link">
          <Icon name="arrow-left" size={16} />
          My vehicles
        </Link>
        <div className="auth-card">
          <Skeleton lines={4} />
        </div>
      </Layout>
    );
  }

  if (vehicle === "not-found" || vehicle === "error") {
    return (
      <Layout active="profile" width="form">
        <Link to="/vehicles" className="label back-link">
          <Icon name="arrow-left" size={16} />
          My vehicles
        </Link>
        {vehicle === "not-found" ? (
          <div className="empty-panel">
            <EmptyState icon="car" title="This vehicle isn't available">
              It may have been removed. Head back to My vehicles to pick another one.
            </EmptyState>
          </div>
        ) : (
          <Alert
            title="We couldn't load this vehicle"
            action={
              <Button variant="secondary" size="sm" onClick={() => setAttempt((n) => n + 1)}>
                Try again
              </Button>
            }
          >
            {NETWORK_ERROR}
          </Alert>
        )}
      </Layout>
    );
  }

  return (
    <Layout active="profile" width="form">
      <Link to="/vehicles" className="label back-link">
        <Icon name="arrow-left" size={16} />
        My vehicles
      </Link>
      <div className="edit-vehicle__head">
        <h1 className="page-title">
          {vehicle.make} {vehicle.model}
        </h1>
        <PlateNumber>{vehicle.plate_number}</PlateNumber>
      </div>
      <EditForm key={vehicle.id} vehicle={vehicle} />
    </Layout>
  );
}

function EditForm({ vehicle }: { vehicle: Vehicle }) {
  const navigate = useNavigate();
  const { token, signOut } = useAuth();
  const [values, setValues] = useState<Fields>({
    make: vehicle.make,
    model: vehicle.model,
    colour: vehicle.colour,
    capacity: String(vehicle.capacity),
    plate_number: vehicle.plate_number,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (name: keyof Fields) => (e: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setFieldErrors((errors) => {
      const next = { ...errors };
      delete next[name];
      return next;
    });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const changes = changedFields(values, vehicle);
    if (Object.keys(changes).length === 0) {
      navigate("/vehicles");
      return;
    }

    setSaving(true);
    try {
      await updateVehicle(token!, vehicle.id, changes);
      navigate("/vehicles", { state: { updated: true } });
    } catch (err) {
      setSaving(false);
      if (!(err instanceof ApiError) || err.status === 0) return setFormError(NETWORK_ERROR);
      if (err.status === 401) {
        signOut();
        navigate("/sign-in", { replace: true });
        return;
      }
      const detail = (err.body as { detail?: unknown } | null)?.detail;
      if (detail === "Vehicle already exists") {
        return setFieldErrors({ plate_number: "A vehicle with this plate number is already registered." });
      }
      const { form, fields } = readError(err.status, err.body);
      setFieldErrors(fields);
      setFormError(form ?? null);
    }
  }

  return (
    <form className="auth-card" onSubmit={onSubmit} aria-busy={saving || undefined} noValidate>
      {formError && <Alert title="Your changes weren't saved">{formError}</Alert>}

      <div className="field-row field-row--wide">
        <TextField
          id="make"
          label="Make"
          maxLength={100}
          disabled={saving}
          value={values.make}
          onChange={set("make")}
          hint={values.make.trim() !== vehicle.make ? `Changed from ${vehicle.make}` : undefined}
          error={fieldErrors.make}
        />
        <TextField
          id="model"
          label="Model"
          maxLength={100}
          disabled={saving}
          value={values.model}
          onChange={set("model")}
          hint={values.model.trim() !== vehicle.model ? `Changed from ${vehicle.model}` : undefined}
          error={fieldErrors.model}
        />
        <TextField
          id="colour"
          label="Colour"
          maxLength={100}
          disabled={saving}
          value={values.colour}
          onChange={set("colour")}
          hint={values.colour.trim() !== vehicle.colour ? `Changed from ${vehicle.colour}` : undefined}
          error={fieldErrors.colour}
        />
        <TextField
          id="capacity"
          label="Passenger seats"
          type="number"
          inputMode="numeric"
          min={1}
          max={8}
          disabled={saving}
          value={values.capacity}
          onChange={set("capacity")}
          hint={
            values.capacity.trim() !== String(vehicle.capacity)
              ? `Changed from ${vehicle.capacity}`
              : "Not counting yours. 1 to 8."
          }
          error={fieldErrors.capacity}
        />
      </div>

      <TextField
        id="plate_number"
        label="Plate number"
        autoCapitalize="characters"
        maxLength={100}
        disabled={saving}
        value={values.plate_number}
        onChange={set("plate_number")}
        hint={
          values.plate_number.trim().toUpperCase() !== vehicle.plate_number.trim().toUpperCase()
            ? `Changed from ${vehicle.plate_number}`
            : undefined
        }
        error={fieldErrors.plate_number}
      />

      <div className="form-actions">
        <Link to="/vehicles" className="cr-btn cr-btn--ghost cr-btn--md">
          Cancel
        </Link>
        <Button type="submit" loading={saving}>
          {saving ? "Saving" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
