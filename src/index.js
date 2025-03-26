import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import {
   createAuthRouter,
   createCategoryRouter,
   createProductRouter,
   createPurchaseRouter,
   createUserRouter,
} from './routes/index.js';
import { CategoryModel } from './models/category.js';
import { ProductModel } from './models/product.js';
import { PurchaseModel } from './models/purchase.js';
import { UserModel } from './models/user.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', createUserRouter(UserModel));
app.use('/api/auth', createAuthRouter(UserModel));
app.use('/api/products', createProductRouter(ProductModel));
app.use('/api/purchases', createPurchaseRouter(PurchaseModel));
app.use('/api/categories', createCategoryRouter(CategoryModel));

app.get('/', (req, res) => {
   res.send('Api is ready');
});

app.use((req, res) => {
   res.status(404).json({
      error: 'Route Not found',
   });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
   console.log(`Api running on http://localhost:${PORT}`);
});

export { app, server };
