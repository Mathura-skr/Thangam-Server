import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';

export const createAuthRouter = (userModel) => {
   const router = Router();

   const authController = new AuthController(userModel);

   router.post('/signin', authController.signin);
   router.post('/signup', authController.signup);

   return router;
};
