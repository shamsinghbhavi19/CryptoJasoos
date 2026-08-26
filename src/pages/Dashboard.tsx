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
  ArrowRight,
  Shield,
  Layers,
  Wallet,
  Bell
} from 'lucide-react';
import { Crypto3DBackground } from '../components/common/Crypto3DBackground';
import { MOCK_ALERTS, MOCK_CASES } from '../data/mockData';
import { RiskBadge } from '../components/common/RiskBadge';
import { AddressCopy } from '../components/common/AddressCopy';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';

// Combined feature section component
import { WalletAnalyzer } from './WalletAnalyzer';
import { WalletProfile } from './WalletProfile';
import { Alerts } from './Alerts';
import { AIInvestigation } from './AIInvestigation';
import { Reports } from './Reports';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [showNewModal, setShowNewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState('');

  const handleStartNewInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddressInput.trim()) {
      setShowNewModal(false);
      const analyzeEl = document.getElementById('wallet-analyzer');
      if (analyzeEl) {
        analyzeEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(`/wallet-analyzer?q=${encodeURIComponent(newAddressInput.trim())}`);
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* ====================================================
          SECTION 1: 3D HERO FRONTPAGE & COMMAND CENTER (#dashboard)
         ==================================================== */}
      <section id="dashboard" className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden bg-navy-950 border-b border-navy-800 pt-8 pb-12 px-4 md:px-8">
        {/* Interactive 3D WebGL / Canvas Background */}
        <Crypto3DBackground />

        <div className="max-w-7xl mx-auto w-full relative z-10 space-y-10">
          {/* Overhead Title & Subtitle */}
          <div className="text-center space-y-3 max-w-4xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Next-Gen Financial Forensics Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none font-mono">
              CRYPTO-JASOOS
            </h1>

            <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              &quot;Trace the Money. Understand the Risk.&quot;
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
              Professional digital-forensics investigation console designed for compliance officers, cybersecurity analysts, and fraud investigators to audit suspicious wallets and trace multi-hop fund flows.
            </p>

            {/* Direct Feature Launch CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => scrollToSection('wallet-analyzer')}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
              >
                <Search className="w-4 h-4" />
                <span>Launch Wallet Analyzer</span>
              </button>

              <button
                onClick={() => scrollToSection('ai-investigation')}
                className="flex items-center gap-2 px-5 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs rounded-xl border border-purple-500/30 transition-all hover:scale-105"
              >
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Ask AI Copilot</span>
              </button>
            </div>
          </div>

          {/* Compact KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Investigations"
              value="24"
              trend="+12% this week"
              trendPositive={true}
              subtitle="Cases assigned to team"
              icon={FileSpreadsheet}
              accentColor="purple"
              onClick={() => scrollToSection('reports')}
            />
            <StatCard
              title="High Risk Wallets"
              value="18"
              trend="+3 new"
              trendPositive={false}
              subtitle="Threat score > 75/100"
              icon={ShieldAlert}
              accentColor="red"
              onClick={() => scrollToSection('wallet-analyzer')}
            />
            <StatCard
              title="Suspicious Transactions"
              value="143"
              trend="+18% 24h"
              trendPositive={false}
              subtitle="Rule engine triggers"
              icon={Activity}
              accentColor="amber"
              onClick={() => scrollToSection('alerts')}
            />
            <StatCard
              title="Critical Security Alerts"
              value="7"
              trend="Action required"
              trendPositive={false}
              subtitle="Unresolved high risk"
              icon={AlertTriangle}
              accentColor="red"
              onClick={() => scrollToSection('alerts')}
            />
          </div>

          {/* Priority Investigations Centerpiece Table */}
          <div className="bg-navy-900/90 backdrop-blur-md border border-navy-800 rounded-xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Priority Investigations Queue</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Active high-priority case queue requiring immediate forensic review
                </p>
              </div>
              <button
                onClick={() => scrollToSection('reports')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
              >
                <span>View All Reports ({MOCK_CASES.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-navy-800 text-slate-400 uppercase tracking-wider text-[10px] font-mono bg-navy-950/80">
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
                    <tr key={c.id} className="hover:bg-navy-850/80 transition-colors">
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
                          onClick={() => scrollToSection('wallet-analyzer')}
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
        </div>
      </section>

      {/* ====================================================
          SECTION 2: WALLET ANALYZER (#wallet-analyzer)
          Combines Wallet Input & Watchlist Audit with Interactive Flow Explorer Graph
         ==================================================== */}
      <section id="wallet-analyzer" className="scroll-mt-20 max-w-7xl mx-auto px-4 md:px-6 space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 font-mono font-bold text-xs border border-blue-500/20">
              FEATURE MODULE 01
            </span>
            <h2 className="text-xl font-extrabold text-white">Wallet Analyzer (Audit &amp; Flow Explorer)</h2>
          </div>
          <button
            onClick={() => scrollToSection('wallet')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 font-mono"
          >
            <span>Next: Wallet Profile</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <WalletAnalyzer />
      </section>

      {/* ====================================================
          SECTION 3: WALLET PROFILE (#wallet)
         ==================================================== */}
      <section id="wallet" className="scroll-mt-20 max-w-7xl mx-auto px-4 md:px-6 space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 font-mono font-bold text-xs border border-cyan-500/20">
              FEATURE MODULE 02
            </span>
            <h2 className="text-xl font-extrabold text-white">Wallet Profile &amp; Risk Dossier</h2>
          </div>
          <button
            onClick={() => scrollToSection('alerts')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 font-mono"
          >
            <span>Next: Security Alerts</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <WalletProfile />
      </section>

      {/* ====================================================
          SECTION 4: SECURITY ALERTS (#alerts)
         ==================================================== */}
      <section id="alerts" className="scroll-mt-20 max-w-7xl mx-auto px-4 md:px-6 space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono font-bold text-xs border border-amber-500/20">
              FEATURE MODULE 03
            </span>
            <h2 className="text-xl font-extrabold text-white">Security Alerts Engine</h2>
          </div>
          <button
            onClick={() => scrollToSection('ai-investigation')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 font-mono"
          >
            <span>Next: AI Assistant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <Alerts />
      </section>

      {/* ====================================================
          SECTION 5: AI INVESTIGATION (#ai-investigation)
         ==================================================== */}
      <section id="ai-investigation" className="scroll-mt-20 max-w-7xl mx-auto px-4 md:px-6 space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 font-mono font-bold text-xs border border-indigo-500/20">
              FEATURE MODULE 04
            </span>
            <h2 className="text-xl font-extrabold text-white">AI Investigation Assistant</h2>
          </div>
          <button
            onClick={() => scrollToSection('reports')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 font-mono"
          >
            <span>Next: FinCEN Reports</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <AIInvestigation />
      </section>

      {/* ====================================================
          SECTION 6: REPORTS (#reports)
         ==================================================== */}
      <section id="reports" className="scroll-mt-20 max-w-7xl mx-auto px-4 md:px-6 space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
              FEATURE MODULE 05
            </span>
            <h2 className="text-xl font-extrabold text-white">FinCEN SAR &amp; Forensic Reports</h2>
          </div>
          <button
            onClick={() => scrollToSection('dashboard')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
          >
            <span>Back to Top</span>
            <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
          </button>
        </div>

        <Reports />
      </section>

      {/* Modals for new investigation & import */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Start New Forensic Audit"
        subtitle="Screen wallet address or hash"
      >
        <form onSubmit={handleStartNewInvestigation} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 font-mono">
              Target Wallet Address / Hash
            </label>
            <input
              type="text"
              required
              value={newAddressInput}
              onChange={(e) => setNewAddressInput(e.target.value)}
              placeholder="e.g. 0x82A7656EC7ab88b098defB751B7401B5f6d8976F"
              className="w-full bg-navy-950 border border-navy-800 rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewModal(false)}
              className="px-3.5 py-1.5 bg-navy-800 text-slate-300 text-xs font-semibold rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md shadow"
            >
              Start Investigation
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Transaction Dataset"
        subtitle="Upload CSV or JSON ledger export"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <div className="border-2 border-dashed border-navy-800 rounded-lg p-6 text-center bg-navy-950">
            <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="font-bold text-white">Drag &amp; drop ledger file here</p>
            <p className="text-slate-500 text-[11px] mt-1">Supports CSV, Etherscan JSON, or CSV export files</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowImportModal(false)}
              className="px-3.5 py-1.5 bg-navy-800 text-slate-300 text-xs font-semibold rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
