import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { Layout } from "../components/Layout";
import { Skeleton } from "../components/Skeleton";
import { ApiError, getMyVehicles } from "../lib/api";
import { useAuth } from "../lib/auth";
import { monthYear, phone } from "../lib/format";

/** "loading" while GET /vehicles/ runs, "error" if it failed, otherwise how many vehicles. */
type VehicleCount = "loading" | "error" | number;

function vehicleCountLabel(count: number): string {
  if (count === 0) return "No vehicles yet";
  return `${count} vehicle${count === 1 ? "" : "s"}`;
}

export default function Profile() {
  const { user, token, status, signOut } = useAuth();
  const navigate = useNavigate();
  // Edit profile sends { saved: true } after a successful save.
  const justSaved = (useLocation().state as { saved?: boolean } | null)?.saved === true;
  const [vehicleCount, setVehicleCount] = useState<VehicleCount>("loading");

  // The user comes from GET /users/me (already loaded by AuthProvider).
  // The vehicle count needs its own request.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setVehicleCount("loading");
    getMyVehicles(token)
      .then((vehicles) => {
        if (!cancelled) setVehicleCount(vehicles.length);
      })
      .catch((err) => {
        if (cancelled) return;
        // The token expired while the page was open: sign in again.
        if (err instanceof ApiError && err.status === 401) {
          signOut();
          navigate("/sign-in", { replace: true });
          return;
        }
        setVehicleCount("error");
      });
    return () => {
      cancelled = true;
    };
  }, [token, signOut, navigate]);

  if (status === "signed-out") return <Navigate to="/sign-in" replace />;

  function onSignOut() {
    signOut();
    navigate("/sign-in", { replace: true });
  }

  return (
    <Layout active="profile">
      <h1 className="page-title profile-title">Profile</h1>
      {justSaved && <Alert tone="success" title="Your details are saved" />}

      {status === "checking" || !user ? (
        <div className="profile">
          <div className="profile-card">
            <Skeleton lines={3} />
          </div>
          <div className="profile__details">
            <Skeleton variant="card" />
          </div>
        </div>
      ) : (
        <div className="profile">
          <section className="profile-card" aria-label="Your account">
            <Avatar name={`${user.first_name} ${user.last_name}`} size="lg" />
            <div className="profile-card__name">
              <h2 className="title-lg">
                {user.first_name} {user.last_name}
              </h2>
              {user.created_at && <p className="body">Member since {monthYear(user.created_at)}</p>}
            </div>
            <Button variant="danger-ghost" size="sm" icon="log-out" onClick={onSignOut}>
              Sign out
            </Button>
          </section>

          <div className="profile__details">
            <section className="profile-section" aria-labelledby="contact-heading">
              <div className="profile-section__head">
                <h3 id="contact-heading" className="title-md">
                  Contact
                </h3>
                <Link to="/profile/edit" className="cr-btn cr-btn--ghost cr-btn--sm">
                  <Icon name="pencil" size={16} />
                  Edit details
                </Link>
              </div>
              <dl className="profile-list">
                <div className="profile-list__row">
                  <dt className="body">Email</dt>
                  <dd className="body-strong">{user.email}</dd>
                </div>
                <div className="profile-list__row">
                  <dt className="body">Phone</dt>
                  {user.phone_number ? (
                    <dd className="body-strong">{phone(user.phone_number)}</dd>
                  ) : (
                    <dd className="body profile-list__empty">Not added</dd>
                  )}
                </div>
              </dl>
            </section>

            <section className="profile-section" aria-labelledby="driving-heading">
              <h3 id="driving-heading" className="title-md">
                Driving
              </h3>
              <Link to="/vehicles" className="profile-link">
                <span className="profile-link__icon" aria-hidden="true">
                  <Icon name="car" />
                </span>
                <span className="profile-link__text">
                  <span className="body-strong">My vehicles</span>
                  {vehicleCount === "loading" ? (
                    <span className="profile-link__skeleton">
                      <span className="cr-skel" />
                    </span>
                  ) : (
                    <span className="caption">
                      {vehicleCount === "error" ? "Open to see your vehicles" : vehicleCountLabel(vehicleCount)}
                    </span>
                  )}
                </span>
                <Icon name="chevron-right" />
              </Link>
            </section>
          </div>
        </div>
      )}
    </Layout>
  );
}
