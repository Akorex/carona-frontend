// Light values live on :root; dark ones switch on with data-theme="dark" on <html>.
// Follow the computer's setting, and keep following it if it changes.
export function followSystemTheme() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const apply = () => {
    document.documentElement.dataset.theme = media.matches ? "dark" : "light";
  };
  apply();
  media.addEventListener("change", apply);
}
