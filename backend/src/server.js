import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  // Connect database (with fallback)
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`=======================================================`);
    logger.info(` CryptoJasoos Forensics API Server Running on Port ${config.port}`);
    logger.info(` Environment: ${config.nodeEnv}`);
    logger.info(` Health Check: http://localhost:${config.port}/api/health`);
    logger.info(` Allowed Frontend: ${config.frontendUrl}`);
    logger.info(`=======================================================`);
  });

  // Graceful shutdown handling
  const shutdown = (signal) => {
    logger.info(`[Server] Received ${signal}. Closing HTTP server gracefully...`);
    server.close(() => {
      logger.info('[Server] HTTP server closed. Process terminating.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  logger.error(`[Server] Fatal startup error: ${err.message}`, err.stack);
  process.exit(1);
});
