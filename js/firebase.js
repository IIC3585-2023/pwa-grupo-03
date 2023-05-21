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

const db = firebase.database();
const timesRef = db.ref('/times');

const getTimes = () => {
  fetch('http://localhost:9000/times')
  .then((response) => response.json())
  .then((data) => {
    createTasksContainers(data);
  });
}

const createTime = (timeObj) => {
  const { name, project, time, completed } = timeObj;

  timesRef.push({
    name,
    project,
    time,
    completed
  });
};

const messaging = firebase.messaging();

messaging
  .requestPermission()
  .then(function () {
    console.log('Notification permission granted.');

    // get the token in the form of promise
    return messaging.getToken();
  })
  .then(function (token) {
    console.log(token);
    localStorage.setItem('token', token);
  })
  .catch(function (err) {
    console.log('Unable to get permission to notify.', err);
  });

let enableForegroundNotification = true;
messaging.onMessage(function (payload) {
    console.log('Message received. ', payload);
    console.log(payload.notification);
    const notification = payload.notification;
    const notificationTitle = notification.title;
    const notificationOptions = {
      body: notification.body,
      icon: './images/icon.svg',
    };
    return new Notification(notificationTitle, notificationOptions);
});

const createNotification = (title, message) => {
  fetch('http://localhost:9000/notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      title,
      token: localStorage.getItem('token'),
    }),
  });
}