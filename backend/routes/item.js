const express = require('express');
const router = express.Router();
const {
  createItem,
  getAllItems,
  getItemsByDateRange,
  getItemById,
  updateItem,
  deleteItem
} = require('../controllers/item');
const { protect } = require('../middleware/auth');

// All item routes require authentication
router.post('/', protect, createItem);
router.get('/', protect, getAllItems);
router.get('/filter', protect, getItemsByDateRange);
router.get('/:id', protect, getItemById);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;