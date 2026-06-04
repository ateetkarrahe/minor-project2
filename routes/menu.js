const express = require('express');
const router = express.Router();
const {
    getMenuItems,
    getMenuItem,
    getMenuByCategory,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    searchMenuItems
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getMenuItems);
router.get('/search/:query', searchMenuItems);
router.get('/category/:category', getMenuByCategory);
router.get('/:id', getMenuItem);

// Admin routes
router.post('/', protect, authorize('admin'), createMenuItem);
router.put('/:id', protect, authorize('admin'), updateMenuItem);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);

module.exports = router;
