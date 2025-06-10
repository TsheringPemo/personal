const db = require('../config/db');

// Function to create recipes table
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

// Sample data operation function
const shareRecipe = async (name, description, ingredients, image) => {
  const query = `
    INSERT INTO recipes (recipe_name, description, ingredients, image, status)
    VALUES ($1, $2, $3, $4, 'pending')
  `;
  await db.none(query, [name, description, ingredients, image]);
};

module.exports = {
  createRecipesTable,
  shareRecipe,
};
