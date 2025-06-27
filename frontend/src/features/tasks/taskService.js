// frontend/src/features/tasks/taskService.js
import axios from 'axios';
const API_URL = '/api/tasks/';

const getConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });
const createTask = async (taskData, token) => { const response = await axios.post(API_URL, taskData, getConfig(token)); return response.data; };
const getTasks = async (token) => { const response = await axios.get(API_URL, getConfig(token)); return response.data; };
const getTasksDueToday = async (token) => { const response = await axios.get(API_URL + 'today', getConfig(token)); return response.data; };
const getUpcomingTasks = async (token) => { const response = await axios.get(API_URL + 'upcoming', getConfig(token)); return response.data; };
const updateTask = async (taskData, token) => { const response = await axios.put(API_URL + taskData._id, taskData, getConfig(token)); return response.data; };
const deleteTask = async (taskId, token) => { const response = await axios.delete(API_URL + taskId, getConfig(token)); return response.data; };
const downloadTasks = async (token, format = 'csv') => {
  const config = { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' };
  const response = await axios.get(API_URL + `download?format=${format}`, config);
  const filename = format === 'pdf' ? 'tasks.pdf' : (format === 'excel' ? 'tasks.xlsx' : 'tasks.csv');
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
const taskService = { createTask, getTasks, updateTask, deleteTask, getTasksDueToday, getUpcomingTasks, downloadTasks };
export default taskService;