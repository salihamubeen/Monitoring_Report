const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register new user (admin only)
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);
// Get all users (admin only)
router.get('/', userController.getAllUsers);
// Change own password
router.post('/change-password', userController.changePassword);
// Admin change any user's password
router.post('/admin-change-password', userController.adminChangePassword);

module.exports = router; 