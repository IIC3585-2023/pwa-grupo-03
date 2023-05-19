const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pwa-db-t4-default-rtdb.firebaseio.com/',
});

const express = require('express');
const { request } = require('express');
const app = express();
const port = 9000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/times', (req, res) => {
  admin
    .database()
    .ref('times')
    .once('value')
    .then((snapshot) => {
      return Object.values(snapshot.val()).sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
      });
    }).then((times) => {
      res.send(times)
    });
});

app.post('/times', (req, res) => {
  const {
    body: { name, time, project },
  } = req;

  admin
    .database()
    .ref('times')
    .push({
      name,
      time,
      project
    })
    .then(() => {
      res.send('Time Created');
    });
})

app.post('/message', (req, res) => {
  const {
    body: { message, title, token },
  } = req;
  const outputMessage = { notification: { title, body: message } };
  admin
    .messaging()
    .sendToDevice(token, outputMessage)
    .then((response) => {
      res.status(200).send('Notification sent successfully');
    })
    .catch((error) => {
      console.log(error);
    });

  res.send({ msg: 'Notifications Sent' }).json();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});