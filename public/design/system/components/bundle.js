/* @ds-bundle: {"format":4,"namespace":"Carona","components":[{"name":"Button"},{"name":"TextField"},{"name":"StatusBadge"},{"name":"PlateNumber"},{"name":"Avatar"},{"name":"Icon"},{"name":"RouteLine"},{"name":"RideCard"},{"name":"VehicleCard"},{"name":"SeatStepper"},{"name":"Alert"},{"name":"EmptyState"},{"name":"Skeleton"},{"name":"TopNav"},{"name":"AppBar"},{"name":"TabBar"}]} */
(function () {
  "use strict";
  var React = window.React;
  var h = React.createElement;

  /* ---------- helpers ---------- */
  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(" ");
  }
  function omit(obj, keys) {
    var o = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) < 0) o[k] = obj[k];
    return o;
  }
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* 2500 -> "₦2,500" */
  function formatNaira(amount) {
    var n = Math.round(Number(amount) || 0);
    return "₦" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  /* ISO string -> "7:30 AM" */
  function formatTime(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var hr = d.getHours(), m = d.getMinutes();
    var ap = hr >= 12 ? "PM" : "AM";
    hr = hr % 12 || 12;
    return hr + ":" + (m < 10 ? "0" : "") + m + " " + ap;
  }
  /* ISO string -> "Tue 12 Nov" */
  function formatDay(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()];
  }
  function seatsLabel(n) {
    if (n <= 0) return "Full";
    return n + (n === 1 ? " seat left" : " seats left");
  }
  function initials(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  }

  /* ---------- Icon ---------- */
  /* 24px grid, 2px stroke, round caps. Names match Lucide icons of the same idea. */
  var ICONS = {
    search: [["c", 11, 11, 7], ["p", "M16.5 16.5L21 21"]],
    car: [["p", "M5 17H3v-4l2-5.2A2 2 0 0 1 6.9 6.5h10.2a2 2 0 0 1 1.9 1.3L21 13v4h-2"], ["p", "M3 13h18"], ["p", "M9 17h6"], ["c", 7, 17, 2], ["c", 17, 17, 2]],
    user: [["c", 12, 8, 4], ["p", "M4 21c0-3.9 3.6-6 8-6s8 2.1 8 6"]],
    ticket: [["p", "M3 8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.5a1.5 1.5 0 0 0 0 3V16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2.5a1.5 1.5 0 0 0 0-3z"], ["p", "M14 7v10"]],
    steering: [["c", 12, 12, 9], ["c", 12, 12, 2], ["p", "M12 14v7"], ["p", "M10 12H3.5"], ["p", "M14 12h6.5"]],
    plus: [["p", "M12 5v14"], ["p", "M5 12h14"]],
    minus: [["p", "M5 12h14"]],
    seat: [["p", "M7 3v10h10"], ["p", "M7 13l-1 8"], ["p", "M17 13v8"], ["p", "M7 8h4"]],
    "chevron-right": [["p", "M9 6l6 6-6 6"]],
    "arrow-left": [["p", "M19 12H5"], ["p", "M11 6l-6 6 6 6"]],
    alert: [["c", 12, 12, 9], ["p", "M12 7.5v5"], ["p", "M12 16.2v.3"]],
    info: [["c", 12, 12, 9], ["p", "M12 11v5.5"], ["p", "M12 7.7v.3"]],
    check: [["p", "M5 12.5l4.5 4.5L19 7.5"]],
    x: [["p", "M6 6l12 12"], ["p", "M18 6L6 18"]],
    clock: [["c", 12, 12, 9], ["p", "M12 7v5l3 2"]],
    pin: [["p", "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"], ["c", 12, 9.5, 2.5]],
    pencil: [["p", "M4 20h4L19 9l-4-4L4 16z"], ["p", "M13.5 6.5l4 4"]],
    calendar: [["p", "M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"], ["p", "M4 10h16"], ["p", "M8 3v4"], ["p", "M16 3v4"]],
    "log-out": [["p", "M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"], ["p", "M10 16l-4-4 4-4"], ["p", "M6 12h10"]]
  };

  function Icon(props) {
    var size = props.size || 20;
    var parts = ICONS[props.name] || [];
    var labelled = !!props.label;
    return h(
      "svg",
      {
        className: cx("cr-icon", props.className),
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        role: labelled ? "img" : undefined,
        "aria-label": labelled ? props.label : undefined,
        "aria-hidden": labelled ? undefined : true,
        focusable: "false"
      },
      parts.map(function (p, i) {
        return p[0] === "c" ? h("circle", { key: i, cx: p[1], cy: p[2], r: p[3] }) : h("path", { key: i, d: p[1] });
      })
    );
  }

  /* ---------- Button ---------- */
  function Button(props) {
    var variant = props.variant || "primary";
    var size = props.size || "md";
    var rest = omit(props, ["variant", "size", "block", "loading", "icon", "children", "className", "type", "disabled"]);
    var attrs = Object.assign(
      {
        type: props.type || "button",
        className: cx("cr-btn", "cr-btn--" + variant, "cr-btn--" + size, props.block && "cr-btn--block", props.loading && "is-loading", props.className)
      },
      rest,
      { disabled: !!(props.disabled || props.loading), "aria-busy": props.loading ? true : undefined }
    );
    var lead = props.loading
      ? h("span", { className: "cr-spinner", "aria-hidden": true })
      : props.icon
      ? h(Icon, { name: props.icon, size: size === "sm" ? 16 : 20 })
      : null;
    return h("button", attrs, lead, props.children != null ? h("span", { className: "cr-btn__label" }, props.children) : null);
  }

  /* ---------- TextField ---------- */
  function TextField(props) {
    var id = props.id;
    var errId = id + "-error";
    var hintId = id + "-hint";
    var rest = omit(props, ["id", "label", "hint", "error", "prefix", "className", "optional"]);
    var describedBy = props.error ? errId : props.hint ? hintId : undefined;
    return h(
      "div",
      { className: cx("cr-field", props.error && "has-error", props.className) },
      h(
        "label",
        { className: "cr-field__label", htmlFor: id },
        props.label,
        props.optional ? h("span", { className: "cr-field__optional" }, " (optional)") : null
      ),
      h(
        "div",
        { className: "cr-field__control" },
        props.prefix ? h("span", { className: "cr-field__prefix", "aria-hidden": true }, props.prefix) : null,
        h(
          "input",
          Object.assign({ id: id, className: "cr-field__input", type: "text" }, rest, {
            "aria-invalid": props.error ? true : undefined,
            "aria-describedby": describedBy
          })
        )
      ),
      props.error
        ? h("p", { id: errId, className: "cr-field__error" }, h(Icon, { name: "alert", size: 16 }), h("span", null, props.error))
        : props.hint
        ? h("p", { id: hintId, className: "cr-field__hint" }, props.hint)
        : null
    );
  }

  /* ---------- StatusBadge ---------- */
  var STATUS = {
    scheduled: ["Scheduled", "info"],
    in_progress: ["On the road", "warning"],
    completed: ["Completed", "success"],
    cancelled: ["Cancelled", "danger"],
    confirmed: ["Booked", "success"],
    full: ["Full", "neutral"]
  };
  function StatusBadge(props) {
    var s = STATUS[props.status] || [String(props.status || ""), "neutral"];
    return h(
      "span",
      { className: cx("cr-badge", "cr-badge--" + (props.tone || s[1]), props.className) },
      h("span", { className: "cr-badge__dot", "aria-hidden": true }),
      props.children || s[0]
    );
  }

  /* ---------- PlateNumber ---------- */
  function PlateNumber(props) {
    return h("span", { className: cx("cr-plate", props.className), "aria-label": "Plate number " + props.children }, String(props.children || "").toUpperCase());
  }

  /* ---------- Avatar ---------- */
  function Avatar(props) {
    var size = props.size || "md";
    return h("span", { className: cx("cr-avatar", "cr-avatar--" + size, props.className), role: "img", "aria-label": props.name }, initials(props.name));
  }

  /* ---------- RouteLine ---------- */
  /* Built from spans so it can sit inside a button (RideCard). */
  function RouteLine(props) {
    var showTimes = !!(props.departure || props.arrival);
    function stop(kind, time, place) {
      return h(
        "span",
        { className: "cr-route__stop" },
        showTimes ? h("span", { className: "cr-route__time" }, time ? formatTime(time) : "") : null,
        h("span", { className: "cr-route__marker cr-route__marker--" + kind, "aria-hidden": true }),
        h("span", { className: "cr-route__place" }, h("span", { className: "cr-sr" }, kind === "start" ? "From " : "To "), place)
      );
    }
    return h(
      "span",
      { className: cx("cr-route", showTimes && "cr-route--timed", props.className) },
      stop("start", props.departure, props.origin),
      h("span", { className: "cr-route__lane", "aria-hidden": true }, showTimes ? h("span", null) : null, h("span", { className: "cr-route__dash" })),
      stop("end", props.arrival, props.destination)
    );
  }

  /* ---------- RideCard ---------- */
  function RideCard(props) {
    var r = props.ride || {};
    var driverName = r.driver ? r.driver.first_name + " " + r.driver.last_name : "";
    var shortDriver = r.driver ? r.driver.first_name + " " + (r.driver.last_name || "").charAt(0) + "." : "";
    var v = r.vehicle;
    var seats = typeof r.seats_left === "number" ? r.seats_left : null;
    var status = r.status || "scheduled";
    var badge = status !== "scheduled" ? h(StatusBadge, { status: status }) : seats === 0 ? h(StatusBadge, { status: "full" }) : null;
    var Tag = props.onSelect ? "button" : "article";
    var tagProps = { className: cx("cr-ride", props.onSelect && "cr-ride--action", status === "cancelled" && "is-muted", props.className) };
    if (props.onSelect) {
      tagProps.type = "button";
      tagProps.onClick = props.onSelect;
    }
    return h(
      Tag,
      tagProps,
      h("span", { className: "cr-ride__top" }, h("span", { className: "cr-ride__day" }, formatDay(r.departure_time)), badge),
      h(
        "span",
        { className: "cr-ride__main" },
        h(RouteLine, { origin: r.origin, destination: r.destination, departure: r.departure_time, arrival: r.arrival_time }),
        h("span", { className: "cr-ride__fare" }, h("span", { className: "cr-ride__amount" }, formatNaira(r.fare)), h("span", { className: "cr-ride__unit" }, "per seat"))
      ),
      h(
        "span",
        { className: "cr-ride__foot" },
        r.driver ? h(Avatar, { name: driverName, size: "sm" }) : null,
        h(
          "span",
          { className: "cr-ride__who" },
          h("span", { className: "cr-ride__driver" }, shortDriver),
          v ? h("span", { className: "cr-ride__car" }, v.colour + " " + v.make + " " + v.model) : null
        ),
        seats !== null && status === "scheduled"
          ? h("span", { className: cx("cr-ride__seats", seats === 1 && "is-low", seats === 0 && "is-full") }, h(Icon, { name: "seat", size: 16 }), seatsLabel(seats))
          : null
      )
    );
  }

  /* ---------- VehicleCard ---------- */
  /* Paint colours for the swatch. These are content (car paint), not theme tokens. */
  var PAINT = {
    silver: "#c3c7cb", grey: "#8b9095", gray: "#8b9095", black: "#1d1f21", white: "#f7f7f4",
    red: "#b3261e", wine: "#6d1f2b", maroon: "#6d1f2b", blue: "#2f5bb7", navy: "#1f2f5c",
    green: "#2e7d4f", yellow: "#e8c547", gold: "#c8a24a", brown: "#6b4a32", orange: "#e07a1f", beige: "#d9c7a5"
  };
  function paintFor(colour) {
    var key = String(colour || "").trim().toLowerCase().split(/\s+/).pop();
    return PAINT[key] || null;
  }
  function VehicleCard(props) {
    var v = props.vehicle || {};
    var paint = paintFor(v.colour);
    var seats = Number(v.capacity) || 0;
    return h(
      "article",
      { className: cx("cr-vehicle", props.className) },
      h("span", { className: cx("cr-vehicle__swatch", !paint && "is-unknown"), style: paint ? { background: paint } : undefined, "aria-hidden": true }, paint ? null : h(Icon, { name: "car", size: 20 })),
      h(
        "div",
        { className: "cr-vehicle__body" },
        h("h3", { className: "cr-vehicle__title" }, v.make + " " + v.model),
        h("p", { className: "cr-vehicle__meta" }, v.colour + " · " + seats + (seats === 1 ? " passenger seat" : " passenger seats")),
        h(PlateNumber, null, v.plate_number)
      ),
      props.onEdit ? h(Button, { variant: "ghost", size: "sm", icon: "pencil", onClick: props.onEdit, "aria-label": "Edit " + v.make + " " + v.model }, "Edit") : null
    );
  }

  /* ---------- SeatStepper ---------- */
  function SeatStepper(props) {
    var min = props.min == null ? 1 : props.min;
    var max = props.max == null ? 4 : props.max;
    var value = props.value == null ? min : props.value;
    var id = props.id || "seats";
    function set(n) {
      if (props.onChange) props.onChange(Math.max(min, Math.min(max, n)));
    }
    return h(
      "div",
      { className: cx("cr-stepper", props.className), role: "group", "aria-labelledby": id + "-label" },
      h("span", { id: id + "-label", className: "cr-stepper__label" }, props.label || "Seats"),
      h(
        "div",
        { className: "cr-stepper__control" },
        h("button", { type: "button", className: "cr-stepper__btn", onClick: function () { set(value - 1); }, disabled: value <= min, "aria-label": "One seat fewer" }, h(Icon, { name: "minus" })),
        h("output", { className: "cr-stepper__value", "aria-live": "polite" }, value),
        h("button", { type: "button", className: "cr-stepper__btn", onClick: function () { set(value + 1); }, disabled: value >= max, "aria-label": "One seat more" }, h(Icon, { name: "plus" }))
      ),
      h("span", { className: "cr-stepper__hint" }, max + (max === 1 ? " seat left" : " seats left"))
    );
  }

  /* ---------- Alert ---------- */
  var ALERT_ICON = { danger: "alert", warning: "alert", info: "info", success: "check" };
  function Alert(props) {
    var tone = props.tone || "danger";
    return h(
      "div",
      { className: cx("cr-alert", "cr-alert--" + tone, props.className), role: tone === "danger" ? "alert" : "status" },
      h(Icon, { name: ALERT_ICON[tone] || "info", size: 20 }),
      h(
        "div",
        { className: "cr-alert__body" },
        props.title ? h("p", { className: "cr-alert__title" }, props.title) : null,
        props.children ? h("div", { className: "cr-alert__text" }, props.children) : null
      ),
      props.action || null
    );
  }

  /* ---------- EmptyState ---------- */
  function EmptyState(props) {
    return h(
      "section",
      { className: cx("cr-empty", props.className) },
      h("span", { className: "cr-empty__icon", "aria-hidden": true }, h(Icon, { name: props.icon || "search", size: 28 })),
      h("h2", { className: "cr-empty__title" }, props.title),
      props.children ? h("p", { className: "cr-empty__text" }, props.children) : null,
      props.action || null
    );
  }

  /* ---------- Skeleton ---------- */
  function Skeleton(props) {
    var variant = props.variant || "text";
    if (variant === "card") {
      return h(
        "div",
        { className: "cr-skel-card", "aria-hidden": true },
        h("span", { className: "cr-skel", style: { width: "30%" } }),
        h("span", { className: "cr-skel cr-skel--lg", style: { width: "70%" } }),
        h("span", { className: "cr-skel cr-skel--lg", style: { width: "55%" } }),
        h("span", { className: "cr-skel", style: { width: "45%" } })
      );
    }
    var lines = props.lines || 3;
    var rows = [];
    for (var i = 0; i < lines; i++) rows.push(h("span", { key: i, className: "cr-skel", style: { width: i === lines - 1 ? "60%" : "100%" } }));
    return h("div", { className: "cr-skel-text", "aria-hidden": true }, rows);
  }

  /* ---------- TopNav ---------- */
  /* The header on every page at laptop width. Links are real <a href>s; pass onNavigate to route in the app. */
  var DEFAULT_LINKS = [
    { id: "find", label: "Find a ride", href: "/find" },
    { id: "trips", label: "My trips", href: "/trips" },
    { id: "offer", label: "Offer a ride", href: "/offer" }
  ];
  function TopNav(props) {
    var links = props.links || DEFAULT_LINKS;
    var user = props.user;
    var signedIn = !!user;
    var name = user ? (user.first_name + " " + (user.last_name || "")).trim() : "";
    function go(id) {
      return function (e) { if (props.onNavigate) props.onNavigate(id, e); };
    }
    var profileOn = props.active === "profile";
    return h(
      "header",
      { className: cx("cr-topnav", props.className) },
      h(
        "div",
        { className: "cr-topnav__inner" },
        h(
          "a",
          { className: "cr-topnav__brand", href: signedIn ? links[0].href : props.homeHref || "/", onClick: go("home") },
          h(
            "span",
            { className: "cr-topnav__mark", "aria-hidden": true },
            h("span", { className: "cr-topnav__ring" }),
            h("span", { className: "cr-topnav__dash" }),
            h("span", { className: "cr-topnav__dash" }),
            h("span", { className: "cr-topnav__dot" })
          ),
          h("span", null, "Carona")
        ),
        signedIn
          ? h(
              "nav",
              { className: "cr-topnav__links", "aria-label": "Main" },
              links.map(function (l) {
                var on = l.id === props.active;
                return h("a", { key: l.id, href: l.href, className: cx("cr-topnav__link", on && "is-active"), "aria-current": on ? "page" : undefined, onClick: go(l.id) }, l.label);
              })
            )
          : null,
        signedIn
          ? h(
              "a",
              { className: cx("cr-topnav__me", profileOn && "is-active"), href: props.profileHref || "/profile", "aria-current": profileOn ? "page" : undefined, onClick: go("profile") },
              h(Avatar, { name: name, size: "sm" }),
              h("span", null, user.first_name)
            )
          : h(
              "div",
              { className: "cr-topnav__auth" },
              h("a", { className: "cr-btn cr-btn--ghost cr-btn--md", href: props.signInHref || "/sign-in", onClick: go("sign-in") }, "Sign in"),
              h("a", { className: "cr-btn cr-btn--primary cr-btn--md", href: props.registerHref || "/register", onClick: go("register") }, "Create account")
            )
      )
    );
  }

  /* ---------- AppBar ---------- */
  function AppBar(props) {
    return h(
      "header",
      { className: cx("cr-appbar", props.className) },
      props.onBack
        ? h("button", { type: "button", className: "cr-appbar__icon", onClick: props.onBack, "aria-label": props.backLabel || "Back" }, h(Icon, { name: "arrow-left" }))
        : h("span", { className: "cr-appbar__spacer" }),
      h("h1", { className: "cr-appbar__title" }, props.title),
      props.action || h("span", { className: "cr-appbar__spacer" })
    );
  }

  /* ---------- TabBar ---------- */
  var DEFAULT_TABS = [
    { id: "find", label: "Find", icon: "search" },
    { id: "trips", label: "Trips", icon: "ticket" },
    { id: "offer", label: "Offer", icon: "steering" },
    { id: "profile", label: "Profile", icon: "user" }
  ];
  function TabBar(props) {
    var items = props.items || DEFAULT_TABS;
    return h(
      "nav",
      { className: cx("cr-tabbar", props.className), "aria-label": "Main" },
      items.map(function (t) {
        var on = t.id === props.active;
        return h(
          "button",
          {
            key: t.id,
            type: "button",
            className: cx("cr-tab", on && "is-active"),
            "aria-current": on ? "page" : undefined,
            onClick: function () { if (props.onChange) props.onChange(t.id); }
          },
          h(Icon, { name: t.icon, size: 22 }),
          h("span", { className: "cr-tab__label" }, t.label)
        );
      })
    );
  }

  var api = {
    Button: Button, TextField: TextField, StatusBadge: StatusBadge, PlateNumber: PlateNumber, Avatar: Avatar, Icon: Icon,
    RouteLine: RouteLine, RideCard: RideCard, VehicleCard: VehicleCard, SeatStepper: SeatStepper, Alert: Alert,
    EmptyState: EmptyState, Skeleton: Skeleton, TopNav: TopNav, AppBar: AppBar, TabBar: TabBar,
    format: { naira: formatNaira, time: formatTime, day: formatDay, seats: seatsLabel, initials: initials },
    iconNames: Object.keys(ICONS)
  };
  window.Carona = Object.assign(window.Carona || {}, api);
})();
