/**
 * CryptoJasoos API Client
 * Provides typed HTTP communication with the CryptoJasoos Express backend.
 */

const getApiBaseUrl = (): string => {
  if ((import.meta as any).env?.VITE_API_BASE_URL) {
    return (import.meta as any).env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://cryptojasoos-api.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Add 8-second timeout controller so requests never hang the UI
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const json = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = json?.message || `API request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return json?.data !== undefined ? json.data : json;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}


export const api = {
  // Health
  getHealth: () => request<any>('/health'),

  // Wallet & Transactions
  getWalletProfile: (address: string) =>
    request<any>('/investigations/wallet', {
      method: 'POST',
      body: JSON.stringify({ address })
    }),

  getWalletTransactions: (address: string, limit = 25) =>
    request<any[]>(`/wallets/${encodeURIComponent(address)}/transactions?limit=${limit}`),

  getTransactionDetails: (hash: string) =>
    request<any>('/investigations/transaction', {
      method: 'POST',
      body: JSON.stringify({ hash })
    }),

  // Flow Explorer Graph
  getFlowGraph: (address: string, hops = 3) =>
    request<{ nodes: any[]; edges: any[] }>(
      `/flow?address=${encodeURIComponent(address)}&hops=${hops}`
    ),

  // Cases
  getCases: (params?: { search?: string; risk?: string; status?: string; network?: string; sortBy?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.risk) query.append('risk', params.risk);
    if (params?.status) query.append('status', params.status);
    if (params?.network) query.append('network', params.network);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    return request<any>(`/cases?${query.toString()}`);
  },

  getCaseById: (id: string) => request<any>(`/cases/${encodeURIComponent(id)}`),

  createCase: (payload: {
    title: string;
    targetAddress: string;
    network?: string;
    priority?: string;
    notes?: string;
  }) =>
    request<any>('/cases', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateCase: (id: string, payload: any) =>
    request<any>(`/cases/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),

  // Alerts
  getAlerts: (params?: { severity?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.severity && params.severity !== 'all') query.append('severity', params.severity);
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    return request<any[]>(`/alerts?${query.toString()}`);
  },

  updateAlertStatus: (id: string, status: 'investigating' | 'resolved') =>
    request<any>(`/alerts/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  // AI Assistant
  askAI: (question: string, targetAddress?: string) =>
    request<any>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question, targetAddress })
    }),

  // Reports
  getReport: (investigationId: string) =>
    request<any>(`/reports/${encodeURIComponent(investigationId)}`),

  getExportUrl: (investigationId: string, format = 'json') =>
    `${API_BASE_URL}/reports/${encodeURIComponent(investigationId)}/export?format=${format}`,

  // Analytics
  getAnalytics: () => request<any>('/analytics')
};
