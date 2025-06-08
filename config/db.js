// config/db.js

// Import pg-promise
const pgp = require('pg-promise')({
  // Optional initialization options can go here
});

// Load environment variables from .env file
require('dotenv').config();

// Initialize database connection using environment variables
const db = pgp({
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  database: process.env.DB_NAME || 'userAuth',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'your_password_here',
  //ssl: {
    //rejectUnauthorized: false // set to true if you want to enforce ssl certificate validation
  //}
  });

// Log connection success (optional)
db.connect()
  .then(obj => {
    obj.done(); // success, release the connection
    console.log('✅ Connected to PostgreSQL database');
  })
  .catch(error => {
    console.error('❌ Error connecting to database:', error.message || error);
  });

module.exports = db;
