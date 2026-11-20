import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import { TextField } from "../components/TextField";
import { ApiError, register } from "../lib/api";
import { useAuth } from "../lib/auth";
import { NETWORK_ERROR, readError } from "../lib/errors";

type Fields = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
};

const EMPTY: Fields = { first_name: "", last_name: "", email: "", phone_number: "", password: "" };

/** The same rules as UserCreate in the API, checked before we send anything. */
function validate(values: Fields): Partial<Record<keyof Fields, string>> {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (values.first_name.trim().length < 2) errors.first_name = "Enter at least 2 characters.";
  if (values.last_name.trim().length < 2) errors.last_name = "Enter at least 2 characters.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "Enter an email address like name@mail.ng.";
  if (values.password.length < 6) errors.password = "Use at least 6 characters.";
  return errors;
}

export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [values, setValues] = useState<Fields>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<"email-taken" | string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (name: keyof Fields) => (e: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    // Clear a field's error as soon as the person starts fixing it.
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

    const email = values.email.trim();
    setSubmitting(true);
    try {
      await register({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email,
        phone_number: values.phone_number.trim() || null,
        password: values.password,
      });
    } catch (err) {
      setSubmitting(false);
      if (!(err instanceof ApiError) || err.status === 0) return setFormError(NETWORK_ERROR);

      const detail = (err.body as { detail?: unknown } | null)?.detail;
      if (detail === "A user with this email already exists") return setFormError("email-taken");
      if (detail === "A user with this phonenumber already exists") {
        return setFieldErrors({ phone_number: "That phone number is already on another account." });
      }
      const { form, fields } = readError(err.status, err.body);
      setFieldErrors(fields);
      setFormError(form ?? null);
      return;
    }

    // The account exists now. Sign in straight away so nobody types the same details twice.
    try {
      await signIn({ email, password: values.password });
      navigate("/find", { replace: true });
    } catch {
      navigate("/sign-in", { replace: true, state: { email, justRegistered: true } });
    }
  }

  return (
    <Layout width="auth" className="auth-main">
      <div className="page-intro">
        <h1 className="page-title">Create your account</h1>
        <p className="body">One account lets you book seats and, once you add a car, offer rides.</p>
      </div>

      <form className="auth-card" onSubmit={onSubmit} noValidate>
        {formError === "email-taken" ? (
          <Alert title="That email already has an account">
            <Link to="/sign-in" state={{ email: values.email.trim() }} className="cr-link-strong">
              Sign in instead
            </Link>
            , or use a different email.
          </Alert>
        ) : formError ? (
          <Alert title="Something went wrong">{formError}</Alert>
        ) : null}

        <div className="field-row">
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
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={set("email")}
          error={fieldErrors.email}
        />
        <TextField
          id="phone_number"
          label="Phone number"
          type="tel"
          optional
          autoComplete="tel"
          placeholder="0803 123 4567"
          maxLength={15}
          hint="Drivers use it to reach you at pickup."
          value={values.phone_number}
          onChange={set("phone_number")}
          error={fieldErrors.phone_number}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          maxLength={100}
          hint="At least 6 characters."
          value={values.password}
          onChange={set("password")}
          error={fieldErrors.password}
        />
        <Button type="submit" block loading={submitting}>
          Create account
        </Button>
      </form>

      <p className="body auth-switch">
        Already have an account?{" "}
        <Link to="/sign-in" className="cr-link-strong">
          Sign in
        </Link>
      </p>
    </Layout>
  );
}
