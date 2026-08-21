import {
  WalletProfileData,
  TransactionItem,
  AlertItem,
  CaseReport,
  AIMessage
} from '../types';

export const MOCK_WALLETS: Record<string, WalletProfileData> = {
  '0x82A7656EC7ab88b098defB751B7401B5f6d8976F': {
    address: '0x82A7656EC7ab88b098defB751B7401B5f6d8976F',
    chain: 'ETH',
    entityName: 'Suspected Lazarus Exploit Sub-Node',
    category: 'Hacker Cluster',
    riskScore: 87,
    riskLevel: 'high',
    firstSeen: '2026-01-14 08:22:15 UTC',
    lastActive: '2026-08-21 11:45:00 UTC',
    totalReceivedUSD: 248420,
    totalSentUSD: 239120,
    currentBalanceUSD: 9300,
    transactionCount: 1284,
    connectedWalletsCount: 87,
    balances: [
      { symbol: 'ETH', amount: 2.85, valueUSD: 7410 },
      { symbol: 'USDT', amount: 1890, valueUSD: 1890 }
    ],
    flags: [
      'Rapid Fund Movement Across 4 Hop Nodes',
      'Tornado Cash Anonymization Protocol Exposure',
      'Peel-Chain Structuring Pattern Detected',
      'Co-location with Flagged Entity Cluster'
    ],
    riskIndicators: [
      {
        id: 'ind-1',
        name: 'Rapid Fund Movement',
        severity: 'high',
        description: 'Transferred 82% of received value within 12 minutes of arrival.',
        detectedStatus: 'Detected',
        evidenceCount: 14
      },
      {
        id: 'ind-2',
        name: 'High Transaction Velocity',
        severity: 'medium',
        description: 'Averaged 42 transactions per hour during peak burst periods.',
        detectedStatus: 'Detected',
        evidenceCount: 8
      },
      {
        id: 'ind-3',
        name: 'Fan-Out Behavior',
        severity: 'high',
        description: 'Splits incoming funds into 9 distinct output streams.',
        detectedStatus: 'Detected',
        evidenceCount: 6
      },
      {
        id: 'ind-4',
        name: 'Circular Flow',
        severity: 'critical',
        description: 'Funds returned to originator via intermediate hop address 0x3F9...2B1.',
        detectedStatus: 'Detected',
        evidenceCount: 3
      }
    ],
    exposure: {
      directIllicit: 64.2,
      indirectIllicit: 28.5,
      mixerExposure: 48.0,
      sanctionedExposure: 72.4,
      cleanVASP: 5.8
    },
    sanctionsMatch: {
      isSanctioned: true,
      lists: ['OFAC SDN List (DPRK)', 'EU Financial Watchlist'],
      sdnId: 'SDN-ETH-98412'
    }
  },

  '0x71C7656EC7ab88b098defB751B7401B5f6d8976F': {
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    chain: 'ETH',
    entityName: 'Flagged Bridge Exploit Cluster',
    category: 'Hacker Cluster',
    riskScore: 98,
    riskLevel: 'critical',
    firstSeen: '2026-03-12 14:22:01 UTC',
    lastActive: '2026-08-20 18:45:10 UTC',
    totalReceivedUSD: 42500000,
    totalSentUSD: 39800000,
    currentBalanceUSD: 2700000,
    transactionCount: 3412,
    connectedWalletsCount: 245,
    balances: [
      { symbol: 'ETH', amount: 840.5, valueUSD: 2185300 },
      { symbol: 'USDT', amount: 450000, valueUSD: 450000 },
      { symbol: 'DAI', amount: 64700, valueUSD: 64700 }
    ],
    flags: [
      'OFAC SDN List Match (#94812)',
      'Ronin Bridge Incident Funds Link',
      'Direct Tornado Cash Pool Interactivity'
    ],
    riskIndicators: [
      {
        id: 'ind-5',
        name: 'OFAC SDN Sanction Match',
        severity: 'critical',
        description: 'Directly linked to SDN list target #94812.',
        detectedStatus: 'Detected',
        evidenceCount: 19
      },
      {
        id: 'ind-6',
        name: 'Mixer Anonymization',
        severity: 'critical',
        description: 'Deposited over 12,000 ETH into anonymizing pools.',
        detectedStatus: 'Detected',
        evidenceCount: 42
      }
    ],
    exposure: {
      directIllicit: 92.5,
      indirectIllicit: 6.8,
      mixerExposure: 84.0,
      sanctionedExposure: 98.0,
      cleanVASP: 0.7
    },
    sanctionsMatch: {
      isSanctioned: true,
      lists: ['OFAC SDN (DPRK)', 'EU Financial Sanctions'],
      sdnId: 'SDN-ETH-DPRK-94812'
    }
  },

  '0x47ac0fb3F2D84898e4D9E7b4DaB3C24507a6D503': {
    address: '0x47ac0fb3F2D84898e4D9E7b4DaB3C24507a6D503',
    chain: 'ETH',
    entityName: 'Tornado Cash 100 ETH Pool',
    category: 'Mixer Service',
    riskScore: 92,
    riskLevel: 'critical',
    firstSeen: '2020-05-10 10:00:00 UTC',
    lastActive: '2026-08-21 12:30:12 UTC',
    totalReceivedUSD: 850000000,
    totalSentUSD: 842000000,
    currentBalanceUSD: 8000000,
    transactionCount: 184500,
    connectedWalletsCount: 14200,
    balances: [
      { symbol: 'ETH', amount: 3076.9, valueUSD: 8000000 }
    ],
    flags: [
      'OFAC Sanctioned Smart Contract',
      'Anonymizing Mixer Protocol'
    ],
    riskIndicators: [
      {
        id: 'ind-7',
        name: 'Privacy Anonymization',
        severity: 'critical',
        description: 'Breaks transaction graph lineage via zero-knowledge proofs.',
        detectedStatus: 'Detected',
        evidenceCount: 1400
      }
    ],
    exposure: {
      directIllicit: 78.0,
      indirectIllicit: 18.0,
      mixerExposure: 100.0,
      sanctionedExposure: 95.0,
      cleanVASP: 2.0
    },
    sanctionsMatch: {
      isSanctioned: true,
      lists: ['OFAC SDN List'],
      sdnId: 'SDN-TORNADO-100'
    }
  },

  '0x3F9A1278c771A90B23fE12938171092817362B1': {
    address: '0x3F9A1278c771A90B23fE12938171092817362B1',
    chain: 'ETH',
    entityName: 'Intermediate Hop B',
    category: 'Unidentified Wallet',
    riskScore: 78,
    riskLevel: 'high',
    firstSeen: '2026-02-18 11:04:12 UTC',
    lastActive: '2026-08-21 09:12:00 UTC',
    totalReceivedUSD: 184000,
    totalSentUSD: 182500,
    currentBalanceUSD: 1500,
    transactionCount: 412,
    connectedWalletsCount: 38,
    balances: [{ symbol: 'USDT', amount: 1500, valueUSD: 1500 }],
    flags: ['Peel Chain Intermediate Node', 'Automated Micro-splitting'],
    riskIndicators: [
      {
        id: 'ind-8',
        name: 'Peel-Chain Intermediate Hop',
        severity: 'high',
        description: 'Transfers 95% of incoming value to sub-wallets within minutes.',
        detectedStatus: 'Detected',
        evidenceCount: 12
      }
    ],
    exposure: {
      directIllicit: 55.0,
      indirectIllicit: 35.0,
      mixerExposure: 30.0,
      sanctionedExposure: 45.0,
      cleanVASP: 10.0
    },
    sanctionsMatch: { isSanctioned: false, lists: [] }
  },

  '0x9A48F921B7d3129841C520938C21094E19491C2': {
    address: '0x9A48F921B7d3129841C520938C21094E19491C2',
    chain: 'ETH',
    entityName: 'Kraken Hot Wallet (VASP Off-Ramp)',
    category: 'Exchanges & VASPs',
    riskScore: 24,
    riskLevel: 'low',
    firstSeen: '2021-01-01 00:00:00 UTC',
    lastActive: '2026-08-21 12:50:00 UTC',
    totalReceivedUSD: 1420000000,
    totalSentUSD: 1410000000,
    currentBalanceUSD: 10000000,
    transactionCount: 980000,
    connectedWalletsCount: 120000,
    balances: [{ symbol: 'ETH', amount: 3846.1, valueUSD: 10000000 }],
    flags: ['Regulated VASP', 'KYC/AML Compliant Off-Ramp'],
    riskIndicators: [],
    exposure: {
      directIllicit: 2.1,
      indirectIllicit: 5.4,
      mixerExposure: 3.2,
      sanctionedExposure: 1.0,
      cleanVASP: 94.6
    },
    sanctionsMatch: { isSanctioned: false, lists: [] }
  }
};

