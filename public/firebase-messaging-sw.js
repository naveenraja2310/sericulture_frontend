importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAZ0hFdQSmhYtW1Sz7fjOJCxKDzP2fPJb0",
    authDomain: "yadhronics.firebaseapp.com",
    projectId: "yadhronics",
    messagingSenderId: "15512986021",
    appId: "1:15512986021:web:07e08c346d935b9093484c"
});

console.log("Firebase Messaging Service Worker Loaded");

const messaging = firebase.messaging();

/**
 * Firebase background messages
 */
// messaging.onBackgroundMessage((payload) => {

//     const title = payload.data?.title || "Notification";
//     const body = payload.data?.body || "";

//     return self.registration.showNotification(title, {
//         body,
//         icon: "/icons/icon-192.png",
//         badge: "/icons/icon-192.png",
//         data: {
//             url: payload.data?.url || "/dashboard"
//         }
//     });
// });

/**
 * Raw Push Event Debugging
 */
// self.addEventListener("push", (event) => {

//     console.log("PUSH EVENT RECEIVED");

//     event.waitUntil(
//         self.registration.showNotification(
//             "PUSH DEBUG",
//             {
//                 body: "Push reached service worker"
//             }
//         )
//     );
// });

/**
 * Notification Click Handler
 */
self.addEventListener("notificationclick", (event) => {

    console.log("Notification clicked");

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

                if (client.url.includes(self.location.origin)) {
                    client.navigate(url);
                    return client.focus();
                }
            }

            return clients.openWindow(url);
        })
    );
});

/**
 * Service Worker Install
 */
self.addEventListener("install", (event) => {
    console.log("Service Worker Installed");
    self.skipWaiting();
});

/**
 * Service Worker Activate
 */
self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated");
    event.waitUntil(self.clients.claim());
});