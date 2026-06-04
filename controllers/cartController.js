const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');


// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
    try {
        const { menuItemId, quantity = 1 } = req.body;

        // Get menu item
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        if (!menuItem.available) {
            return res.status(400).json({
                success: false,
                message: 'This item is currently not available'
            });
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        // Check if item already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.menuItem.toString() === menuItemId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity,
                image: menuItem.image
            });
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateCartItem = async (req, res, next) => {
    try {
        const { menuItemId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.menuItem.toString() === menuItemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(
            item => item.menuItem.toString() !== req.params.itemId
        );

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            data: cart
        });
    } catch (err) {
        next(err);
    }
};
