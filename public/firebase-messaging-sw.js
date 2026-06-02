importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAZ0hFdQSmhYtW1Sz7fjOJCxKDzP2fPJb0",
  authDomain: "yadhronics.firebaseapp.com",
  projectId: "yadhronics",
  messagingSenderId: "15512986021",
  appId: "1:15512986021:web:07e08c346d935b9093484c"
});

const messaging = firebase.messaging();

self.addEventListener('install', (event) => {
  console.log('firebase-messaging-sw installed');
});

self.addEventListener('activate', (event) => {
  console.log('firebase-messaging-sw activated');
});

messaging.onBackgroundMessage((payload) => {

  console.log("Background Message:", payload);

  const title =
    payload.data?.title ||
    payload.notification?.title ||
    "Notification";

  const body =
    payload.data?.body ||
    payload.notification?.body ||
    "";

  const url =
    payload.data?.url ||
    "/dashboard";

  self.registration.showNotification(title, {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: {
      url,
    },
  });
});

// Fallback: handle raw push events in case the compat `onBackgroundMessage`
// doesn't provide the notification fields. Some environments deliver the
// payload differently; parsing `event.data.json()` ensures we extract title/body.
self.addEventListener('push', (event) => {
  console.log('push event received in SW', event);

  let body = '';
  let title = 'Notification';
  let url = '/dashboard';

  try {
    const payload = event.data ? event.data.json() : {};
    const data = payload.data || payload;
    title = data.title || (payload.notification && payload.notification.title) || title;
    body = data.body || (payload.notification && payload.notification.body) || '';
    url = data.url || (payload.data && payload.data.url) || url;
  } catch (err) {
    console.warn('Failed to parse push event data', err);
  }

  const options = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click
self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  const url =
    event.notification.data?.url ||
    "/dashboard";

  event.waitUntil(

    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clientList) => {

      for (const client of clientList) {

        if (
          client.url.includes(self.location.origin)
        ) {

          client.navigate(url);

          return client.focus();
        }
      }

      return clients.openWindow(url);
    })
  );
});