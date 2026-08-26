import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Search,
  GitMerge,
  Wallet,
  Bell,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Database,
  GitBranch,
  FileSearch,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Layers,
  RotateCcw,
  Filter,
  X
} from 'lucide-react';
import { BlockchainService } from '../services/blockchainService';
import { WalletProfileData } from '../types';
import { MOCK_FLOW_NODES, MOCK_FLOW_EDGES } from '../data/mockData';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskScoreCard } from '../components/common/RiskScoreCard';
import { AddressCopy } from '../components/common/AddressCopy';

// Custom Wallet Node Component for Flow Explorer Canvas
const CustomWalletNode = ({ data }: { data: any }) => {
  const getBorderColor = () => {
    switch (data.riskLevel) {
      case 'critical':
        return 'border-red-500/80 bg-navy-900 shadow-md shadow-red-500/10';
      case 'high':
        return 'border-orange-500/80 bg-navy-900 shadow-md shadow-orange-500/10';
      case 'medium':
        return 'border-amber-500/80 bg-navy-900';
      case 'low':
        return 'border-emerald-500/80 bg-navy-900';
      default:
        return 'border-navy-700 bg-navy-900';
    }
  };

  return (
    <div
      className={`px-3.5 py-2.5 rounded-md border transition-all cursor-pointer hover:scale-[1.02] min-w-[210px] ${getBorderColor()}`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-blue-500 border-2 border-navy-950" />

      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-navy-950 text-slate-300 border border-navy-800">
          {data.chain}
        </span>
        <RiskBadge level={data.riskLevel} score={data.riskScore} size="sm" />
      </div>

      <div className="font-bold text-white text-xs tracking-wide truncate">{data.label}</div>
      <div className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
        {data.address.slice(0, 6)}...{data.address.slice(-4)}
      </div>

      <div className="mt-2 pt-1.5 border-t border-navy-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Txs: {data.transactionCount}</span>
        <span className="text-white font-bold">${(data.balanceUSD / 1000).toFixed(1)}k</span>
      </div>

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-blue-500 border-2 border-navy-950" />
    </div>
  );
};

export const WalletAnalyzer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchMode, setSearchMode] = useState<'address' | 'hash'>('address');
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '');
  const [selectedChain, setSelectedChain] = useState('Ethereum');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<WalletProfileData | null>(null);

  // Active view tab inside Wallet Analyzer: 'flow' (Flow Explorer Graph) or 'dossier' (Risk Assessment Dossier)
  const [activeTab, setActiveTab] = useState<'flow' | 'dossier'>('flow');

  // React Flow State
  const nodeTypes = useMemo(() => ({ customNode: CustomWalletNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(MOCK_FLOW_NODES as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(MOCK_FLOW_EDGES as any);
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(MOCK_FLOW_NODES[1].data);

  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [amountFilter, setAmountFilter] = useState<string>('all');

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeData(node.data);
  }, []);

  const resetGraphView = () => {
    setNodes(MOCK_FLOW_NODES as any);
    setEdges(MOCK_FLOW_EDGES as any);
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInputVal(q);
      executeInvestigation(q);
    } else {
      executeInvestigation('0x82A7656EC7ab88b098defB751B7401B5f6d8976F');
    }
  }, [searchParams]);

  const executeInvestigation = async (targetQuery: string) => {
    setIsAnalyzing(true);
    const data = await BlockchainService.getWalletProfile(targetQuery);
    setAnalyzedData(data);
    setIsAnalyzing(false);
  };

  const handleStartInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      executeInvestigation(inputVal.trim());
    }
  };

  const handleSampleClick = () => {
    const sampleAddress = '0x82A7656EC7ab88b098defB751B7401B5f6d8976F';
    setInputVal(sampleAddress);
    executeInvestigation(sampleAddress);
  };

  // Visually connected 4-Step Investigation Workflow (COLLECT → TRACE → ANALYZE → EXPLAIN)
  const steps = [
    {
      num: '01',
      title: 'COLLECT',
      subtitle: 'Retrieve Blockchain Data',
      desc: 'Ingests real-time transactions, smart contract calls, and token balances.',
      icon: Database
    },
    {
      num: '02',
      title: 'TRACE',
      subtitle: 'Follow Connected Transfers',
      desc: 'Maps multi-hop fund flows across intermediate wallets and cross-chain bridges.',
      icon: GitBranch
    },
    {
      num: '03',
      title: 'ANALYZE',
      subtitle: 'Detect Risk Patterns',
      desc: 'Runs automated rule engines for peel-chains, mixers, and OFAC SDN lists.',
      icon: FileSearch
    },
    {
      num: '04',
      title: 'EXPLAIN',
      subtitle: 'Synthesize Assessment',
      desc: 'Produces quantifiable threat scores and FinCEN SAR evidence reports.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="p-4 md:p-5 space-y-5 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold text-xs border border-blue-500/30">
            UNIFIED FORENSIC MODULE
          </span>
          <span className="text-xs text-slate-400 font-mono">Wallet Audit &amp; Flow Graph</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-blue-400" />
          <span>Wallet Analyzer</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 max-w-3xl">
          Unified investigation workspace combining real-time wallet risk screening, watchlist audits, and visual multi-hop transaction flow graph mapping.
        </p>
      </div>

      {/* Main Investigation Input Card */}
      <div className="bg-navy-900 border border-navy-800 rounded-lg p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchMode('address')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all font-mono ${
                searchMode === 'address'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-navy-950 text-slate-400 hover:text-slate-200 border border-navy-800'
              }`}
            >
              [ Wallet Address ]
            </button>
            <button
              onClick={() => setSearchMode('hash')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all font-mono ${
                searchMode === 'hash'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-navy-950 text-slate-400 hover:text-slate-200 border border-navy-800'
              }`}
            >
              [ Transaction Hash ]
            </button>
          </div>

          <button
            onClick={handleSampleClick}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 flex items-center gap-1"
          >
            <span>Try sample audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleStartInvestigation} className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          <div className="md:col-span-8">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  searchMode === 'address'
                    ? 'Enter wallet address (e.g. 0x82A7656EC7ab88b098defB751B7401B5f6d8976F)'
                    : 'Enter transaction hash (e.g. 0x9a8f3b21c4e5d67890123...)'
                }
                className="w-full bg-navy-950 border border-navy-800 rounded-md pl-9 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="w-full bg-navy-950 border border-navy-800 rounded-md px-3 py-2.5 text-xs text-slate-300 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Ethereum">Ethereum (ETH)</option>
              <option value="Bitcoin">Bitcoin (BTC)</option>
              <option value="Polygon">Polygon (POL)</option>
              <option value="BNB Chain">BNB Chain (BNB)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full h-full min-h-[38px] bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-md shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Start Audit</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 4-Step Connected Workflow */}
        <div className="pt-3 border-t border-navy-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.num}
                className="p-3 rounded-md bg-navy-950 border border-navy-800 flex items-start gap-2.5 relative"
              >
                <div className="p-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                  <StepIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-blue-400">{step.num}</span>
                    <h4 className="text-xs font-bold text-white">{step.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{step.subtitle}</p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block w-4 h-4 text-navy-700 absolute -right-3 top-1/2 -translate-y-1/2 z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Unified Output: Tab Navigation (Flow Explorer Graph vs Risk Dossier) */}
      <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('flow')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                activeTab === 'flow'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
              }`}
            >
              <GitMerge className="w-4 h-4" />
              <span>Interactive Flow Explorer Graph</span>
            </button>
            <button
              onClick={() => setActiveTab('dossier')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                activeTab === 'dossier'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Risk Score &amp; Evidence Dossier</span>
            </button>
          </div>

          {analyzedData && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Audited Target:</span>
              <AddressCopy address={analyzedData.address} />
            </div>
          )}
        </div>

        {/* TAB 1: FLOW EXPLORER GRAPH WORKSPACE */}
        {activeTab === 'flow' && (
          <div className="space-y-3">
            {/* Flow Graph Controls */}
            <div className="bg-navy-950 border border-navy-800 p-2.5 rounded-md flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-400 font-bold uppercase text-[10px]">
                  Graph View Controls:
                </span>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="bg-navy-900 text-slate-200 border border-navy-800 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button
                onClick={resetGraphView}
                className="px-2.5 py-1 bg-navy-900 hover:bg-navy-800 text-slate-300 rounded border border-navy-800 font-mono text-[11px] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset View</span>
              </button>
            </div>

            {/* Canvas + Selected Node Evidence Drawer */}
            <div className="h-[65vh] border border-navy-800 rounded-lg overflow-hidden relative bg-navy-950 flex">
              <div className="flex-1 h-full relative">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  minZoom={0.2}
                  maxZoom={1.8}
                >
                  <Background color="#1E293B" gap={20} size={1} />
                  <Controls className="bg-navy-900 border border-navy-800 rounded overflow-hidden fill-slate-200" />
                  <MiniMap
                    className="bg-navy-900 border border-navy-800 rounded overflow-hidden"
                    nodeColor={(node) => {
                      if (node.data?.riskLevel === 'critical') return '#EF4444';
                      if (node.data?.riskLevel === 'high') return '#F97316';
                      return '#3B82F6';
                    }}
                  />
                </ReactFlow>
              </div>

              {/* Selected Node Evidence Panel */}
              {selectedNodeData && (
                <div className="w-80 sm:w-96 bg-navy-900 border-l border-navy-800 flex flex-col justify-between p-4 shadow-2xl overflow-y-auto z-20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2.5 border-b border-navy-800">
                      <div>
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider font-mono">
                          INVESTIGATION EVIDENCE
                        </span>
                        <h3 className="text-sm font-bold text-white mt-0.5 truncate">
                          {selectedNodeData.label}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedNodeData(null)}
                        className="p-1 text-slate-400 hover:text-white rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <AddressCopy address={selectedNodeData.address} truncate={false} linkToProfile={false} />

                    <div className="flex items-center justify-between">
                      <RiskBadge level={selectedNodeData.riskLevel} score={selectedNodeData.riskScore} size="md" />
                      <span className="text-xs font-mono text-slate-400">
                        Chain: <strong className="text-white">{selectedNodeData.chain}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-navy-950 p-2.5 rounded border border-navy-800 text-xs">
                      <div>
                        <span className="text-slate-400 text-[9px] font-mono uppercase">Funds Received</span>
                        <div className="font-mono font-bold text-white mt-0.5">
                          ${((selectedNodeData.balanceUSD * 2.8) / 1000).toFixed(1)}k
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[9px] font-mono uppercase">Funds Sent</span>
                        <div className="font-mono font-bold text-white mt-0.5">
                          ${((selectedNodeData.balanceUSD * 2.1) / 1000).toFixed(1)}k
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-navy-800 mt-3">
                    <button
                      onClick={() => navigate(`/wallet/${encodeURIComponent(selectedNodeData.address)}`)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded shadow transition-all flex items-center justify-center gap-2"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Open Wallet Profile</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: THREAT SCORE & RISK DOSSIER */}
        {activeTab === 'dossier' && analyzedData && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <RiskScoreCard
                score={analyzedData.riskScore}
                level={analyzedData.riskLevel}
                explanation={`Evaluated based on detected risk indicators: ${analyzedData.flags.join(', ')}.`}
              />

              <div className="lg:col-span-2 bg-navy-950 border border-navy-800 rounded-lg p-4 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Watchlist &amp; Sanctions Screening
                </h3>
                <div className="p-3 rounded bg-navy-900 border border-navy-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">OFAC SDN List Status:</span>
                    <div className="font-mono font-bold text-red-400 mt-0.5">
                      {analyzedData.sanctionsMatch.isSanctioned ? 'Match Identified (SDN Watchlist)' : 'No Match'}
                    </div>
                  </div>
                  {analyzedData.sanctionsMatch.sdnId && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                      {analyzedData.sanctionsMatch.sdnId}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 font-mono">Detected Risk Indicators:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analyzedData.riskIndicators.map((ind) => (
                      <div key={ind.id} className="p-2.5 rounded bg-navy-900 border border-navy-800 flex items-start gap-2">
                        <RiskBadge level={ind.severity} size="sm" />
                        <div>
                          <div className="text-xs font-bold text-white">{ind.name}</div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{ind.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
