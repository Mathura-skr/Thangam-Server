import { Router } from 'express';
import { ProductController } from '../controllers/product.js';
import auth from '../middlewares/auth.js';

export const createProductRouter = (productModel) => {
   const router = Router();

   const productController = new ProductController(productModel);

   router.get('/', productController.getAll);
   router.get('/:productId', productController.getById);
   router.post('/', auth, productController.create);
   router.patch('/:productId', auth, productController.update);
   router.delete('/:productId', auth, productController.delete);

   return router;
};
