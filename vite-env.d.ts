// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_AUTH_URL: string; // Add your environment variables here
  // Define more variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
