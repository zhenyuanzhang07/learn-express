const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/adduser', (req, res) => {
    let newuser = req.body;
    req.users.push(newuser); // Add the new user to the users array in memory
    fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), err => {
        if (err) {
            console.log('Failed to write');
            res.status(500).send('Failed to add user');
        } else {
            console.log('User Saved');
            res.send('User added successfully');
        }
    });
});

module.exports = router;
