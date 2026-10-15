import { RISK_RULES, RISK_BANDS, DOCUMENTED_RISK_REGISTRY } from '../config/riskRules.js';

export class RiskAnalysisService {
  /**
   * Evaluates wallet address and associated transactions using transparent forensic rules.
   *
   * @param {string} targetAddress - Wallet address under audit
   * @param {Array} transactions - Associated transaction history
   * @returns {Object} Comprehensive explainable risk assessment
   */
  static analyze(targetAddress, transactions = []) {
    const cleanTarget = (targetAddress || '').toLowerCase();
    const triggeredRules = [];
    let calculatedScore = 0;

    // 1. RULE: Known-Risk / Sanctioned Watchlist Exposure
    const registryHit = DOCUMENTED_RISK_REGISTRY[cleanTarget];
    if (registryHit) {
      const rule = RISK_RULES.KNOWN_RISK_EXPOSURE;
      triggeredRules.push({
        id: rule.id,
        name: rule.name,
        severity: rule.severity,
        weight: rule.weight,
        description: rule.description,
        reason: `Target address is cataloged in documented risk intelligence: ${registryHit.category} (SDN: ${registryHit.sdnId || 'N/A'}).`,
        relevantAddresses: [cleanTarget],
        supportingHashes: [],
        observedValue: `Registry Hit: ${registryHit.source}`,
        limitations: 'Registry match based on published OFAC/EU sanctions lists and known public incident disclosures.'
      });
      calculatedScore += rule.weight;
    }

    // Check transactions if available
    if (transactions && transactions.length > 0) {
      // Outgoing & incoming splits
      const outgoing = transactions.filter((t) => (t.fromAddress || '').toLowerCase() === cleanTarget);
      const incoming = transactions.filter((t) => (t.toAddress || '').toLowerCase() === cleanTarget);

      // 2. RULE: Fan-Out Pattern (1 address dispersing to >= 4 distinct targets)
      const uniqueRecipients = new Set(outgoing.map((t) => (t.toAddress || '').toLowerCase()));
      if (uniqueRecipients.size >= RISK_RULES.FAN_OUT.thresholdOutputs) {
        const rule = RISK_RULES.FAN_OUT;
        triggeredRules.push({
          id: rule.id,
          name: rule.name,
          severity: rule.severity,
          weight: rule.weight,
          description: rule.description,
          reason: `Target dispatched funds to ${uniqueRecipients.size} distinct recipient addresses across ${outgoing.length} transactions.`,
          relevantAddresses: Array.from(uniqueRecipients).slice(0, 5),
          supportingHashes: outgoing.slice(0, 3).map((t) => t.hash),
          observedValue: `${uniqueRecipients.size} unique recipients (Threshold: ${rule.thresholdOutputs})`,
          limitations: 'Fan-out patterns may also occur in benign scenarios such as payroll distributions or token airdrops.'
        });
        calculatedScore += rule.weight;
      }

      // 3. RULE: Fan-In Pattern (>= 4 distinct senders consolidating to 1 address)
      const uniqueSenders = new Set(incoming.map((t) => (t.fromAddress || '').toLowerCase()));
      if (uniqueSenders.size >= RISK_RULES.FAN_IN.thresholdInputs) {
        const rule = RISK_RULES.FAN_IN;
        triggeredRules.push({
          id: rule.id,
          name: rule.name,
          severity: rule.severity,
          weight: rule.weight,
          description: rule.description,
          reason: `Target received funds from ${uniqueSenders.size} distinct sender addresses.`,
          relevantAddresses: Array.from(uniqueSenders).slice(0, 5),
          supportingHashes: incoming.slice(0, 3).map((t) => t.hash),
          observedValue: `${uniqueSenders.size} unique depositors (Threshold: ${rule.thresholdInputs})`,
          limitations: 'Consolidation can also correspond to legitimate merchant wallets, donation drives, or exchange deposit aggregators.'
        });
        calculatedScore += rule.weight;
      }

      // 4. RULE: Rapid Fund Movement (< 15 mins between arrival and departure)
      let rapidCount = 0;
      const rapidHashes = [];
      for (const inTx of incoming) {
        const inTime = new Date(inTx.timestamp).getTime();
        for (const outTx of outgoing) {
          const outTime = new Date(outTx.timestamp).getTime();
          const diffMinutes = (outTime - inTime) / (1000 * 60);
          if (diffMinutes > 0 && diffMinutes <= RISK_RULES.RAPID_MOVEMENT.thresholdMinutes) {
            rapidCount++;
            rapidHashes.push(outTx.hash);
            break;
          }
        }
      }

      if (rapidCount > 0) {
        const rule = RISK_RULES.RAPID_MOVEMENT;
        triggeredRules.push({
          id: rule.id,
          name: rule.name,
          severity: rule.severity,
          weight: rule.weight,
          description: rule.description,
          reason: `Detected ${rapidCount} fund movements redistributed within ${rule.thresholdMinutes} minutes of arrival.`,
          relevantAddresses: [cleanTarget],
          supportingHashes: rapidHashes.slice(0, 4),
          observedValue: `${rapidCount} rapid forward events (< ${rule.thresholdMinutes}m)`,
          limitations: 'Automated market making and algorithmic arbitrage bots routinely forward funds within seconds.'
        });
        calculatedScore += rule.weight;
      }

      // 5. RULE: Circular Flow (Funds returned toward an origin/counterparty address)
      const incomingSenders = new Set(incoming.map((t) => (t.fromAddress || '').toLowerCase()));
      const circularTxs = outgoing.filter((t) => incomingSenders.has((t.toAddress || '').toLowerCase()));
      if (circularTxs.length > 0) {
        const rule = RISK_RULES.CIRCULAR_FLOW;
        triggeredRules.push({
          id: rule.id,
          name: rule.name,
          severity: rule.severity,
          weight: rule.weight,
          description: rule.description,
          reason: `Funds looped directly back to ${circularTxs.length} counterparty address(es) that originally deposited funds.`,
          relevantAddresses: circularTxs.map((t) => (t.toAddress || '').toLowerCase()),
          supportingHashes: circularTxs.map((t) => t.hash),
          observedValue: `${circularTxs.length} looping transfers identified`,
          limitations: 'Circular flows can occur in lending protocol repayments or trade cancellations.'
        });
        calculatedScore += rule.weight;
      }

      // 6. RULE: Multi-Hop Peeling Lineage
      const maxHops = Math.max(...transactions.map((t) => t.hopCount || 1), 1);
      if (maxHops >= RISK_RULES.MULTI_HOP.thresholdHops) {
        const rule = RISK_RULES.MULTI_HOP;
        triggeredRules.push({
          id: rule.id,
          name: rule.name,
          severity: rule.severity,
          weight: rule.weight,
          description: rule.description,
          reason: `Lineage graph traces fund continuity across ${maxHops} sequential hop layers.`,
          relevantAddresses: [cleanTarget],
          supportingHashes: transactions.filter((t) => (t.hopCount || 1) >= 2).map((t) => t.hash).slice(0, 3),
          observedValue: `${maxHops} sequential hops (Threshold: ${rule.thresholdHops})`,
          limitations: 'Intermediate hops may involve decentralized exchange routers or bridge contract proxies.'
        });
        calculatedScore += rule.weight;
      }
    } else {
      // Inconclusive note for missing transactions
      if (!registryHit) {
        triggeredRules.push({
          id: 'RULE_DATA_LIMITED',
          name: 'Transaction Lineage Inconclusive',
          severity: 'low',
          weight: 0,
          description: 'Historical on-chain account transactions unavailable via standard RPC. Behavioral heuristics marked inconclusive.',
          reason: 'No transaction history indexed for address.',
          relevantAddresses: [cleanTarget],
          supportingHashes: [],
          observedValue: '0 transactions available',
          limitations: 'Requires Etherscan / Alchemy Transfers key to inspect multi-hop history.'
        });
      }
    }

    // Cap illustrative score at 100
    const finalScore = Math.min(100, Math.max(0, calculatedScore));

    // Determine Risk Band
    let riskLevel = 'low';
    if (finalScore >= RISK_BANDS.CRITICAL.min) riskLevel = 'critical';
    else if (finalScore >= RISK_BANDS.HIGH.min) riskLevel = 'high';
    else if (finalScore >= RISK_BANDS.MEDIUM.min) riskLevel = 'medium';

    return {
      riskScore: finalScore,
      riskLevel,
      riskBand: RISK_BANDS[riskLevel.toUpperCase()],
      triggeredRules,
      disclaimer: 'CRITICAL INVESTIGATIVE NOTICE: Suspicious patterns are investigative leads and risk indicators, NOT mathematical proof of criminal activity. All findings require corroborating legal and off-chain evidence.',
      evaluatedAt: new Date().toISOString()
    };
  }
}
