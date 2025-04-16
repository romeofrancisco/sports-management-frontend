import axios from "axios";
import { toast } from "sonner";
import store from "@/store";
import { logout } from "@/store/slices/authSlice";
import { persistor } from "@/store";
import { queryClient } from "@/context/QueryProvider";
import { navigateTo } from "@/utils/navigate";
import { isManualLogout, setManualLogout } from "@/utils/logoutFlag";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Convert to JSON for specific endpoints
  if (config.url?.includes("/starting_lineup/")) {
    config.headers["Content-Type"] = "application/json";

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
      return Promise.reject(error);
    }

    // Get current auth state from Redux
    const { auth } = store.getState();

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
