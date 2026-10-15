import { Router } from 'express';
import { analyzeRisk, getInvestigationRisk } from '../controllers/riskController.js';

const router = Router();

router.post('/analyze', analyzeRisk);
router.get('/investigations/:id/risk', getInvestigationRisk);

export default router;
