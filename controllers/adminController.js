const db = require('../config/db');

// Admin Dashboard: Show all pending recipes
exports.getAdminDashboard = async (req, res) => {
  try {
    const pendingRecipes = await db.any(
      'SELECT * FROM recipes WHERE status = $1 ORDER BY id DESC',
      ['pending']
    );
    res.render('pages/adminDashboard', { pendingRecipes });
  } catch (err) {
    console.error('Error loading dashboard:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserManagementPage = async (req, res) => {
  try {
    const users = await db.any('SELECT id, full_name, email FROM users ORDER BY id DESC');
    res.render('pages/admin-users', { users });
  } catch (err) {
    console.error('Error loading user management page:', err.message);
    res.status(500).send('Server error');
  }
};
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Error deleting user');
  }
};

function confirmDelete(event, userName) {
  console.log("confirmDelete called for", userName);
  const confirmed = confirm(`Are you sure you want to delete user "${userName}"?`);
  if (!confirmed) {
    event.preventDefault();
    return false;
  }
  return true;
}

// Approve a recipe
exports.approveRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    await db.none('UPDATE recipes SET status = $1 WHERE id = $2', ['approved', recipeId]);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Approve error:', err.message);
    res.status(500).send('Server error');
  }
};

// Reject a recipe
exports.rejectRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    await db.none('UPDATE recipes SET status = $1 WHERE id = $2', ['rejected', recipeId]);
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Reject error:', err.message);
    res.status(500).send('Server error');
  }
};

// User Management: Get list of all users
exports.getUserList = async (req, res) => {
  try {
    const users = await db.any('SELECT id, name, email FROM users ORDER BY id DESC');
    res.render('pages/adminUsers', { users });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error');
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await db.none('DELETE FROM users WHERE id = $1', [userId]);
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).send('Server error');
  }
};
