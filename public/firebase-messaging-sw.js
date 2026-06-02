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