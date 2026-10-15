import { getDbStatus } from '../config/db.js';
import { config } from '../config/env.js';
import { formatSuccess } from '../utils/responseFormatter.js';

export const getHealth = (req, res) => {
  const dbStatus = getDbStatus();

  res.status(200).json(
    formatSuccess({
      status: 'online',
      service: 'CryptoJasoos Forensics API',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus,
      blockchain: {
        provider: config.alchemyApiKey ? 'Alchemy' : 'Ethereum JSON-RPC (Cloudflare)',
        network: config.defaultNetwork,
        etherscanConfigured: !!config.etherscanApiKey
      },
      ai: {
        geminiConfigured: !!config.geminiApiKey
      }
    }, 'CryptoJasoos API is operating normally')
  );
};
