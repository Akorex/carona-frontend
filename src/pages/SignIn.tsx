import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import { TextField } from "../components/TextField";
import { ApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { BAD_CREDENTIALS, NETWORK_ERROR } from "../lib/errors";

/** What other pages can pass when they send someone here. */
type IncomingState = { email?: string; justRegistered?: boolean } | null;

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = location.state as IncomingState;
  const { signIn } = useAuth();

  const [email, setEmail] = useState(incoming?.email ?? "");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<"credentials" | "network" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const errors: typeof fieldErrors = {};
    if (!email.trim()) errors.email = "Enter your email.";
    if (!password) errors.password = "Enter your password.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
      navigate("/find", { replace: true });
    } catch (err) {
      setSubmitting(false);
      // "Account does not exist", "Incorrect password" and a too-short password (422) all get the
      // same message, so the page never reveals who has an account.
      const reachedApi = err instanceof ApiError && err.status > 0 && err.status < 500;
      setFormError(reachedApi ? "credentials" : "network");
    }
  }

  return (
    <Layout width="auth" className="auth-main">
      <h1 className="page-title" style={{ margin: 0 }}>
        Welcome back
      </h1>

      <form className="auth-card" onSubmit={onSubmit} noValidate>
        {formError === "credentials" ? (
          <Alert title={BAD_CREDENTIALS}>Check both and try again.</Alert>
        ) : formError === "network" ? (
          <Alert title="Something went wrong">{NETWORK_ERROR}</Alert>
        ) : incoming?.justRegistered ? (
          <Alert tone="success" title="Your account is ready">
            Sign in to continue.
          </Alert>
        ) : null}

        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((f) => ({ ...f, email: undefined }));
          }}
          error={fieldErrors.email}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFieldErrors((f) => ({ ...f, password: undefined }));
          }}
          error={fieldErrors.password}
        />
        <Button type="submit" block loading={submitting}>
          Sign in
        </Button>
      </form>

      <p className="body auth-switch">
        New to Carona?{" "}
        <Link to="/register" className="cr-link-strong">
          Create an account
        </Link>
      </p>
    </Layout>
  );
}
