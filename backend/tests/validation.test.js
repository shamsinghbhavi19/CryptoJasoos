import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Request Validation & Error Handling', () => {
  it('POST /api/investigations/wallet with invalid address should return 400', async () => {
    const res = await request(app)
      .post('/api/investigations/wallet')
      .send({ address: 'not-an-eth-address' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
    expect(JSON.stringify(res.body)).toContain('Invalid Ethereum address format');
  });

  it('POST /api/investigations/transaction with invalid hash should return 400', async () => {
    const res = await request(app)
      .post('/api/investigations/transaction')
      .send({ hash: '0x123tooShort' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(JSON.stringify(res.body)).toContain('Invalid transaction hash format');
  });

  it('POST /api/cases with missing title or invalid target address should return 400', async () => {
    const res = await request(app)
      .post('/api/cases')
      .send({
        title: '',
        targetAddress: 'invalid-address'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
