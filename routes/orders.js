const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getAllOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const {getProducts} = require('../controllers/getMainPageProducts')
// All order routes require authentication
router.use(protect);

router.get('/products/all', getProducts);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
