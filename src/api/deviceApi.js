import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

const DEVICE_ID = "YADH-B4ACF589";

export const getStatus = async () => {
  const res = await API.get(`/device/${DEVICE_ID}/status`);
  return res.data;
};

export const toggleDevice = async (device, action) => {
  await API.post(`/device/${DEVICE_ID}/${device}/${action}`);
};

export const setMode = async (mode) => {
  await API.post(`/device/${DEVICE_ID}/mode/${mode}`);
};

export const setTempThreshold = async (value) => {
  await API.post(`/device/${DEVICE_ID}/temp-threshold`, {
    value
  });
};

export const setHumThreshold = async (value) => {
  await API.post(`/device/${DEVICE_ID}/hum-threshold`, {
    value
  });
};

export const setFanCycle = async (minutes) => {
  await API.post(`/device/${DEVICE_ID}/fan-cycle`, {
    minutes
  });
};
