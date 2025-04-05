const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser=require("cookie-parser")
const createTables = require('./config/dbInit'); 
const pool = require('./config/database')



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
// const staffRoutes = require('./routes/staffRoutes');
const supplierRoutes = require('./routes/supplierRoutes');



const createAuthRouter  = require('./routes/authRoutes');
const User = require('./models/User'); // Import User Model
const authRoutes = createAuthRouter(User); // Pass User Model


dotenv.config();

const app = express();

// Middleware
app.use(cors({ 
  origin: '*',  // Allow all origins (use a specific origin in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow cookies if needed
}));

app.use(helmet());             // Secure HTTP headers
app.use(morgan('dev'));        // Log HTTP requests
app.use(express.json());       // Parse incoming JSON payloads
app.use(cookieParser())

// API routes
app.use('/api/auth', authRoutes);
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
// app.use('/api/staff', staffRoutes);
app.use('/suppliers', supplierRoutes);


app.get("/", (req, res) => {
  // res.status(200).json({ message: "run" });
  res.send('Api is ready');
});

app.use((req, res) => {
  res.status(404).json({
     error: 'Route Not found',
  });
});


createTables().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error("❌ Error initializing database:", error.message);
});


