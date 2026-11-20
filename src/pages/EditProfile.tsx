import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Layout } from "../components/Layout";
import { Skeleton } from "../components/Skeleton";
import { TextField } from "../components/TextField";
import { ApiError, updateMe, type ProfileChanges, type User } from "../lib/api";
import { useAuth } from "../lib/auth";
import { NETWORK_ERROR, readError } from "../lib/errors";

type Fields = { first_name: string; last_name: string; phone_number: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

export default function EditProfile() {
  const { user, status } = useAuth();

  if (status === "signed-out") return <Navigate to="/sign-in" replace />;

  return (
    <Layout active="profile" width="form">
      <Link to="/profile" className="label back-link">
        <Icon name="arrow-left" size={16} />
        Profile
      </Link>
      <div className="page-intro">
        <h1 className="page-title">Edit your details</h1>
        <p className="body">
          Drivers and passengers see your name. Your phone number is only shared with people on the same trip.
        </p>
      </div>
      {/* Wait for GET /users/me so the form starts with the saved values. */}
      {user ? (
        <EditForm user={user} />
      ) : (
        <div className="auth-card">
          <Skeleton lines={4} />
        </div>
      )}
    </Layout>
  );
}

/** The same rules as UserProfileUpdate in the API. */
function validate(values: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (values.first_name.trim().length < 2) errors.first_name = "Enter at least 2 characters.";
  if (values.last_name.trim().length < 2) errors.last_name = "Enter at least 2 characters.";
  return errors;
}

/** Only the fields that differ from what's saved: PATCH should send nothing else. */
function changedFields(values: Fields, user: User): ProfileChanges {
  const changes: ProfileChanges = {};
  const first = values.first_name.trim();
  const last = values.last_name.trim();
  const phone = values.phone_number.trim();
  if (first !== user.first_name) changes.first_name = first;
  if (last !== user.last_name) changes.last_name = last;
  // An emptied field sends null, which removes the saved number.
  if (phone !== (user.phone_number ?? "")) changes.phone_number = phone || null;
  return changes;
}

function EditForm({ user }: { user: User }) {
  const navigate = useNavigate();
  const { token, signOut, refreshUser } = useAuth();
  const [values, setValues] = useState<Fields>({
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // The avatar and name at the top follow what's typed.
  const fullName = `${values.first_name.trim()} ${values.last_name.trim()}`.trim() || "Your name";

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

    const changes = changedFields(values, user);
    if (Object.keys(changes).length === 0) {
      // Nothing changed: no request needed.
      navigate("/profile");
      return;
    }

    setSaving(true);
    try {
      await updateMe(token!, changes);
      // Reload from GET /users/me so every page shows what the API saved.
      await refreshUser();
      navigate("/profile", { state: { saved: true } });
    } catch (err) {
      setSaving(false);
      if (!(err instanceof ApiError) || err.status === 0) return setFormError(NETWORK_ERROR);
      if (err.status === 401) {
        // The session ended while the form was open.
        signOut();
        navigate("/sign-in", { replace: true });
        return;
      }
      const detail = (err.body as { detail?: unknown } | null)?.detail;
      if (detail === "A user with this phonenumber already exists") {
        return setFieldErrors({ phone_number: "That phone number is already on another account." });
      }
      const { form, fields } = readError(err.status, err.body);
      setFieldErrors(fields);
      setFormError(form ?? null);
    }
  }

  return (
    <form className="auth-card" onSubmit={onSubmit} noValidate>
      {formError && <Alert title="Your changes weren't saved">{formError}</Alert>}

      <div className="edit-profile__preview">
        <Avatar name={fullName} size="lg" />
        <div className="edit-profile__preview-text">
          <span className="title-md">{fullName}</span>
          <span className="caption">Your initials update as you type.</span>
        </div>
      </div>

      <div className="field-row field-row--wide">
        <TextField
          id="first_name"
          label="First name"
          autoComplete="given-name"
          maxLength={100}
          value={values.first_name}
          onChange={set("first_name")}
          error={fieldErrors.first_name}
        />
        <TextField
          id="last_name"
          label="Last name"
          autoComplete="family-name"
          maxLength={100}
          value={values.last_name}
          onChange={set("last_name")}
          error={fieldErrors.last_name}
        />
      </div>
      <TextField
        id="phone_number"
        label="Phone number"
        type="tel"
        optional
        autoComplete="tel"
        placeholder="0803 123 4567"
        maxLength={15}
        value={values.phone_number}
        onChange={set("phone_number")}
        error={fieldErrors.phone_number}
      />

      <div className="form-actions">
        <Link to="/profile" className="cr-btn cr-btn--ghost cr-btn--md">
          Cancel
        </Link>
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
