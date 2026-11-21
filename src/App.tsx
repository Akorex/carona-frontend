import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import ComingSoon from "./pages/ComingSoon";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import OfferRide from "./pages/OfferRide";
import FindRide from "./pages/FindRide";
import SearchResults from "./pages/SearchResults";
import RideDetail from "./pages/RideDetail";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import EditVehicle from "./pages/EditVehicle";
import { DesignLink, DesignRedirect } from "./components/DesignLink";

// Routes from the design system's "Building with Carona" guide.
// Pages that aren't built yet show a placeholder so the top navigation has somewhere to go.
export default function App() {
  return (
    <>
      <DesignLink />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/find" element={<FindRide />} />
        <Route path="/find/results" element={<SearchResults />} />
        <Route path="/rides/:id" element={<RideDetail />} />
        <Route path="/trips" element={<ComingSoon active="trips" title="My trips" />} />
        <Route path="/offer" element={<OfferRide />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/new" element={<AddVehicle />} />
        <Route path="/vehicles/:id/edit" element={<EditVehicle />} />
        {/* The designs are static pages in public/design/. */}
        <Route path="/design/*" element={<DesignRedirect />} />
        <Route path="*" element={<ComingSoon title="Page not found" notFound />} />
      </Routes>
    </>
  );
}
