import { Router } from 'express';
import { getReport, exportReport } from '../controllers/reportController.js';

const router = Router();

router.get('/:investigationId', getReport);
router.get('/:investigationId/export', exportReport);

export default router;
