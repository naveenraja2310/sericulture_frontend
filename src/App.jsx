import { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import { clearAuthData, isLoggedIn } from "./utils/auth";
import { Routes, Route, Navigate } from "react-router-dom";
import ThresholdTimer from "./pages/ThresholdTimer";
import SetStage from "./pages/SetStage";
import ContactUs from "./pages/ContactUs";
import FooterNav from "./components/FooterNav";

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setLoggedIn(false);
  };

  return (
    <>
      <Toaster position="top-center" />
      {!loggedIn ? (
        <Login setLoggedIn={setLoggedIn} />
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
            <Route path="/threshold" element={<ThresholdTimer />} />
            <Route path="/setstage" element={<SetStage />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <FooterNav />
        </>
      )}
    </>
  );
}

export default App;
