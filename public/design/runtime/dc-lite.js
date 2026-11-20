/*
  dc-lite: renders the Carona Screens canvas files (*.dc.html) in a plain browser,
  without claude.ai. It understands the parts of the Design Component format the
  canvas uses:

    {{hole}} / {{a.b}}         values from renderVals(), in text and attributes
    <sc-if value="{{x}}">      render children when x is truthy
    <sc-for list="{{xs}}" as="x">  repeat children for each item
    <x-import component-from-global-scope="Carona.Button" ...>
                               mount a design-system component (window.Carona)
    <dc-import name="TopNav" ...>  mount another .dc.html file from this folder
    <script type="text/x-dc">  class Component extends DCLogic { renderVals() {...} }

  Needs window.React, window.ReactDOM and the design-system bundle loaded first.
*/
(function () {
  "use strict";
  var R = window.React;
  var RD = window.ReactDOM;

  // Hide the raw template until React has rendered it.
  var hide = document.createElement("style");
  hide.textContent = "x-dc{display:none!important}";
  document.head.appendChild(hide);

  var THEME_KEY = "carona-design-theme";
  function savedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  /* ---------- values ---------- */
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

  function lookup(path, scope) {
    if (path === "true") return true;
    if (path === "false") return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var parts = path.split(".");
    var v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }
  // An attribute that is exactly one hole keeps the raw value (object, function, boolean).
  function attrValue(raw, scope) {
    var m = WHOLE.exec(raw);
    if (m) return lookup(m[1], scope);
    return raw.replace(HOLE, function (_, p) {
      var v = lookup(p, scope);
      return v == null ? "" : String(v);
    });
  }

  /* ---------- attribute names ---------- */
  function camel(name) {
    return name.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
  }
  var DOM_NAMES = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex", "readonly": "readOnly",
    "maxlength": "maxLength", "minlength": "minLength", "autocomplete": "autoComplete",
    "autofocus": "autoFocus", "inputmode": "inputMode", "colspan": "colSpan", "rowspan": "rowSpan",
    "onchange": "onChange", "onclick": "onClick", "oninput": "onInput", "onsubmit": "onSubmit",
    "srcset": "srcSet", "crossorigin": "crossOrigin", "enterkeyhint": "enterKeyHint"
  };
  function domName(name) {
    if (DOM_NAMES[name]) return DOM_NAMES[name];
    if (name.indexOf("aria-") === 0 || name.indexOf("data-") === 0) return name;
    if (name.indexOf("-") > 0) return camel(name);
    return name;
  }
  function styleObject(css) {
    var out = {};
    String(css).split(";").forEach(function (decl) {
      var i = decl.indexOf(":");
      if (i < 0) return;
      var prop = decl.slice(0, i).trim();
      var val = decl.slice(i + 1).trim();
      if (!prop || !val) return;
      out[prop.indexOf("--") === 0 ? prop : camel(prop)] = val;
    });
    return out;
  }

  /* ---------- template to React ---------- */
  var VOID = { input: 1, br: 1, img: 1, hr: 1, meta: 1, link: 1, source: 1, col: 1, area: 1, wbr: 1 };
  var loaded = {}; // dc-import name -> component class

  function renderChildren(node, scope) {
    var out = [];
    node.childNodes.forEach(function (child, i) {
      var el = renderNode(child, scope, i);
      if (el == null || el === "") return;
      if (Array.isArray(el)) out.push.apply(out, el); else out.push(el);
    });
    return out;
  }

  function renderNode(node, scope, key) {
    if (node.nodeType === 3) {
      var text = node.nodeValue;
      if (!text.trim()) return text.indexOf("\n") >= 0 ? null : text;
      return text.replace(HOLE, function (_, p) {
        var v = lookup(p, scope);
        return v == null ? "" : String(v);
      });
    }
    if (node.nodeType !== 1) return null;
    var tag = node.tagName.toLowerCase();

    if (tag === "helmet" || tag === "script" || tag === "style") return null;

    if (tag === "sc-if") {
      var show = attrValue(node.getAttribute("value") || "", scope);
      return show ? R.createElement(R.Fragment, { key: key }, renderChildren(node, scope)) : null;
    }

    if (tag === "sc-for") {
      var list = attrValue(node.getAttribute("list") || "", scope) || [];
      var as = node.getAttribute("as") || "item";
      return R.createElement(R.Fragment, { key: key }, list.map(function (item, i) {
        var inner = Object.assign({}, scope);
        inner[as] = item;
        return R.createElement(R.Fragment, { key: i }, renderChildren(node, inner));
      }));
    }

    if (tag === "x-import" || tag === "dc-import") {
      var type, props = { key: key };
      if (tag === "x-import") {
        var path = node.getAttribute("component-from-global-scope") || "";
        type = path.split(".").reduce(function (o, k) { return o && o[k]; }, window);
        if (!type) return R.createElement("span", { key: key, style: { color: "red" } }, "Missing component " + path);
      } else {
        type = loaded[node.getAttribute("name")];
        if (!type) return null;
        if (scope.__theme) props.theme = scope.__theme;
      }
      Array.prototype.forEach.call(node.attributes, function (a) {
        if (a.name === "component-from-global-scope" || a.name.indexOf("hint-") === 0) return;
        if (tag === "dc-import" && a.name === "name") return;
        var v = attrValue(a.value, scope);
        if (v === undefined) return;
        props[a.name === "class" ? "className" : camel(a.name)] = v;
      });
      var kids = renderChildren(node, scope).filter(function (k) { return typeof k !== "string" || k.trim(); });
      return R.createElement.apply(null, [type, props].concat(kids));
    }

    var p = { key: key };
    Array.prototype.forEach.call(node.attributes, function (a) {
      var v = attrValue(a.value, scope);
      if (v === undefined || v === null) return;
      var name = domName(a.name);
      if (name === "style") v = styleObject(v);
      if (name === "checked" && typeof v === "string") v = v !== "false";
      if (name === "checked" && !p.onChange) p.readOnly = true;
      p[name] = v;
    });
    if (p.checked !== undefined && p.onChange) delete p.readOnly;
    if (VOID[tag]) return R.createElement(tag, p);
    return R.createElement.apply(null, [tag, p].concat(renderChildren(node, scope)));
  }

  /* ---------- DCLogic ---------- */
  class DCLogic extends R.Component {
    renderVals() { return {}; }
    render() {
      var vals = Object.assign({ __theme: this.props.theme }, this.renderVals());
      var tpl = this.constructor.__tpl;
      var kids = renderChildren(tpl, vals);
      return kids.length === 1 ? kids[0] : R.createElement(R.Fragment, null, kids);
    }
  }
  window.DCLogic = DCLogic;

  function defaultsFrom(script) {
    var out = {};
    try {
      var decl = JSON.parse(script.getAttribute("data-props") || "{}");
      Object.keys(decl).forEach(function (k) {
        if (k.charAt(0) !== "$" && decl[k] && "default" in decl[k]) out[k] = decl[k]["default"];
      });
    } catch (e) { /* no tweaks */ }
    return out;
  }

  var headAdded = {};
  function adoptHelmet(doc) {
    var helmet = doc.querySelector("x-dc > helmet");
    if (!helmet) return;
    Array.prototype.forEach.call(helmet.children, function (el) {
      var tag = el.tagName.toLowerCase();
      var id = tag === "link" ? el.getAttribute("href") : el.textContent;
      if (headAdded[id]) return;
      headAdded[id] = true;
      if (tag === "link" || tag === "style") document.head.appendChild(document.importNode(el, true));
    });
  }

  function compile(doc) {
    var tpl = doc.querySelector("x-dc");
    var script = doc.querySelector('script[type="text/x-dc"]');
    var Comp = new Function("DCLogic", "React", script.textContent + "\nreturn Component;")(DCLogic, R);
    Comp.__tpl = tpl;
    Comp.defaultProps = defaultsFrom(script);
    adoptHelmet(doc);
    return Comp;
  }

  function loadImports(doc) {
    var names = {};
    doc.querySelectorAll("dc-import").forEach(function (n) { names[n.getAttribute("name")] = true; });
    return Promise.all(Object.keys(names).filter(function (n) { return !loaded[n]; }).map(function (name) {
      loaded[name] = null;
      return fetch(name + ".dc.html")
        .then(function (r) { if (!r.ok) throw new Error(name + ".dc.html: " + r.status); return r.text(); })
        .then(function (html) {
          var sub = new DOMParser().parseFromString(html, "text/html");
          return loadImports(sub).then(function () { loaded[name] = compile(sub); });
        });
    }));
  }

  /* ---------- mount the page ---------- */
  var root, Page, theme;
  function render() {
    root.render(R.createElement(Page, { theme: theme }));
  }

  window.DCLite = {
    getTheme: function () { return theme; },
    setTheme: function (t) {
      theme = t;
      try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* private window */ }
      document.documentElement.setAttribute("data-theme", t);
      render();
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    loadImports(document).then(function () {
      Page = compile(document);
      // The template is kept in memory; take it out of the page so its raw
      // inputs and ids don't clash with the rendered ones.
      Page.__tpl.remove();
      theme = savedTheme() || Page.defaultProps.theme || "light";
      document.documentElement.setAttribute("data-theme", theme);
      var mount = document.createElement("div");
      mount.id = "dc-root";
      document.body.insertBefore(mount, document.body.firstChild);
      root = RD.createRoot(mount);
      render();
      document.dispatchEvent(new CustomEvent("dc-lite:ready"));
    }).catch(function (err) {
      document.body.insertAdjacentHTML("afterbegin",
        '<p style="font:16px system-ui;padding:24px;color:#b42318">This screen could not load: ' +
        String(err.message || err) + ". Open it through the dev server (npm run dev), not as a file.</p>");
    });
  });
})();
