const express = require('express');
const {
  bookTickets,
  getMyBookings,
  getAllBookings,
  getBooking,
  cancelBooking,
} = require('../controllers/bookingController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin-only route
router.get('/', adminOnly, getAllBookings);

// User routes (static routes first, dynamic last)
router.post('/', bookTickets);           // Book tickets
router.get('/my-bookings', getMyBookings); // Get user's bookings
router.get('/:id', getBooking);          // Get single booking
router.put('/:id/cancel', cancelBooking); // Cancel booking

module.exports = router;