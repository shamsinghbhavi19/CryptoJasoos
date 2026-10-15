import {
  MOCK_WALLETS,
  MOCK_TRANSACTIONS,
  MOCK_ALERTS,
  MOCK_CASES,
  MOCK_CASE_MANAGEMENT_DATA,
  MOCK_FLOW_NODES,
  MOCK_FLOW_EDGES
} from '../data/mockData';
import {
  WalletProfileData,
  TransactionItem,
  AlertItem,
  CaseReport,
  CaseManagementItem,
  RiskLevel
} from '../types';
import { api } from './api';

/**
 * BlockchainService
 * Provides data to the CryptoJasoos frontend.
 * Communicates with the live Express backend API, with graceful fallback to
 * structured mock data if the backend server is unreachable.
 */
export class BlockchainService {
  /**
   * Fetch wallet profile information by address.
   */
  static async getWalletProfile(address: string): Promise<WalletProfileData> {
    const cleanAddress = address.trim();

    try {
      const data = await api.getWalletProfile(cleanAddress);
      if (data && data.address) {
        return data as WalletProfileData;
      }
    } catch (err) {
      // Backend offline or query failed: use fallback
    }

    if (MOCK_WALLETS[cleanAddress]) {
      return MOCK_WALLETS[cleanAddress];
    }

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
    if (params?.address) {
      try {
        const liveTxs = await api.getWalletTransactions(params.address, params.limit || 25);
        if (Array.isArray(liveTxs) && liveTxs.length > 0) {
          return liveTxs as TransactionItem[];
        }
      } catch (err) {
        // Fallback
      }
    }

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
    try {
      const data = await api.getAlerts(params);
      if (Array.isArray(data) && data.length > 0) {
        return data as AlertItem[];
      }
    } catch (err) {
      // Fallback to mock
    }

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
   * Update alert review status.
   */
  static async updateAlertStatus(id: string, status: 'investigating' | 'resolved') {
    try {
      return await api.updateAlertStatus(id, status);
    } catch (err) {
      return { id, status };
    }
  }

  /**
   * Fetch investigation cases.
   */
  static async getCases(params?: {
    search?: string;
    risk?: string;
    status?: string;
    network?: string;
    sortBy?: string;
  }): Promise<{ cases: CaseManagementItem[]; stats?: any }> {
    try {
      const result = await api.getCases(params);
      if (result && Array.isArray(result)) {
        return { cases: result };
      }
      if (result && Array.isArray(result.data)) {
        return { cases: result.data, stats: result.stats };
      }
    } catch (err) {
      // Fallback
    }

    return { cases: MOCK_CASE_MANAGEMENT_DATA };
  }

  /**
   * Create a new investigation case.
   */
  static async createCase(payload: {
    title: string;
    targetAddress: string;
    network?: string;
    priority?: string;
    notes?: string;
  }): Promise<CaseManagementItem> {
    try {
      const created = await api.createCase(payload);
      if (created) return created as CaseManagementItem;
    } catch (err) {
      // Fallback locally
    }

    const newPriority = (payload.priority || 'Medium') as 'Low' | 'Medium' | 'High' | 'Critical';
    const newRiskLevel: RiskLevel =
      newPriority === 'Critical' ? 'critical' : newPriority === 'High' ? 'high' : newPriority === 'Medium' ? 'medium' : 'low';

    return {
      id: `CJ-2026-0${Date.now().toString().slice(-3)}`,
      caseNumber: `CJ-2026-0${Date.now().toString().slice(-3)}`,
      title: payload.title,
      targetAddress: payload.targetAddress,
      network: (payload.network as any) || 'Ethereum',
      riskLevel: newRiskLevel,
      priority: newPriority,
      status: 'ACTIVE',
      alertsCount: 1,
      transactionsAnalyzed: 142,
      connectedAddressesCount: 18,
      riskScore: newPriority === 'Critical' ? 92 : newPriority === 'High' ? 79 : 45,
      graphDepthHops: 3,
      firstActivityDate: '26 Aug 2026',
      lastActivityDate: '26 Aug 2026',
      createdDate: new Date().toISOString().split('T')[0],
      leadInvestigator: 'Alex Vance (Cyber Crime Unit)',
      notes: payload.notes || 'Initiated via CryptoJasoos Forensics Console.',
      riskIndicators: ['Rapid Fund Movement', 'Multi-Hop Transfers']
    };
  }

  /**
   * Fetch flow graph data (nodes and edges) for React Flow visualization.
   */
  static async getFlowGraph(params?: {
    centerAddress?: string;
    hops?: number;
    minRisk?: RiskLevel;
  }) {
    const center = params?.centerAddress || '0x82A7656EC7ab88b098defB751B7401B5f6d8976F';

    try {
      const graph = await api.getFlowGraph(center, params?.hops || 3);
      if (graph && Array.isArray(graph.nodes) && graph.nodes.length > 0) {
        return graph;
      }
    } catch (err) {
      // Fallback
    }

    return {
      nodes: MOCK_FLOW_NODES,
      edges: MOCK_FLOW_EDGES
    };
  }

  /**
   * Ask AI Copilot
   */
  static async askAI(question: string, targetAddress?: string) {
    try {
      const res = await api.askAI(question, targetAddress);
      return res;
    } catch (err) {
      return null;
    }
  }

  /**
   * Fetch FinCEN SAR report
   */
  static async getReport(investigationId: string) {
    try {
      return await api.getReport(investigationId);
    } catch (err) {
      return null;
    }
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
