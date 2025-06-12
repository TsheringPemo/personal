// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const db = require('./config/db');
const { createUserTable } = require('./tables/usersTable');
const createRecipesTable = require('./tables/recipesTable');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Render share-recipe page
app.get('/share-recipe', (req, res) => {
  res.render('pages/share-recipe');
});

// Routes
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', authRoutes);
app.use('/', recipeRoutes);
app.use('/admin', adminRoutes);

// Test DB Route
app.get('/test-db', async (req, res) => {
  try {
    const dbName = await db.one('SELECT current_database()');
    res.send(`✅ Connected to database: ${dbName.current_database}`);
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    res.status(500).send('❌ Database connection error');
  }
});

// Check if tables exist
const checkTables = async () => {
  try {
    const userTable = await db.oneOrNone(`SELECT to_regclass('public.users') AS table_name;`);
    console.log(userTable?.table_name ? '✅ Users table exists' : '❌ Users table does NOT exist');

    const recipeTable = await db.oneOrNone(`SELECT to_regclass('public.recipes') AS table_name;`);
    console.log(recipeTable?.table_name ? '✅ Recipes table exists' : '❌ Recipes table does NOT exist');
  } catch (err) {
    console.error('❌ Error checking tables:', err.message);
  }
};

// Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  try {
    // ✅ Create tables if they don't exist
    await createUserTable();
    await createRecipesTable();

    // ✅ Check that tables exist
    await checkTables();
  } catch (err) {
    console.error('❌ Error during app startup:', err.message);
  }
});
