// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const { login, verify, createEmployee, getAllUsers, updateEmployee, deleteEmployee, changePassword, getDepartments } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const { checkAdminAccess } = require('../middleware/rolecheck');

// === PUBLIC ROUTES ===
router.post('/login', login);

// === PROTECTED USER ROUTES ===
router.get('/verify', protect, verify);
router.put('/changepassword', protect, changePassword); // For both Admin and Employee

// === ADMIN ROUTES ===
const adminRoutes = router.route('/admin/users');

adminRoutes.post(protect, checkAdminAccess, createEmployee); // Create new employee
adminRoutes.get(protect, checkAdminAccess, getAllUsers);   // Get all users

router.route('/admin/users/:id')
    .put(protect, checkAdminAccess, updateEmployee)   // Update specific user
    .delete(protect, checkAdminAccess, deleteEmployee); // Delete specific user

router.get('/admin/departments', protect, checkAdminAccess, getDepartments); // Get department list

module.exports = router;