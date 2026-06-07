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

    let permissionPromise = null;
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        permissionPromise = Notification.requestPermission().catch((e) => {
          console.warn('Permission request failed', e);
          return null;
        });
      } else {
        permissionPromise = Promise.resolve(Notification.permission);
      }
    } catch (err) {
      console.warn('Failed to initiate permission request', err);
      permissionPromise = Promise.resolve(null);
    }

    try {
      const response = await login({ username, password });
      console.log("Login response", response);
      if (response?.statusCode === 200 && response?.data) {
        const user = response.data?.user || response.data;
        console.log("Resolved user object:", user);

        saveAuthData({
          userId: user.id,
          deviceId: user.deviceId,
          isAdmin: user.isAdmin
        });

        toast.success("Login successful");
        setLoggedIn(true);

        try {
          const perm = await permissionPromise;
          console.log('Notification permission result:', perm);
          if (perm === 'granted') {
            if (window.getFcmToken) {
              // Wait for SW to be fully active before fetching token (critical for PWA)
              if ('serviceWorker' in navigator) {
                await navigator.serviceWorker.ready;
              }
              const fcmToken = await window.getFcmToken();
              console.log('Fetched FCM token post-login:', fcmToken);
              if (fcmToken) {
                const updateResponse = await updateUser(user.id, { fcmToken });
                console.log("FCM update response:", updateResponse);
              }
            }
          } else {
            console.log('Notification permission not granted; skipping token save');
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
            <img src="/icons/icon-192.png" alt="SeriSmart Logo" className="header-logo" />
          </div>
          <h1>Sericulture IOT</h1>
        </div>

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
        <p className="app-version">app v1.0.2</p>
      </div>
    </div>
  );
}

export default Login;