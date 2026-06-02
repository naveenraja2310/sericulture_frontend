importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAZ0hFdQSmhYtW1Sz7fjOJCxKDzP2fPJb0",
    authDomain: "yadhronics.firebaseapp.com",
    projectId: "yadhronics",
    messagingSenderId: "15512986021",
    appId: "1:15512986021:web:07e08c346d935b9093484c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(
        payload.notification.title,
        {
        body: payload.notification.body,
        icon: "/icons/icon-192.png"
        }
    );
});