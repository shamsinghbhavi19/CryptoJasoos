import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Gemini AI Investigation Endpoint', () => {
  it('POST /api/ai/summarize/:investigationId should handle missing key gracefully', async () => {
    const res = await request(app)
      .post('/api/ai/summarize/0x82A7656EC7ab88b098defB751B7401B5f6d8976F')
      .send({
        notes: 'Investigator sample inquiry'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary).toBeDefined();
    // When no key is set, it explains that rule-based risk evaluation remains operational
    if (!process.env.GEMINI_API_KEY) {
      expect(res.body.data.available).toBe(false);
      expect(res.body.data.summary).toContain('Rule-based risk assessment remains fully operational');
    }
  });

  it('POST /api/ai/ask should handle copilot prompt safely', async () => {
    const res = await request(app)
      .post('/api/ai/ask')
      .send({
        question: 'Why is target 0x82A7656EC7ab88b098defB751B7401B5f6d8976F flagged as high risk?'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
