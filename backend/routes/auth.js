// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const { login, verify, createEmployee, getAllUsers, updateEmployee, deleteEmployee, changePassword, getDepartments } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

// === PUBLIC ROUTES ===
router.post('/login', login);

// === PROTECTED USER ROUTES ===
router.get('/verify', protect, verify);
router.put('/changepassword', protect, changePassword); // For both Admin and Employee

// === ADMIN ROUTES ===
const adminRoutes = router.route('/admin/users');

adminRoutes.post(protect, authorize('admin'), createEmployee); // Create new employee
adminRoutes.get(protect, authorize('admin'), getAllUsers);   // Get all users

router.route('/admin/users/:id')
    .put(protect, authorize('admin'), updateEmployee)   // Update specific user
    .delete(protect, authorize('admin'), deleteEmployee); // Delete specific user

router.get('/admin/departments', protect, authorize('admin'), getDepartments); // Get department list

module.exports = router;