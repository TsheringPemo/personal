const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Landing page
router.get('/', (req, res) => {
  res.render('pages/landing');
});

// Signup routes
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

// Login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Logout route
router.post('/logout', authController.logout);

// Home route (after successful login)
router.get('/home', (req, res) => {
  if (req.session.user) {
    res.render('pages/home', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
