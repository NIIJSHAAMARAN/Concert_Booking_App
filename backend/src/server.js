require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const concertRoutes = require('./routes/concertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logger (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎵 Concert Booking API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/bookings', bookingRoutes);

// ─── API Info ─────────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Concert Booking API v1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user (auth required)',
        'POST /api/auth/create-admin': 'Create admin user (admin only)',
      },
      concerts: {
        'GET /api/concerts': 'List all concerts (public)',
        'GET /api/concerts/:id': 'Get concert details (public)',
        'POST /api/concerts': 'Create concert (admin only)',
        'PUT /api/concerts/:id': 'Update concert (admin only)',
        'DELETE /api/concerts/:id': 'Delete concert (admin only)',
      },
      bookings: {
        'POST /api/bookings': 'Book tickets (auth required)',
        'GET /api/bookings/my-bookings': 'My bookings (auth required)',
        'GET /api/bookings/:id': 'Get booking (auth required)',
        'PUT /api/bookings/:id/cancel': 'Cancel booking (auth required)',
        'GET /api/bookings': 'All bookings (admin only)',
      },
    },
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n🎵 Concert Booking API`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 API Docs: http://localhost:${PORT}/api\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;