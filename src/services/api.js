import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    // If we're in production, default to relative /api path
    // If in development, default to localhost:5000/api
    return import.meta.env.MODE === 'production' 
      ? '/api' 
      : 'http://localhost:5000/api';
  }
  
  // Ensure the URL ends with /api if it doesn't already
  return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the authentication header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login or clear token)
      localStorage.removeItem('token');
      // Optional: window.location.href = '/login'; 
      // Better handled in AuthContext or components to avoid hard page reloads
    }
    return Promise.reject(error);
  }
);

export default api;
