const Booking = require('../models/Booking');
const Concert = require('../models/Concert');
const sendResponse = require('../Utils/sendResponse');
const { getPagination, createPaginationObject } = require('../Utils/pagination');
const mongoose = require('mongoose');

// @route   POST /api/bookings
// @desc    Create booking
// @access  Private
exports.bookTickets = async (req, res, next) => {
  try {
    const { concertId, ticketsBooked } = req.body;
    const userId = req.user._id;

    if (!concertId || !ticketsBooked) {
      return sendResponse(res, 400, 'Please provide concert ID and number of tickets');
    }

    if (ticketsBooked < 1 || ticketsBooked > 3) {
      return sendResponse(res, 400, 'You can book minimum 1 and maximum 3 tickets per concert');
    }

    const concert = await Concert.findById(concertId);
    if (!concert || concert.isDeleted) {
      return sendResponse(res, 404, 'Concert not found');
    }

    if (new Date(concert.dateTime) < new Date()) {
      return sendResponse(res, 400, 'Cannot book for past concerts');
    }

    if (concert.availableTickets < ticketsBooked) {
      return sendResponse(res, 400, 'Not enough tickets available');
    }

    // Check user's total tickets for this concert
    const userBookings = await Booking.find({
      userId,
      concertId,
      bookingStatus: 'confirmed',
    });

    let totalBooked = 0;
    userBookings.forEach(b => {
      totalBooked += b.ticketsBooked;
    });

    if (totalBooked + ticketsBooked > 3) {
      return sendResponse(
        res,
        400,
        `You can only book maximum 3 tickets per concert. You have already booked ${totalBooked} tickets.`
      );
    }

    const booking = await Booking.create({
      userId,
      concertId,
      ticketsBooked: parseInt(ticketsBooked),
      totalPrice: concert.ticketPrice * ticketsBooked,
      bookingStatus: 'confirmed',
    });

    concert.availableTickets -= ticketsBooked;
    await concert.save();

    await booking.populate([
      { path: 'concertId', select: 'name artist dateTime venue ticketPrice' },
      { path: 'userId', select: 'name email' },
    ]);

    sendResponse(res, 201, 'Booking created successfully', { booking });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/bookings/my-bookings
// @desc    Get user's bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, status } = req.query;
    const { skip } = getPagination(page, limit);
    // const userId = req.user._id;
  
  
    // Build filter properly
    //  const filter = { userId: new mongoose.Types.ObjectId(userId) }; // convert string to ObjectId
    // if (status) filter.bookingStatus = status;

    // Correct find query
    const userId = req.user._id.toString();
    const filter = {  userId }; // just use string
    if (status) filter.bookingStatus = status;
   console.log("req.user._id:", req.user._id, typeof req.user._id);
   const bookings = await Booking.find(filter)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(parseInt(limit))
  .populate('concertId')
  .populate('userId');

    console.log("Fetched bookings:", bookings);

    const total = await Booking.countDocuments(filter);
    const pagination = createPaginationObject(page, limit, total);

    sendResponse(res, 200, 'Bookings fetched', { bookings }, pagination);
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/bookings
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const { skip } = getPagination(page, limit);

    const filter = {};
    if (status) filter.bookingStatus = status;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('concertId')
      .populate('userId');

    const total = await Booking.countDocuments(filter);
    const pagination = createPaginationObject(page, limit, total);

    sendResponse(res, 200, 'All bookings fetched', { bookings }, pagination);
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('concertId')
      .populate('userId');

    if (!booking) {
      return sendResponse(res, 404, 'Booking not found');
    }

    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, 'Not authorized to view this booking');
    }

    sendResponse(res, 200, 'Booking fetched', { booking });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return sendResponse(res, 404, 'Booking not found');
    }

    if (booking.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return sendResponse(res, 403, 'Not authorized to cancel this booking');
    }

    if (booking.bookingStatus === 'cancelled') {
      return sendResponse(res, 400, 'This booking is already cancelled');
    }

    const concert = await Concert.findById(booking.concertId);
    if (new Date(concert.dateTime) < new Date()) {
      return sendResponse(res, 400, 'Cannot cancel bookings for past concerts');
    }

    booking.bookingStatus = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    concert.availableTickets += booking.ticketsBooked;
    await concert.save();

    sendResponse(res, 200, 'Booking cancelled successfully', { booking });
  } catch (err) {
    next(err);
  }
};