import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../api/authApi";
import { getStoredRememberedCredentials, saveAuthData, saveRememberedCredentials } from "../utils/auth";
import { updateUser } from "../api/userApi";

function Login({ setLoggedIn }) {
  const rememberedCredentials = getStoredRememberedCredentials();
  const [username, setUsername] = useState(rememberedCredentials.username);
  const [password, setPassword] = useState(rememberedCredentials.password);
  const [rememberMe, setRememberMe] = useState(rememberedCredentials.rememberMe);
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
        const token = response.data?.token || "";
        const user = response.data?.user || response.data || {};
        const resolvedDeviceId = user.deviceId || user.deviceID || user.DeviceID || user.device_id || "";
        console.log("Resolved user object:", user);

        saveRememberedCredentials({ username, password, rememberMe });

        saveAuthData({
          userId: user.id || user._id,
          deviceId: resolvedDeviceId,
          isAdmin: Boolean(user.isAdmin),
          isSuperAdmin: Boolean(user.isSuperAdmin),
          token,
        });

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

        toast.success("Login successful");
        setLoggedIn(true);
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
        <div>
          <h1 className="login-title">PKS EC Solution</h1>
          <p className="login-subtitle">Smart Sericulture Solution</p>
        </div>
      </div>

      <div className="login-divider" />

      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <div className="input-group">
          <i className="ti ti-user input-icon" aria-hidden="true" />
          <input
            id="username" name="username" type="text"
            value={username} onChange={e => setUsername(e.target.value)}
            placeholder="Username" autoComplete="username"
            autoCapitalize="none" spellCheck={false}
          />
        </div>

        <div className="input-group">
          <i className="ti ti-lock input-icon" aria-hidden="true" />
          <input
            id="password" name="password" type="password"
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" autoComplete="current-password"
            autoCapitalize="none" spellCheck={false}
          />
        </div>

        {/* ── Remember me toggle ── */}
        <label className="remember-me-row">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
          />
          <div className={`remember-toggle ${rememberMe ? "on" : "off"}`} />
          <div className="remember-label">
            <span>Remember me</span>
            <span>{rememberMe ? "Credentials saved" : "Sign in each time"}</span>
          </div>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <i className="ti ti-loader-2"
                style={{ animation: "spin 0.9s linear infinite" }}
                aria-hidden="true"
              />
              Signing in…
            </>
          ) : (
            <>
              <i className="ti ti-login" aria-hidden="true" />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="login-footer">
        <div className="login-footer__version">v2.1.0</div>
        <div className="login-footer__powered">Powered by Yadhronics Private Limited</div>
      </div>

    </div>
  </div>
  );
}

export default Login;