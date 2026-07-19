import { useEffect, useState } from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Devices from "./pages/Devices";
import { Toaster } from "react-hot-toast";
import { clearAuthData, isLoggedIn, getStoredIsAdmin, getStoredIsSuperAdmin, getStoredDeviceId } from "./utils/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import { logout } from "./api/authApi";
import ThresholdTimer from "./pages/ThresholdTimer";
import SetStage from "./pages/SetStage";
import Notification from "./pages/Notification";
import ContactUs from "./pages/ContactUs";
import OTA from "./pages/Ota";
import FooterNav from "./components/FooterNav";
import { DeviceDataProvider } from "./contexts/DeviceDataContext";

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [isAdmin, setIsAdmin] = useState(getStoredIsAdmin());
  const [isSuperAdmin, setIsSuperAdmin] = useState(getStoredIsSuperAdmin());

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setIsAdmin(isLoggedIn() && getStoredIsAdmin());
    setIsSuperAdmin(isLoggedIn() && getStoredIsSuperAdmin());
  }, []);

  useEffect(() => {
    setIsAdmin(loggedIn && getStoredIsAdmin());
    setIsSuperAdmin(loggedIn && getStoredIsSuperAdmin());
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

  const showAdminRoutes = isAdmin && !isSuperAdmin;
  const showSuperAdminRoutes = isSuperAdmin;

  const handleLogout = async () => {
    console.log("Initiating logout process for device ID:", getStoredDeviceId());
    try {
      await logout(getStoredDeviceId());
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      clearAuthData();
      setLoggedIn(false);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    }
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
            <Route path="/contact-us" element={<ContactUs />} />
            {showSuperAdminRoutes && <Route path="/ota" element={<OTA />} />}
            {showAdminRoutes ? (
              <>
                <Route path="/users" element={<Users />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/" element={<Navigate to="/users" replace />} />
              </>
            ) : showSuperAdminRoutes ? (
              <Route path="/" element={<Navigate to="/ota" replace />} />
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/threshold" element={<ThresholdTimer />} />
                <Route path="/setstage" element={<SetStage />} />
                <Route path="/notification" element={<Notification />} />
              </>
            )}
            <Route path="*" element={<Navigate to={showSuperAdminRoutes ? "/ota" : showAdminRoutes ? "/users" : "/"} replace />} />
          </Routes>
          <FooterNav isAdmin={showAdminRoutes} isSuperAdmin={isSuperAdmin} />
        </DeviceDataProvider>
      )}
    </>
  );
}

export default App;
