import { Router } from 'express';
import {
  investigateWallet,
  getWalletInvestigation,
  getWalletTransactions,
  investigateTransaction,
  getTransactionByHash
} from '../controllers/investigationController.js';
import { validate, walletInvestigationSchema, transactionInvestigationSchema } from '../middleware/validate.js';
import { investigationLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Wallet Investigation
router.post('/wallet', investigationLimiter, validate(walletInvestigationSchema), investigateWallet);
router.get('/wallet/:address', getWalletInvestigation);

// Transaction Investigation
router.post('/transaction', investigationLimiter, validate(transactionInvestigationSchema), investigateTransaction);

export default router;
