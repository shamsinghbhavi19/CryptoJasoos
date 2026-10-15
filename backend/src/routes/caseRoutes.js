import { Router } from 'express';
import {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  associateInvestigation
} from '../controllers/caseController.js';
import { validate, caseCreateSchema, caseUpdateSchema } from '../middleware/validate.js';

const router = Router();

router.get('/', getCases);
router.get('/:id', getCaseById);
router.post('/', validate(caseCreateSchema), createCase);
router.patch('/:id', validate(caseUpdateSchema), updateCase);
router.post('/:id/investigations', associateInvestigation);

export default router;
