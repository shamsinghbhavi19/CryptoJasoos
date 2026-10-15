import { Router } from 'express';
import { getAlerts, updateAlertStatus } from '../controllers/alertController.js';
import { validate, alertUpdateSchema } from '../middleware/validate.js';

const router = Router();

router.get('/', getAlerts);
router.patch('/:id', validate(alertUpdateSchema), updateAlertStatus);

export default router;
