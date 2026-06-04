const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB("mongodb+srv://ateet08karrahe_db_user:YHhu7fY18OEp458T@cluster0.5x3g4cu.mongodb.net/canteenOrdering?retryWrites=true&w=majority&appName=Cluster0");

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Error handler middleware
app.use(require('./middleware/errorHandler'));

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to College Cafeteria API',
    endpoints: {
      auth: '/api/auth',
      menu: '/api/menu',
      cart: '/api/cart',
      orders: '/api/orders'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
});
