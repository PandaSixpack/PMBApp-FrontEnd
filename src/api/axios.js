import axios from 'axios';

export const BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://apipmb.polbis.ac.id' 
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

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

export default api;
