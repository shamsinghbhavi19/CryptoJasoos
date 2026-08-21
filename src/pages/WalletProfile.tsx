import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  GitMerge,
  PlusCircle,
  Download,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { BlockchainService } from '../services/blockchainService';
import { WalletProfileData, TransactionItem } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskScoreCard } from '../components/common/RiskScoreCard';
import { AddressCopy } from '../components/common/AddressCopy';

export const WalletProfile: React.FC = () => {
  const { address } = useParams<{ address?: string }>();
  const navigate = useNavigate();

  const targetAddress = address || '0x82A7656EC7ab88b098defB751B7401B5f6d8976F';

  const [walletData, setWalletData] = useState<WalletProfileData | null>(null);
  const [txHistory, setTxHistory] = useState<TransactionItem[]>([]);
  const [directionFilter, setDirectionFilter] = useState<'all' | 'in' | 'out'>('all');
  const [txSearch, setTxSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const wData = await BlockchainService.getWalletProfile(targetAddress);
      const txs = await BlockchainService.getTransactions({ address: targetAddress });
      setWalletData(wData);
      setTxHistory(txs);
    };
    fetchData();
  }, [targetAddress]);

  if (!walletData) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono">
        Loading forensic wallet dossier...
      </div>
    );
  }

  const filteredTxs = txHistory.filter((tx) => {
    const isOut = tx.fromAddress.toLowerCase() === targetAddress.toLowerCase();
    if (directionFilter === 'in' && isOut) return false;
    if (directionFilter === 'out' && !isOut) return false;
    if (txSearch) {
      const q = txSearch.toLowerCase();
      return (
        tx.hash.toLowerCase().includes(q) ||
        tx.fromAddress.toLowerCase().includes(q) ||
        tx.toAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 md:p-5 space-y-5 max-w-7xl mx-auto">
      {/* 1. WHAT AM I INVESTIGATING? Header Bar */}
      <div className="bg-navy-900 border border-navy-800 p-5 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold border border-blue-500/30">
              WHAT AM I INVESTIGATING? — WALLET PROFILE DOSSIER
            </span>
            <span className="text-xs text-slate-400 font-mono">{walletData.chain} Chain</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-3 font-mono">
            <AddressCopy address={walletData.address} truncate={false} linkToProfile={false} />
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Subject Classification: <span className="text-white font-semibold">{walletData.category}</span> ({walletData.entityName || 'Unidentified Wallet'})
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/flow-explorer')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-all shadow-sm"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Trace Flow</span>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold rounded-md border border-navy-700 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Add to Case</span>
          </button>

          <button
            onClick={() => alert(`Exporting dossier for ${walletData.address}...`)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold rounded-md border border-navy-700 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. WHAT DID THE SYSTEM FIND? Risk Score & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RiskScoreCard
            score={walletData.riskScore}
            level={walletData.riskLevel}
            explanation={`Evaluated based on detected risk indicators: ${walletData.flags.join(', ')}.`}
            className="h-full"
          />
        </div>

        {/* Exposure breakdown card */}
        <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              WHAT DID THE SYSTEM FIND? — EXPOSURE
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Mixer Anonymization Exposure</span>
                  <span className="font-mono">{walletData.exposure.mixerExposure}%</span>
                </div>
                <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${walletData.exposure.mixerExposure}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Sanctioned Cluster Exposure</span>
                  <span className="font-mono">{walletData.exposure.sanctionedExposure}%</span>
                </div>
                <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${walletData.exposure.sanctionedExposure}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Clean VASP Off-Ramp</span>
                  <span className="font-mono">{walletData.exposure.cleanVASP}%</span>
                </div>
                <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${walletData.exposure.cleanVASP}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Compact Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-navy-900 border border-navy-800 p-3 rounded-md">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Total Received</span>
          <div className="text-sm font-bold font-mono text-white mt-0.5">
            ${walletData.totalReceivedUSD.toLocaleString()}
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-800 p-3 rounded-md">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Total Sent</span>
          <div className="text-sm font-bold font-mono text-white mt-0.5">
            ${walletData.totalSentUSD.toLocaleString()}
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-800 p-3 rounded-md">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Transactions</span>
          <div className="text-sm font-bold font-mono text-white mt-0.5">
            {walletData.transactionCount.toLocaleString()}
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-800 p-3 rounded-md">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Connected Wallets</span>
          <div className="text-sm font-bold font-mono text-white mt-0.5">
            {walletData.connectedWalletsCount}
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-800 p-3 rounded-md">
          <span className="text-[9px] font-mono text-slate-400 uppercase">First Seen</span>
          <div className="text-xs font-semibold text-slate-300 mt-0.5 truncate">
            {walletData.firstSeen.split(' ')[0]}
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-800 p-3 rounded-md">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Last Active</span>
          <div className="text-xs font-semibold text-emerald-400 mt-0.5 truncate">
            Today
          </div>
        </div>
      </div>

      {/* 3. WHY IS IT SUSPICIOUS? Behavioral Indicators */}
      <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
          WHY IS IT SUSPICIOUS? — DETECTED RISK INDICATORS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {walletData.riskIndicators.map((ind) => (
            <div
              key={ind.id}
              className="p-3 rounded-md bg-navy-950 border border-navy-800 flex items-start gap-2.5"
            >
              <RiskBadge level={ind.severity} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{ind.name}</h4>
                  <span className="text-[9px] font-mono text-slate-400 bg-navy-900 px-1.5 py-0.2 rounded border border-navy-800">
                    Evidence: {ind.evidenceCount}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{ind.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. WHAT SHOULD I DO NEXT? Recommended Actions Box */}
      <div className="bg-navy-900 border border-blue-500/30 rounded-lg p-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
            WHAT SHOULD I DO NEXT? — RECOMMENDED INVESTIGATIVE ACTIONS
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Trace hop destinations in <strong>Flow Explorer</strong>, query <strong>AI Copilot</strong> for synthesis, or file a <strong>SAR Report</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/flow-explorer')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md shadow-sm flex items-center gap-1"
          >
            <span>Trace Multi-Hop Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold rounded-md border border-navy-700"
          >
            <span>Draft Case Report</span>
          </button>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">Transaction History</h3>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-navy-950 p-1 rounded border border-navy-800 text-xs">
              <button
                onClick={() => setDirectionFilter('all')}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  directionFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDirectionFilter('in')}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  directionFilter === 'in' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Incoming
              </button>
              <button
                onClick={() => setDirectionFilter('out')}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  directionFilter === 'out' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Outgoing
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Search hash..."
                className="bg-navy-950 border border-navy-800 rounded pl-7 pr-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-navy-800 text-slate-400 uppercase tracking-wider text-[10px] font-mono bg-navy-950/60">
                <th className="py-2.5 px-3">Tx Hash</th>
                <th className="py-2.5 px-3">Direction</th>
                <th className="py-2.5 px-3">Counterparty</th>
                <th className="py-2.5 px-3">Amount (USD)</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-850">
              {filteredTxs.slice(0, 10).map((tx) => {
                const isOut = tx.fromAddress.toLowerCase() === targetAddress.toLowerCase();
                const counterparty = isOut ? tx.toAddress : tx.fromAddress;

                return (
                  <tr key={tx.id} className="hover:bg-navy-850/60 transition-colors font-mono">
                    <td className="py-2.5 px-3">
                      <span className="text-blue-400 hover:underline cursor-pointer">
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold">
                          <ArrowUpRight className="w-3 h-3" /> OUT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          <ArrowDownLeft className="w-3 h-3" /> IN
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <AddressCopy address={counterparty} />
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      ${tx.amountUSD.toLocaleString()} ({tx.amountCrypto} {tx.symbol})
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{tx.timestamp}</td>
                    <td className="py-2.5 px-3 text-right">
                      <RiskBadge level={tx.riskLevel} score={tx.riskScore} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
