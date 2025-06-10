// tables/recipesTable.js
const db = require('../config/db');

const createRecipesTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        recipe_name VARCHAR(255) NOT NULL,
        upload_image VARCHAR(255),
        description TEXT,
        ingredients TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_approved BOOLEAN DEFAULT false,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        image VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending'
      );
    `);
    console.log("✅ 'recipes' table created successfully");
  } catch (err) {
    console.error("❌ Error creating 'recipes' table:", err.message);
    throw err;
  }
};

module.exports = createRecipesTable;