import API from "./apiClient";
import { getStoredDeviceId } from "../utils/auth";

export const getNotifications = async ({ page = 1, limit = 10, deviceId } = {}) => {
  const id = deviceId || getStoredDeviceId();
  const params = { page, limit };
  if (id) params.device_id = id;
  const res = await API.get("/notification", { params });
  return res.data;
};

export default API;
