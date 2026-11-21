import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Layout } from "../components/Layout";
import { TextField } from "../components/TextField";
import { ApiError, createVehicle } from "../lib/api";
import { useAuth } from "../lib/auth";
import { NETWORK_ERROR, readError } from "../lib/errors";

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

export default function AddVehicle() {
  const { token, status, signOut } = useAuth();
  const navigate = useNavigate();
  const nav = useLocation().state as { from?: string } | null;
  const fromOffer = nav?.from === "/offer";
  const backTo = fromOffer ? "/offer" : "/vehicles";

  const [values, setValues] = useState<Fields>({
    make: "",
    model: "",
    colour: "",
    capacity: "4",
    plate_number: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (status === "signed-out") return <Navigate to="/sign-in" replace />;

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

    setSaving(true);
    try {
      await createVehicle(token!, {
        make: values.make.trim(),
        model: values.model.trim(),
        colour: values.colour.trim(),
        capacity: Number(values.capacity),
        plate_number: values.plate_number.trim().toUpperCase(),
      });
      if (fromOffer) {
        navigate("/offer");
      } else {
        navigate("/vehicles", { state: { added: true } });
      }
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
    <Layout active={fromOffer ? "offer" : "profile"} width="form">
      <Link to={backTo} className="label back-link">
        <Icon name="arrow-left" size={16} />
        {fromOffer ? "Offer a ride" : "My vehicles"}
      </Link>

      <div className="page-intro">
        <h1 className="page-title">Add a vehicle</h1>
        <p className="body">Passengers use these details to find your car at pickup.</p>
      </div>

      <form className="auth-card" onSubmit={onSubmit} aria-busy={saving || undefined} noValidate>
        {formError && <Alert title="Your vehicle wasn't saved">{formError}</Alert>}

        <div className="field-row field-row--wide">
          <TextField
            id="make"
            label="Make"
            placeholder="Toyota"
            maxLength={100}
            disabled={saving}
            value={values.make}
            onChange={set("make")}
            error={fieldErrors.make}
          />
          <TextField
            id="model"
            label="Model"
            placeholder="Corolla"
            maxLength={100}
            disabled={saving}
            value={values.model}
            onChange={set("model")}
            error={fieldErrors.model}
          />
          <TextField
            id="colour"
            label="Colour"
            placeholder="Silver"
            maxLength={100}
            disabled={saving}
            value={values.colour}
            onChange={set("colour")}
            error={fieldErrors.colour}
          />
          <TextField
            id="capacity"
            label="Passenger seats"
            type="number"
            inputMode="numeric"
            min={1}
            max={8}
            hint="Not counting yours. 1 to 8."
            disabled={saving}
            value={values.capacity}
            onChange={set("capacity")}
            error={fieldErrors.capacity}
          />
        </div>

        <TextField
          id="plate_number"
          label="Plate number"
          placeholder="LND 482 KJ"
          autoCapitalize="characters"
          maxLength={100}
          disabled={saving}
          value={values.plate_number}
          onChange={set("plate_number")}
          error={fieldErrors.plate_number}
        />

        <div className="form-actions">
          <Link to={backTo} className="cr-btn cr-btn--ghost cr-btn--md">
            Cancel
          </Link>
          <Button type="submit" loading={saving}>
            {saving ? "Saving" : "Save vehicle"}
          </Button>
        </div>
      </form>
    </Layout>
  );
}
