import axios from "axios";
import { getStoredDeviceId } from "../utils/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

export const getDeviceId = () => getStoredDeviceId() 

export const getStatus = async (deviceId) => {
  const id = deviceId || getDeviceId();
  const res = await API.get(`/device/${id}/status`);
  return res.data;
};

// internal api functions (accept deviceId first)
const apiSendDeviceAction = async (deviceId, device, action) => {
  const id = deviceId || getDeviceId();
  await API.post(`/device/${id}/${device}/${action}`);
};

const apiSetMode = async (deviceId, mode) => {
  const id = deviceId || getDeviceId();
  await API.post(`/device/${id}/mode/${mode}`);
};

const apiSetStage = async (deviceId, stage) => {
  const id = deviceId || getDeviceId();
  await API.post(`/device/${id}/set-stage`, {
    stage
  });
};

const apiSetTempThreshold = async (deviceId, value) => {
  const id = deviceId || getDeviceId();
  await API.post(`/device/${id}/temp-threshold`, {
    value
  });
};

const apiSetHumThreshold = async (deviceId, value) => {
  const id = deviceId || getDeviceId();
  await API.post(`/device/${id}/hum-threshold`, {
    value
  });
};

const apiSetFanCycle = async (deviceId, minutes) => {
  const id = deviceId || getDeviceId();
  await API.post(`/device/${id}/fan-cycle`, {
    minutes
  });
};

const apiSetStageSettings = async (deviceId, settings) => {
  const id = deviceId || getDeviceId();
  await API.post(`/device/${id}/stage-settings`, settings);
};

export const getTelemetries = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const res = await API.get('/get-all-telemetry', { params: { page, limit, search } });
  return res.data;
};

// Backwards-compatible wrappers (old signatures used across the app)
export const sendDeviceAction = async (deviceIdOrDevice, maybeDevice, maybeAction) => {
  // Support (deviceId, device, action) or (device, action)
  if (maybeAction !== undefined) {
    return apiSendDeviceAction(deviceIdOrDevice, maybeDevice, maybeAction);
  }
  return apiSendDeviceAction(undefined, deviceIdOrDevice, maybeDevice);
};

export const toggleDevice = async (device, action) => {
  return apiSendDeviceAction(undefined, device, action);
};

export const setMode = async (a, b) => {
  // setMode(mode) OR setMode(deviceId, mode)
  if (b === undefined) return apiSetMode(undefined, a);
  return apiSetMode(a, b);
};

export const setStage = async (a, b) => {
  if (b === undefined) return apiSetStage(undefined, a);
  return apiSetStage(a, b);
};

export const setTempThreshold = async (a, b) => {
  if (b === undefined) return apiSetTempThreshold(undefined, a);
  return apiSetTempThreshold(a, b);
};

export const setHumThreshold = async (a, b) => {
  if (b === undefined) return apiSetHumThreshold(undefined, a);
  return apiSetHumThreshold(a, b);
};

export const setFanCycle = async (a, b) => {
  if (b === undefined) return apiSetFanCycle(undefined, a);
  return apiSetFanCycle(a, b);
};

export const setStageSettings = async (a, b) => {
  // setStageSettings(settings) OR setStageSettings(deviceId, settings)
  if (b === undefined) return apiSetStageSettings(undefined, a);
  return apiSetStageSettings(a, b);
};
