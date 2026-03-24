import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Crucial for JWT Cookies
});

// Centralized Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    console.error("API Error:", message);
    return Promise.reject(message);
  }
);

export default api;