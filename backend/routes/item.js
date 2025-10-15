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

// If you have authentication middleware, import it
// const { protect } = require('../middleware/auth');

// Create a new item
router.post('/', createItem);

// Get all items
router.get('/', getAllItems);

// Get items by date range (filter)
router.get('/filter', getItemsByDateRange);

// Get single item by ID
router.get('/:id', getItemById);

// Update item
router.put('/:id', updateItem);

// Delete item
router.delete('/:id', deleteItem);

module.exports = router;