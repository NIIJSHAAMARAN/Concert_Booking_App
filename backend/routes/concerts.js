const express = require('express');
const {
  getAllConcerts,
  getConcert,
  createConcert,
  updateConcert,
  deleteConcert,
} = require('../controllers/concertController');
const {protect} = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllConcerts);
router.get('/:id', getConcert);

// Protected routes (Admin only)
router.post('/', protect, adminMiddleware, createConcert);
router.put('/:id', protect, adminMiddleware, updateConcert);
router.delete('/:id', protect, adminMiddleware, deleteConcert);

module.exports = router;