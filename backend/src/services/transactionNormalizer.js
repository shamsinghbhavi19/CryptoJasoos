import { DOCUMENTED_RISK_REGISTRY } from '../config/riskRules.js';

export class TransactionNormalizer {
  static normalize(rawTx) {
    if (!rawTx) return null;

    const fromAddress = (rawTx.fromAddress || rawTx.from || '').toLowerCase();
    const toAddress = (rawTx.toAddress || rawTx.to || '').toLowerCase();
    const hash = (rawTx.hash || rawTx.txHash || '').toLowerCase();

    // Check registry labels
    const fromLabel = DOCUMENTED_RISK_REGISTRY[fromAddress]?.category || 'Address Under Investigation';
    const toLabel = DOCUMENTED_RISK_REGISTRY[toAddress]?.category || 'Counterparty Address';

    const amountCrypto = parseFloat(rawTx.amountCrypto || rawTx.value || 0);
    const amountUSD = rawTx.amountUSD || Math.round(amountCrypto * 2600);

    return {
      hash,
      chain: rawTx.chain || 'ETH',
      fromAddress,
      fromLabel,
      toAddress,
      toLabel,
      amountCrypto,
      symbol: rawTx.symbol || 'ETH',
      amountUSD,
      blockNumber: rawTx.blockNumber || null,
      timestamp: rawTx.timestamp || new Date().toISOString(),
      gasUsed: rawTx.gasUsed || '0',
      status: rawTx.status || 'Confirmed',
      riskScore: rawTx.riskScore || 0,
      riskLevel: rawTx.riskLevel || 'low',
      category: rawTx.category || 'Standard Transfer',
      hopCount: rawTx.hopCount || 1
    };
  }

  static normalizeList(txList) {
    if (!Array.isArray(txList)) return [];
    return txList.map((tx) => this.normalize(tx)).filter(Boolean);
  }
}
