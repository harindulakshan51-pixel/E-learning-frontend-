import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true });
export const errorMessage = error => error.response?.data?.message || 'Unable to connect. Please try again.';
