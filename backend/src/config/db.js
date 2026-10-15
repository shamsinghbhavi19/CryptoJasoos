import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let isDbConnected = false;

export const connectDB = async () => {
  if (!config.mongodbUri) {
    logger.warn('[Database] MONGODB_URI not configured. Operating in in-memory fallback mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000
    });
    isDbConnected = true;
    logger.info(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isDbConnected = false;
    logger.error(`[Database] Connection Error: ${error.message}. System falling back to memory store.`);
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isDbConnected,
  readyState: mongoose.connection.readyState,
  status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
});
