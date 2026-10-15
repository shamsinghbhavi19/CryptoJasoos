export const formatSuccess = (data, message = 'Success', metadata = {}) => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
  ...metadata
});

export const formatError = (message = 'An error occurred', statusCode = 500, details = null) => ({
  success: false,
  message,
  statusCode,
  error: details,
  timestamp: new Date().toISOString()
});