// 50+ Mock Transactions
export const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-101',
    hash: '0x9a8f3b21c4e5d67890123456789abcdef0123456789abcdef0123456789abc10',
    chain: 'ETH',
    fromAddress: '0x82A7656EC7ab88b098defB751B7401B5f6d8976F',
    fromLabel: 'Wallet Under Investigation',
    toAddress: '0x3F9A1278c771A90B23fE12938171092817362B1',
    toLabel: 'Intermediate Hop B',
    amountCrypto: 45.0,
    symbol: 'ETH',
    amountUSD: 117000,
    timestamp: '2026-08-21 11:42:10 UTC',
    riskScore: 88,
    riskLevel: 'high',
    category: 'Rapid Transfer',
    hopCount: 1,
    status: 'Flagged'
  },
  {
    id: 'tx-102',
    hash: '0x8b7e2a10d3c4b567890123456789abcdef0123456789abcdef0123456789abc20',
    chain: 'ETH',
    fromAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    fromLabel: 'Bridge Incident Cluster',
    toAddress: '0x47ac0fb3F2D84898e4D9E7b4DaB3C24507a6D503',
    toLabel: 'Tornado Cash Pool',
    amountCrypto: 100.0,
    symbol: 'ETH',
    amountUSD: 260000,
    timestamp: '2026-08-21 10:15:22 UTC',
    riskScore: 98,
    riskLevel: 'critical',
    category: 'Mixer Deposit',
    hopCount: 2,
    status: 'Flagged'
  }
];

