const express = require('express');
const router = express.Router();

const protect = require('../middleware/protect');
const checkAdmin = require('../middleware/checkAdmin');
const { createEmployee, getAllUsers, updateEmployee, deleteEmployee } = require('../controllers/adminController');

router.post('/users', protect, checkAdmin, createEmployee);
router.get('/users', protect, checkAdmin, getAllUsers);
router.put('/users/:id', protect, checkAdmin, updateEmployee);
router.delete('/users/:id', protect, checkAdmin, deleteEmployee);

module.exports = router;
