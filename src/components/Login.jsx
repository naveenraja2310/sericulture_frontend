import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../api/authApi";
import { saveAuthData } from "../utils/auth";
import { updateUser } from "../api/userApi";

function Login({ setLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    setLoading(true);

    // Request notification permission and FCM token early while still in the
    // user click handler so the browser will show the permission prompt.
    let preFcmToken = null;
    try {
      if (window.getFcmToken) {
        preFcmToken = await window.getFcmToken();
        console.log("Pre-login FCM token:", preFcmToken);
      }
    } catch (err) {
      console.warn("FCM token request was not completed before login", err);
    }

    try {
      const response = await login({ username, password });

      if (response?.statusCode === 200 && response?.data) {
        const user = response.data;

        saveAuthData({
          userId: user.id,
          deviceId: user.deviceId,
          isAdmin: user.isAdmin
        });

        toast.success("Login successful");
        setLoggedIn(true);

        // If we obtained an FCM token earlier, associate it with the user record.
        try {
          if (preFcmToken) {
            await updateUser(user.id, { fcmToken: preFcmToken });
          }
        } catch (err) {
          console.error('Failed to save FCM token', err);
        }
      } else {
        toast.error(response?.statusMessage || "Login failed");
      }
    } catch (error) {
      toast.error("Unable to login. Please check credentials.");
      console.error("Login error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            {/* <i className="ti ti-leaf" aria-hidden="true" /> */}
            <img src="/icons/icon-192.png" alt="SeriSmart Logo" className="header-logo" />
          </div>

          <h1>Sericulture IOT</h1>
        </div>
        {/* <p>Smart monitoring system for silkworm farms</p> */}

        <div className="input-group">
          <i className="ti ti-user input-icon" aria-hidden="true" />
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            autoComplete="username"
          />
        </div>

        <div className="input-group">
          <i className="ti ti-lock input-icon" aria-hidden="true" />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
          />
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