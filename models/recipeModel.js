// models/recipeModel.js
const db = require('../config/db');

const createRecipesTable = `
  CREATE TABLE IF NOT EXISTS public.recipes (
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
        REFERENCES public.users (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
  );
`;

db.none(createRecipesTable)
  .then(() => {
    console.log("✅ 'recipes' table created successfully.");
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ Error creating table:", error);
    process.exit(1);
  });

exports.shareRecipe = async (name, description, ingredients, image) => {
  const query = `
    INSERT INTO recipes (recipe_name, description, ingredients, image, status)
    VALUES ($1, $2, $3, $4, 'pending')
  `;
  await db.none(query, [name, description, ingredients, image]);
};
