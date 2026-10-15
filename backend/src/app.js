import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { config } from './config/env.js';
import { formatError } from './utils/responseFormatter.js';

export const app = express();

// Security Headers
app.use(helmet());

// CORS configuration supporting configured frontend, Vercel deployments, and local ports
const allowedOrigins = [
  config.frontendUrl,
  'https://crypto-jasoos.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman, or same-origin)
      if (!origin) return callback(null, true);
      
      if (
        allowedOrigins.includes(origin) ||
        origin === 'https://crypto-jasoos.vercel.app' ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  })
);

// Request Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root welcome & API health redirect
app.get('/', (req, res) => {
  res.json({
    message: 'CryptoJasoos Blockchain Forensics & Crypto Transaction Investigation API',
    status: 'online',
    docs: '/api/health'
  });
});

// Mount /api endpoints
app.use('/api', apiLimiter, apiRouter);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json(formatError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
