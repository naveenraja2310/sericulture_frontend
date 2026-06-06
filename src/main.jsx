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

// Register the service worker for PWA / firebase messaging
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((reg) => {
      console.log('Service worker registered:', reg);
      return navigator.serviceWorker.ready;
    })
    .then((readyReg) => {
      console.log('Service worker ready:', readyReg);
    })
    .catch((err) => {
      console.error('Service worker registration failed:', err);
    });
}
