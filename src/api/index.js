import axios from "axios";
import { toast } from "sonner";
import store from "@/store";
import { logout } from "@/store/slices/authSlice";
import { persistor } from "@/store";
import { queryClient } from "@/context/QueryProvider";
import { navigateTo } from "@/utils/navigate";
import { isManualLogout, setManualLogout } from "@/utils/logoutFlag";
import { triggerGlobalError } from "@/utils/globalErrorHandler";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const isFormData = config.data instanceof FormData;
  let hasFile = false;

  if (isFormData) {
    for (let value of config.data.values()) {
      if (value instanceof File || value instanceof Blob) {
        hasFile = true;
        break;
      }
    }

    if (!hasFile) {
      // Convert to JSON if no file is found
      const jsonData = {};
      config.data.forEach((value, key) => {
        jsonData[key] = value;
      });
      config.data = jsonData;
      config.headers["Content-Type"] = "application/json";
    } else {
      // Let the browser set proper multipart/form-data headers
      delete config.headers["Content-Type"];
    }
  } else {
    // Not FormData? Assume JSON
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent retry loop on refresh endpoint
    if (originalRequest.url === "refresh/") {
      return Promise.reject(error);
    }

    // If there's no response at all (server is down, CORS, etc.)
    if (!error.response) {
      toast.error("Unable to connect to the server", {
        description:
          "Please check your internet connection or try again later.",
        richColors: true,
      });
      
      // Trigger global error handler for critical network failures
      triggerGlobalError({
        type: "NETWORK_ERROR",
        message: "Unable to connect to the server",
        originalError: error,
      });
      
      return Promise.reject(error);
    }

    // Get current auth state from Redux
    const { auth } = store.getState();

    // Server error (5xx)
    if (error.response.status >= 500) {
      toast.error("Server Error", {
        description: "Something went wrong on the server. Please try again later.",
        richColors: true,
      });
      
      // Trigger global error handler for server errors
      triggerGlobalError({
        type: "SERVER_ERROR",
        message: "Server error occurred",
        status: error.response.status,
        originalError: error,
      });
    }

    // Token expired
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      auth.isAuthenticated
    ) {
      originalRequest._retry = true;

      try {
        await api.post("refresh/");
        return api(originalRequest);
      } catch (refreshError) {
        try {
          await api.post("logout/", null);
        } catch (logoutError) {}

        await persistor.purge();
        queryClient.clear();
        store.dispatch(logout());

        if (!isManualLogout) {
          toast.error("Session Expired", {
            description:
              "Your session has expired. Please log in again to continue.",
            richColors: true,
          });
        }

        // Reset manual flag
        setManualLogout(false);

        navigateTo("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export { default as leaderApi } from "./leaderApi";
export * as trainingsApi from "./trainingsApi";
