import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Alert Management Endpoints', () => {
  it('GET /api/alerts should list security alerts', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('PATCH /api/alerts/:id should update alert review status', async () => {
    const res = await request(app)
      .patch('/api/alerts/ALT-2026-801')
      .send({ status: 'investigating' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('investigating');
  });

  it('PATCH /api/alerts/:id with invalid status should return 400', async () => {
    const res = await request(app)
      .patch('/api/alerts/ALT-2026-801')
      .send({ status: 'invalid-status' });

    expect(res.status).toBe(400);
  });
});
