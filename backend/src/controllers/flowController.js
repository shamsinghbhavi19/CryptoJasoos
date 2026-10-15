import { FlowGraphService } from '../services/flowGraphService.js';
import { blockchainProvider } from '../services/blockchainProvider.js';
import { TransactionNormalizer } from '../services/transactionNormalizer.js';
import { SEED_TRANSACTIONS } from '../utils/seedData.js';
import { formatSuccess } from '../utils/responseFormatter.js';

export const getFlowGraph = async (req, res, next) => {
  try {
    const { address = '0x82A7656EC7ab88b098defB751B7401B5f6d8976F', hops = 3, limit = 25 } = req.query;
    const cleanAddress = address.trim().toLowerCase();

    // 1. Fetch available transactions
    const txResult = await blockchainProvider.getWalletTransactions(cleanAddress, parseInt(limit, 10));
    let normalized = TransactionNormalizer.normalizeList(txResult.transactions);

    // If 0 transactions found, use enriched seed transactions to demonstrate graph flow
    if (normalized.length === 0) {
      normalized = SEED_TRANSACTIONS;
    }

    // 2. Build React Flow Graph
    const graph = FlowGraphService.buildGraph(cleanAddress, normalized, {
      maxNodes: 20,
      maxEdges: 30
    });

    res.json(formatSuccess(graph, 'Flow graph generated for visualization'));
  } catch (err) {
    next(err);
  }
};

export const getInvestigationFlow = async (req, res, next) => {
  return getFlowGraph(req, res, next);
};
