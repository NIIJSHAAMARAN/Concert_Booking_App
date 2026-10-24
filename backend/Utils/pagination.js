const getPagination = (page = 1, limit = 9) => {
  const skip = (page - 1) * limit;
  return { skip, limit, page };
};

const createPaginationObject = (page, limit, total) => {
  const pages = Math.ceil(total / limit);
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total: parseInt(total),
    pages,
  };
};

module.exports = { getPagination, createPaginationObject };