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
      const entries = Object.entries(snapshot.val());
      const times = entries.map((entry) => {
        return {
          id: entry[0],
          ...entry[1],
        };
      });
      return times.sort((a, b) => {
        return new Date(b.time) - new Date(a.time);
      });
    }).then((times) => {
      res.header('Access-Control-Allow-Origin', '*')
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
      project,
      completed: false
    })
    .then((data) => {
      res.send(data);
    });
})

app.patch('/times/:id', (req, res) => {
  const {
    params: { id },
    body: { completed, time },
  } = req;
  admin
    .database()
    .ref('times')
    .child(id)
    .update({
      time,
      completed,
    })
    .then(() => {
      res.send('Time Updated');
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});