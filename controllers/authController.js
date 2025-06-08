const bcrypt = require('bcrypt');
const db = require('../config/db');
require('dotenv').config(); // Load environment variables

// GET: Show signup page
exports.getSignup = (req, res) => {
  res.render('pages/signup', { message: null });
};

// POST: Handle signup with validation
exports.postSignup = async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  // Simple validation rules
  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{6,}$/;

  if (!fullName || !email || !password || !confirmPassword) {
    return res.render('pages/signup', { message: 'Please fill in all fields.' });
  }

  if (!nameRegex.test(fullName)) {
    return res.render('pages/signup', { message: 'Name must contain letters only.' });
  }

  if (!emailRegex.test(email)) {
    return res.render('pages/signup', { message: 'Please enter a valid email address.' });
  }

  if (!passwordRegex.test(password)) {
    return res.render('pages/signup', { message: 'Password must include at least one letter, one number, and one special character.' });
  }

  if (password !== confirmPassword) {
    return res.render('pages/signup', { message: 'Passwords do not match!' });
  }

  try {
    const userEmail = email.toLowerCase();

    const existingUser = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [userEmail]);
    if (existingUser) {
      return res.render('pages/signup', { message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.none(
      `INSERT INTO users (full_name, email, password, is_verified)
       VALUES ($1, $2, $3, $4)`,
      [fullName, userEmail, hashedPassword, true]
    );

    res.redirect('/login');
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    res.render('pages/signup', { message: 'An error occurred during signup. Please try again.' });
  }
};

// GET: Show login page
exports.getLogin = (req, res) => {
  res.render('pages/login', { message: null });
};

// POST: Handle login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('pages/login', { message: 'Please enter both email and password.' });
  }

  try {
    const userEmail = email.toLowerCase();

    // Admin login
    if (userEmail === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      req.session.user = {
        id: 'admin',
        name: 'Admin',
        email: userEmail,
        role: 'admin',
      };
      return res.redirect('/admin/dashboard');
    }

    // Normal user login
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [userEmail]);
    if (!user) {
      return res.render('pages/login', { message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('pages/login', { message: 'Invalid email or password.' });
    }

    req.session.user = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: 'user',
    };

    res.redirect('/home');
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.render('pages/login', { message: 'An error occurred during login. Please try again.' });
  }
};

// POST: Logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('❌ Logout error:', err.message);
      return res.status(500).send('Error logging out.');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};
