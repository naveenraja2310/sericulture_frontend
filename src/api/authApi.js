import API from "./apiClient";

export const login = async (credentials) => {
  const response = await API.post("/login", credentials);
  return response.data;
};

export const logout = async (deviceId) => {
  console.log("Logging out device with ID:", deviceId);
  if (!deviceId) return;
  await API.put(`/logout/${deviceId}`);
};
