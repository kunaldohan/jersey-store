// server/utils/response.js
// Helper functions for consistent API response format
// Every response looks like: { success: true/false, message: "...", data: ... }

const sendSuccess = (res, data = null, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message = "Something went wrong", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

module.exports = { sendSuccess, sendError };
