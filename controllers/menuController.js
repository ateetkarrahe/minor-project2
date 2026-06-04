const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res, next) => {
    try {
        let query = {};

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category.toLowerCase();
        }

        // Filter by availability
        if (req.query.available) {
            query.available = req.query.available === 'true';
        }

        // Filter popular items
        if (req.query.popular) {
            query.popular = req.query.popular === 'true';
        }

        const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get menu items by category
// @route   GET /api/menu/category/:category
// @access  Public
exports.getMenuByCategory = async (req, res, next) => {
    try {
        const menuItems = await MenuItem.find({
            category: req.params.category.toLowerCase(),
            available: true
        }).sort({ popular: -1, name: 1 });

        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private/Admin
exports.createMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.create(req.body);

        res.status(201).json({
            success: true,
            data: menuItem
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
exports.updateMenuItem = async (req, res, next) => {
    try {
        let menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
exports.deleteMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        await menuItem.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Search menu items
// @route   GET /api/menu/search/:query
// @access  Public
exports.searchMenuItems = async (req, res, next) => {
    try {
        const searchQuery = req.params.query;

        const menuItems = await MenuItem.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ],
            available: true
        });

        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (err) {
        next(err);
    }
};
