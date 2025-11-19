// sw.js
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

messaging.onBackgroundMessage(function(payload) {
  console.log('[sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/perpetual_logo_small.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
