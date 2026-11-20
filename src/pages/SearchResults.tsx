import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Layout } from "../components/Layout";
import { RideCard } from "../components/RideCard";
import { RideSearchForm } from "../components/RideSearchForm";
import { Skeleton } from "../components/Skeleton";
import { searchRides, type Ride, type RideSearch } from "../lib/api";
import { useAuth } from "../lib/auth";
import { NETWORK_ERROR } from "../lib/errors";
import { dayFromDate } from "../lib/format";

type Results = "loading" | "error" | Ride[];

export default function SearchResults() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const search: RideSearch = {
    origin: params.get("origin") ?? "",
    destination: params.get("destination") ?? "",
    day: params.get("day") ?? "",
  };
  const key = params.toString();
  const [results, setResults] = useState<Results>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setResults("loading");
    searchRides(search)
      .then((rides) => !cancelled && setResults(rides))
      .catch(() => !cancelled && setResults("error"));
    return () => {
      cancelled = true;
    };
    // `key` changes whenever the address's search changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  if (status === "signed-out") return <Navigate to="/sign-in" replace />;

  const when = search.day ? `on ${dayFromDate(search.day)}` : "coming up";
  const route = `${search.origin || "anywhere"} to ${search.destination || "anywhere"}`;

  return (
    <Layout active="find">
      {/* key: start the form again when the search in the address changes */}
      <RideSearchForm key={key} initial={search} variant="secondary" />

      {results === "loading" ? (
        <>
          <Skeleton lines={1} />
          <div className="results-grid">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        </>
      ) : results === "error" ? (
        <Alert
          title="We couldn't load rides"
          action={
            <Button variant="secondary" size="sm" onClick={() => setAttempt((n) => n + 1)}>
              Try again
            </Button>
          }
        >
          {NETWORK_ERROR}
        </Alert>
      ) : results.length === 0 ? (
        <div className="empty-panel">
          <EmptyState icon="search" title="No rides match">
            Nobody is driving from {route} {when} yet. Try a nearby place or another day.
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="results-head">
            <h1 className="title-lg">
              {results.length} ride{results.length === 1 ? "" : "s"} {when}
            </h1>
            <p className="body">Earliest departure first</p>
          </div>
          <div className="results-grid">
            {results.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onSelect={() => navigate(`/rides/${ride.id}`, { state: { from: `/find/results?${key}` } })}
              />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
