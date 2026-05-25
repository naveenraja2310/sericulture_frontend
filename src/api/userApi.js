import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const createUser = async (user) => {
  const res = await API.post('/user', user);
  return res.data;
};

export const updateUser = async (id, user) => {
    console.log('Updating user with ID:', id, 'Data:', user);
  const res = await API.put(`/user/${id}`, user);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/user/${id}`);
  return res.data;
};

export const getUser = async (id) => {
  const res = await API.get(`/user/${id}`);
  return res.data;
};

export const getUsers = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const res = await API.get('/users', { params: { page, limit, search } });
  return res.data;
};

export default API;
