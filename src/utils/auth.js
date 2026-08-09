const IS_ADMIN_KEY = "isAdmin";
const IS_SUPER_ADMIN_KEY = "isSuperAdmin";
const DEVICE_ID_KEY = "deviceId";
const USER_ID_KEY = "userId";
const TOKEN_KEY = "token";
const LoggedInKey = "loggedIn";
const REMEMBER_ME_KEY = "rememberMe";
const REMEMBERED_USERNAME_KEY = "rememberedUsername";
const REMEMBERED_PASSWORD_KEY = "rememberedPassword";

export const getStoredIsAdmin = () => localStorage.getItem(IS_ADMIN_KEY) === "true";
export const getStoredIsSuperAdmin = () => localStorage.getItem(IS_SUPER_ADMIN_KEY) === "true";
export const getStoredDeviceId = () => localStorage.getItem(DEVICE_ID_KEY) || "";
export const getStoredUserId = () => localStorage.getItem(USER_ID_KEY);
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || "";

export const getStoredRememberedCredentials = () => ({
  username: localStorage.getItem(REMEMBERED_USERNAME_KEY) || "",
  password: localStorage.getItem(REMEMBERED_PASSWORD_KEY) || "",
  rememberMe: localStorage.getItem(REMEMBER_ME_KEY) === "true",
});

export const saveRememberedCredentials = ({ username, password, rememberMe }) => {
  if (rememberMe && username) {
    localStorage.setItem(REMEMBERED_USERNAME_KEY, username);
    localStorage.setItem(REMEMBERED_PASSWORD_KEY, password || "");
    localStorage.setItem(REMEMBER_ME_KEY, "true");
    return;
  }

  localStorage.removeItem(REMEMBERED_USERNAME_KEY);
  localStorage.removeItem(REMEMBERED_PASSWORD_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
};

export const isLoggedIn = () => Boolean(localStorage.getItem(LoggedInKey)) && Boolean(getStoredToken());

export const saveAuthData = ({ userId, deviceId, isAdmin, isSuperAdmin, token }) => {
  const resolvedDeviceId = deviceId || getStoredDeviceId();

  if (userId) localStorage.setItem(USER_ID_KEY, userId);
  if (resolvedDeviceId) {
    localStorage.setItem(DEVICE_ID_KEY, resolvedDeviceId);
  }
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (isAdmin !== undefined) localStorage.setItem(IS_ADMIN_KEY, String(Boolean(isAdmin)));
  if (isSuperAdmin !== undefined) localStorage.setItem(IS_SUPER_ADMIN_KEY, String(Boolean(isSuperAdmin)));
  localStorage.setItem(LoggedInKey, "true");
};

export const clearAuthData = () => {
  localStorage.removeItem(DEVICE_ID_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(IS_ADMIN_KEY);
  localStorage.removeItem(IS_SUPER_ADMIN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LoggedInKey);

  if (localStorage.getItem(REMEMBER_ME_KEY) !== "true") {
    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem(REMEMBERED_USERNAME_KEY);
    localStorage.removeItem(REMEMBERED_PASSWORD_KEY);
  }
};
