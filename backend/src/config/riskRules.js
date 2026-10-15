/**
 * Configurable rule definitions, weights, and thresholds for the CryptoJasoos Risk Engine.
 * Note: Risk scores are illustrative investigative indicators, not calibrated mathematical proof of fraud.
 */

export const RISK_BANDS = {
  LOW: { min: 0, max: 29, label: 'Low', color: '#10B981' },
  MEDIUM: { min: 30, max: 59, label: 'Medium', color: '#F59E0B' },
  HIGH: { min: 60, max: 79, label: 'High', color: '#F97316' },
  CRITICAL: { min: 80, max: 100, label: 'Critical', color: '#EF4444' }
};

export const RISK_RULES = {
  RAPID_MOVEMENT: {
    id: 'RULE_RAPID_MOVEMENT',
    name: 'Rapid Fund Movement',
    description: 'Incoming funds were forwarded to a subsequent address within an unusually short timeframe (< 15 minutes).',
    severity: 'high',
    weight: 25,
    thresholdMinutes: 15
  },
  FAN_OUT: {
    id: 'RULE_FAN_OUT',
    name: 'Fan-Out Distribution Pattern',
    description: 'A single source address dispersed funds into multiple independent output addresses within a short window.',
    severity: 'high',
    weight: 20,
    thresholdOutputs: 4
  },
  FAN_IN: {
    id: 'RULE_FAN_IN',
    name: 'Fan-In Consolidation Pattern',
    description: 'Multiple distinct addresses consolidated funds into a single recipient address.',
    severity: 'medium',
    weight: 15,
    thresholdInputs: 4
  },
  MULTI_HOP: {
    id: 'RULE_MULTI_HOP',
    name: 'Multi-Hop Peeling Lineage',
    description: 'Transaction lineage indicates funds travelled through 3 or more intermediate hop addresses in sequence.',
    severity: 'high',
    weight: 20,
    thresholdHops: 3
  },
  CIRCULAR_FLOW: {
    id: 'RULE_CIRCULAR_FLOW',
    name: 'Circular Fund Movement',
    description: 'Graph connectivity indicates funds cycled through intermediate hops and returned toward the originator cluster.',
    severity: 'critical',
    weight: 35
  },
  HIGH_VELOCITY: {
    id: 'RULE_HIGH_VELOCITY',
    name: 'Unusual Transaction Frequency Burst',
    description: 'Address exhibited a burst of 10 or more transactions within a 1-hour window.',
    severity: 'medium',
    weight: 15,
    burstCount: 10
  },
  KNOWN_RISK_EXPOSURE: {
    id: 'RULE_KNOWN_RISK_EXPOSURE',
    name: 'Sanctioned Protocol / Known-Risk Cluster Exposure',
    description: 'Direct or indirect counterparty interaction with recognized OFAC SDN list entities or anonymization protocols.',
    severity: 'critical',
    weight: 40
  }
};

/**
 * Verified mock reference intelligence for demo & tests (OFAC SDN & Tornado Cash contracts)
 */
export const DOCUMENTED_RISK_REGISTRY = {
  '0x82a7656ec7ab88b098defb751b7401b5f6d8976f': {
    category: 'Suspected Exploit Sub-Node',
    riskLevel: 'high',
    sanctioned: true,
    sdnId: 'SDN-ETH-98412',
    source: 'EU/OFAC Watchlist Cluster Reference'
  },
  '0x71c7656ec7ab88b098defb751b7401b5f6d8976f': {
    category: 'Flagged Bridge Incident Cluster',
    riskLevel: 'critical',
    sanctioned: true,
    sdnId: 'SDN-ETH-DPRK-94812',
    source: 'OFAC SDN List Match'
  },
  '0x47ac0fb3f2d84898e4d9e7b4dab3c24507a6d503': {
    category: 'Anonymizing Mixer Protocol (Tornado Cash 100 ETH)',
    riskLevel: 'critical',
    sanctioned: true,
    sdnId: 'SDN-TORNADO-100',
    source: 'OFAC Sanctioned Smart Contract'
  }
};
