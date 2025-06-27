// frontend/src/features/admin/adminService.js
import axios from 'axios';
const API_URL = '/api/admin/users/';

const getUsers = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const deactivateUser = async (userId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(API_URL + userId + '/deactivate', {}, config);
  return response.data;
};

const adminService = { getUsers, deactivateUser };
export default adminService;