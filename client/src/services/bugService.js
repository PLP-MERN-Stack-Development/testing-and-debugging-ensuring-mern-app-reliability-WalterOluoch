import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    console.log('Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getBugs = async () => {
  try {
    const response = await api.get('/bugs');
    return response.data;
  } catch (error) {
    console.error('Error fetching bugs:', error);
    throw error;
  }
};

export const getBugById = async (id) => {
  try {
    const response = await api.get(`/bugs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bug:', error);
    throw error;
  }
};

export const createBug = async (bugData) => {
  try {
    const response = await api.post('/bugs', bugData);
    return response.data;
  } catch (error) {
    console.error('Error creating bug:', error);
    throw error;
  }
};

export const updateBug = async (id, bugData) => {
  try {
    const response = await api.put(`/bugs/${id}`, bugData);
    return response.data;
  } catch (error) {
    console.error('Error updating bug:', error);
    throw error;
  }
};

export const deleteBug = async (id) => {
  try {
    const response = await api.delete(`/bugs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting bug:', error);
    throw error;
  }
};
