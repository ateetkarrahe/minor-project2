const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add item name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['vegthali', 'breakfast', 'south', 'sweets', 'drinks'],
        lowercase: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=Food+Item'
    },
    available: {
        type: Boolean,
        default: true
    },
    popular: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster category queries
MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ available: 1 });

module.exports = mongoose.model('MenuItem', MenuItemSchema);


const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Please add item name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['vegthali', 'breakfast', 'south', 'sweets', 'drinks'],
        lowercase: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=Food+Item'
    },
    available: {
        type: Boolean,
        default: true
    },
    popular: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster category queries
ProductSchema.index({ category: 1 });
ProductSchema.index({ available: 1 });

module.exports = mongoose.model('food', ProductSchema);
