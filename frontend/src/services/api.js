import axios from 'axios';

export const getAssetUrl = (url) => {
  if (!url || /^(https?:|blob:|data:)/i.test(url)) return url;
  const backendOrigin = import.meta.env.VITE_API_ORIGIN || 'http://127.0.0.1:5001';
  return `${backendOrigin}${url.startsWith('/') ? url : `/${url}`}`;
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add Bearer token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devcore_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid or expired
      localStorage.removeItem('devcore_token');
      localStorage.removeItem('devcore_user');
    }
    return Promise.reject(error);
  }
);

export default api;
