import { Router } from 'express';
import { getFlowGraph, getInvestigationFlow } from '../controllers/flowController.js';

const router = Router();

router.get('/', getFlowGraph);
router.get('/investigations/:id/flow', getInvestigationFlow);

export default router;