for (let i = 3; i <= 50; i++) {
  MOCK_TRANSACTIONS.push({
    id: `tx-10${i}`,
    hash: `0x${i}f${i * 2}a${i * 3}b4e5d67890123456789abcdef0123456789abcdef0123456789abc${i}`,
    chain: i % 2 === 0 ? 'ETH' : 'BTC',
    fromAddress: `0x82A7656EC7ab88b098defB751B7401B5f6d8976F`,
    fromLabel: 'Wallet Under Investigation',
    toAddress: `0x3F9A1278c771A90B23fE12938171092817362B1`,
    toLabel: `Hop Address ${i}`,
    amountCrypto: Number((1.5 * i).toFixed(2)),
    symbol: i % 2 === 0 ? 'ETH' : 'BTC',
    amountUSD: Math.floor(1.5 * i * 2600),
    timestamp: `2026-08-21 10:${(i % 60).toString().padStart(2, '0')}:00 UTC`,
    riskScore: i % 3 === 0 ? 88 : 45,
    riskLevel: i % 3 === 0 ? 'critical' : 'medium',
    category: i % 3 === 0 ? 'Rapid Transfer' : 'Standard Transfer',
    hopCount: (i % 4) + 1,
    status: i % 3 === 0 ? 'Flagged' : 'Confirmed'
  });
}

