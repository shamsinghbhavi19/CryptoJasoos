import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import investigationRoutes from './investigationRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import flowRoutes from './flowRoutes.js';
import riskRoutes from './riskRoutes.js';
import caseRoutes from './caseRoutes.js';
import alertRoutes from './alertRoutes.js';
import aiRoutes from './aiRoutes.js';
import reportRoutes from './reportRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import { getWalletTransactions } from '../controllers/investigationController.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/investigations', investigationRoutes);
router.use('/transactions', transactionRoutes);
router.use('/flow', flowRoutes);
router.use('/risk', riskRoutes);
router.use('/cases', caseRoutes);
router.use('/alerts', alertRoutes);
router.use('/ai', aiRoutes);
router.use('/reports', reportRoutes);
router.use('/analytics', analyticsRoutes);

// Additional convenience routes matching spec
router.get('/wallets/:address/transactions', getWalletTransactions);

export default router;
