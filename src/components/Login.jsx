import { useState } from "react";

function Login({ setLoggedIn }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("token", "dummy-token");
      setLoggedIn(true);
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <i className="ti ti-leaf" aria-hidden="true" />
        </div>

        <h1>Sericulture IoT</h1>
        <p>Smart monitoring system for silkworm farms</p>

        <div className="input-group">
          <i className="ti ti-user input-icon" aria-hidden="true" />
          <input type="text" placeholder="Username" autoComplete="username" />
        </div>

        <div className="input-group">
          <i className="ti ti-lock input-icon" aria-hidden="true" />
          <input type="password" placeholder="Password" autoComplete="current-password" />
        </div>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? (
            <>
              <i className="ti ti-loader-2" style={{ marginRight: 6, animation: "spin 0.9s linear infinite", display: "inline-block" }} aria-hidden="true" />
              Signing in…
            </>
          ) : (
            <>
              <i className="ti ti-login" style={{ marginRight: 6 }} aria-hidden="true" />
              Sign In
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Login;