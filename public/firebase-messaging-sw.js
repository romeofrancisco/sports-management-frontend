// firebase-messaging-sw.js
// Version: 3.2.0 - Persist settings to IndexedDB so they survive SW restarts
const SW_VERSION = '3.2.0';

importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Force the new service worker to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    clients.claim().then(() => {
      // Load settings from IndexedDB on activation
      return loadSettingsFromDB();
    })
  );
});

firebase.initializeApp({
  apiKey: "AIzaSyAntExOd_2zfY4JoBYXeJd1Uw94s0h7zjE",
  authDomain: "sports-management2025.firebaseapp.com",
  projectId: "sports-management2025",
  storageBucket: "sports-management2025.appspot.com",
  messagingSenderId: "919143438314",
  appId: "1:919143438314:web:8cd52120fa007e0078c493"
});

const messaging = firebase.messaging();

// In-memory mute settings cache
let muteSettings = {
  globalEnabled: true,
  mutedTeams: []
};

// IndexedDB for persistence
const DB_NAME = 'NotificationSettingsSW';
const DB_VERSION = 1;
const STORE_NAME = 'settings';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

async function saveSettingsToDB() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key: 'muteSettings', value: muteSettings });
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (error) {
    // Error saving to IndexedDB
  }
}

async function loadSettingsFromDB() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('muteSettings');
    const result = await new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
    db.close();
    
    if (result && result.value) {
      muteSettings = result.value;
    }
  } catch (error) {
    // Error loading from IndexedDB
  }
}

// Listen for settings updates from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_MUTE_SETTINGS') {
    muteSettings.globalEnabled = event.data.globalEnabled;
    muteSettings.mutedTeams = event.data.mutedTeams || [];
    // Persist to IndexedDB
    saveSettingsToDB();
  }
  
  if (event.data && event.data.type === 'GET_MUTE_SETTINGS') {
    event.ports[0].postMessage(muteSettings);
  }
});

/**
 * Check if notifications should be shown based on mute settings
 */
function shouldShowNotification(data) {
  // Check global mute
  if (muteSettings.globalEnabled === false) {
    return false;
  }
  
  // Check team-specific mute
  const teamId = data.team_id;
  if (teamId && muteSettings.mutedTeams.length > 0) {
    const teamIdStr = teamId.toString();
    if (muteSettings.mutedTeams.includes(teamIdStr)) {
      return false;
    }
  }
  
  return true;
}

// Handle background messages
// Since we use data-only messages (no 'notification' field from backend),
// we have FULL CONTROL over whether to show notifications
messaging.onBackgroundMessage(function(payload) {
  // Get the data for mute checking
  const data = payload.data || {};
  
  // Check mute settings FIRST before anything else
  if (!shouldShowNotification(data)) {
    return; // Exit early - don't show anything
  }
  
  // If notification field exists (shouldn't happen with our backend), skip to avoid duplicates
  if (payload.notification) {
    return;
  }
  
  // Only show notification for data-only messages (no notification field)
  const notificationTitle = data.title || 'New Notification';
  const notificationBody = data.body || '';
  
  if (!notificationTitle) {
    return;
  }
  
  const notificationOptions = {
    body: notificationBody,
    icon: '/perpetual_logo_small.png',
    badge: '/status_bar_icon.png',
    data: data,
    requireInteraction: false,
    tag: data.team_id || data.game_id || data.event_id || data.reservation_id || Date.now().toString(),
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Get the click action URL from notification data
  // FCM puts the link in fcmOptions when using webpush config
  let clickAction = event.notification.data?.click_action || 
                    event.notification.data?.FCM_MSG?.link ||
                    '/';
  
  // If click_action is a full URL, extract just the path for navigation
  try {
    const url = new URL(clickAction);
    // If it's our domain, use just the pathname + search
    clickAction = url.pathname + url.search;
  } catch (e) {
    // clickAction is already a path, use as-is
  }
  
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
