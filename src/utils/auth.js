const IS_ADMIN_KEY = "isAdmin";
const DEVICE_ID_KEY = "deviceId";
const LoggedInKey = "loggedIn";

export const getStoredIsAdmin = () => localStorage.getItem(IS_ADMIN_KEY) === "true";
export const getStoredDeviceId = () => localStorage.getItem(DEVICE_ID_KEY);

export const isLoggedIn = () => Boolean(localStorage.getItem(LoggedInKey));

export const saveAuthData = ({ deviceId, isAdmin }) => {
  if (deviceId) localStorage.setItem(DEVICE_ID_KEY, deviceId);
  if (isAdmin !== undefined) localStorage.setItem(IS_ADMIN_KEY, String(Boolean(isAdmin)));
  localStorage.setItem(LoggedInKey, "true");
};

export const clearAuthData = () => {
  localStorage.removeItem(DEVICE_ID_KEY);
  localStorage.removeItem(IS_ADMIN_KEY);
  localStorage.removeItem(LoggedInKey); 
};
