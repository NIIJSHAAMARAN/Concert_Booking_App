require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Concert = require('./models/Concert');
const Booking = require('./models/Booking');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Concert.deleteMany({});
    await Booking.deleteMany({});

    console.log('📋 Cleared existing data...');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@concertapp.com',
      password: 'admin1234',
      role: 'admin',
    });

    console.log('👤 Created admin user:', adminUser.email);

    // Create regular user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });

    console.log('👤 Created regular user:', regularUser.email);

    // Create sample concerts
    const concerts = await Concert.insertMany([
      {
        name: 'Rock Night 2025',
        artist: 'The Rolling Stones',
        description: 'The legendary rock band brings their greatest hits!',
        dateTime: new Date('2025-05-15T19:00:00Z'),
        venue: {
          name: 'Madison Square Garden',
          address: '33 W 33rd St',
          city: 'New York',
        },
        ticketPrice: 150,
        totalTickets: 5000,
        availableTickets: 5000,
        genre: 'Rock',
        createdBy: adminUser._id,
      },
      {
        name: 'Pop Sensation Tour',
        artist: 'Taylor Swift',
        description: 'The biggest pop concert of the year!',
        dateTime: new Date('2025-06-20T18:00:00Z'),
        venue: {
          name: 'Staples Center',
          address: '1111 S Figueroa St',
          city: 'Los Angeles',
        },
        ticketPrice: 200,
        totalTickets: 20000,
        availableTickets: 20000,
        genre: 'Pop',
        createdBy: adminUser._id,
      },
      {
        name: 'Jazz Night Experience',
        artist: 'Miles Davis Ensemble',
        description: 'Smooth jazz in an intimate venue',
        dateTime: new Date('2025-07-10T20:00:00Z'),
        venue: {
          name: 'Lincoln Center',
          address: '10 Lincoln Center Plaza',
          city: 'New York',
        },
        ticketPrice: 80,
        totalTickets: 2000,
        availableTickets: 2000,
        genre: 'Jazz',
        createdBy: adminUser._id,
      },
      {
        name: 'Electronic Beats Festival',
        artist: 'Daft Punk',
        description: 'Electronic music festival with world-class DJs',
        dateTime: new Date('2025-08-05T22:00:00Z'),
        venue: {
          name: 'Hollywood Bowl',
          address: '2301 N Highland Ave',
          city: 'Los Angeles',
        },
        ticketPrice: 120,
        totalTickets: 18000,
        availableTickets: 18000,
        genre: 'Electronic',
        createdBy: adminUser._id,
      },
      {
        name: 'Classical Symphony',
        artist: 'New York Philharmonic',
        description: 'Classical masterpieces performed by world-renowned orchestra',
        dateTime: new Date('2025-04-25T19:30:00Z'),
        venue: {
          name: 'Avery Fisher Hall',
          address: '10 Lincoln Center',
          city: 'New York',
        },
        ticketPrice: 100,
        totalTickets: 2500,
        availableTickets: 2500,
        genre: 'Classical',
        createdBy: adminUser._id,
      },
      {
        name: 'Hip-Hop Summit',
        artist: 'Kendrick Lamar',
        description: 'Premium hip-hop experience with top artists',
        dateTime: new Date('2025-09-12T20:00:00Z'),
        venue: {
          name: 'Chase Center',
          address: '1020 Irving St',
          city: 'San Francisco',
        },
        ticketPrice: 140,
        totalTickets: 19500,
        availableTickets: 19500,
        genre: 'Hip-Hop',
        createdBy: adminUser._id,
      },
    ]);

    console.log(`🎵 Created ${concerts.length} sample concerts`);

    // Create sample bookings
    const bookings = await Booking.insertMany([
      {
        user: regularUser._id,
        concert: concerts[0]._id,
        ticketsBooked: 2,
        totalAmount: 300,
        status: 'confirmed',
      },
      {
        user: regularUser._id,
        concert: concerts[1]._id,
        ticketsBooked: 3,
        totalAmount: 600,
        status: 'confirmed',
      },
    ]);

    // Update concert available tickets
    await Concert.findByIdAndUpdate(concerts[0]._id, {
      availableTickets: 4998,
    });
    await Concert.findByIdAndUpdate(concerts[1]._id, {
      availableTickets: 19997,
    });

    console.log(`🎟 Created ${bookings.length} sample bookings`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('   Admin:');
    console.log('   Email: admin@concertapp.com');
    console.log('   Password: admin1234');
    console.log('\n   User:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();