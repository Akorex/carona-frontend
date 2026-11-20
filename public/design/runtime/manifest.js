/* Generated from canvas.json (Carona Screens canvas, copied off claude.ai on 2026-11-20). */
window.CARONA_SCREENS = {
  "title": "Carona Screens",
  "intro": "How to read this canvas\n\nEvery screen is a web page designed at laptop width (1440px), built from the Carona design system's real components. Pages are fluid, so they also work in a narrow window.\n\nPress Play on any page to click through: the top navigation and the main links move between pages.\n\nRows 1 and 2 work against the API as it is today. Rows 3 and 4 need the rides and bookings endpoints from the roadmap.\n\nThe note under each page names its endpoint and what the code must handle. Every page has a Theme tweak to check dark mode.",
  "screens": [
    {
      "file": "TopNav.dc.html",
      "id": "TopNav",
      "title": "Top navigation (shared)",
      "row": "Shared parts",
      "note": "One file, imported by every page with <dc-import name=\"TopNav\">. Props: active (find, trips, offer, profile) and signed-in. Change it here and every page follows.",
      "status": "shared"
    },
    {
      "file": "Main.dc.html",
      "id": "Main",
      "title": "Welcome",
      "row": "Get started · works with the API today",
      "note": "Works today · no API call\nShown when there is no saved token. If a token exists, call GET /users/me: 200 goes to Find a ride, 401 stays here. The ride cards are labelled examples.",
      "status": "works"
    },
    {
      "file": "Register.dc.html",
      "id": "Register",
      "title": "Create account",
      "row": "Get started · works with the API today",
      "note": "Works today · POST /users/register\nFields mirror UserCreate: names 2–100 chars, password 6+. Phone is optional. On success, sign in straight away with the same email and password so the person doesn't type them twice.",
      "status": "works"
    },
    {
      "file": "RegisterErrors.dc.html",
      "id": "RegisterErrors",
      "title": "Create account · errors",
      "row": "Get started · works with the API today",
      "note": "Works today · 400 and 422\n400 \"A user with this email already exists\" → form Alert with a Sign in link.\n422 → one error per field, read from detail[].loc.",
      "status": "works"
    },
    {
      "file": "SignIn.dc.html",
      "id": "SignIn",
      "title": "Sign in · wrong password",
      "row": "Get started · works with the API today",
      "note": "Works today · POST /users/login\nSave data.access_token, then GET /users/me. Both \"account does not exist\" and \"Incorrect password\" show the same message so the page doesn't reveal who has an account.",
      "status": "works"
    },
    {
      "file": "Profile.dc.html",
      "id": "Profile",
      "title": "Profile",
      "row": "Profile and vehicles · works today (edit needs the PATCH fix)",
      "note": "Works today · GET /users/me\nShow name, email and phone. Never show role, password or ids. Sign out clears the token; there is no logout endpoint.\nEdit details opens Edit profile.",
      "status": "works"
    },
    {
      "file": "EditProfile.dc.html",
      "id": "EditProfile",
      "title": "Edit profile · phone taken",
      "row": "Profile and vehicles · works today (edit needs the PATCH fix)",
      "note": "Planned · PATCH /users/me (doesn't exist yet)\nEditable: first name, last name, phone. Email can't be changed: leave it out of UserUpdate so the API rejects or ignores it too, not just the form. Every field optional; phone keeps register's uniqueness check (400 → show it on the field). Send only changed fields, then reload GET /users/me. Changing the password is a separate flow, not designed yet.",
      "status": "planned"
    },
    {
      "file": "Vehicles.dc.html",
      "id": "Vehicles",
      "title": "My vehicles",
      "row": "Profile and vehicles · works today (edit needs the PATCH fix)",
      "note": "Works today · GET /vehicles/\nReturns only the signed-in user's vehicles. Capacity is shown as passenger seats.",
      "status": "works"
    },
    {
      "file": "VehiclesEmpty.dc.html",
      "id": "VehiclesEmpty",
      "title": "My vehicles · empty",
      "row": "Profile and vehicles · works today (edit needs the PATCH fix)",
      "note": "Works today · empty list\ndata: [] → EmptyState with one action.",
      "status": "works"
    },
    {
      "file": "VehiclesLoading.dc.html",
      "id": "VehiclesLoading",
      "title": "My vehicles · loading",
      "row": "Profile and vehicles · works today (edit needs the PATCH fix)",
      "note": "Works today · loading\nSkeleton cards in the same grid while GET /vehicles/ runs. The header never disappears.",
      "status": "works"
    },
    {
      "file": "AddVehicle.dc.html",
      "id": "AddVehicle",
      "title": "Add vehicle · duplicate plate",
      "row": "Profile and vehicles · works today (edit needs the PATCH fix)",
      "note": "Works today · POST /vehicles/\n400 \"Vehicle already exists\" means the plate is taken: show it on the plate field. Capacity has no limits in the API yet; the form allows 1–8.",
      "status": "works"
    },
    {
      "file": "EditVehicle.dc.html",
      "id": "EditVehicle",
      "title": "Edit vehicle · saving",
      "row": "Profile and vehicles · works today (edit needs the PATCH fix)",
      "note": "Blocked · PATCH /vehicles/{id}\nFails with a 500 until the argument order in routes/vehicles.py is fixed, and needs every field until VehicleUpdate makes them optional. Send only changed fields. There is no DELETE yet, so no Remove button.",
      "status": "blocked"
    },
    {
      "file": "Find.dc.html",
      "id": "Find",
      "title": "Find a ride",
      "row": "Find and book · needs the rides and bookings API",
      "note": "Planned · GET /rides?origin=&destination=&date=\nPlaces are free text for now. Recent searches live in the browser (localStorage), not the API.",
      "status": "planned"
    },
    {
      "file": "Results.dc.html",
      "id": "Results",
      "title": "Search results",
      "row": "Find and book · needs the rides and bookings API",
      "note": "Planned · same endpoint\nEach ride must include seats_left, driver {first_name, last_name} and vehicle {make, model, colour} so the list needs one request. Sorted by departure time.",
      "status": "planned"
    },
    {
      "file": "ResultsEmpty.dc.html",
      "id": "ResultsEmpty",
      "title": "Search results · none",
      "row": "Find and book · needs the rides and bookings API",
      "note": "Planned · data: []\nOffer to change the search. Don't show an error: nothing went wrong.",
      "status": "planned"
    },
    {
      "file": "RideDetail.dc.html",
      "id": "RideDetail",
      "title": "Ride details",
      "row": "Find and book · needs the rides and bookings API",
      "note": "Planned · GET /rides/{id}, POST /rides/{id}/bookings\nThe seat stepper works in Play: the total updates with the seat count. If seats ran out meanwhile, reload the ride and lower the maximum.",
      "status": "planned"
    },
    {
      "file": "Booked.dc.html",
      "id": "Booked",
      "title": "Booking confirmed",
      "row": "Find and book · needs the rides and bookings API",
      "note": "Planned · booking response\nThe plate number and car colour appear only after booking. Cash at pickup is the default for now.",
      "status": "planned"
    },
    {
      "file": "Trips.dc.html",
      "id": "Trips",
      "title": "My trips",
      "row": "Trips and offering a ride · needs the rides and bookings API",
      "note": "Planned · GET /bookings/me and GET /rides/mine\nUpcoming first, then past. Shows rides you booked and rides you drive, with a badge for each state.",
      "status": "planned"
    },
    {
      "file": "OfferNoVehicle.dc.html",
      "id": "OfferNoVehicle",
      "title": "Offer a ride · no vehicle",
      "row": "Trips and offering a ride · needs the rides and bookings API",
      "note": "Works today · GET /vehicles/ returns []\nDriving needs a vehicle, so Offer a ride asks for one first. This is the \"driver is a capability, not a role\" decision from the brief.",
      "status": "works"
    },
    {
      "file": "OfferRide.dc.html",
      "id": "OfferRide",
      "title": "Offer a ride",
      "row": "Trips and offering a ride · needs the rides and bookings API",
      "note": "Planned · POST /rides\nVehicle picker uses GET /vehicles/ (works today). Seats are capped at the vehicle's capacity. distance_km is left out until maps arrive. In Play, the preview card follows the fare and seats you type.",
      "status": "planned"
    },
    {
      "file": "DriverRide.dc.html",
      "id": "DriverRide",
      "title": "Driver · my ride",
      "row": "Trips and offering a ride · needs the rides and bookings API",
      "note": "Planned · GET /rides/{id}/bookings, PATCH /rides/{id}/status\nStart trip appears from 30 minutes before departure. Cancelling asks for confirmation and cancels every booking.",
      "status": "planned"
    }
  ]
};
