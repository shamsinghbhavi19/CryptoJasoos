import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Filter,
  ShieldAlert,
  Search,
  CheckCircle2,
  ArrowRight,
  Eye,
  GitMerge,
  Bot,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { BlockchainService } from '../services/blockchainService';
import { AlertItem, RiskLevel } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { AddressCopy } from '../components/common/AddressCopy';
import { Drawer } from '../components/common/Drawer';

export const Alerts: React.FC = () => {
  const navigate = useNavigate();

  const [alertsList, setAlertsList] = useState<AlertItem[]>([]);
  const [severityFilter, setSeverityFilter] = useState<RiskLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'investigating' | 'resolved'>('all');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await BlockchainService.getAlerts({
        severity: severityFilter,
        status: statusFilter
      });
      setAlertsList(data);
    };
    fetchAlerts();
  }, [severityFilter, statusFilter]);

  const updateAlertStatus = (alertId: string, newStatus: 'investigating' | 'resolved') => {
    setAlertsList((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert({ ...selectedAlert, status: newStatus });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-amber-400" />
            <span>Security Alerts Engine</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Monitor real-time suspicious blockchain activity requiring forensic investigation and compliance escalation.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-navy-900 border border-navy-800 p-4 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 bg-navy-950 px-3 py-1.5 rounded-xl border border-navy-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-navy-950 px-3 py-1.5 rounded-xl border border-navy-800 text-xs">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Triggers</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing <strong>{alertsList.length}</strong> Security Triggers
        </span>
      </div>

      {/* Alerts Table / List */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-navy-800 bg-navy-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Alert ID &amp; Severity</th>
                <th className="py-3 px-4">Title &amp; Category</th>
                <th className="py-3 px-4">Target Wallet</th>
                <th className="py-3 px-4">Volume (USD)</th>
                <th className="py-3 px-4">Detected Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-850">
              {alertsList.map((alert) => (
                <tr
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className="hover:bg-navy-850/70 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span className="font-mono text-slate-400 text-[11px] font-bold">{alert.id}</span>
                      <div>
                        <RiskBadge level={alert.severity} size="sm" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>
                      <h4 className="font-bold text-white text-xs">{alert.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{alert.description}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <AddressCopy address={alert.walletAddress} />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    ${alert.amountUSD.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {alert.timestamp}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                        alert.status === 'new'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : alert.status === 'investigating'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAlert(alert);
                      }}
                      className="px-3 py-1.5 bg-navy-800 hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Detail Drawer */}
      {selectedAlert && (
        <Drawer
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title={`Alert Detail — ${selectedAlert.id}`}
          subtitle="Forensic Risk Trigger Analysis"
        >
          <div className="space-y-5">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <RiskBadge level={selectedAlert.severity} size="md" />
                <span className="text-xs font-mono text-slate-400">{selectedAlert.timestamp}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{selectedAlert.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedAlert.description}</p>
            </div>

            {/* Target wallet & volume */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Target Address</span>
                <div className="mt-1">
                  <AddressCopy address={selectedAlert.walletAddress} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Transaction Volume</span>
                <div className="font-mono font-bold text-white text-sm mt-1">
                  ${selectedAlert.amountUSD.toLocaleString()} USD
                </div>
              </div>
            </div>

            {/* Trigger Reason & Evidence */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Why It Triggered (Evidence Breakdown)
              </h4>
              <div className="space-y-2">
                {selectedAlert.evidence.map((ev, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-navy-950 border border-navy-800 flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended investigation steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Recommended Forensic Actions
              </h4>
              <div className="p-3.5 rounded-xl bg-navy-950 border border-blue-500/30 text-xs text-slate-300 space-y-2">
                <p>• Launch <strong>Flow Explorer</strong> to trace secondary hop destinations.</p>
                <p>• Query <strong>AI Investigation Copilot</strong> to synthesize transaction lineage.</p>
                <p>• Attach evidence hashes to active FinCEN SAR draft in <strong>Reports</strong>.</p>
              </div>
            </div>

            {/* Interactive Status Actions */}
            <div className="space-y-2 pt-4 border-t border-navy-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateAlertStatus(selectedAlert.id, 'investigating')}
                  className="py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Mark Investigating
                </button>
                <button
                  onClick={() => updateAlertStatus(selectedAlert.id, 'resolved')}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Resolve Alert
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedAlert(null);
                  navigate('/flow-explorer');
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <GitMerge className="w-4 h-4" />
                <span>Launch Visual Flow Graph</span>
              </button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
