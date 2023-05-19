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
  return timesRef.once('value').then((snapshot) => {
    return Object.values(snapshot.val()).sort((a, b) => {
      return new Date(b.time) - new Date(a.time);
    });
  });
};

const createTime = (time) => {
  const { name, project, time: timeCount } = time;

  timesRef.push({
    name,
    project,
    time: timeCount,
  });
};

getTimes().then((times) => {
  const timesNames = times.map((time) => time.name);
  document.getElementById('test-text').innerHTML = timesNames
});

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
  })
  .catch(function (err) {
    console.log('Unable to get permission to notify.', err);
  });

let enableForegroundNotification = true;
messaging.onMessage(function (payload) {
    console.log('Message received. ', payload);

    let notification = payload.notification;
    const notificationTitle = notification.title;
    const notificationOptions = {
      body: notification.body,
    };

    return new Notification(notificationTitle, notificationOptions);
});
