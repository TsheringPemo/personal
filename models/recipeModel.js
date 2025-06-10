const db = require('../config/db');

// ✅ Create the recipes table
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
        created_by INTEGER,
        image VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        CONSTRAINT recipes_created_by_fkey FOREIGN KEY (created_by)
          REFERENCES users (id)
          ON UPDATE NO ACTION
          ON DELETE NO ACTION
      );
    `);
    console.log("✅ 'recipes' table created.");
  } catch (err) {
    console.error("❌ Error creating 'recipes' table:", err.message);
  }
};

// ✅ Check if recipes table exists (optional)
const checkRecipesTable = async () => {
  try {
    await db.any('SELECT * FROM recipes LIMIT 1');
    console.log('✅ Recipes table exists');
  } catch (err) {
    console.error('❌ Recipes table does NOT exist:', err.message);
  }
};

module.exports = {
  createRecipesTable,
  checkRecipesTable,
};
