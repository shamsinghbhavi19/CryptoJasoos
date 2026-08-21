import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  GitMerge,
  Wallet,
  Bell,
  Bot,
  FileSpreadsheet,
  Shield,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Analyze Wallet', path: '/analyze', icon: Search },
    { name: 'Flow Explorer', path: '/flow-explorer', icon: GitMerge },
    { name: 'Wallet Profile', path: '/wallet', icon: Wallet },
    { name: 'Alerts', path: '/alerts', icon: Bell, badge: '7' },
    { name: 'AI Investigation', path: '/ai-investigation', icon: Bot, badge: 'Copilot' },
    { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
  ];

  const sidebarContent = (
    <aside
      className={`bg-navy-900 border-r border-navy-800 flex flex-col h-screen sticky top-0 z-30 select-none transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Console Brand Header */}
      <div className="p-3.5 border-b border-navy-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm tracking-wider text-white">CRYPTOJASOOS</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                Forensics Console
              </p>
            </div>
          )}
        </div>

        {/* Toggle Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1 rounded-md text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-navy-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-2.5 py-1 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Forensic Suite
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-navy-800 text-white border-l-2 border-blue-500 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </div>

              {!collapsed && item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    item.badge === 'Copilot'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-navy-950 text-white text-xs rounded shadow-xl border border-navy-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Bottom — DEMO MODE Status */}
      <div className="p-2 border-t border-navy-800">
        <div className="bg-navy-950 p-2.5 rounded-md border border-navy-800">
          {!collapsed ? (
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  DEMO MODE
                </span>
                <span className="text-[9px] font-mono text-slate-400 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20">
                  Simulated
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Blockchain Data — Simulated</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Risk Engine — Demo</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>AI Assistant — Demo</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1" title="DEMO MODE: Simulated Data">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:block">{sidebarContent}</div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-sm flex">
          <div className="w-60 max-w-full">{sidebarContent}</div>
          <div className="flex-1" onClick={onMobileClose} />
        </div>
      )}
    </>
  );
};
