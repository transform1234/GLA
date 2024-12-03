import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import '../i18n.js';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_APP_SENTRY_DSN,
  integrations: [],
});

const container = document.getElementById('root');
if (!container) throw new Error("Root container not found.");

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
