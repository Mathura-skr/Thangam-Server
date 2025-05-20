const express = require('express');
const router = express.Router();
const { 
  create, 
  updateById, 
  getByUserId, 
  getAll, 
  getSalesSummary, 
  getMonthlySalesSummary, 
  getQuarterlySalesSummary, 
  getAnnualSalesSummary, 
  cancelOrder 
} = require('../controllers/Order');


router.post('/', create);
router.get('/user/:userId', getByUserId);
router.get('/', getAll);
router.get('/sales', getSalesSummary);
router.put('/:id', updateById);
router.get('/summary/monthly', getMonthlySalesSummary);
router.get('/summary/quarterly', getQuarterlySalesSummary);
router.get('/summary/annual', getAnnualSalesSummary);
router.patch('/cancel/:id', cancelOrder);


module.exports = router;
