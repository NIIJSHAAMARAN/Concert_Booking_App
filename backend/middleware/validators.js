const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

const loginValidator = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Concert validators
const concertValidator = [
  body('name').trim().notEmpty().withMessage('Concert name is required').isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  body('artist').trim().notEmpty().withMessage('Artist name is required'),
  body('dateTime').notEmpty().withMessage('Date and time is required').isISO8601().withMessage('Provide a valid date (ISO 8601 format)').toDate(),
  body('venue.name').trim().notEmpty().withMessage('Venue name is required'),
  body('venue.address').trim().notEmpty().withMessage('Venue address is required'),
  body('venue.city').trim().notEmpty().withMessage('City is required'),
  body('ticketPrice').notEmpty().withMessage('Ticket price is required').isFloat({ min: 0 }).withMessage('Ticket price must be a non-negative number'),
  body('totalTickets').notEmpty().withMessage('Total tickets is required').isInt({ min: 1 }).withMessage('Total tickets must be at least 1'),
  body('genre').optional().isIn(['Rock', 'Pop', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic', 'Country', 'R&B', 'Other']).withMessage('Invalid genre'),
  validate,
];

const concertUpdateValidator = [
  body('name').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  body('dateTime').optional().isISO8601().withMessage('Provide a valid date (ISO 8601 format)').toDate(),
  body('ticketPrice').optional().isFloat({ min: 0 }).withMessage('Ticket price must be a non-negative number'),
  body('totalTickets').optional().isInt({ min: 1 }).withMessage('Total tickets must be at least 1'),
  validate,
];

// Booking validator
const bookingValidator = [
  body('concertId').notEmpty().withMessage('Concert ID is required').isMongoId().withMessage('Invalid Concert ID'),
  body('ticketsBooked').notEmpty().withMessage('Number of tickets is required').isInt({ min: 1, max: 3 }).withMessage('You can book between 1 and 3 tickets per concert'),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  concertValidator,
  concertUpdateValidator,
  bookingValidator,
};