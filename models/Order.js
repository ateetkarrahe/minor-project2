const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: String
});

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderNumber: {
        type: String,
        unique: true
    },
    items: [OrderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        default: 20
    },
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'upi', 'card'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    deliveryLocation: {
        type: String,
        required: [true, 'Please add delivery location'],
        trim: true
    },
    contactPhone: {
        type: String,
        required: [true, 'Please add contact phone number'],
        trim: true
    },
    specialInstructions: {
        type: String,
        trim: true
    },
    couponCode: {
        type: String,
        trim: true
    },
    estimatedDelivery: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Generate order number before saving
OrderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `ORD${dateStr}${random}`;
    }

    // Set estimated delivery (30 mins from now)
    if (!this.estimatedDelivery) {
        this.estimatedDelivery = new Date(Date.now() + 30 * 60000);
    }

    next();
});

// Index for faster queries
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
//OrderSchema.index({ //orderNumber//: 1 });

module.exports = mongoose.model('Order', OrderSchema);
