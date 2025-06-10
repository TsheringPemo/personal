const db = require('../config/db');

// ✅ Create the users table
const createUserTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ 'users' table created.");
  } catch (err) {
    console.error("❌ Error creating 'users' table:", err.message);
  }
};

// ✅ Check if users table exists (optional)
const checkUserTable = async () => {
  try {
    await db.any('SELECT * FROM users LIMIT 1');
    console.log('✅ Users table exists');
  } catch (err) {
    console.error('❌ Users table does NOT exist:', err.message);
  }
};

module.exports = {
  createUserTable,
  checkUserTable,
};
