/**
 * API Integration Tests
 * Run these tests to verify all endpoints are working correctly
 */

const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

// Test data
let token = '';
let userId = '';
let concertId = '';
let bookingId = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️ ${msg}${colors.reset}`),
  test: (msg) => console.log(`\n${colors.yellow}🧪 Testing: ${msg}${colors.reset}`),
};

const api = axios.create({
  baseURL: API_URL,
  validateStatus: () => true, // Don't throw on any status
});

const runTests = async () => {
  try {
    console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.blue + '  Concert Booking API - Integration Tests' + colors.reset);
    console.log(colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);

    // Test 1: Register
    log.test('User Registration');
    let res = await api.post('/auth/register', {
      name: 'Test User',
      email: `testuser${Date.now()}@example.com`,
      password: 'test1234',
    });
    if (res.status === 201) {
      log.success('User registration');
      token = res.data.data.token;
      userId = res.data.data.user._id;
    } else {
      log.error(`User registration: ${res.data.message}`);
    }

    // Test 2: Login
    log.test('User Login');
    res = await api.post('/auth/login', {
      email: 'admin@concertapp.com',
      password: 'admin1234',
    });
    if (res.status === 200) {
      log.success('User login');
      token = res.data.data.token;
    } else {
      log.error(`User login: ${res.data.message}`);
    }

    // Test 3: Get Current User
    log.test('Get Current User');
    res = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
      log.success('Get current user');
    } else {
      log.error(`Get current user: ${res.data.message}`);
    }

    // Test 4: Get All Concerts
    log.test('Get All Concerts');
    res = await api.get('/concerts?page=1&limit=9');
    if (res.status === 200 && res.data.data.concerts) {
      log.success(`Get concerts - Found ${res.data.data.concerts.length} concerts`);
      if (res.data.data.concerts.length > 0) {
        concertId = res.data.data.concerts[0]._id;
      }
    } else {
      log.error(`Get concerts: ${res.data.message}`);
    }

    // Test 5: Get Single Concert
    if (concertId) {
      log.test('Get Single Concert');
      res = await api.get(`/concerts/${concertId}`);
      if (res.status === 200) {
        log.success('Get single concert');
      } else {
        log.error(`Get single concert: ${res.data.message}`);
      }
    }

    // Test 6: Create Booking
    if (concertId) {
      log.test('Create Booking');
      res = await api.post(
        '/bookings',
        {
          concertId: concertId,
          ticketsBooked: 2,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 201) {
        log.success('Create booking');
        bookingId = res.data.data.booking._id;
      } else {
        log.error(`Create booking: ${res.data.message}`);
      }
    }

    // Test 7: Get My Bookings
    log.test('Get My Bookings');
    res = await api.get('/bookings/my-bookings', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200 && res.data.data.bookings) {
      log.success(`Get my bookings - Found ${res.data.data.bookings.length} bookings`);
    } else {
      log.error(`Get my bookings: ${res.data.message}`);
    }

    // Test 8: Get Single Booking
    if (bookingId) {
      log.test('Get Single Booking');
      res = await api.get(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        log.success('Get single booking');
      } else {
        log.error(`Get single booking: ${res.data.message}`);
      }
    }

    // Test 9: Get All Concerts with Filters
    log.test('Get Concerts with Filters');
    res = await api.get('/concerts?page=1&limit=5&genre=Rock&sortBy=dateTime&order=asc');
    if (res.status === 200) {
      log.success('Get concerts with filters');
    } else {
      log.error(`Get concerts with filters: ${res.data.message}`);
    }

    // Test 10: Unauthorized Access Test
    log.test('Unauthorized Access (without token)');
    res = await api.get('/bookings/my-bookings');
    if (res.status === 401) {
      log.success('Correctly blocked unauthorized access');
    } else {
      log.error('Should have blocked unauthorized access');
    }

    console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════' + colors.reset);
    log.info('Integration tests completed!');
    console.log(colors.blue + '═══════════════════════════════════════════════════════' + colors.reset + '\n');

    process.exit(0);
  } catch (err) {
    log.error(`Test error: ${err.message}`);
    process.exit(1);
  }
};

// Check if server is running
const checkServer = async () => {
  try {
    await api.get('/health');
    runTests();
  } catch (err) {
    log.error('Server not running on http://localhost:3001');
    log.error('Please start the server first: npm run dev');
    process.exit(1);
  }
};

checkServer();