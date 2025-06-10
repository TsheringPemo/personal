const db = require('../config/db');

// ✅ Create the users table with enhanced schema
const createUserTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(100),
        verification_expires TIMESTAMP,
        password_reset_token VARCHAR(100),
        password_reset_expires TIMESTAMP,
        last_login TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT email_lowercase CHECK (email = LOWER(email))
      );
      
      CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
      CREATE INDEX IF NOT EXISTS users_status_idx ON users (status);
    `);
    console.log("✅ 'users' table created or already exists.");
  } catch (err) {
    console.error("❌ Error creating 'users' table:", err.message);
    throw err; // Re-throw to handle in calling function
  }
};

// ✅ Enhanced table existence check
const checkUserTable = async () => {
  try {
    const result = await db.oneOrNone(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (result.exists) {
      const columns = await db.any(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `);
      console.log('✅ Users table exists with columns:', columns.map(c => c.column_name));
      return true;
    } else {
      console.log('❌ Users table does NOT exist');
      return false;
    }
  } catch (err) {
    console.error('❌ Error checking users table:', err.message);
    throw err;
  }
};

// ✅ Verify table structure matches expectations
const verifyUserTableStructure = async () => {
  const requiredColumns = [
    'id', 'full_name', 'email', 'password', 
    'is_verified', 'created_at'
  ];
  
  try {
    const existingColumns = await db.any(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    
    const missingColumns = requiredColumns.filter(
      col => !existingColumns.some(c => c.column_name === col)
    );
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }
    
    console.log('✅ Users table has all required columns');
    return true;
  } catch (err) {
    console.error('❌ Users table structure verification failed:', err.message);
    throw err;
  }
};

module.exports = {
  createUserTable,
  checkUserTable,
  verifyUserTableStructure
};