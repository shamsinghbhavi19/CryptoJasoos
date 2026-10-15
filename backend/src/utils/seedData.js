export const SEED_CASES = [
  {
    caseNumber: 'CJ-2026-014',
    title: 'Suspected Crypto Fraud Investigation',
    targetAddress: '0x82A7656EC7ab88b098defB751B7401B5f6d8976F',
    network: 'Ethereum',
    riskLevel: 'high',
    priority: 'High',
    status: 'ACTIVE',
    alertsCount: 12,
    transactionsAnalyzed: 1284,
    connectedAddressesCount: 107,
    riskScore: 87,
    graphDepthHops: 6,
    firstActivityDate: '12 Aug 2026',
    lastActivityDate: '26 Aug 2026',
    createdDate: '26 Aug 2026',
    leadInvestigator: 'Alex Vance (Cyber Crime Unit)',
    notes: 'Rapid fund redistribution across 4 intermediate hop nodes following suspicious contract call.',
    riskIndicators: [
      'Rapid Fund Movement',
      'Fan-Out Pattern',
      'Multi-Hop Transfers',
      'High Transaction Velocity'
    ]
  },
  {
    caseNumber: 'CJ-2026-013',
    title: 'Lazarus Sub-Node Exploitation Audit',
    targetAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    network: 'Ethereum',
    riskLevel: 'critical',
    priority: 'Critical',
    status: 'ACTIVE',
    alertsCount: 19,
    transactionsAnalyzed: 3412,
    connectedAddressesCount: 245,
    riskScore: 98,
    graphDepthHops: 8,
    firstActivityDate: '01 Aug 2026',
    lastActivityDate: '25 Aug 2026',
    createdDate: '20 Aug 2026',
    leadInvestigator: 'Sarah Jenkins',
    notes: 'Direct Tornado Cash anonymization interactivity and OFAC SDN watchlist match.',
    riskIndicators: [
      'OFAC SDN Watchlist Match',
      'Mixer Anonymization',
      'Circular Fund Movement',
      'Multi-Hop Transfers'
    ]
  },
  {
    caseNumber: 'CJ-2026-012',
    title: 'Cross-Chain Bridge Fund Tracing',
    targetAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    network: 'Bitcoin',
    riskLevel: 'critical',
    priority: 'High',
    status: 'UNDER REVIEW',
    alertsCount: 8,
    transactionsAnalyzed: 8940,
    connectedAddressesCount: 310,
    riskScore: 94,
    graphDepthHops: 5,
    firstActivityDate: '15 Jul 2026',
    lastActivityDate: '24 Aug 2026',
    createdDate: '18 Aug 2026',
    leadInvestigator: 'Cyber Forensics Division',
    notes: 'Cross-chain hop exit node associated with darknet market liquidity pool.',
    riskIndicators: [
      'High-Risk Endpoint',
      'Rapid Fund Movement',
      'Peel Chain Structuring'
    ]
  },
  {
    caseNumber: 'CJ-2026-011',
    title: 'Intermediate Hop Peeling Chain Analysis',
    targetAddress: '0x3F9A1278c771A90B23fE12938171092817362B1',
    network: 'Ethereum',
    riskLevel: 'high',
    priority: 'Medium',
    status: 'UNDER REVIEW',
    alertsCount: 5,
    transactionsAnalyzed: 412,
    connectedAddressesCount: 38,
    riskScore: 78,
    graphDepthHops: 4,
    firstActivityDate: '10 Aug 2026',
    lastActivityDate: '22 Aug 2026',
    createdDate: '15 Aug 2026',
    leadInvestigator: 'Alex Vance',
    notes: 'Micro-splitting address attempting VASP off-ramp cashout.',
    riskIndicators: [
      'Peel-Chain Intermediate Hop',
      'High Transaction Velocity'
    ]
  },
  {
    caseNumber: 'CJ-2026-010',
    title: 'Regulated Exchange Off-Ramp Audit',
    targetAddress: '0x9A48F921B7d3129841C520938C21094E19491C2',
    network: 'Ethereum',
    riskLevel: 'low',
    priority: 'Low',
    status: 'CLOSED',
    alertsCount: 0,
    transactionsAnalyzed: 980000,
    connectedAddressesCount: 120000,
    riskScore: 24,
    graphDepthHops: 2,
    firstActivityDate: '01 Jan 2021',
    lastActivityDate: '26 Aug 2026',
    createdDate: '05 Aug 2026',
    leadInvestigator: 'Compliance Audit Team',
    notes: 'Verified KYC/AML exchange hot wallet.',
    riskIndicators: [
      'Regulated VASP Off-Ramp'
    ]
  }
];

export const SEED_ALERTS = [
  {
    alertId: 'ALT-2026-801',
    title: 'Suspicious Activity Detected: Circular Flow',
    severity: 'critical',
    category: 'High-Velocity Peeling',
    walletAddress: '0x82A7656EC7ab88b098defB751B7401B5f6d8976F',
    entityLabel: 'Wallet Under Investigation',
    txHash: '0x9a8f3b21c4e5d67890123456789abcdef0123456789abcdef0123456789abc10',
    amountUSD: 117000,
    status: 'new',
    description: 'Potential Money-Laundering Pattern: Funds departed address 0x82A...91F and returned via 3 hop nodes within 12 minutes.',
    evidence: [
      '3 Hop Cycles in under 15 minutes',
      '99.2% Amount Retention across transfers',
      'High-Risk Connection with flagged address cluster'
    ]
  },
  {
    alertId: 'ALT-2026-802',
    title: 'Potential Fraud Indicators Detected: Large Fan-Out Structuring',
    severity: 'high',
    category: 'High-Velocity Peeling',
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    entityLabel: 'Bridge Incident Cluster',
    txHash: '0x8b7e2a10d3c4b567890123456789abcdef0123456789abcdef0123456789abc20',
    amountUSD: 450000,
    status: 'investigating',
    description: 'Potential Money-Laundering Indicator: Single deposit split into 9 distinct output transactions sent simultaneously.',
    evidence: [
      '9 Simultaneous Outgoing Transfers',
      'Zero change retained in source address'
    ]
  }
];

export const SEED_TRANSACTIONS = [
  {
    hash: '0x9a8f3b21c4e5d67890123456789abcdef0123456789abcdef0123456789abc10',
    chain: 'ETH',
    fromAddress: '0x82a7656ec7ab88b098defb751b7401b5f6d8976f',
    fromLabel: 'Wallet Under Investigation',
    toAddress: '0x3f9a1278c771a90b23fe12938171092817362b1',
    toLabel: 'Intermediate Hop B',
    amountCrypto: 45.0,
    symbol: 'ETH',
    amountUSD: 117000,
    timestamp: '2026-08-21 11:42:10 UTC',
    riskScore: 88,
    riskLevel: 'high',
    category: 'Rapid Transfer',
    hopCount: 1,
    status: 'Confirmed'
  },
  {
    hash: '0x8b7e2a10d3c4b567890123456789abcdef0123456789abcdef0123456789abc20',
    chain: 'ETH',
    fromAddress: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
    fromLabel: 'Bridge Incident Cluster',
    toAddress: '0x47ac0fb3f2d84898e4d9e7b4dab3c24507a6d503',
    toLabel: 'Tornado Cash Pool',
    amountCrypto: 100.0,
    symbol: 'ETH',
    amountUSD: 260000,
    timestamp: '2026-08-21 10:15:22 UTC',
    riskScore: 98,
    riskLevel: 'critical',
    category: 'Mixer Deposit',
    hopCount: 2,
    status: 'Confirmed'
  }
];
