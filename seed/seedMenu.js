const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const MenuItem = require('../models/MenuItem');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Menu items data matching the existing frontend pages
const menuItems = [
    // Veg Thali Category
    {
        name: 'Veg Thali',
        description: 'Complete vegetarian thali with dal, rice, roti, sabzi, and salad',
        price: 60,
        category: 'vegthali',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/kvfwtpifrp0tm7yytxt0',
        available: true,
        popular: true
    },
    {
        name: 'Thali for Regular Student',
        description: 'Budget-friendly thali for everyday meals',
        price: 50,
        category: 'vegthali',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2025/4/24/91164c47-b6e8-42f8-89f8-6e482421eda6_66efc409-dff7-44e4-ab80-99b5331f50e3.jpeg',
        available: true,
        popular: false
    },
    {
        name: 'Special Thali',
        description: 'Premium thali with extra items and sweets',
        price: 80,
        category: 'vegthali',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/9/9/6f7fe255-f4f7-491f-9d78-b25d2e253d6f_6b38c48f-92a3-4c76-99aa-0d25ac58c5ca.png',
        available: true,
        popular: true
    },

    // Breakfast Category
    {
        name: 'Samosa',
        description: 'Crispy fried pastry with spiced potato filling',
        price: 20,
        category: 'breakfast',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/9/20/eccb9924-a6d9-4b56-88a3-c03402652efa_3600e0ee-ce9c-4681-95da-fcd435508cdb.jpg',
        available: true,
        popular: true
    },
    {
        name: 'Kachori',
        description: 'Deep-fried spicy snack with lentil filling',
        price: 20,
        category: 'breakfast',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/11/15/9474c84b-4ae8-4abc-b12e-a4fd5c790f19_59f34d32-8b08-467c-a716-1ce1fae93a77.jpg',
        available: true,
        popular: false
    },
    {
        name: 'Poha',
        description: 'Flattened rice with onions, peanuts and spices',
        price: 20,
        category: 'breakfast',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/9/3/12350093-9d5d-449d-a70f-8f42424fcc09_4a0fe5de-94cd-42ba-93cf-648f58c6649b.jpg',
        available: true,
        popular: true
    },
    {
        name: 'Chai/Tea',
        description: 'Hot Indian masala chai',
        price: 15,
        category: 'breakfast',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/da7154fd97b3d4382e4ac67f31e035b0',
        available: true,
        popular: true
    },
    {
        name: 'Bread Pakora',
        description: 'Bread slices dipped in gram flour batter and fried',
        price: 25,
        category: 'breakfast',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/32c85f5ff620dcc9db186a4a4de05e37',
        available: true,
        popular: false
    },

    // South Indian Category
    {
        name: 'Masala Dosa',
        description: 'Crispy crepe filled with spiced potato',
        price: 50,
        category: 'south',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/8/20/0d44da49-243e-4089-a3b2-6d6482ccaeb8_25b2eb07-7339-4969-9d42-3d7da12c2a10.jpeg',
        available: true,
        popular: true
    },
    {
        name: 'Idli Sambar',
        description: 'Steamed rice cakes served with sambar and chutney',
        price: 40,
        category: 'south',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/8/20/0d44da49-243e-4089-a3b2-6d6482ccaeb8_25b2eb07-7339-4969-9d42-3d7da12c2a10.jpeg',
        available: true,
        popular: true
    },
    {
        name: 'Vada',
        description: 'Crispy fried lentil donuts',
        price: 30,
        category: 'south',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/8/20/0d44da49-243e-4089-a3b2-6d6482ccaeb8_25b2eb07-7339-4969-9d42-3d7da12c2a10.jpeg',
        available: true,
        popular: false
    },
    {
        name: 'Uttapam',
        description: 'Thick pancake topped with vegetables',
        price: 45,
        category: 'south',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/8/20/0d44da49-243e-4089-a3b2-6d6482ccaeb8_25b2eb07-7339-4969-9d42-3d7da12c2a10.jpeg',
        available: true,
        popular: false
    },

    // Sweets Category
    {
        name: 'Gulab Jamun',
        description: 'Deep-fried milk solids soaked in sugar syrup',
        price: 30,
        category: 'sweets',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/mjwdojzysoj2tjl5lss8',
        available: true,
        popular: true
    },
    {
        name: 'Jalebi',
        description: 'Crispy fried sweet spirals',
        price: 25,
        category: 'sweets',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/mjwdojzysoj2tjl5lss8',
        available: true,
        popular: true
    },
    {
        name: 'Rasgulla',
        description: 'Soft spongy cottage cheese balls in sugar syrup',
        price: 35,
        category: 'sweets',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/mjwdojzysoj2tjl5lss8',
        available: true,
        popular: false
    },
    {
        name: 'Kheer',
        description: 'Creamy rice pudding with nuts',
        price: 40,
        category: 'sweets',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/mjwdojzysoj2tjl5lss8',
        available: true,
        popular: false
    },

    // Drinks Category
    {
        name: 'Cold Coffee',
        description: 'Chilled coffee with ice and cream',
        price: 40,
        category: 'drinks',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/4265afa824038fb33d5dd18303b5b5bc',
        available: true,
        popular: true
    },
    {
        name: 'Mango Lassi',
        description: 'Sweet mango yogurt drink',
        price: 35,
        category: 'drinks',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/4265afa824038fb33d5dd18303b5b5bc',
        available: true,
        popular: true
    },
    {
        name: 'Fresh Lime Soda',
        description: 'Refreshing lime drink with soda',
        price: 25,
        category: 'drinks',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/4265afa824038fb33d5dd18303b5b5bc',
        available: true,
        popular: false
    },
    {
        name: 'Buttermilk',
        description: 'Spiced yogurt drink (Chaas)',
        price: 20,
        category: 'drinks',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/4265afa824038fb33d5dd18303b5b5bc',
        available: true,
        popular: false
    },
    {
        name: 'Mineral Water',
        description: 'Packaged drinking water bottle',
        price: 20,
        category: 'drinks',
        image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/4265afa824038fb33d5dd18303b5b5bc',
        available: true,
        popular: false
    }
];

// Seed function
const seedDB = async () => {
    try {
        // Clear existing menu items
        await MenuItem.deleteMany();
        console.log('🗑️  Cleared existing menu items');

        // Insert new menu items
        await MenuItem.insertMany(menuItems);
        console.log('✅ Menu items seeded successfully!');
        console.log(`📋 Total items added: ${menuItems.length}`);

        // Show category breakdown
        const categories = {};
        menuItems.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + 1;
        });
        console.log('\n📊 Category breakdown:');
        Object.entries(categories).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} items`);
        });

        process.exit();
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
