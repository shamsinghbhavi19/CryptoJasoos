import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { MOCK_WALLETS } from '../data/mockData';
import { RiskBadge } from '../components/common/RiskBadge';
import { AddressCopy } from '../components/common/AddressCopy';

export const Analytics: React.FC = () => {
  const navigate = useNavigate();

  const riskTrendData = [
    { date: 'Aug 1', avgRiskScore: 42, criticalIncidents: 3 },
    { date: 'Aug 5', avgRiskScore: 48, criticalIncidents: 5 },
    { date: 'Aug 9', avgRiskScore: 61, criticalIncidents: 9 },
    { date: 'Aug 13', avgRiskScore: 55, criticalIncidents: 6 },
    { date: 'Aug 17', avgRiskScore: 72, criticalIncidents: 12 },
    { date: 'Aug 21', avgRiskScore: 79, criticalIncidents: 15 },
  ];

  const volumeData = [
    { month: 'Mar', cleanVol: 14.2, suspiciousVol: 2.1 },
    { month: 'Apr', cleanVol: 18.5, suspiciousVol: 3.4 },
    { month: 'May', cleanVol: 15.0, suspiciousVol: 4.8 },
    { month: 'Jun', cleanVol: 22.1, suspiciousVol: 6.2 },
    { month: 'Jul', cleanVol: 28.4, suspiciousVol: 8.9 },
    { month: 'Aug', cleanVol: 25.0, suspiciousVol: 11.4 },
  ];

  const patternData = [
    { pattern: 'Rapid Movement', count: 420, fill: '#EF4444' },
    { pattern: 'Fan-Out Behavior', count: 310, fill: '#F97316' },
    { pattern: 'Circular Flow', count: 240, fill: '#8B5CF6' },
    { pattern: 'Mixer Anonymization', count: 190, fill: '#3B82F6' },
    { pattern: 'High Velocity Burst', count: 145, fill: '#F59E0B' },
  ];

  const chainDistribution = [
    { name: 'Ethereum', value: 54, color: '#3B82F6' },
    { name: 'Bitcoin', value: 26, color: '#F59E0B' },
    { name: 'Solana', value: 12, color: '#8B5CF6' },
    { name: 'BNB Chain', value: 8, color: '#10B981' },
  ];

  const sortedWallets = Object.values(MOCK_WALLETS).sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="p-4 md:p-5 space-y-5 max-w-7xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <span>Macro Forensic Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl font-sans">
          High-level forensic intelligence dashboard monitoring cross-chain laundering trends, threat vectors, and protocol risk indexes.
        </p>
      </div>

      {/* Grid: Risk Trend & Transaction Volume Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Score Trend Line Chart */}
        <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                Network Risk Score Trend
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Average threat index over 30-day window</p>
            </div>
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-bold">
              Avg Risk: 79/100
            </span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1020',
                    borderColor: '#1E293B',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }}
                />
                <Line type="monotone" dataKey="avgRiskScore" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', r: 3 }} name="Avg Risk Score" />
                <Line type="monotone" dataKey="criticalIncidents" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 3" name="Critical Incidents" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Volume Bar Chart */}
        <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                Transaction Volume Breakdown ($M)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Legitimate vs Suspicious Volume Traced</p>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1020',
                    borderColor: '#1E293B',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="cleanVol" fill="#3B82F6" radius={[2, 2, 0, 0]} name="Clean Volume ($M)" />
                <Bar dataKey="suspiciousVol" fill="#EF4444" radius={[2, 2, 0, 0]} name="Suspicious ($M)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Suspicious Patterns & Blockchain Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                Suspicious Pattern Vector Frequency
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated detection hits across forensic rules</p>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patternData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#64748B" fontSize={10} />
                <YAxis type="category" dataKey="pattern" stroke="#94A3B8" fontSize={10} width={130} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1020',
                    borderColor: '#1E293B',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="count" radius={[0, 2, 2, 0]}>
                  {patternData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blockchain Distribution Donut Chart */}
        <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
              Blockchain Chain Distribution
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Volume origin by network</p>
          </div>

          <div className="h-40 relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chainDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                  {chainDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1020',
                    borderColor: '#1E293B',
                    borderRadius: '6px',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {chainDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between bg-navy-950 p-1.5 rounded border border-navy-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Risky Monitored Wallets Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-lg p-4 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
          Top Risky Monitored Wallets
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-navy-800 text-slate-400 uppercase tracking-wider text-[10px] font-mono bg-navy-950/60">
                <th className="py-2.5 px-3">Wallet Address</th>
                <th className="py-2.5 px-3">Entity Attribution</th>
                <th className="py-2.5 px-3">Chain</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Transactions</th>
                <th className="py-2.5 px-3">Volume Traced</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-850">
              {sortedWallets.slice(0, 6).map((w) => (
                <tr key={w.address} className="hover:bg-navy-850/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <AddressCopy address={w.address} />
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                    {w.entityName || w.category}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{w.chain}</td>
                  <td className="py-2.5 px-3">
                    <RiskBadge level={w.riskLevel} score={w.riskScore} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{w.transactionCount}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    ${(w.totalReceivedUSD / 1000000).toFixed(2)}M
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => navigate(`/wallet/${encodeURIComponent(w.address)}`)}
                      className="px-2.5 py-1 bg-navy-850 hover:bg-blue-600 text-slate-200 hover:text-white rounded text-[11px] font-semibold transition-all inline-flex items-center gap-1 border border-navy-700"
                    >
                      <span>Investigate</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
