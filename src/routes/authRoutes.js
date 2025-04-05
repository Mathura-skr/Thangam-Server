const express = require('express');
const Auth  = require('../controllers/Auth'); 

const createAuthRouter = (userModel) => {
  const router = express.Router();
  const authController = new Auth(userModel);



  router.post('/signin', authController.signin);
  router.post('/signup', authController.signup);

  return router;
};

module.exports = createAuthRouter; 
