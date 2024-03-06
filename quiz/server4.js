const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

const readUsers = require('./readUsers');
const writeUsers = require('./writeUsers');

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
});

const addMsgToRequest = (req, res, next) => {
  if (users) {
    req.users = users;
    next();
  } else {
    res.status(404).json({
      error: { message: 'users not found', status: 404 }
    });
  }
};

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addMsgToRequest);

app.use('/read', readUsers);
app.use('/write', writeUsers);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
