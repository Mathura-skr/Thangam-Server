const express = require('express');
const { Auth } = require('../controllers/Auth'); 

const createAuthRouter = (userModel) => {
  const router = express.Router();
  const authController = new Auth(userModel);

  // Async handler wrapper (optional) for proper error handling
  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  router.post('/signin', asyncHandler(authController.signin));
  router.post('/signup', asyncHandler(authController.signup));

  return router;
};

module.exports = createAuthRouter; 
