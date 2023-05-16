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
    .then((response) => {
      res.send(response.val());
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});