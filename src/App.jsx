import { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import { clearAuthData, isLoggedIn } from "./utils/auth";

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
        <Dashboard onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
