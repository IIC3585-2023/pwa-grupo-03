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
const apiUrl = 'http://localhost:9000';

const getTimes = async () => {
  return fetch(`${apiUrl}/times`)
  .then((response) => response.json())
  .then((times) => {
    const groupedTimes = calculateMinutesSpent(times);
    console.log({times, groupedTimes})

    return {times, groupedTimes};
  });
}

const createTime = (timeObj) => {
  const { name, project, time, completed } = timeObj;

  timesRef.push({
    name,
    project,
    time,
    initialTime: time,
    completed
  });
};

const updateTime = (timeId, completed, time) => {
  console.log({timeId, completed, time})
  fetch(`${apiUrl}/times/${timeId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      completed,
      time
    }),
  });
}

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