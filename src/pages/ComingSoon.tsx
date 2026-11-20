import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import { Skeleton } from "../components/Skeleton";
import { useAuth } from "../lib/auth";

/**
 * Stand-in for the signed-in pages that aren't built yet (Find a ride, My trips,
 * Offer a ride, Profile). Replace each route in App.tsx as its real page lands.
 */
export default function ComingSoon({ title, active, notFound }: { title: string; active?: string; notFound?: boolean }) {
  const { status, signOut } = useAuth();
  const navigate = useNavigate();

  if (notFound) {
    return (
      <Layout>
        <div className="page-intro">
          <h1 className="page-title">Page not found</h1>
          <p className="body">
            That address doesn't match a page. <Link to="/">Go to the start</Link>.
          </p>
        </div>
      </Layout>
    );
  }

  if (status === "signed-out") return <Navigate to="/sign-in" replace />;

  return (
    <Layout active={active}>
      {status === "checking" ? (
        <Skeleton lines={2} />
      ) : (
        <>
          <div className="page-intro">
            <h1 className="page-title">{title}</h1>
            <p className="body">This page isn't built yet. It's next on the list.</p>
          </div>
          <div>
            <Button
              variant="secondary"
              icon="log-out"
              onClick={() => {
                signOut();
                navigate("/sign-in", { replace: true });
              }}
            >
              Sign out
            </Button>
          </div>
        </>
      )}
    </Layout>
  );
}
