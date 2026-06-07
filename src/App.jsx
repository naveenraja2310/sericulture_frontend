import { useEffect, useState } from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Devices from "./pages/Devices";
import { Toaster } from "react-hot-toast";
import { clearAuthData, isLoggedIn, getStoredIsAdmin } from "./utils/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import ThresholdTimer from "./pages/ThresholdTimer";
import SetStage from "./pages/SetStage";
import Notification from "./pages/Notification";
import FooterNav from "./components/FooterNav";
import { DeviceDataProvider } from "./contexts/DeviceDataContext";

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [isAdmin, setIsAdmin] = useState(getStoredIsAdmin());

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setIsAdmin(isLoggedIn() && getStoredIsAdmin());
  }, []);

  useEffect(() => {
    setIsAdmin(loggedIn && getStoredIsAdmin());
  }, [loggedIn]);

useEffect(() => {

  navigator.serviceWorker?.addEventListener("message", (event) => {

    console.log("Message from SW:", event.data);

    if (
      event.data?.type === "FCM_RECEIVED" ||
      event.data?.type === "RAW_PUSH_RECEIVED"
    ) {

      localStorage.setItem(
        "lastNotification",
        JSON.stringify(event.data)
      );

      console.log("Push received successfully");
    }
  });

}, []);

  const handleLogout = () => {
    clearAuthData();
    setLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <>
      <Toaster position="top-center" />
      {!loggedIn ? (
        <Login setLoggedIn={setLoggedIn} />
      ) : (
        <DeviceDataProvider>
          <Header onLogout={handleLogout} />
          <Routes>
            {isAdmin ? (
              <>
                <Route path="/users" element={<Users />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/" element={<Navigate to="/users" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/threshold" element={<ThresholdTimer />} />
                <Route path="/setstage" element={<SetStage />} />
                <Route path="/notification" element={<Notification />} />
              </>
            )}
            <Route path="*" element={<Navigate to={isAdmin ? "/users" : "/"} replace />} />
          </Routes>
          <FooterNav isAdmin={isAdmin} />
        </DeviceDataProvider>
      )}
    </>
  );
}

export default App;
