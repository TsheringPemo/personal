// controllers/recipeController.js
const Recipe = require('../models/recipeModel');
const user = require('../models/userModel');
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.render('pages/recipes', { recipes });
  } catch (error) {
    res.status(500).render('pages/recipes', {
      recipes: [],
      message: 'Error fetching recipes: ' + error.message
    });
  }
};

exports.shareRecipe = async (req, res) => {
  try {
    const { name, description, ingredients } = req.body;
    const upload_image = req.file ? req.file.filename : null;

    // Validate required fields
    if (!name || !description || !ingredients || !upload_image) {
      return res.status(400).render('pages/share-recipe', {
        message: 'Please fill in all required fields',
        recipe: req.body
      });
    }

    // Save recipe in the database
    await Recipe.shareRecipe(name, description, ingredients, upload_image);

    // If request is AJAX (fetch), respond with JSON success
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true });
    } else {
      // For normal form submission fallback
      res.redirect('/recipes');
    }
  } catch (error) {
    res.status(500).render('pages/share-recipe', {
      message: 'Error sharing recipe: ' + error.message,
      recipe: req.body
    });
  }
};
