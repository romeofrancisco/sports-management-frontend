// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
let messaging = null;

// Only initialize messaging if supported
try {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    messaging = getMessaging(app);
  }
} catch (err) {
  console.warn('Firebase Messaging not supported:', err);
}

export const requestFirebaseNotificationPermission = async () => {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Register service worker first (force update to get latest version)
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      updateViaCache: 'none'
    });
    
    // Check for updates
    await registration.update();

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;

    // Get FCM token with service worker registration
    const token = await getToken(messaging, { 
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    
    if (token) {
      console.log('[Firebase] FCM token obtained successfully');
    } else {
      console.warn('[Firebase] No FCM token available');
    }
    
    return token;
  } catch (err) {
    console.error("[Firebase] FCM permission error:", err);
    return null;
  }
};

// Handle messages while app is in foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Message received in foreground: ", payload);
        resolve(payload);
      });
    }
  });

export { messaging };
export default app;
