import axios from "axios";
import { clearAuthData, getStoredToken } from "../utils/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    if (error?.response?.status === 401) {
      clearAuthData();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
