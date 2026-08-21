export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ChainType = 'ETH' | 'BTC' | 'SOL' | 'POLYGON' | 'BNB';

export interface TokenBalance {
  symbol: string;
  amount: number;
  valueUSD: number;
}

export interface ExposureBreakdown {
  directIllicit: number; // percentage
  indirectIllicit: number; // percentage
  mixerExposure: number; // percentage
  sanctionedExposure: number; // percentage
  cleanVASP: number; // percentage
}

export interface RiskIndicatorItem {
  id: string;
  name: string;
  severity: RiskLevel;
  description: string;
  detectedStatus: 'Detected' | 'Clear' | 'Pending Verification';
  evidenceCount: number;
}

export interface WalletProfileData {
  address: string;
  chain: ChainType;
  entityName?: string;
  category: 'Hacker Cluster' | 'Mixer Service' | 'Darknet Market' | 'OFAC Sanctioned' | 'Exchanges & VASPs' | 'DeFi Protocol' | 'Unidentified Wallet';
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  firstSeen: string;
  lastActive: string;
  totalReceivedUSD: number;
  totalSentUSD: number;
  currentBalanceUSD: number;
  transactionCount: number;
  connectedWalletsCount: number;
  balances: TokenBalance[];
  flags: string[];
  riskIndicators: RiskIndicatorItem[];
  exposure: ExposureBreakdown;
  sanctionsMatch: {
    isSanctioned: boolean;
    lists: string[];
    sdnId?: string;
  };
}

export interface TransactionItem {
  id: string;
  hash: string;
  chain: ChainType;
  fromAddress: string;
  fromLabel?: string;
  toAddress: string;
  toLabel?: string;
  amountCrypto: number;
  symbol: string;
  amountUSD: number;
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  category: string;
  hopCount: number;
  status: 'Confirmed' | 'Pending' | 'Flagged';
}

export interface FlowNodeData {
  label: string;
  address: string;
  type: 'target' | 'mixer' | 'exchange' | 'darknet' | 'peel_chain' | 'sanctioned' | 'victim' | 'wallet';
  chain: ChainType;
  riskLevel: RiskLevel;
  riskScore: number;
  balanceUSD: number;
  transactionCount: number;
  tags: string[];
}

export interface AlertItem {
  id: string;
  title: string;
  severity: RiskLevel;
  category: 'Mixer Funneling' | 'OFAC Sanctions Evasion' | 'High-Velocity Peeling' | 'Darknet Deposit' | 'Ransomware Cashout' | 'Flash Loan Exploit';
  walletAddress: string;
  entityLabel?: string;
  txHash: string;
  amountUSD: number;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved';
  description: string;
  evidence: string[];
  assignedTo?: string;
}

export interface CaseReport {
  id: string;
  caseNumber: string;
  title: string;
  targetAddress: string;
  entity: string;
  totalIllicitUSD: number;
  leadInvestigator: string;
  status: 'Draft' | 'Under Review' | 'Submitted FinCEN' | 'Archived';
  dateCreated: string;
  lastUpdated: string;
  summary: string;
  tags: string[];
  evidenceHashes: string[];
  suspiciousIndicators: string[];
  recommendedSteps: string[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  evidenceItems?: {
    type: 'wallet' | 'transaction' | 'mixer' | 'entity';
    label: string;
    value: string;
    riskLevel?: RiskLevel;
  }[];
}
