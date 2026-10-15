import { describe, it, expect } from 'vitest';
import { RiskAnalysisService } from '../src/services/riskAnalysisService.js';
import { TransactionNormalizer } from '../src/services/transactionNormalizer.js';

describe('Risk Analysis Service & Explainable Rules', () => {
  const target = '0x82a7656ec7ab88b098defb751b7401b5f6d8976f';

  it('should identify OFAC SDN / Registry match with proper severity and limitations', () => {
    const result = RiskAnalysisService.analyze(target, []);
    expect(result.riskScore).toBeGreaterThanOrEqual(40);
    expect(result.riskLevel).toBeDefined();

    const registryRule = result.triggeredRules.find((r) => r.id === 'RULE_KNOWN_RISK_EXPOSURE');
    expect(registryRule).toBeDefined();
    expect(registryRule.severity).toBe('critical');
    expect(registryRule.reason).toContain('Suspected Exploit Sub-Node');
    expect(registryRule.limitations).toBeDefined();
    expect(result.disclaimer).toContain('CRITICAL INVESTIGATIVE NOTICE');
  });

  it('should detect Fan-Out pattern when 1 address splits funds into 4+ outputs', () => {
    const mockTxs = [
      { fromAddress: target, toAddress: '0x1111111111111111111111111111111111111111', amountUSD: 1000, hash: '0x01' },
      { fromAddress: target, toAddress: '0x2222222222222222222222222222222222222222', amountUSD: 1000, hash: '0x02' },
      { fromAddress: target, toAddress: '0x3333333333333333333333333333333333333333', amountUSD: 1000, hash: '0x03' },
      { fromAddress: target, toAddress: '0x4444444444444444444444444444444444444444', amountUSD: 1000, hash: '0x04' }
    ];

    const result = RiskAnalysisService.analyze('0x9999999999999999999999999999999999999999', mockTxs.map(t => ({ ...t, fromAddress: '0x9999999999999999999999999999999999999999' })));
    const fanOutRule = result.triggeredRules.find((r) => r.id === 'RULE_FAN_OUT');
    expect(fanOutRule).toBeDefined();
    expect(fanOutRule.observedValue).toContain('4 unique recipients');
  });

  it('should detect Rapid Fund Movement when outgoing occurs within 15 minutes of incoming', () => {
    const baseTime = Date.now();
    const mockTxs = [
      {
        fromAddress: '0xaaaa',
        toAddress: '0xbbbb',
        timestamp: new Date(baseTime).toISOString(),
        hash: '0xin'
      },
      {
        fromAddress: '0xbbbb',
        toAddress: '0xcccc',
        timestamp: new Date(baseTime + 5 * 60 * 1000).toISOString(), // 5 mins later
        hash: '0xout'
      }
    ];

    const result = RiskAnalysisService.analyze('0xbbbb', mockTxs);
    const rapidRule = result.triggeredRules.find((r) => r.id === 'RULE_RAPID_MOVEMENT');
    expect(rapidRule).toBeDefined();
    expect(rapidRule.supportingHashes).toContain('0xout');
  });

  it('should handle missing data gracefully and mark rules as inconclusive without throwing error', () => {
    const result = RiskAnalysisService.analyze('0x1234567890123456789012345678901234567890', []);
    expect(result.riskScore).toBe(0);
    expect(result.riskLevel).toBe('low');
    const limitedRule = result.triggeredRules.find((r) => r.id === 'RULE_DATA_LIMITED');
    expect(limitedRule).toBeDefined();
    expect(limitedRule.reason).toContain('No transaction history');
  });

  it('TransactionNormalizer should standardize fields and labels', () => {
    const normalized = TransactionNormalizer.normalize({
      hash: '0xABC',
      from: '0x82a7656ec7ab88b098defb751b7401b5f6d8976f',
      to: '0x123',
      amountCrypto: 2.5
    });

    expect(normalized.hash).toBe('0xabc');
    expect(normalized.fromLabel).toBe('Suspected Exploit Sub-Node');
    expect(normalized.amountUSD).toBe(6500); // 2.5 * 2600
  });
});
