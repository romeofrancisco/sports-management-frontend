// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAntExOd_2zfY4JoBYXeJd1Uw94s0h7zjE",
  authDomain: "sports-management2025.firebaseapp.com",
  projectId: "sports-management2025",
  storageBucket: "sports-management2025.firebasestorage.app",
  messagingSenderId: "919143438314",
  appId: "1:919143438314:web:8cd52120fa007e0078c493",
  measurementId: "G-87X3F7W8KW"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestFirebaseNotificationPermission = async () => {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Get FCM token
    const token = await getToken(messaging, { 
      vapidKey: "BIg3lx-R24LcfiRnub1xv3s6I76TBMHOjYrQJgRk2Ti0Dz-fuaQayXSnugnISwho7B_40tGKlbRzLOwQuT_hfNs" 
    });
    
    console.log("FCM Token:", token);
    return token;
  } catch (err) {
    console.error("FCM permission error:", err);
    return null;
  }
};

// Handle messages while app is in foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      resolve(payload);
    });
  });

export { messaging };
export default app;
