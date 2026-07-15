/**
 * Build paginated query parameters from request.
 */
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Build a paginated response object.
 */
const paginatedResponse = (data, total, page, limit) => ({
  data,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

/**
 * Generate a random bandwidth data point (simulated).
 */
const randomMbps = (min = 10, max = 500) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));

/**
 * Get current timestamp in ISO format.
 */
const nowISO = () => new Date().toISOString();

/**
 * Get current time as HH:MM:SS string.
 */
const timeString = () =>
  new Date().toLocaleTimeString("en-US", { hour12: false });

module.exports = {
  getPaginationParams,
  paginatedResponse,
  randomMbps,
  nowISO,
  timeString,
};
