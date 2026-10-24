const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a concert name'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'Please provide an artist name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dateTime: {
      type: Date,
      required: [true, 'Please provide a date and time'],
    },
    venue: {
      name: {
        type: String,
        required: [true, 'Please provide a venue name'],
      },
      address: {
        type: String,
        required: [true, 'Please provide a venue address'],
      },
      city: {
        type: String,
        required: [true, 'Please provide a city'],
      },
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Please provide a ticket price'],
      min: [0, 'Ticket price cannot be negative'],
    },
    totalTickets: {
      type: Number,
      required: [true, 'Please provide total tickets'],
      min: [1, 'Total tickets must be at least 1'],
    },
    availableTickets: {
      type: Number,
      // required: true,
      min: [0, 'Available tickets cannot be negative'],
    },
    genre: {
      type: String,
      enum: ['Music','Rock', 'Pop', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic', 'Country', 'R&B', 'Other'],
      default: 'Other',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Update availableTickets when totalTickets changes
concertSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableTickets = this.totalTickets;
  }
  // Optional: adjust if totalTickets changes
  if (this.isModified('totalTickets')) {
    const diff = this.totalTickets - this.availableTickets;
    this.availableTickets += diff;
  }
  next();
});
concertSchema.index({ dateTime: 1 });
concertSchema.index({ 'venue.city': 1 });
module.exports = mongoose.model('Concert', concertSchema);