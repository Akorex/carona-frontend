import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Icon } from "../components/Icon";
import { Layout } from "../components/Layout";
import { Skeleton } from "../components/Skeleton";
import { VehicleCard } from "../components/VehicleCard";
import { ApiError, getMyVehicles, type Vehicle } from "../lib/api";
import { useAuth } from "../lib/auth";
import { NETWORK_ERROR } from "../lib/errors";

type VehicleState = "loading" | "error" | Vehicle[];

export default function Vehicles() {
  const { token, status, signOut } = useAuth();
  const navigate = useNavigate();
  const nav = useLocation().state as { added?: boolean; updated?: boolean } | null;
  const [vehicles, setVehicles] = useState<VehicleState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setVehicles("loading");
    getMyVehicles(token)
      .then((list) => {
        if (!cancelled) setVehicles(list);
      })
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

  const isEmpty = Array.isArray(vehicles) && vehicles.length === 0;

  return (
    <Layout active="profile">
      <Link to="/profile" className="label back-link">
        <Icon name="arrow-left" size={16} />
        Profile
      </Link>

      {nav?.added && <Alert tone="success" title="Vehicle added" />}
      {nav?.updated && <Alert tone="success" title="Vehicle updated" />}

      {isEmpty ? (
        <>
          <h1 className="page-title">My vehicles</h1>
          <div className="empty-panel">
            <EmptyState
              icon="car"
              title="No vehicles yet"
              action={
                <Link to="/vehicles/new" className="cr-btn cr-btn--primary cr-btn--md">
                  <Icon name="plus" />
                  Add a vehicle
                </Link>
              }
            >
              Add the car you drive so you can offer rides in it.
            </EmptyState>
          </div>
        </>
      ) : (
        <>
          <div className="vehicles-head">
            <div className="page-intro">
              <h1 className="page-title">My vehicles</h1>
              <p className="body">
                Passengers see the colour, model and plate once they book, so they can find you at pickup.
              </p>
            </div>
            <Link to="/vehicles/new" className="cr-btn cr-btn--secondary cr-btn--md">
              <Icon name="plus" />
              Add vehicle
            </Link>
          </div>

          {vehicles === "loading" ? (
            <>
              <p className="cr-sr">Loading your vehicles</p>
              <div className="cr-grid" aria-busy="true">
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </div>
            </>
          ) : vehicles === "error" ? (
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
          ) : (
            <div className="cr-grid">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  onEdit={() => navigate(`/vehicles/${v.id}/edit`, { state: { vehicle: v } })}
                />
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