// 15 Alerts
export const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'ALT-2026-801',
    title: 'Possible Circular Fund Movement',
    severity: 'critical',
    category: 'High-Velocity Peeling',
    walletAddress: '0x82A7656EC7ab88b098defB751B7401B5f6d8976F',
    entityLabel: 'Wallet Under Investigation',
    txHash: '0x9a8f3b21c4e5d67890123456789abcdef0123456789abcdef0123456789abc10',
    amountUSD: 117000,
    timestamp: '2026-08-21 11:42:10 UTC',
    status: 'new',
    description: 'Funds departed address 0x82A...91F and returned via 3 hop nodes within 12 minutes.',
    evidence: [
      '3 Hop Cycles in under 15 minutes',
      '99.2% Amount Retention across transfers',
      'Co-location with flagged address cluster'
    ]
  },
  {
    id: 'ALT-2026-802',
    title: 'Large Fan-Out Structuring Behavior',
    severity: 'high',
    category: 'High-Velocity Peeling',
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    entityLabel: 'Bridge Exploit Cluster',
    txHash: '0x8b7e2a10d3c4b567890123456789abcdef0123456789abcdef0123456789abc20',
    amountUSD: 450000,
    timestamp: '2026-08-21 10:15:22 UTC',
    status: 'investigating',
    description: 'Single deposit split into 9 distinct output transactions sent simultaneously.',
    evidence: [
      '9 Simultaneous Outgoing Transfers',
      'Zero change retained in source address'
    ]
  }
];

// Priority Investigations Dataset for Dashboard Centerpiece
export const MOCK_CASES: CaseReport[] = [
  {
    id: 'CF-024',
    caseNumber: 'CF-024',
    title: 'Circular Flow & Rapid Transfer Investigation',
    targetAddress: '0x82A7656EC7ab88b098defB751B7401B5f6d8976F',
    entity: 'Wallet Under Investigation',
    totalIllicitUSD: 248420,
    leadInvestigator: 'Alex Vance (Senior Investigator)',
    status: 'Under Review',
    dateCreated: '2026-08-21',
    lastUpdated: '2 min ago',
    summary: 'Circular flow pattern + rapid movement detected across 4 hop addresses within 12 minutes.',
    tags: ['Circular Flow', 'Rapid Movement', 'OFAC SDN'],
    evidenceHashes: [
      '0x9a8f3b21c4e5d67890123456789abcdef0123456789abcdef0123456789abc10'
    ],
    suspiciousIndicators: [
      'Circular flow looping back to originator',
      'Rapid transfer velocity',
      'Mixer exposure'
    ],
    recommendedSteps: [
      'Issue Freeze Request to exchange off-ramp Kraken (0x9A48...)',
      'Submit formal FinCEN SAR filing'
    ]
  },
  {
    id: 'CF-023',
    caseNumber: 'CF-023',
    title: 'Fan-Out Structuring Behavior Cluster',
    targetAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    entity: 'Bridge Incident Cluster',
    totalIllicitUSD: 4250000,
    leadInvestigator: 'Sarah Jenkins',
    status: 'Under Review',
    dateCreated: '2026-08-20',
    lastUpdated: '8 min ago',
    summary: 'Fan-out behavior splitting lump sum deposits into 9 distinct output streams.',
    tags: ['Fan-Out', 'Mixer Deposit'],
    evidenceHashes: ['0x8b7e2a10d3c4b567890123456789abcdef0123456789abcdef0123456789abc20'],
    suspiciousIndicators: ['Fan-Out multi-wallet distribution', 'Sanction list match'],
    recommendedSteps: ['Subpoena request dispatch to VASP off-ramp']
  },
  {
    id: 'CF-022',
    caseNumber: 'CF-022',
    title: 'Tornado Cash Anonymization Flow',
    targetAddress: '0x47ac0fb3F2D84898e4D9E7b4DaB3C24507a6D503',
    entity: 'Mixer Service',
    totalIllicitUSD: 8500000,
    leadInvestigator: 'Alex Vance',
    status: 'Submitted FinCEN',
    dateCreated: '2026-08-18',
    lastUpdated: '1 hour ago',
    summary: '100 ETH deposited into sanctioned zero-knowledge anonymizing mixer contract.',
    tags: ['Tornado Cash', 'OFAC SDN'],
    evidenceHashes: ['0x7c6d1a09b2c3d4567890123456789abcdef0123456789abcdef0123456789abc30'],
    suspiciousIndicators: ['Mixer Anonymization', 'Sanctioned contract call'],
    recommendedSteps: ['File FinCEN SAR Form 111']
  },
  {
    id: 'CF-021',
    caseNumber: 'CF-021',
    title: 'High-Risk Destination Off-Ramp Attempt',
    targetAddress: '0x3F9A1278c771A90B23fE12938171092817362B1',
    entity: 'Intermediate Hop B',
    totalIllicitUSD: 184000,
    leadInvestigator: 'Cyber Forensics Unit',
    status: 'Draft',
    dateCreated: '2026-08-15',
    lastUpdated: '3 hours ago',
    summary: 'Transfers 95% of incoming value to sub-wallets attempting VASP cashout.',
    tags: ['Peel Chain', 'VASP Off-Ramp'],
    evidenceHashes: ['0x6b5c0a98a1b2c34567890123456789abcdef0123456789abcdef0123456789abc40'],
    suspiciousIndicators: ['Peel-Chain Intermediate Hop', 'High velocity transfers'],
    recommendedSteps: ['Coordinate with exchange compliance team']
  }
];

