import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useGlobalChatWebSocket } from "./hooks/useGlobalChatWebSocket";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import api from "./api";
import { requestFirebaseNotificationPermission, onMessageListener } from "../firebase";

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

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

      // Request FCM permission and get token
      const token = await requestFirebaseNotificationPermission();
      
      if (token) {
        // Save token to backend
        await api.post("/chat/fcm/save-token/", { token });

        // Just log foreground messages, don't show notification
        // The service worker will handle all notifications
        onMessageListener()
          .then((payload) => {
            console.log("Received foreground message:", payload);
            // Don't create notification here - FCM service worker handles it
          })
          .catch((err) => console.error("Failed to receive message:", err));
      }
    } catch (error) {
      console.error("FCM initialization error:", error);
    }
  };

  // Register service worker and request notification permission on app load
  useEffect(() => {
    const chatNotificationsEnabled = JSON.parse(
      localStorage.getItem("chatNotificationsEnabled") ?? "true"
    );

    if (!chatNotificationsEnabled) return;

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            { scope: "/" }
          );
          console.log("Service Worker registered successfully:", registration);

          // Request notification permission
          if (Notification.permission === "default") {
            await Notification.requestPermission();
          }

          // Disable Web Push API subscription since we're using FCM
          // if (Notification.permission === "granted" && isAuthenticated) {
          //   await subscribeToPushNotifications(registration);
          // }
        } catch (err) {
          console.error("Service Worker registration failed:", err);
        }
      });
    }
  }, [isAuthenticated]);

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
