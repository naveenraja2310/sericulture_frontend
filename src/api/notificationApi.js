import axios from "axios";
import { getStoredDeviceId } from "../utils/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getNotifications = async ({ page = 1, limit = 10, deviceId } = {}) => {
  const id = deviceId || getStoredDeviceId();
  const params = { page, limit };
  if (id) params.device_id = id;
  const res = await API.get("/notification", { params });
  return res.data;
};

export default API;
