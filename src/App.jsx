import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <Toaster position="top-center" />

      {!loggedIn ? (
        <Login setLoggedIn={setLoggedIn} />
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;
