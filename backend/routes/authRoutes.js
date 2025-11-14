const express = require('express');
const router = express.Router();
const { login, verify, changePassword } = require('../controllers/authController');
const { getDepartments, createEmployee, getAllUsers, updateEmployee, deleteEmployee } = require('../controllers/adminController');
const protect = require('../middleware/protect');
const checkAdmin = require('../middleware/checkAdmin');

// Public routes
router.post('/login', login);
router.get('/verify', protect, verify);
router.put('/changepassword', protect, changePassword);

// Admin routes - must be after protect middleware sets req.user
try {
  router.get('/admin/departments', protect, checkAdmin, getDepartments);
  router.get('/admin/users', protect, checkAdmin, getAllUsers);
  router.post('/admin/users', protect, checkAdmin, createEmployee);
  router.put('/admin/users/:id', protect, checkAdmin, updateEmployee);
  router.delete('/admin/users/:id', protect, checkAdmin, deleteEmployee);
  console.log('Admin routes registered successfully');
} catch (error) {
  console.error('Error registering admin routes:', error);
}

module.exports = router;
