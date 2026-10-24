const User = require('../models/User');
const sendResponse = require('../Utils/sendResponse');
const { generateToken } = require('../Utils/tokenUtils');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password) {
      return sendResponse(res, 400, 'Please provide all required fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendResponse(res, 400, 'Email already registered');
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: 'user',
    });

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    sendResponse(res, 201, 'User registered successfully', {
      token,
      user: userResponse,
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return sendResponse(res, 400, 'Please provide email and password');
    }

    // Check user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendResponse(res, 401, 'Invalid credentials');
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    sendResponse(res, 200, 'Login successful', {
      token,
      user: userResponse,
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    sendResponse(res, 200, 'User fetched', { user });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/create-admin
// @desc    Create admin user (for setup only)
// @access  Public (should be protected in production)
exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendResponse(res, 400, 'Please provide all required fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendResponse(res, 400, 'Email already registered');
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: 'admin',
    });

    const token = generateToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    sendResponse(res, 201, 'Admin created successfully', {
      token,
      user: userResponse,
    });
  } catch (err) {
    next(err);
  }
};