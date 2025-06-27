// frontend/src/features/stats/statsService.js
// --- FINAL, COMPLETE VERSION ---

import axios from 'axios';

const API_URL = '/api/stats/';

// Helper function to create the authorization header config
const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get task completion stats for the last 7 days chart
const getTaskStats = async (token) => {
  const response = await axios.get(API_URL + 'tasks-by-day', getConfig(token));
  return response.data;
};

// Get the most popular task categories
const getPopularCategories = async (token) => {
  const response = await axios.get(API_URL + 'popular-categories', getConfig(token));
  return response.data;
};

const statsService = {
  getTaskStats,
  getPopularCategories,
};

export default statsService;