import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useGlobalChatWebSocket } from "./hooks/useGlobalChatWebSocket";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import api from "./api";
import { requestFirebaseNotificationPermission, onMessageListener } from "../firebase";
import { syncSettingsToServiceWorker } from "./utils/notificationSettings";

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Sync notification settings to service worker on app load and when page becomes visible
  // This ensures the service worker always has the latest mute settings
  useEffect(() => {
    // Sync after service worker is ready
    const syncSettings = () => {
      syncSettingsToServiceWorker();
    };

    // Initial sync after a delay to ensure SW is ready
    const timer = setTimeout(syncSettings, 1000);

    // Also sync when page becomes visible (in case SW was reset)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncSettings();
      }
    };

    // Sync when SW controller changes (new SW activated)
    const handleControllerChange = () => {
      console.log('[App] Service worker controller changed, syncing settings');
      syncSettings();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    navigator.serviceWorker?.addEventListener('controllerchange', handleControllerChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      navigator.serviceWorker?.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  // Initialize FCM for push notifications
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeFCM();
    }
  }, [isAuthenticated, user]);

  const initializeFCM = async () => {
    try {
      const chatNotificationsEnabled = JSON.parse(
        localStorage.getItem("chatNotificationsEnabled") ?? "true"
      );

      if (!chatNotificationsEnabled) return;

      // Request FCM permission and get token (this gets a fresh token each time)
      const token = await requestFirebaseNotificationPermission();
      
      if (token) {
        
        // Save token to backend
        try {
          await api.post("/chat/fcm/save-token/", { token });
          console.log("[FCM] Token saved to backend");
        } catch (err) {
          console.error("[FCM] Failed to save token:", err);
        }

        // Just log foreground messages, don't show notification
        // The service worker will handle all notifications
        onMessageListener()
          .then((payload) => {
            console.log("Received foreground message:", payload);
            // Don't create notification here - FCM service worker handles it
          })
          .catch((err) => console.error("Failed to receive message:", err));
      } else {
        console.warn("[FCM] No token received");
      }
    } catch (error) {
      console.error("FCM initialization error:", error);
    }
  };

  // Register service worker and request notification permission on app load
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          // Force update the service worker to get latest mute settings logic
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            { scope: "/", updateViaCache: "none" }
          );
          console.log("Service Worker registered successfully:", registration);
          
          // Check for updates
          registration.update();

          // Request notification permission
          if (Notification.permission === "default") {
            await Notification.requestPermission();
          }
        } catch (err) {
          console.error("Service Worker registration failed:", err);
        }
      });
    }
  }, []);

  // Initialize global chat WebSocket for real-time notifications
  useGlobalChatWebSocket();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
