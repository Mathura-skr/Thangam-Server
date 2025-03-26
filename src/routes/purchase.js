import { Router } from 'express';
import { PurchaseController } from '../controllers/purchase.js';
import auth from '../middlewares/auth.js';

export const createPurchaseRouter = (purchaseModel) => {
   const router = Router();

   const purchaseController = new PurchaseController(purchaseModel);

   router.get('/', purchaseController.getAll);
   router.get('/user/:userId', purchaseController.getByUser);
   router.post('/', auth, purchaseController.create);

   return router;
};
