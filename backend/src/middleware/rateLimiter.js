import rateLimit from 'express-rate-limit';
import { formatError } from '../utils/responseFormatter.js';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // max 150 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: formatError('Too many requests from this IP, please try again after 15 minutes', 429)
});

export const investigationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 40, // max 40 on-chain investigation lookups per 5 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: formatError('Investigation rate limit exceeded. Please wait a few minutes before querying more addresses.', 429)
});
