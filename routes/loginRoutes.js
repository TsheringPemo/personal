const express = require('express');
const router = express.Router();
const db = require('../config/db'); // your DB connection
const bcrypt = require('bcrypt'); // if you hash passwords
const session = require('express-session');

// POST /login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // If you store hashed passwords, compare with bcrypt
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send('Invalid email or password');
    }

    // Save user info in session
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role, // assuming you have a role field
    };

    res.redirect('/'); // or wherever you want to send logged-in users

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
