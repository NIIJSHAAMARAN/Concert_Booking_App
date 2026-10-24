const Concert = require('../models/Concert');
const sendResponse = require('../Utils/sendResponse');
const { getPagination, createPaginationObject } = require('../Utils/pagination');


// @route   GET /api/concerts
exports.getAllConcerts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 9,
      search,
      genre,
      available,
      sortBy = 'dateTime',
      order = 'asc'
    } = req.query;

    const { skip } = getPagination(page, limit);

    const filter = { isDeleted: false };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
      ];
    }

    if (genre) {
      filter.genre = genre;
    }

    if (available === 'true') {
      filter.availableTickets = { $gt: 0 };
    }

    const sortObj = {};
    sortObj[sortBy] = order === 'asc' ? 1 : -1;

    const concerts = await Concert.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Concert.countDocuments(filter);
    const pagination = createPaginationObject(page, limit, total);

    sendResponse(res, 200, 'Concerts fetched', { concerts }, pagination);
  } catch (err) {
    next(err);
  }
};


// @route   GET /api/concerts/:id
exports.getConcert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const concert = await Concert.findById(id);

    if (!concert || concert.isDeleted) {
      return sendResponse(res, 404, 'Concert not found');
    }

    sendResponse(res, 200, 'Concert fetched', { concert });
  } catch (err) {
    next(err);
  }
};


// @route   POST /api/concerts
exports.createConcert = async (req, res, next) => {
  try {
    const {
      name,
      artist,
      description,
      dateTime,
      venue,
      ticketPrice,
      totalTickets,
      genre
    } = req.body;

    if (!name || !artist || !dateTime || !venue || !ticketPrice || !totalTickets) {
      return sendResponse(res, 400, 'Please provide all required fields');
    }

    const concert = await Concert.create({
      name: name.trim(),
      artist: artist.trim(),
      description: description?.trim(),
      dateTime: new Date(dateTime),
      venue: {
        name: venue.name?.trim(),
        address: venue.address?.trim(),
        city: venue.city?.trim(),
      },
      ticketPrice: Number(ticketPrice),
      totalTickets: Number(totalTickets),
      genre: genre || 'Other',
      createdBy: req.user._id, // 🔥 important
    });

    sendResponse(res, 201, 'Concert created successfully', { concert });
  } catch (err) {
    next(err);
  }
};


// @route   PUT /api/concerts/:id
exports.updateConcert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      artist,
      description,
      dateTime,
      venue,
      ticketPrice,
      totalTickets,
      genre
    } = req.body;

    let concert = await Concert.findById(id);

    if (!concert || concert.isDeleted) {
      return sendResponse(res, 404, 'Concert not found');
    }

    if (
      concert.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return sendResponse(res, 403, 'Not authorized to update this concert');
    }

    if (name !== undefined) concert.name = name.trim();
    if (artist !== undefined) concert.artist = artist.trim();
    if (description !== undefined) concert.description = description.trim();
    if (dateTime !== undefined) concert.dateTime = new Date(dateTime);

    if (venue) {
      if (venue.name !== undefined) concert.venue.name = venue.name.trim();
      if (venue.address !== undefined) concert.venue.address = venue.address.trim();
      if (venue.city !== undefined) concert.venue.city = venue.city.trim();
    }

    if (ticketPrice !== undefined) concert.ticketPrice = Number(ticketPrice);
    if (totalTickets !== undefined) concert.totalTickets = Number(totalTickets);
    if (genre !== undefined) concert.genre = genre;

    await concert.save();

    sendResponse(res, 200, 'Concert updated successfully', { concert });
  } catch (err) {
    next(err);
  }
};


// @route   DELETE /api/concerts/:id
exports.deleteConcert = async (req, res, next) => {
  try {
    const { id } = req.params;

    let concert = await Concert.findById(id);

    if (!concert || concert.isDeleted) {
      return sendResponse(res, 404, 'Concert not found');
    }

    if (
      concert.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return sendResponse(res, 403, 'Not authorized to delete this concert');
    }

    const Booking = require('../models/Booking');

    const activeBookings = await Booking.countDocuments({
      concert: id,
      status: 'confirmed',
    });

    if (activeBookings > 0) {
      return sendResponse(res, 400, 'Cannot delete concert with active bookings');
    }

    concert.isDeleted = true;
    await concert.save();

    sendResponse(res, 200, 'Concert deleted successfully');
  } catch (err) {
    next(err);
  }
};