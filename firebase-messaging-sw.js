importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js",
);
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts(
    "https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js",
);

const firebaseConfig = {
    apiKey: "AIzaSyA_JlQ2hoZRHm85UvjWheb1MHMP4MBy7NQ",
    authDomain: "pwa-db-t4.firebaseapp.com",
    databaseURL: "https://pwa-db-t4-default-rtdb.firebaseio.com",
    projectId: "pwa-db-t4",
    storageBucket: "pwa-db-t4.appspot.com",
    messagingSenderId: "724990693332",
    appId: "1:724990693332:web:313587cd79166516985041"
};

const app = firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload,
    );
    let notification = payload.notification;
    const notificationTitle = notification.title;
    const notificationOptions = {
        body: payload.body,
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );

});