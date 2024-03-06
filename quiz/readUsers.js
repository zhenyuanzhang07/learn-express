const express = require('express');
const router = express.Router();

// Endpoint to get all usernames
router.get('/usernames', (req, res) => {
    let usernames = req.users.map(user => ({ id: user.id, username: user.username }));
    res.send(usernames);
});

// Endpoint to get a specific user by username
router.get('/username/:name', (req, res) => {
    const { name } = req.params;
    const user = req.users.find(user => user.username === name);
    if (user) {
        res.json({ email: user.email });
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

module.exports = router;
