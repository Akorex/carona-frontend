import { useEffect } from "react";

/*
  The designs (21 screens and the design system) are static pages in public/design/.
  Vite serves them as they are, outside React, so links to them are plain <a href>.
*/
export const DESIGN_HOME = "/design/index.html";

/** Small floating link to the design pages. Only shown while developing (npm run dev). */
export function DesignLink() {
  if (!import.meta.env.DEV) return null;
  return (
    <a className="cr-design-link" href={DESIGN_HOME}>
      Design
    </a>
  );
}

/** /design (without index.html) lands in React, so hand it over to the static pages. */
export function DesignRedirect() {
  useEffect(() => {
    window.location.replace(DESIGN_HOME);
  }, []);
  return null;
}
