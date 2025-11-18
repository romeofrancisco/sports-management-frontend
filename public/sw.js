// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/perpetual_logo_small.png', // Use perpetual logo for notifications
      badge: '/perpetual_logo_small.png',
      tag: `chat-${data.team_id || 'general'}`,
      requireInteraction: true,
      data: {
        team_id: data.team_id,
        message_id: data.message_id
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const teamId = event.notification.data?.team_id;
  const url = teamId ? `/chat/${teamId}` : '/chat';

  event.waitUntil(
    clients.openWindow(url)
  );
});