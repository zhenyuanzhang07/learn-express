const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
});

const addMsgToRequest = function(req, res, next) {
  if (users) {
    req.users = users;
    next();
  } else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }
};

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to get usernames
app.use('/read/usernames', addMsgToRequest);
app.get('/read/usernames', (req, res) => {
  let usernames = req.users.map(user => {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

// Endpoint for adding a new user
app.use('/write/adduser', addMsgToRequest);
app.post('/write/adduser', (req, res) => {
  let newuser = req.body;
  req.users.push(newuser);
  fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
    if (err) console.log('Failed to write');
    else console.log('User Saved');
  });
  res.send('done');
});

// New endpoint for searching a user by username and returning their email
app.get('/read/username/:name', (req, res) => {
  const { name } = req.params;
  const user = users.find(user => user.username === name);
  if (user) {
    res.json({ email: user.email });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
