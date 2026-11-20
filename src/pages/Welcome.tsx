import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { RideCard, type RideSummary } from "../components/RideCard";
import { useAuth } from "../lib/auth";

// Example rides for the hero. These are illustrations, not data from the API.
const EXAMPLE_RIDES: RideSummary[] = [
  {
    id: "example-1",
    origin: "Ikeja City Mall",
    destination: "Victoria Island",
    departure_time: "2026-11-12T07:30:00",
    arrival_time: "2026-11-12T08:45:00",
    fare: 2500,
    seats_left: 3,
    status: "scheduled",
    driver: { first_name: "Tunde", last_name: "Bakare" },
    vehicle: { make: "Toyota", model: "Corolla", colour: "Silver" },
  },
  {
    id: "example-2",
    origin: "Lekki Phase 1",
    destination: "Yaba",
    departure_time: "2026-11-12T17:15:00",
    arrival_time: null,
    fare: 1800,
    seats_left: 1,
    status: "scheduled",
    driver: { first_name: "Chiamaka", last_name: "Obi" },
    vehicle: { make: "Honda", model: "Civic", colour: "Black" },
  },
];

const STEPS = [
  { title: "Search your route", text: "Enter where you're starting, where you're going and the day." },
  { title: "Book your seats", text: "See the time, the fare per seat and who's driving, then book." },
  { title: "Meet the car", text: "You get the car's colour, model and plate number. Pay the driver in cash." },
];

export default function Welcome() {
  const { status } = useAuth();
  const navigate = useNavigate();

  // A saved token that still works (GET /users/me returned 200) goes straight to Find a ride.
  useEffect(() => {
    if (status === "signed-in") navigate("/find", { replace: true });
  }, [status, navigate]);

  return (
    <Layout className="welcome-main">
      <section className="welcome-hero">
        <div className="welcome-hero__text">
          <h1 className="display-lg">Share the ride you're already taking.</h1>
          <p className="body-lg">
            Drivers fill their empty seats on trips they already make. Passengers get across Lagos for less, with
            someone going the same way.
          </p>
          <div className="welcome-hero__actions">
            <Link to="/register" className="cr-btn cr-btn--primary cr-btn--md">
              Create account
            </Link>
            <Link to="/sign-in" className="cr-btn cr-btn--secondary cr-btn--md">
              Sign in
            </Link>
          </div>
        </div>

        <div className="welcome-hero__examples">
          <p className="label">Example rides</p>
          {EXAMPLE_RIDES.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
        </div>
      </section>

      <section className="welcome-steps" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="title-lg">
          How a trip works
        </h2>
        <ol>
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="label">Step {i + 1}</span>
              <span className="title-md">{step.title}</span>
              <span className="body">{step.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </Layout>
  );
}
