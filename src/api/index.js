import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});


api.interceptors.request.use(config => {
  // Convert to JSON for specific endpoints
  if (config.url?.includes('/starting_lineup/')) {
    config.headers['Content-Type'] = 'application/json';
    
    // Convert FormData to JSON if needed
    if (config.data instanceof FormData) {
      const jsonData = {};
      config.data.forEach((value, key) => {
        jsonData[key] = value;
      });
      config.data = jsonData;
    }
  }  
  
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle server connection errors (e.g., server is down)
    if (!error.response) {
      toast.error("Unable to connect to the server", {
        description:
          "Please check your internet connection or try again later.",
        richColors: true,
      });
      return Promise.reject(error);
    }

    // Prevent retry loop on refresh endpoint
    if (originalRequest.url === "refresh/") {
      return Promise.reject(error);
    }

    // If access token is expired (401), attempt to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request to avoid loops

      try {
        // Attempt to refresh the token
        await api.post("refresh/");

        // Retry the original request with the new access token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout the user
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
