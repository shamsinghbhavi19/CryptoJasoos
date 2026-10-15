import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Case Management Endpoints', () => {
  let createdCaseId = null;

  it('GET /api/cases should return case list with summary stats', async () => {
    const res = await request(app).get('/api/cases');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.activeCases).toBeGreaterThanOrEqual(20);
  });

  it('POST /api/cases should create a new investigation case', async () => {
    const newCase = {
      title: 'Automated Test Ransomware Tracing',
      targetAddress: '0x82A7656EC7ab88b098defB751B7401B5f6d8976F',
      network: 'Ethereum',
      priority: 'High',
      notes: 'Initial test case payload'
    };

    const res = await request(app).post('/api/cases').send(newCase);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.caseNumber).toContain('CJ-2026');
    expect(res.body.data.title).toBe(newCase.title);
    createdCaseId = res.body.data.caseNumber;
  });

  it('GET /api/cases/:id should retrieve the created case details', async () => {
    const res = await request(app).get(`/api/cases/${createdCaseId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.caseNumber).toBe(createdCaseId);
  });

  it('PATCH /api/cases/:id should update permitted metadata (status, priority)', async () => {
    const res = await request(app)
      .patch(`/api/cases/${createdCaseId}`)
      .send({ status: 'UNDER REVIEW', notes: 'Updated forensic analysis notes' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('UNDER REVIEW');
  });
});
