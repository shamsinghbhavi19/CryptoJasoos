import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  GitMerge,
  Wallet,
  Bell,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Database,
  GitBranch,
  FileSearch,
  CheckCircle2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { BlockchainService } from '../services/blockchainService';
import { WalletProfileData } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskScoreCard } from '../components/common/RiskScoreCard';
import { AddressCopy } from '../components/common/AddressCopy';

export const AnalyzeWallet: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchMode, setSearchMode] = useState<'address' | 'hash'>('address');
  const [inputVal, setInputVal] = useState(searchParams.get('q') || '');
  const [selectedChain, setSelectedChain] = useState('Ethereum');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<WalletProfileData | null>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInputVal(q);
      executeInvestigation(q);
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
        <h1 className="text-xl font-bold text-white tracking-tight">
          Analyze Wallet &amp; Transaction Hash
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Primary entry point for new investigations. Enter an address or transaction hash to evaluate threat scores and screen watchlists.
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
            <span>Try sample investigation</span>
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
                  <span>Investigating...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Start Investigation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Visual Investigation Findings Output Card */}
      {analyzedData && (
        <div className="bg-navy-900 border border-navy-800 rounded-lg p-5 shadow-lg space-y-5 animate-fadeIn">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-navy-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-mono font-bold border border-blue-500/30">
                  INVESTIGATION DOSSIER
                </span>
                <span className="text-xs text-slate-400 font-mono">{analyzedData.chain} Network</span>
              </div>
              <h2 className="text-lg font-bold text-white flex items-center gap-3 font-mono">
                <AddressCopy address={analyzedData.address} truncate={false} linkToProfile={false} />
              </h2>
              {analyzedData.entityName && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Attribution Record: <span className="text-white font-semibold">{analyzedData.entityName}</span> ({analyzedData.category})
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate('/flow-explorer')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-all shadow-sm"
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span>Launch Flow Explorer</span>
              </button>
              <button
                onClick={() => navigate(`/wallet/${encodeURIComponent(analyzedData.address)}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold rounded-md border border-navy-700 transition-all"
              >
                <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Profile</span>
              </button>
              <button
                onClick={() => navigate('/alerts')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold rounded-md border border-navy-700 transition-all"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Create Alert</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Risk Score & Sanction / Exposure */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RiskScoreCard
              score={analyzedData.riskScore}
              level={analyzedData.riskLevel}
              explanation={`Evaluated based on ${analyzedData.flags.join(', ')}.`}
            />

            {/* Sanctions & Watchlist Match Card */}
            <div className="bg-navy-950 border border-navy-800 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Watchlist &amp; Sanctions Screening
                </span>
                <div className="mt-2.5">
                  {analyzedData.sanctionsMatch.isSanctioned ? (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 flex items-start gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-red-400 uppercase font-mono">
                          OFAC SDN WATCHLIST MATCH
                        </h4>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          ID: <span className="font-mono">{analyzedData.sanctionsMatch.sdnId}</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400">Clear — Zero Sanction Hits</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-navy-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-mono">Mixer Exposure:</span>
                  <span className="block font-mono font-bold text-white">{analyzedData.exposure.mixerExposure}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-mono">Direct Illicit:</span>
                  <span className="block font-mono font-bold text-white">{analyzedData.exposure.directIllicit}%</span>
                </div>
              </div>
            </div>

            {/* Risk Indicators Card */}
            <div className="bg-navy-950 border border-navy-800 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Behavioral Indicators
                </span>
                <div className="mt-2.5 space-y-1.5">
                  {analyzedData.flags.map((flag, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/ai-investigation')}
                className="mt-3 w-full py-1.5 bg-navy-800 hover:bg-navy-700 text-purple-400 text-xs font-bold rounded-md border border-navy-700 transition-all flex items-center justify-center gap-1 font-mono"
              >
                <span>Ask AI Copilot to Explain</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Step Connected Workflow (COLLECT → TRACE → ANALYZE → EXPLAIN) */}
      <div className="bg-navy-900 border border-navy-800 rounded-lg p-5 shadow-md">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-1">
          Forensic Workflow — 4-Step Investigation Pipeline
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Systematic methodology for analyzing suspicious blockchain addresses
        </p>

        {/* Visually connected 4-step row with arrows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative flex-1">
                <div className="p-4 rounded-lg bg-navy-950 border border-navy-800 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {step.num} {step.title}
                      </span>
                      <div className="p-1.5 rounded bg-navy-900 text-slate-400 border border-navy-800">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1">{step.subtitle}</h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Connecting arrow indicator for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-blue-500/50">
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
