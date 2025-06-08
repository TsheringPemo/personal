const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin Dashboard
router.get('/dashboard', adminController.getAdminDashboard);

// User Management
router.get('/users', adminController.getUserManagementPage);
router.post('/users/:id/delete', adminController.deleteUser); // ✅ Updated

// Approve/Reject Recipes
router.post('/recipes/:id/approve', adminController.approveRecipe);
router.post('/recipes/:id/reject', adminController.rejectRecipe);

module.exports = router;
