import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "../i18n.js";
import { registerSW } from "../registerServiceWorker.js";
import { Provider } from "react-redux";
import store from "./store/store";

const sentryDsn = import.meta.env.VITE_APP_SENTRY_DSN;

if (sentryDsn) {
  import("@sentry/react").then((Sentry) => {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [],
    });
  });
}

const container = document.getElementById("root");
if (!container) throw new Error("Root container not found.");

const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

registerSW();
