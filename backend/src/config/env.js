import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  mongodbUri: process.env.MONGODB_URI || '',
  alchemyApiKey: process.env.ALCHEMY_API_KEY || '',
  etherscanApiKey: process.env.ETHERSCAN_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  defaultNetwork: process.env.DEFAULT_NETWORK || 'homestead'
};
