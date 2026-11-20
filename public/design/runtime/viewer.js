/*
  The bar at the bottom of every design screen: back to the list, previous/next
  screen in canvas order, the canvas note for this screen, light/dark, and a link
  to the design system. Arrow keys also move between screens.
*/
(function () {
  "use strict";
  var data = window.CARONA_SCREENS;
  if (!data) return;
  var here = location.pathname.split("/").pop().replace(".dc.html", "");
  var list = data.screens;
  var i = list.findIndex(function (s) { return s.id === here; });
  if (i < 0) return;
  var s = list[i];
  var prev = list[(i - 1 + list.length) % list.length];
  var next = list[(i + 1) % list.length];
  var STATUS = { works: "Works today", planned: "Planned", blocked: "Blocked", shared: "Shared part" };

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  var ICON = {
    grid: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>',
    left: '<path d="M15 18l-6-6 6-6"/>',
    right: '<path d="M9 18l6-6-6-6"/>',
    note: '<path d="M4 4h16v12H8l-4 4z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V21h16"/>',
    hide: '<path d="M6 9l6 6 6-6"/>'
  };
  function icon(n) {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + "</svg>";
  }

  var bar = document.createElement("div");
  bar.className = "dv-bar";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Design viewer");
  bar.innerHTML =
    '<div class="dv-note" id="dv-note" hidden>' +
      '<div class="dv-note__head"><span class="dv-chip dv-chip--' + s.status + '">' + esc(STATUS[s.status] || "Note") + "</span>" +
      '<span class="dv-note__row">' + esc(s.row) + "</span></div>" +
      '<p class="dv-note__text">' + esc(s.note || "No note for this screen.") + "</p>" +
    "</div>" +
    '<div class="dv-bar__inner">' +
      '<a class="dv-btn" href="../index.html" title="All screens">' + icon("grid") + '<span class="dv-wide">All screens</span></a>' +
      '<span class="dv-sep"></span>' +
      '<a class="dv-btn dv-btn--icon" href="' + prev.file + '" aria-label="Previous: ' + esc(prev.title) + '" title="Previous: ' + esc(prev.title) + ' (←)">' + icon("left") + "</a>" +
      '<span class="dv-title"><span class="dv-count">' + (i + 1) + "/" + list.length + "</span> " + esc(s.title) + "</span>" +
      '<a class="dv-btn dv-btn--icon" href="' + next.file + '" aria-label="Next: ' + esc(next.title) + '" title="Next: ' + esc(next.title) + ' (→)">' + icon("right") + "</a>" +
      '<span class="dv-sep"></span>' +
      '<button type="button" class="dv-btn" id="dv-note-btn" aria-expanded="false" aria-controls="dv-note">' + icon("note") + '<span class="dv-wide">Note</span></button>' +
      '<button type="button" class="dv-btn" id="dv-theme"></button>' +
      '<a class="dv-btn" href="../system/index.html">' + icon("book") + '<span class="dv-wide">Design system</span></a>' +
      '<button type="button" class="dv-btn dv-btn--icon" id="dv-hide" aria-label="Hide this bar" title="Hide this bar (H)">' + icon("hide") + "</button>" +
    "</div>";

  var show = document.createElement("button");
  show.type = "button";
  show.className = "dv-show";
  show.textContent = "Show viewer";
  show.hidden = true;

  function paintTheme() {
    var dark = window.DCLite && window.DCLite.getTheme() === "dark";
    var b = document.getElementById("dv-theme");
    b.innerHTML = icon(dark ? "sun" : "moon") + '<span class="dv-wide">' + (dark ? "Light" : "Dark") + "</span>";
    b.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  function setHidden(h) {
    bar.hidden = h;
    show.hidden = !h;
    try { sessionStorage.setItem("dv-hidden", h ? "1" : ""); } catch (e) { /* ignore */ }
  }

  document.addEventListener("dc-lite:ready", function () {
    document.body.appendChild(bar);
    document.body.appendChild(show);
    document.title = s.title + " · Carona design";
    paintTheme();
    var hidden = false;
    try { hidden = sessionStorage.getItem("dv-hidden") === "1"; } catch (e) { /* ignore */ }
    setHidden(hidden);

    document.getElementById("dv-theme").addEventListener("click", function () {
      window.DCLite.setTheme(window.DCLite.getTheme() === "dark" ? "light" : "dark");
      paintTheme();
    });
    var noteBtn = document.getElementById("dv-note-btn");
    var note = document.getElementById("dv-note");
    noteBtn.addEventListener("click", function () {
      note.hidden = !note.hidden;
      noteBtn.setAttribute("aria-expanded", String(!note.hidden));
    });
    document.getElementById("dv-hide").addEventListener("click", function () { setHidden(true); });
    show.addEventListener("click", function () { setHidden(false); });

    document.addEventListener("keydown", function (e) {
      var t = e.target;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "ArrowLeft") location.href = prev.file;
      else if (e.key === "ArrowRight") location.href = next.file;
      else if (e.key === "h" || e.key === "H") setHidden(!bar.hidden);
    });
  });
})();
