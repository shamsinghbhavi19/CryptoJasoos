import { Router } from 'express';
import { summarizeInvestigation, askAiAssistant } from '../controllers/aiController.js';

const router = Router();

router.post('/summarize/:investigationId', summarizeInvestigation);
router.post('/ask', askAiAssistant);

export default router;
