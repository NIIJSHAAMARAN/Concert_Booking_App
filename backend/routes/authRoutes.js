const express = require('express');
const { register, login, getMe, createAdmin } = require('../controllers/authController');
const {protect}=require('../middleware/authMiddleware');
const router = express.Router();
// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/create-admin', createAdmin);

// Protected routes
router.get('/me',protect, getMe);


module.exports = router;