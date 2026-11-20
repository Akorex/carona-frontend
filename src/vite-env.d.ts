/// <reference types="vite/client" />

// The variables we read from .env. Only names starting with VITE_ reach the browser.
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
