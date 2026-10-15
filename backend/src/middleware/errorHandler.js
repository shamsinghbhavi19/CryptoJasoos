import { logger } from '../utils/logger.js';
import { formatError } from '../utils/responseFormatter.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`[Error] ${req.method} ${req.originalUrl} - ${err.message}`, err.stack);

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.isOperational ? err.message : (statusCode === 500 ? 'Internal Server Error' : err.message);

  res.status(statusCode).json(formatError(message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined));
};
