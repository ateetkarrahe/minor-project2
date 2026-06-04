const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const createUser = async () => {
    try {
        // Email from command line or default
        const email = process.argv[2] || 'ateetkarrahe08@gmail.com';
        const password = process.argv[3] || 'password123';
        const name = process.argv[4] || 'Test User';

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('⚠️ User already exists with this email!');
            console.log(`Email: ${email}`);
            console.log('Try logging in with your password.');
            process.exit(0);
        }

        // Create user
        const user = await User.create({
            name: name,
            email: email,
            password: password,
            studentId: 'STU' + Date.now(),
            phone: '9999999999',
            role: 'student'
        });

        console.log('✅ User created successfully!');
        console.log('-----------------------------------');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating user:', error.message);
        process.exit(1);
    }
};

createUser();
