const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, 'recipe-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Route to handle recipe sharing
router.post('/recipes/share', upload.single('image'), async (req, res) => {
  try {
    const { recipe_name, description, ingredients } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    if (!recipe_name || !description || !ingredients) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const query = `
      INSERT INTO recipes (recipe_name, description, ingredients, image)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const values = [recipe_name, description, ingredients, imagePath];
    const result = await db.one(query, values);

    // ✅ Send JSON response used by frontend popup logic
    res.json({ message: 'Recipe shared successfully', recipeId: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Route to render approved recipes
router.get('/recipes', async (req, res) => {
  try {
    const result = await db.any('SELECT * FROM recipes WHERE status = $1', ['approved']);
    res.render('pages/recipes', { recipes: result });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading recipes');
  }
});

module.exports = router;
