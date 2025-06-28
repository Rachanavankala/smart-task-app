// frontend/src/features/ai/aiService.js
// --- FINAL, COMPLETE VERSION ---

import axios from 'axios';
import authService from '../auth/authService';

const API_URL = import.meta.env.PROD
  ? `${import.meta.env.VITE_API_URL}/api/ai/`
  : '/api/ai/';
  ;

/**
 * Calls the backend to generate a description from a task title.
 * @param {string} title - The title of the task.
 * @returns {Promise<object>} The response data, e.g., { description: "..." }.
 */
const generateDescription = async (title) => {
  const config = {
    headers: authService.authHeader(),
  };
  const response = await axios.post(
    API_URL + 'generate-description',
    { title },
    config
  );
  return response.data;
};

/**
 * Calls the backend to predict a category from a task title.
 * @param {string} title - The title of the new task.
 * @returns {Promise<object>} The response data, e.g., { category: "Work" }.
 */
const predictCategory = async (title) => {
  const config = {
    headers: authService.authHeader(),
  };
  const response = await axios.post(
    API_URL + 'predict-category',
    { title },
    config
  );
  return response.data;
};


const aiService = {
  generateDescription,
  predictCategory, // Export the new function
};

export default aiService;