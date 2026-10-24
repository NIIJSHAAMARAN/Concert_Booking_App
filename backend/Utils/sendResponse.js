const sendResponse = (res, status, message, data = null, pagination = null) => {
  const response = {
    success: status >= 200 && status < 300,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  res.status(status).json(response);
};

module.exports = sendResponse;