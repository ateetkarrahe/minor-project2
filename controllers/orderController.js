const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { deliveryLocation, paymentMethod, specialInstructions, couponCode, items: requestItems, contactPhone } = req.body;

        // Validate required phone number
        if (!contactPhone) {
            return res.status(400).json({
                success: false,
                message: 'Contact phone number is required'
            });
        }

        let items = [];
        let subtotal = 0;

        // Check if items are provided in request (from localCart)
        if (requestItems && requestItems.length > 0) {
            items = requestItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }));
            subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        } else {
            // Fallback: Get user's cart from database
            const cart = await Cart.findOne({ user: req.user.id });

            if (!cart || cart.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cart is empty'
                });
            }

            items = cart.items;
            subtotal = cart.totalAmount;

            // Clear the database cart
            cart.items = [];
            await cart.save();
        }

        if (items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No items in order'
            });
        }

        // Calculate amounts
        const deliveryFee = subtotal >= 200 ? 0 : 20; // Free delivery above ₹200
        let discount = 0;

        // Apply coupon codes
        if (couponCode) {
            const upperCoupon = couponCode.toUpperCase();
            if (upperCoupon === 'VEG50') {
                discount = subtotal * 0.5; // 50% off
            } else if (upperCoupon === 'CAMPUS10') {
                discount = subtotal * 0.1; // 10% off
            } else if (upperCoupon === 'FIRST20') {
                discount = subtotal * 0.2; // 20% off for first order
            }
        }

        const totalAmount = subtotal + deliveryFee - discount;

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items,
            subtotal,
            deliveryFee,
            discount,
            totalAmount,
            deliveryLocation,
            contactPhone,
            paymentMethod: paymentMethod || 'cod',
            specialInstructions,
            couponCode,
            status: 'confirmed'
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user owns order or is admin
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;

        // Update payment status if delivered
        if (status === 'delivered') {
            order.paymentStatus = 'completed';
        }

        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check ownership
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Can only cancel pending or confirmed orders
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel order that is already being prepared or delivered'
            });
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        let query = {};

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email studentId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};
