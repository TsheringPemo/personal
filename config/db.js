// config/db.js

const pgp = require('pg-promise')();

// Initialize database connection using Render's DATABASE_URL
const db = pgp({
  connectionString: process.env.DATABASE_URL
});

// Optional: Test connection on startup
db.connect()
  .then(obj => {
    obj.done(); // success, release connection
    console.log('✅ Connected to PostgreSQL database on Render');
  })
  .catch(error => {
    console.error('❌ Error connecting to PostgreSQL:', error.message || error);
  });

module.exports = db;
