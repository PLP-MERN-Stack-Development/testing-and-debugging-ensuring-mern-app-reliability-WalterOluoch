/**
 * Debugging utilities for the Bug Tracker application
 * These functions help with debugging and logging
 */

/**
 * Logs a formatted debug message with timestamp
 * @param {string} message - The debug message
 * @param {any} data - Optional data to log
 */
const debugLog = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[DEBUG ${timestamp}] ${message}`);
  if (data) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
};

/**
 * Logs an error with stack trace
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred
 */
const debugError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR ${timestamp}] ${context}`);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
  if (error.response) {
    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);
  }
};

/**
 * Logs API request details
 * @param {object} req - Express request object
 */
const logRequest = (req) => {
  debugLog(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
    params: req.params,
    headers: req.headers
  });
};

/**
 * Logs API response details
 * @param {object} res - Express response object
 * @param {any} data - Response data
 */
const logResponse = (res, data) => {
  debugLog(`Response ${res.statusCode}`, data);
};

/**
 * Measures execution time of a function
 * @param {string} label - Label for the measurement
 * @param {Function} fn - Function to measure
 * @returns {Promise<any>} - Result of the function
 */
const measureTime = async (label, fn) => {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    debugLog(`${label} took ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    debugError(error, `${label} failed after ${duration}ms`);
    throw error;
  }
};

module.exports = {
  debugLog,
  debugError,
  logRequest,
  logResponse,
  measureTime
};
