const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    bookingReference: {
    type: String,
    unique: true,
    default: () => 'BK' + Math.floor(Math.random() * 1000000), // Example: BK123456
  },
    concertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Concert',
      required: [true, 'Concert ID is required'],
    },
    ticketsBooked: {
      type: Number,
      required: [true, 'Number of tickets is required'],
      min: [1, 'At least 1 ticket must be booked'],
      max: [3, 'Maximum 3 tickets per booking'],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'confirmed',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'refunded'],
      default: 'paid',
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure user can only book max 3 tickets per concert
bookingSchema.index({ userId: 1, concertId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);