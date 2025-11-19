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

        // Listen for foreground messages
        onMessageListener()
          .then((payload) => {
            console.log("Received foreground message:", payload);
            // Show notification
            if (Notification.permission === "granted") {
              new Notification(payload.notification.title, {
                body: payload.notification.body,
                icon: "/perpetual_logo_small.png",
                data: payload.data,
              });
            }
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

  const subscribeToPushNotifications = async (registration) => {
    try {
      const response = await api.get("/chat/push/vapid-public-key/");
      const { public_key } = response.data;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(public_key),
      });

      // Send subscription to backend
      await api.post("/chat/push/subscribe/", {
        subscription: subscription,
        user_id: user.id,
      });
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

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
