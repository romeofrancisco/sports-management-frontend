// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAntExOd_2zfY4JoBYXeJd1Uw94s0h7zjE",
  authDomain: "sports-management2025.firebaseapp.com",
  projectId: "sports-management2025",
  storageBucket: "sports-management2025.appspot.com",
  messagingSenderId: "919143438314",
  appId: "1:919143438314:web:8cd52120fa007e0078c493"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  // Extract title and body from data field (backend sends data-only currently)
  const notificationTitle = payload.data?.title || payload.notification?.title || 'New Message';
  const notificationBody = payload.data?.body || payload.notification?.body || '';
  
  if (!notificationTitle || !notificationBody) {
    return;
  }
  
  const notificationOptions = {
    body: notificationBody,
    icon: '/perpetual_logo_small.png',
    badge: '/perpetual_logo_small.png',
    data: payload.data || {},
    requireInteraction: false,
    tag: payload.data?.team_id || payload.data?.game_id || 'default',
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Get the click action URL from the notification data
  const clickAction = event.notification.data?.click_action || '/';
  
  // Open or focus the app window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus().then(() => {
              // Navigate to the click action URL
              return client.navigate(clickAction);
            });
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      })
  );
});
