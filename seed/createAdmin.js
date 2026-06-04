const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@cafeteria.com' });

        if (existingAdmin) {
            console.log('⚠️ Admin user already exists!');
            console.log('Email: admin@cafeteria.com');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@cafeteria.com',
            password: 'admin123',
            studentId: 'ADMIN001',
            phone: '9999999999',
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log('Email: admin@cafeteria.com');
        console.log('Password: admin123');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
