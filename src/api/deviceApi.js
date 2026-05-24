import axios from "axios";
import { getStoredDeviceId } from "../utils/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

const defaultDeviceId = "YADH-B4ACF589";

export const getDeviceId = () => getStoredDeviceId() || defaultDeviceId;

export const getStatus = async () => {
  const deviceId = getDeviceId();
  const res = await API.get(`/device/${deviceId}/status`);
  return res.data;
};

export const toggleDevice = async (device, action) => {
  const deviceId = getDeviceId();
  await API.post(`/device/${deviceId}/${device}/${action}`);
};

export const setMode = async (mode) => {
  const deviceId = getDeviceId();
  await API.post(`/device/${deviceId}/mode/${mode}`);
};

export const setStage = async (stage) => {
  const deviceId = getDeviceId();
  await API.post(`/device/${deviceId}/set-stage`, {
    stage
  });
};

export const setTempThreshold = async (value) => {
  const deviceId = getDeviceId();
  await API.post(`/device/${deviceId}/temp-threshold`, {
    value
  });
};

export const setHumThreshold = async (value) => {
  const deviceId = getDeviceId();
  await API.post(`/device/${deviceId}/hum-threshold`, {
    value
  });
};

export const setFanCycle = async (minutes) => {
  const deviceId = getDeviceId();
  await API.post(`/device/${deviceId}/fan-cycle`, {
    minutes
  });
};
