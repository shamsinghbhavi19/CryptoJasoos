import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Investigation, Flow, and Report Endpoints', () => {
  const targetAddress = '0x82A7656EC7ab88b098defB751B7401B5f6d8976F';
  const sampleHash = '0x9a8f3b21c4e5d67890123456789abcdef0123456789abcdef0123456789abc10';

  it('POST /api/investigations/wallet should return wallet dossier with explainable risk', async () => {
    const res = await request(app)
      .post('/api/investigations/wallet')
      .send({ address: targetAddress });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.address).toBe(targetAddress.toLowerCase());
    expect(res.body.data.riskScore).toBeGreaterThanOrEqual(40);
    expect(res.body.data.riskIndicators.length).toBeGreaterThan(0);
    expect(res.body.data.disclaimer).toBeDefined();
  });

  it('GET /api/investigations/wallet/:address should retrieve wallet dossier', async () => {
    const res = await request(app).get(`/api/investigations/wallet/${targetAddress}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.address).toBe(targetAddress.toLowerCase());
  });

  it('POST /api/investigations/transaction should investigate a transaction hash', async () => {
    const res = await request(app)
      .post('/api/investigations/transaction')
      .send({ hash: sampleHash });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hash).toBe(sampleHash.toLowerCase());
    expect(res.body.data.counterpartyMeta).toBeDefined();
  });

  it('GET /api/flow should return React Flow nodes and edges', async () => {
    const res = await request(app).get(`/api/flow?address=${targetAddress}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.nodes)).toBe(true);
    expect(Array.isArray(res.body.data.edges)).toBe(true);
    expect(res.body.data.nodes.length).toBeGreaterThan(0);
  });

  it('GET /api/reports/:id should generate a FinCEN SAR report structure', async () => {
    const res = await request(app).get(`/api/reports/${targetAddress}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reportId).toContain('SAR');
    expect(res.body.data.targetSubject.address).toBe(targetAddress);
    expect(res.body.data.regulatoryNotice).toBeDefined();
  });

  it('GET /api/reports/:id/export?format=json should export JSON attachment', async () => {
    const res = await request(app).get(`/api/reports/${targetAddress}/export?format=json`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.headers['content-disposition']).toContain('attachment');
  });

  it('GET /api/analytics should return macro statistics and risk distribution', async () => {
    const res = await request(app).get('/api/analytics');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary.totalInvestigations).toBeDefined();
    expect(Array.isArray(res.body.data.riskDistribution)).toBe(true);
  });
});
