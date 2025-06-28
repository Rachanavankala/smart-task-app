// frontend/src/features/admin/adminService.js
import axios from 'axios';
const API_URL = import.meta.env.PROD
  ? `${import.meta.env.VITE_API_URL}/api/auth/`
  : '/api/auth/';
  ;

const getUsers = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'users', config);
  return response.data;
};
const deactivateUser = async (userId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(API_URL + `users/${userId}/deactivate`, {}, config);
  return response.data;
};
const getUserTasks = async (userId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + `users/${userId}/tasks`, config);
  return response.data;
};
const generateReport = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'tasks/report', config);
  return response.data;
};

const adminService = { getUsers, deactivateUser, getUserTasks, generateReport };
export default adminService;