import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Icon } from "../components/Icon";
import { Layout } from "../components/Layout";
import { RouteLine } from "../components/RouteLine";
import { Skeleton } from "../components/Skeleton";
import { StatusBadge } from "../components/StatusBadge";
import { ApiError, getRide, type Ride } from "../lib/api";
import { useAuth } from "../lib/auth";
import { NETWORK_ERROR } from "../lib/errors";
import { day, naira, seats } from "../lib/format";

type RideState = "loading" | "error" | "not-found" | Ride;

export default function RideDetail() {
  const { id = "" } = useParams();
  const { user, status } = useAuth();
  const location = useLocation();
  const nav = location.state as { from?: string; offered?: boolean } | null;
  const [ride, setRide] = useState<RideState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setRide("loading");
    getRide(id)
      .then((r) => !cancelled && setRide(r))
      .catch((err) => {
        if (cancelled) return;
        // 404: no such ride. 422: the address isn't a ride id at all.
        const missing = err instanceof ApiError && (err.status === 404 || err.status === 422);
        setRide(missing ? "not-found" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  if (status === "signed-out") return <Navigate to="/sign-in" replace />;

  const backTo = nav?.from ?? "/find";
  const backLabel = nav?.from ? "Back to results" : "Find a ride";

  if (ride === "loading") {
    return (
      <Layout active="find">
        <Skeleton lines={2} />
        <div className="ride-detail">
          <div className="ride-detail__main">
            <Skeleton variant="card" />
          </div>
          <div className="ride-detail__aside">
            <Skeleton lines={4} />
          </div>
        </div>
      </Layout>
    );
  }

  if (ride === "not-found" || ride === "error") {
    return (
      <Layout active="find">
        <Link to={backTo} className="label back-link">
          <Icon name="arrow-left" size={16} />
          {backLabel}
        </Link>
        {ride === "not-found" ? (
          <div className="empty-panel">
            <EmptyState icon="search" title="This ride isn't available">
              It may have been removed. Search again to find another one.
            </EmptyState>
          </div>
        ) : (
          <Alert
            title="We couldn't load this ride"
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

  const isMine = user?.id === ride.driver.id;
  const driverName = `${ride.driver.first_name} ${ride.driver.last_name}`;
  // "a silver Toyota Corolla": only the colour is lower case; make and model are names.
  const car = `${ride.vehicle.colour.toLowerCase()} ${ride.vehicle.make} ${ride.vehicle.model}`;

  return (
    <Layout active={isMine ? "offer" : "find"}>
      <Link to={isMine ? "/offer" : backTo} className="label back-link">
        <Icon name="arrow-left" size={16} />
        {isMine ? "Offer another ride" : backLabel}
      </Link>

      {nav?.offered && isMine && (
        <Alert tone="success" title="Your ride is live">
          Passengers can find it now when they search for {ride.origin} to {ride.destination}.
        </Alert>
      )}

      <div className="ride-detail">
        <div className="ride-detail__main">
          <div className="ride-detail__title">
            <p className="label">{day(ride.departure_time)}</p>
            <h1 className="page-title">
              {ride.origin} to {ride.destination}
            </h1>
          </div>

          <section className="panel">
            <RouteLine
              origin={ride.origin}
              destination={ride.destination}
              departure={ride.departure_time}
              arrival={ride.arrival_time}
            />
          </section>

          <section className="ride-detail__section" aria-labelledby="driver-heading">
            <h2 id="driver-heading" className="title-md">
              {isMine ? "You're driving" : "Your driver"}
            </h2>
            <div className="panel driver-row">
              <Avatar name={driverName} />
              <div className="driver-row__text">
                <span className="body-strong">{driverName}</span>
                <span className="body">
                  Drives a {car} · {ride.vehicle.capacity} passenger seat{ride.vehicle.capacity === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            {!isMine && <p className="caption ride-detail__note">You'll see the plate number once you book.</p>}
          </section>
        </div>

        <aside className="ride-detail__aside panel" aria-label="Fare and seats">
          <div className="ride-detail__fare">
            <span className="fare">{naira(ride.fare)}</span>
            <span className="caption">per seat</span>
          </div>
          <div className="ride-detail__seats">
            <span className="body">Seats</span>
            {ride.status === "scheduled" ? (
              <span className="body-strong">{seats(ride.seats_left)}</span>
            ) : (
              <StatusBadge status={ride.status} />
            )}
          </div>
          {isMine ? (
            <p className="caption ride-detail__note">
              You offered {ride.seats_offered} seat{ride.seats_offered === 1 ? "" : "s"}. Bookings will show up here.
            </p>
          ) : (
            <>
              <Button block disabled>
                Booking opens soon
              </Button>
              <p className="caption ride-detail__note ride-detail__note--center">
                Paid in cash to the driver at pickup.
              </p>
            </>
          )}
        </aside>
      </div>
    </Layout>
  );
}
