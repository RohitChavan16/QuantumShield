import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const stored = sessionStorage.getItem('sentinelfuse_auth');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('sentinelfuse_auth');
      sessionStorage.setItem('sentinelfuse_toast', 'Session expired — please sign in again.');
      window.location.href = '/login';
    }
    
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;
