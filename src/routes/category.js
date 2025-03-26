import { Router } from 'express';
import { CategoryController } from '../controllers/category.js';
import auth from '../middlewares/auth.js';

export const createCategoryRouter = (categoryModel) => {
   const router = Router();

   const categoryController = new CategoryController(categoryModel);

   router.get('/', categoryController.getAll);
   router.post('/', auth, categoryController.create);

   return router;
};