// React Flow Graph Nodes & Edges (With non-judgmental language)
export const MOCK_FLOW_NODES = [
  {
    id: 'node-victim',
    type: 'customNode',
    position: { x: 50, y: 180 },
    data: {
      label: 'Victim Protocol Vault',
      address: '0x1A8bC9201f9483C2A11048194aE219481C921A11',
      type: 'victim',
      chain: 'ETH',
      riskLevel: 'low',
      riskScore: 15,
      balanceUSD: 0,
      transactionCount: 1420,
      tags: ['Origin Vault']
    }
  },
  {
    id: 'node-target',
    type: 'customNode',
    position: { x: 380, y: 180 },
    data: {
      label: 'Wallet Under Investigation',
      address: '0x82A7656EC7ab88b098defB751B7401B5f6d8976F',
      type: 'target',
      chain: 'ETH',
      riskLevel: 'high',
      riskScore: 87,
      balanceUSD: 9300,
      transactionCount: 1284,
      tags: ['Primary Subject', 'Peel Chain']
    }
  },
  {
    id: 'node-hop1',
    type: 'customNode',
    position: { x: 720, y: 60 },
    data: {
      label: 'Intermediate Hop B',
      address: '0x3F9A1278c771A90B23fE12938171092817362B1',
      type: 'peel_chain',
      chain: 'ETH',
      riskLevel: 'high',
      riskScore: 78,
      balanceUSD: 1500,
      transactionCount: 412,
      tags: ['Hop Node', 'Micro-Split']
    }
  },
  {
    id: 'node-mixer',
    type: 'customNode',
    position: { x: 720, y: 320 },
    data: {
      label: 'Tornado Cash Pool',
      address: '0x47ac0fb3F2D84898e4D9E7b4DaB3C24507a6D503',
      type: 'mixer',
      chain: 'ETH',
      riskLevel: 'critical',
      riskScore: 92,
      balanceUSD: 8000000,
      transactionCount: 184500,
      tags: ['Mixer', 'OFAC Sanctioned']
    }
  },
  {
    id: 'node-exchange',
    type: 'customNode',
    position: { x: 1050, y: 60 },
    data: {
      label: 'Kraken Hot Wallet (VASP Off-Ramp)',
      address: '0x9A48F921B7d3129841C520938C21094E19491C2',
      type: 'exchange',
      chain: 'ETH',
      riskLevel: 'low',
      riskScore: 24,
      balanceUSD: 10000000,
      transactionCount: 980000,
      tags: ['VASP Endpoint']
    }
  },
  {
    id: 'node-darknet',
    type: 'customNode',
    position: { x: 1050, y: 320 },
    data: {
      label: 'High-Risk Destination',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      type: 'darknet',
      chain: 'BTC',
      riskLevel: 'critical',
      riskScore: 94,
      balanceUSD: 300000,
      transactionCount: 8940,
      tags: ['High-Risk Endpoint']
    }
  }
];

