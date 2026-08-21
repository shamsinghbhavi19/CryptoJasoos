import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Printer,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { MOCK_CASES } from '../data/mockData';
import { CaseReport } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { AddressCopy } from '../components/common/AddressCopy';
import { Modal } from '../components/common/Modal';

export const Reports: React.FC = () => {
  const [casesList, setCasesList] = useState<CaseReport[]>(MOCK_CASES);
  const [selectedCase, setSelectedCase] = useState<CaseReport | null>(MOCK_CASES[0]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newWallet, setNewWallet] = useState('');

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReport: CaseReport = {
      id: `CF-02${casesList.length + 1}`,
      caseNumber: `CF-02${casesList.length + 1}`,
      title: newTitle,
      targetAddress: newWallet || '0x82A7656EC7ab88b098defB751B7401B5f6d8976F',
      entity: 'Wallet Under Investigation',
      totalIllicitUSD: 1450000,
      leadInvestigator: 'Alex Vance (Senior Investigator)',
      status: 'Draft',
      dateCreated: new Date().toISOString().split('T')[0],
      lastUpdated: 'Just now',
      summary: 'Newly generated suspicious activity report for compliance audit.',
      tags: ['Custom Investigation', 'FinCEN Draft'],
      evidenceHashes: ['0x9a8f3b21c4e5d67890123456789abcdef0123456789abcdef0123456789abc10'],
      suspiciousIndicators: ['Rapid Fund Movement', 'Mixer Exposure'],
      recommendedSteps: ['Submit formal FinCEN SAR filing']
    };

    setCasesList([newReport, ...casesList]);
    setSelectedCase(newReport);
    setShowGenerateModal(false);
    setNewTitle('');
    setNewWallet('');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-5 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <span>FinCEN SAR &amp; Forensic Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl font-sans">
            Generate, manage, and export FinCEN-compliant Suspicious Activity Reports (SAR) with verified evidence hashes.
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md shadow-md transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Generate Report</span>
        </button>
      </div>

      {/* Grid: Reports Cards List & Live Case Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Reports Cards List */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
            Active Case Files ({casesList.length})
          </h3>

          {casesList.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-2 ${
                selectedCase?.id === c.id
                  ? 'bg-navy-900 border-blue-500/80 shadow-md'
                  : 'bg-navy-900/60 border-navy-800 hover:border-navy-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400">{c.caseNumber}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-navy-950 text-slate-300 border border-navy-800">
                  {c.status}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white line-clamp-1">{c.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{c.summary}</p>

              <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Target: {c.targetAddress.slice(0, 6)}...{c.targetAddress.slice(-4)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCase(c);
                    setShowPreviewModal(true);
                  }}
                  className="text-blue-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Case Full Report Preview */}
        {selectedCase && (
          <div className="lg:col-span-2 bg-navy-900 border border-navy-800 rounded-lg p-5 shadow-lg space-y-5">
            {/* Report Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-navy-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold font-mono border border-purple-500/30">
                    FINCEN SAR FORM 111 DOSSIER
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedCase.dateCreated}</span>
                </div>
                <h2 className="text-base font-bold text-white">{selectedCase.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lead Investigator: <strong className="text-slate-200">{selectedCase.leadInvestigator}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-all shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>

                <button
                  onClick={handlePrintPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold rounded-md border border-navy-700 transition-all font-mono"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Sections Preview */}
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-md bg-navy-950 border border-navy-800 space-y-1">
                <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-blue-400 font-mono">
                  1. Case Overview &amp; Executive Summary
                </h4>
                <p className="leading-relaxed">{selectedCase.summary}</p>
                <div className="text-[10px] font-mono text-slate-400 pt-1">
                  Total Illicit Value Traced: <strong className="text-white">${selectedCase.totalIllicitUSD.toLocaleString()} USD</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-navy-950 border border-navy-800 space-y-1">
                <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-blue-400 font-mono">
                  2. Investigated Wallet Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] font-mono">Target Address:</span>
                    <AddressCopy address={selectedCase.targetAddress} />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-mono">Attributed Subject:</span>
                    <span className="block font-semibold text-white">{selectedCase.entity}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-navy-950 border border-navy-800 space-y-1">
                <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-blue-400 font-mono">
                  3. Risk Assessment &amp; Threat Score
                </h4>
                <div className="flex items-center gap-3">
                  <RiskBadge level="high" score={87} size="md" />
                  <span className="text-slate-300">Evaluated as High Risk based on mixer exposure &amp; rapid transfer velocity.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-navy-950 border border-navy-800 space-y-1">
                <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-blue-400 font-mono">
                  4. Detected Suspicious Indicators
                </h4>
                <div className="space-y-1">
                  {selectedCase.suspiciousIndicators.map((ind, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full PDF / Print Report Preview Modal */}
      {selectedCase && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title={`FinCEN SAR Official Report — ${selectedCase.caseNumber}`}
          subtitle="Printable Legal Dossier Format"
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs text-slate-300 p-2">
            <div className="text-center border-b border-navy-800 pb-3">
              <h2 className="text-base font-bold text-white tracking-widest uppercase font-mono">
                SUSPICIOUS ACTIVITY REPORT (FINCEN FORM 111)
              </h2>
              <p className="text-[10px] text-slate-400 font-mono mt-1">
                CRYPTOJASOOS AI FINANCIAL FORENSICS PLATFORM • RECORD ID: {selectedCase.caseNumber}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white uppercase text-[10px] font-mono text-blue-400">
                  1. CASE SUBJECT &amp; TARGET WALLET
                </h4>
                <p className="mt-1">Target Address: <span className="font-mono text-white font-bold">{selectedCase.targetAddress}</span></p>
                <p>Subject Record: <span className="text-white font-bold">{selectedCase.entity}</span></p>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase text-[10px] font-mono text-blue-400">
                  2. EXECUTIVE FORENSIC SUMMARY
                </h4>
                <p className="mt-1 leading-relaxed">{selectedCase.summary}</p>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase text-[10px] font-mono text-blue-400">
                  3. CRYPTOGRAPHIC EVIDENCE HASHES
                </h4>
                <div className="mt-1 space-y-1">
                  {selectedCase.evidenceHashes.map((h) => (
                    <div key={h} className="font-mono text-[10px] bg-navy-950 p-2 rounded border border-navy-800 text-slate-300">
                      Tx Hash: {h}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-navy-800">
              <button
                onClick={handlePrintPDF}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-md shadow flex items-center gap-2 font-mono"
              >
                <Printer className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Generate Report Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate FinCEN SAR Report"
        subtitle="Compile target wallet evidence into formal case dossier"
      >
        <form onSubmit={handleCreateReport} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 font-mono">
              Report Title / Case Name
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Lazarus Sub-Node Laundering Audit"
              className="w-full bg-navy-950 border border-navy-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 font-mono">
              Target Wallet Address
            </label>
            <input
              type="text"
              value={newWallet}
              onChange={(e) => setNewWallet(e.target.value)}
              placeholder="e.g. 0x82A7656EC7ab88b098defB751B7401B5f6d8976F"
              className="w-full bg-navy-950 border border-navy-800 rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowGenerateModal(false)}
              className="px-3.5 py-1.5 bg-navy-800 text-slate-300 text-xs font-semibold rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md shadow"
            >
              Generate SAR Case
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
