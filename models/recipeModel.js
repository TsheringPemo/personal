// models/recipeModel.js
const db = require('../config/db');

exports.shareRecipe = async (name, description, ingredients, image) => {
  const query = `
    INSERT INTO recipes (recipe_name, description, ingredients, image, status)
    VALUES ($1, $2, $3, $4, 'pending')
  `;
  await db.none(query, [name, description, ingredients, image]);
};
