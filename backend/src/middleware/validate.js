import { z } from 'zod';
import { isValidEthAddress, isValidTxHash } from '../utils/addressValidator.js';
import { formatError } from '../utils/responseFormatter.js';

export const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const dataToValidate = req[source];
    const parsed = schema.parse(dataToValidate);
    req[source] = parsed;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }));
      return res.status(400).json(formatError('Request validation failed', 400, details));
    }
    return res.status(400).json(formatError('Invalid request payload', 400, error.message));
  }
};

// Common reusable Zod schemas
export const ethereumAddressSchema = z.string().refine(isValidEthAddress, {
  message: 'Invalid Ethereum address format (must be 42-character 0x-prefixed hex)'
});

export const transactionHashSchema = z.string().refine(isValidTxHash, {
  message: 'Invalid transaction hash format (must be 66-character 0x-prefixed hex)'
});

export const walletInvestigationSchema = z.object({
  address: ethereumAddressSchema,
  network: z.string().optional().default('homestead'),
  limit: z.number().int().min(1).max(100).optional().default(25)
});

export const transactionInvestigationSchema = z.object({
  hash: transactionHashSchema,
  network: z.string().optional().default('homestead')
});

export const caseCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  targetAddress: ethereumAddressSchema,
  network: z.enum(['Ethereum', 'Bitcoin', 'Polygon', 'Solana', 'BNB Chain']).default('Ethereum'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  notes: z.string().optional()
});

export const caseUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  status: z.enum(['ACTIVE', 'UNDER REVIEW', 'CLOSED']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  notes: z.string().optional()
});

export const alertUpdateSchema = z.object({
  status: z.enum(['new', 'investigating', 'resolved'])
});
