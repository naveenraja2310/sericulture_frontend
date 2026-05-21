import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

export const login = async (credentials) => {
  const response = await API.post("/login", credentials);
  return response.data;
};
