import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
// Use the inlined Firebase initialization from `index.html` when available.
// Call `getFcmToken` once the window has loaded so the inline script
// (which defines `window.getFcmToken`) has executed.
// Do NOT request notification permission automatically on app open.
// Call `window.getFcmToken()` explicitly after user action (e.g. login)
// to avoid prompting or unexpected notifications when the PWA starts.
