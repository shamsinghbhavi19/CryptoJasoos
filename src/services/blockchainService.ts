import {
  MOCK_WALLETS,
  MOCK_TRANSACTIONS,
  MOCK_ALERTS,
  MOCK_CASES,
  MOCK_FLOW_NODES,
  MOCK_FLOW_EDGES
} from '../data/mockData';
import {
  WalletProfileData,
  TransactionItem,
  AlertItem,
  CaseReport,
  RiskLevel
} from '../types';

/**
 * BlockchainService
 * Abstracts all data fetching and manipulation logic.
 * Currently backed by realistic mock data, designed to be swapped with
 * a real REST / GraphQL Node.js backend later.
 */
export class BlockchainService {
  /**
   * Fetch wallet profile information by address.
   * If address is unknown, generates a fallback mock profile.
   */
  static async getWalletProfile(address: string): Promise<WalletProfileData> {
    await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate async latency

    const cleanAddress = address.trim();
    if (MOCK_WALLETS[cleanAddress]) {
      return MOCK_WALLETS[cleanAddress];
    }

    // Default target wallet if query matches partial or new address
    const defaultAddress = '0x82A7656EC7ab88b098defB751B7401B5f6d8976F';
    const base = MOCK_WALLETS[defaultAddress];
    
    return {
      ...base,
      address: cleanAddress.length > 10 ? cleanAddress : defaultAddress,
      entityName: cleanAddress.startsWith('0x') ? 'Analyzed Custom Address' : 'Analyzed BTC Address'
    };
  }

  /**
   * Retrieve list of transactions filtered by address, chain, or risk level.
   */
  static async getTransactions(params?: {
    address?: string;
    chain?: string;
    riskLevel?: RiskLevel | 'all';
    limit?: number;
  }): Promise<TransactionItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    let txs = [...MOCK_TRANSACTIONS];

    if (params?.address) {
      const addr = params.address.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.fromAddress.toLowerCase().includes(addr) ||
          t.toAddress.toLowerCase().includes(addr)
      );
    }

    if (params?.chain && params.chain !== 'all') {
      txs = txs.filter((t) => t.chain.toUpperCase() === params.chain?.toUpperCase());
    }

    if (params?.riskLevel && params.riskLevel !== 'all') {
      txs = txs.filter((t) => t.riskLevel === params.riskLevel);
    }

    if (params?.limit) {
      txs = txs.slice(0, params.limit);
    }

    return txs;
  }

  /**
   * Fetch security alerts filtered by severity or status.
   */
  static async getAlerts(params?: {
    severity?: RiskLevel | 'all';
    status?: 'all' | 'new' | 'investigating' | 'resolved';
  }): Promise<AlertItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    let alerts = [...MOCK_ALERTS];

    if (params?.severity && params.severity !== 'all') {
      alerts = alerts.filter((a) => a.severity === params.severity);
    }

    if (params?.status && params.status !== 'all') {
      alerts = alerts.filter((a) => a.status === params.status);
    }

    return alerts;
  }

  /**
   * Fetch investigation cases.
   */
  static async getCases(): Promise<CaseReport[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_CASES;
  }

  /**
   * Fetch flow graph data (nodes and edges) for React Flow visualization.
   */
  static async getFlowGraph(params?: {
    centerAddress?: string;
    hops?: number;
    minRisk?: RiskLevel;
  }) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return {
      nodes: MOCK_FLOW_NODES,
      edges: MOCK_FLOW_EDGES
    };
  }

  /**
   * Global Search query matching wallets, transactions, or case IDs.
   */
  static async globalSearch(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return { wallets: [], transactions: [], cases: [] };

    const matchedWallets = Object.values(MOCK_WALLETS).filter(
      (w) =>
        w.address.toLowerCase().includes(q) ||
        (w.entityName && w.entityName.toLowerCase().includes(q))
    );

    const matchedTransactions = MOCK_TRANSACTIONS.filter(
      (t) =>
        t.hash.toLowerCase().includes(q) ||
        t.fromAddress.toLowerCase().includes(q) ||
        t.toAddress.toLowerCase().includes(q)
    );

    const matchedCases = MOCK_CASES.filter(
      (c) =>
        c.caseNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.targetAddress.toLowerCase().includes(q)
    );

    return {
      wallets: matchedWallets,
      transactions: matchedTransactions,
      cases: matchedCases
    };
  }
}
