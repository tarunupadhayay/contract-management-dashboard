const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { signupValidation, loginValidation } = require('../middleware/validate');

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', authenticate, getMe);

module.exports = router;
