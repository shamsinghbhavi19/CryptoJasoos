import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Health & Root API Endpoints', () => {
  it('GET / should return welcome message and online status', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('online');
    expect(res.body.message).toContain('CryptoJasoos');
  });

  it('GET /api/health should return status 200 with database and provider metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('online');
    expect(res.body.data.service).toBe('CryptoJasoos Forensics API');
    expect(res.body.data.database).toBeDefined();
    expect(res.body.data.blockchain).toBeDefined();
  });

  it('GET /api/unknown-route should return 404 with structured error', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Route not found');
  });
});
