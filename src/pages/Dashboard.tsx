import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  GitMerge,
  Plus,
  Upload,
  Activity,
  AlertTriangle,
  FileSpreadsheet,
  Bot,
  ChevronRight,
  Eye,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { MOCK_ALERTS, MOCK_CASES } from '../data/mockData';
import { RiskBadge } from '../components/common/RiskBadge';
import { AddressCopy } from '../components/common/AddressCopy';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [showNewModal, setShowNewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState('');

  const handleStartNewInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddressInput.trim()) {
      setShowNewModal(false);
      navigate(`/analyze?q=${encodeURIComponent(newAddressInput.trim())}`);
    }
  };

  return (
    <div className="p-4 md:p-5 space-y-5 max-w-7xl mx-auto">
      {/* Console Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-navy-800 p-4 rounded-lg shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/20">
              DEMO MODE — SIMULATED FORENSIC DATA
            </span>
            <span className="text-xs text-slate-400 font-mono">OFAC SDN Watchlist Active</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Investigation Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            Monitor flagged cryptocurrency wallets, investigate multi-hop fund flows, and draft evidence reports.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Investigation</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs font-semibold rounded-md border border-navy-800 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span>Import Transaction</span>
          </button>
        </div>
      </div>

      {/* Compact KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Active Investigations"
          value="24"
          trend="+12% this week"
          trendPositive={true}
          subtitle="Cases assigned to team"
          icon={FileSpreadsheet}
          accentColor="purple"
          onClick={() => navigate('/reports')}
        />
        <StatCard
          title="High Risk Wallets"
          value="18"
          trend="+3 new"
          trendPositive={false}
          subtitle="Threat score > 75/100"
          icon={ShieldAlert}
          accentColor="red"
          onClick={() => navigate('/analyze')}
        />
        <StatCard
          title="Suspicious Transactions"
          value="143"
          trend="+18% 24h"
          trendPositive={false}
          subtitle="Rule engine triggers"
          icon={Activity}
          accentColor="amber"
          onClick={() => navigate('/alerts')}
        />
        <StatCard
          title="Critical Alerts"
          value="7"
          trend="Action required"
          trendPositive={false}
          subtitle="Unresolved high risk"
          icon={AlertTriangle}
          accentColor="red"
          onClick={() => navigate('/alerts')}
        />
      </div>

      {/* CENTERPIECE: Large Priority Investigations Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Priority Investigations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              High-confidence case queue requiring active forensic investigation
            </p>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
          >
            <span>View All Cases ({MOCK_CASES.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-navy-800 text-slate-400 uppercase tracking-wider text-[10px] font-mono bg-navy-950/60">
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Wallet Under Investigation</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Suspicious Reason / Indicator</th>
                <th className="py-2.5 px-3">Last Activity</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-850">
              {MOCK_CASES.map((c) => (
                <tr key={c.id} className="hover:bg-navy-850/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white">{c.caseNumber}</td>
                  <td className="py-3 px-3">
                    <AddressCopy address={c.targetAddress} />
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge level={c.caseNumber === 'CF-024' || c.caseNumber === 'CF-022' ? 'critical' : 'high'} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-medium">
                    <span className="line-clamp-1">{c.summary}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{c.lastUpdated}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => navigate(`/wallet/${encodeURIComponent(c.targetAddress)}`)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-bold transition-all inline-flex items-center gap-1 shadow-sm"
                    >
                      <span>Investigate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split Section: Quick Forensics Launchers & Security Alerts Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Investigative Tool Launchers */}
        <div className="lg:col-span-2 bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Investigative Workflow Tools
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => navigate('/analyze')}
              className="p-3.5 rounded-lg bg-navy-950 border border-navy-800 hover:border-blue-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Search className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">1. Analyze Wallet</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Start fresh audit for wallet risk &amp; OFAC sanctions hit.</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/flow-explorer')}
              className="p-3.5 rounded-lg bg-navy-950 border border-navy-800 hover:border-purple-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <GitMerge className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400 transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">2. Flow Explorer</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Map visual multi-hop fund lineage graph across hop nodes.</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/ai-investigation')}
              className="p-3.5 rounded-lg bg-navy-950 border border-navy-800 hover:border-indigo-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Bot className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">3. AI Copilot</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Synthesize evidence &amp; explain risk indicators in plain English.</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/reports')}
              className="p-3.5 rounded-lg bg-navy-950 border border-navy-800 hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">4. Case Reports</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Compile &amp; export FinCEN SAR evidence reports.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Security Alerts Queue */}
        <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Live Alert Triggers
            </h3>
            <button
              onClick={() => navigate('/alerts')}
              className="text-[11px] font-semibold text-blue-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {MOCK_ALERTS.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigate('/alerts')}
                className="p-2.5 rounded-md bg-navy-950 border border-navy-800 hover:border-navy-700 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <RiskBadge level={alert.severity} size="sm" />
                  <span className="text-[9px] font-mono text-slate-400">{alert.timestamp.split(' ')[1]}</span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{alert.title}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Investigation Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Start New Investigation"
        subtitle="Screen address for threat score & OFAC sanctions hits"
      >
        <form onSubmit={handleStartNewInvestigation} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 font-mono">
              Cryptocurrency Wallet Address or Tx Hash
            </label>
            <input
              type="text"
              required
              value={newAddressInput}
              onChange={(e) => setNewAddressInput(e.target.value)}
              placeholder="e.g. 0x82A7656EC7ab88b098defB751B7401B5f6d8976F"
              className="w-full bg-navy-950 border border-navy-800 rounded-md px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewModal(false)}
              className="px-3.5 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-md text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-bold shadow-md"
            >
              Start Investigation
            </button>
          </div>
        </form>
      </Modal>

      {/* Import Transaction Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Raw Blockchain Data"
        subtitle="Batch transaction upload"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <div className="border border-dashed border-navy-700 hover:border-blue-500/50 rounded-lg p-6 text-center bg-navy-950 transition-colors cursor-pointer">
            <Upload className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="font-bold text-white">Drop transaction CSV/JSON file here</p>
            <p className="text-slate-400 text-[10px] mt-1">Supports CSV, Etherscan exports, or RPC dumps</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowImportModal(false)}
              className="px-3.5 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-md text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
