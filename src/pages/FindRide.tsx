import { Link, Navigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Layout } from "../components/Layout";
import { RideSearchForm } from "../components/RideSearchForm";
import { readRecentSearches, resultsUrl } from "../lib/recentSearches";
import { useAuth } from "../lib/auth";

export default function FindRide() {
  const { user, status } = useAuth();
  if (status === "signed-out") return <Navigate to="/sign-in" replace />;

  const recent = readRecentSearches();

  return (
    <Layout active="find" className="find-main">
      <section className="find-hero">
        <h1 className="display">{user ? `Where are you going, ${user.first_name}?` : "Where are you going?"}</h1>
        <RideSearchForm />
      </section>

      {recent.length > 0 && (
        <section className="find-recent" aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="title-md">
            Recent searches
          </h2>
          <div className="find-recent__list">
            {recent.map((s) => (
              <Link key={`${s.origin}|${s.destination}`} to={resultsUrl(s)} className="recent-search">
                <span className="recent-search__icon" aria-hidden="true">
                  <Icon name="clock" />
                </span>
                <span className="recent-search__text body-strong">
                  {s.origin || "Anywhere"} to {s.destination || "anywhere"}
                </span>
                <Icon name="chevron-right" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
