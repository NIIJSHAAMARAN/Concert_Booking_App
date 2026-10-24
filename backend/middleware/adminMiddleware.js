const sendResponse = require('../Utils/sendResponse');

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendResponse(res, 403, 'Not authorized as an admin');
  }
  next();
};

module.exports = adminMiddleware;