import { Router } from 'express';
import { UserController } from '../controllers/user.js';

export const createUserRouter = (userModel) => {
   const router = Router();

   const userController = new UserController(userModel);

   router.get('/:userId', userController.getById);

   return router;
};