export const MOCK_FLOW_EDGES = [
  {
    id: 'e-victim-target',
    source: 'node-victim',
    target: 'node-target',
    animated: true,
    style: { stroke: '#EF4444', strokeWidth: 2 },
    label: '$248,420 (100 ETH)',
    labelStyle: { fill: '#F87171', fontWeight: 700, fontSize: 10 },
    labelBgStyle: { fill: '#0B1020', fillOpacity: 0.9, rx: 3 }
  },
  {
    id: 'e-target-hop1',
    source: 'node-target',
    target: 'node-hop1',
    animated: true,
    style: { stroke: '#F97316', strokeWidth: 2 },
    label: '$117,000 (45 ETH)',
    labelStyle: { fill: '#FDBA74', fontWeight: 600, fontSize: 10 },
    labelBgStyle: { fill: '#0B1020', fillOpacity: 0.9, rx: 3 }
  },
  {
    id: 'e-target-mixer',
    source: 'node-target',
    target: 'node-mixer',
    animated: true,
    style: { stroke: '#DC2626', strokeWidth: 2 },
    label: '$131,420 (55 ETH)',
    labelStyle: { fill: '#F87171', fontWeight: 700, fontSize: 10 },
    labelBgStyle: { fill: '#0B1020', fillOpacity: 0.9, rx: 3 }
  },
  {
    id: 'e-hop1-exchange',
    source: 'node-hop1',
    target: 'node-exchange',
    animated: true,
    style: { stroke: '#3B82F6', strokeWidth: 2 },
    label: '$110,500 (42.5 ETH)',
    labelStyle: { fill: '#93C5FD', fontWeight: 600, fontSize: 10 },
    labelBgStyle: { fill: '#0B1020', fillOpacity: 0.9, rx: 3 }
  },
  {
    id: 'e-mixer-darknet',
    source: 'node-mixer',
    target: 'node-darknet',
    animated: true,
    style: { stroke: '#EF4444', strokeDasharray: '4,4', strokeWidth: 2 },
    label: '$85,000 (1.25 BTC)',
    labelStyle: { fill: '#FCA5A5', fontWeight: 600, fontSize: 10 },
    labelBgStyle: { fill: '#0B1020', fillOpacity: 0.9, rx: 3 }
  }
];

export const MOCK_AI_CONVERSATION: AIMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Why was target wallet 0x82A7656EC7ab88b098defB751B7401B5f6d8976F flagged as high risk?',
    timestamp: '11:45 AM'
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    text: 'Target wallet 0x82A7...91F received a Risk Score of 87/100 (HIGH RISK) due to multiple specific risk indicators:\n\n1. Rapid Transfer Velocity: Transferred 82% of received value across 4 hop addresses within 12 minutes of arrival.\n2. Mixer Interactivity: Executed direct transfers with Tornado Cash 100 ETH pool.\n3. Circular Looping: Detected 3 hop cycles returning to intermediate wallet 0x3F9A...2B1.\n4. Watchlist Co-Location: Sub-cluster link to OFAC SDN entry #SDN-ETH-98412.',
    timestamp: '11:45 AM',
    evidenceItems: [
      { type: 'wallet', label: 'Wallet Under Investigation', value: '0x82A7656EC7ab88b098defB751B7401B5f6d8976F', riskLevel: 'high' },
      { type: 'mixer', label: 'Tornado Cash Pool', value: '0x47ac0fb3F2D84898e4D9E7b4DaB3C24507a6D503', riskLevel: 'critical' }
    ]
  }
];
