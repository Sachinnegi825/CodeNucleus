import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Crucial for JWT Cookies
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // If refresh successful, retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or clear state
        console.error("Refresh token expired or invalid");
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export default api;