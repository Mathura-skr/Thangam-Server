const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Import routes using CommonJS
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const brandRoutes = require('./routes/brandRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const otpRoutes = require('./routes/otpRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const staffRoutes = require('./routes/staffRoutes');
const createAuthRouter  = require('./routes/authRoutes');
const User = require('./models/User');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());             // Secure HTTP headers
app.use(cors());               // Enable Cross-Origin Resource Sharing
app.use(morgan('dev'));        // Log HTTP requests
app.use(express.json());       // Parse incoming JSON payloads

// API routes
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/auth', createAuthRouter(User));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
