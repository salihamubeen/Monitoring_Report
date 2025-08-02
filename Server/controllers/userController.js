const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register a new user (admin only)
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }
    const user = new User({ username, password, role: role || 'user' });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully', user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to register user' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid username or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid username or password' });
    }
    res.status(200).json({ success: true, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username role');
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
};

// Change own password
exports.changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ success: false, error: 'Old password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to change password' });
  }
};

// Admin change any user's password (no old password required)
exports.adminChangePassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to change password' });
  }
}; 