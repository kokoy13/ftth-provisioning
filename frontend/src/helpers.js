/**
 * Format an ISO date string to a human-readable format.
 * @param {string} isoString - ISO 8601 date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (isoString, options = {}) => {
  if (!isoString) return "—";
  const defaults = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("en-US", { ...defaults, ...options }).format(new Date(isoString));
};

/**
 * Format a short date (no time).
 */
export const formatShortDate = (isoString) =>
  formatDate(isoString, { second: undefined, hour: undefined, minute: undefined, hour12: undefined });

/**
 * Format bytes to a human-readable size.
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format Mbps value with unit.
 */
export const formatMbps = (value) => `${Number(value).toFixed(2)} Mbps`;

/**
 * Truncate a string to a max length with ellipsis.
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return "";
  return str.length > maxLength ? `${str.slice(0, maxLength)}…` : str;
};

/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Replace :param placeholders in a URL template with actual values.
 * e.g. buildUrl("/provisioning/:id/retry", { id: "abc" }) => "/provisioning/abc/retry"
 */
export const buildUrl = (template, params = {}) =>
  Object.entries(params).reduce(
    (url, [key, value]) => url.replace(`:${key}`, encodeURIComponent(value)),
    template
  );

/**
 * Generate a debounced version of a function.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Calculate pagination metadata.
 */
export const getPaginationMeta = (totalItems, currentPage, pageSize) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  return {
    totalPages,
    startItem: totalItems > 0 ? startItem : 0,
    endItem,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
};

/**
 * Generate an array of page numbers to display in pagination.
 */
export const getPageNumbers = (currentPage, totalPages, maxVisible = 5) => {
  const pages = [];
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
};

/**
 * Generate a random color from a seed string (for charts).
 */
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 60%)`;
};
