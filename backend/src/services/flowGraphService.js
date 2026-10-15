import { DOCUMENTED_RISK_REGISTRY } from '../config/riskRules.js';

export class FlowGraphService {
  /**
   * Generates React Flow graph nodes and directed edges for an address or transaction dataset.
   *
   * @param {string} centerAddress - Primary focus address
   * @param {Array} transactions - Transactions to trace
   * @param {Object} options - { maxNodes, maxEdges }
   * @returns {Object} { nodes, edges }
   */
  static buildGraph(centerAddress, transactions = [], options = {}) {
    const maxNodes = options.maxNodes || 20;
    const maxEdges = options.maxEdges || 30;

    const cleanCenter = (centerAddress || '0x82A7656EC7ab88b098defB751B7401B5f6d8976F').toLowerCase();
    const nodeMap = new Map();
    const edges = [];

    // Add Center Node
    const centerRegistry = DOCUMENTED_RISK_REGISTRY[cleanCenter];
    nodeMap.set(cleanCenter, {
      id: `node-${cleanCenter.slice(0, 8)}`,
      type: 'customNode',
      position: { x: 380, y: 180 },
      data: {
        label: centerRegistry?.category || 'Target Address Under Investigation',
        address: cleanCenter,
        type: 'target',
        chain: 'ETH',
        riskLevel: centerRegistry?.riskLevel || 'high',
        riskScore: centerRegistry ? (centerRegistry.riskLevel === 'critical' ? 95 : 85) : 65,
        balanceUSD: 9300,
        transactionCount: transactions.length || 1,
        tags: ['Primary Subject', 'Audit Node']
      }
    });

    let xOffsetRight = 720;
    let xOffsetLeft = 50;
    let yStepOut = 60;
    let yStepIn = 60;

    for (const tx of transactions) {
      if (nodeMap.size >= maxNodes || edges.length >= maxEdges) break;

      const from = (tx.fromAddress || '').toLowerCase();
      const to = (tx.toAddress || '').toLowerCase();

      // Ensure From Node exists
      if (from && !nodeMap.has(from)) {
        const reg = DOCUMENTED_RISK_REGISTRY[from];
        nodeMap.set(from, {
          id: `node-${from.slice(0, 8)}`,
          type: 'customNode',
          position: { x: xOffsetLeft, y: yStepIn },
          data: {
            label: reg?.category || 'Origin / Depositor',
            address: from,
            type: reg?.sanctioned ? 'sanctioned' : 'wallet',
            chain: tx.chain || 'ETH',
            riskLevel: reg?.riskLevel || (tx.riskLevel || 'medium'),
            riskScore: tx.riskScore || 45,
            balanceUSD: tx.amountUSD * 2 || 5000,
            transactionCount: 1,
            tags: ['Source Hop']
          }
        });
        yStepIn += 120;
      }

      // Ensure To Node exists
      if (to && !nodeMap.has(to)) {
        const reg = DOCUMENTED_RISK_REGISTRY[to];
        nodeMap.set(to, {
          id: `node-${to.slice(0, 8)}`,
          type: 'customNode',
          position: { x: xOffsetRight, y: yStepOut },
          data: {
            label: reg?.category || 'Counterparty / Hop',
            address: to,
            type: reg?.sanctioned ? 'mixer' : 'peel_chain',
            chain: tx.chain || 'ETH',
            riskLevel: reg?.riskLevel || (tx.riskLevel || 'high'),
            riskScore: tx.riskScore || 75,
            balanceUSD: tx.amountUSD || 1500,
            transactionCount: 1,
            tags: ['Hop Node']
          }
        });
        yStepOut += 130;
      }

      // Create Directed Edge
      if (from && to && nodeMap.has(from) && nodeMap.has(to)) {
        const sourceNode = nodeMap.get(from);
        const targetNode = nodeMap.get(to);
        const edgeId = `e-${sourceNode.id}-${targetNode.id}-${edges.length}`;

        edges.push({
          id: edgeId,
          source: sourceNode.id,
          target: targetNode.id,
          animated: true,
          style: {
            stroke: tx.riskLevel === 'critical' ? '#EF4444' : tx.riskLevel === 'high' ? '#F97316' : '#3B82F6',
            strokeWidth: 2
          },
          label: `$${(tx.amountUSD || 0).toLocaleString()} (${tx.amountCrypto || 0} ${tx.symbol || 'ETH'})`,
          labelStyle: { fill: '#F87171', fontWeight: 600, fontSize: 10 },
          labelBgStyle: { fill: '#0B1020', fillOpacity: 0.9, rx: 3 }
        });
      }
    }

    // Return graph nodes array and edges
    return {
      nodes: Array.from(nodeMap.values()),
      edges
    };
  }
}
