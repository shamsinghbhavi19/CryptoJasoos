import { Router } from 'express';
import { getTransactionByHash, getWalletTransactions } from '../controllers/investigationController.js';

const router = Router();

router.get('/:hash', getTransactionByHash);

export default router;
