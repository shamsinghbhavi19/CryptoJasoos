import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  Shield,
  ArrowRight,
  X,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { BlockchainService } from '../../services/blockchainService';
import { Modal } from '../common/Modal';
import { RiskBadge } from '../common/RiskBadge';

interface HeaderProps {
  onMobileMenuOpen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    wallets: any[];
    transactions: any[];
    cases: any[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Dashboard', breadcrumb: 'Overview & Investigation Center' };
      case '/analyze':
        return { title: 'Analyze Wallet', breadcrumb: 'Check Wallet Risk & Sanctions' };
      case '/flow-explorer':
        return { title: 'Flow Explorer', breadcrumb: 'Visual Transaction Money Flow' };
      case '/wallet':
      case location.pathname.startsWith('/wallet') ? location.pathname : '':
        return { title: 'Wallet Profile', breadcrumb: 'Detailed History & Risk Score' };
      case '/alerts':
        return { title: 'Security Alerts', breadcrumb: 'Suspicious Activity Alerts' };
      case '/ai-investigation':
        return { title: 'AI Assistant', breadcrumb: 'Ask Questions & Get Explanations' };
      case '/reports':
        return { title: 'Reports & Files', breadcrumb: 'Case Reports & Official Filings' };
      default:
        return { title: 'CryptoJasoos AI', breadcrumb: 'Blockchain Intelligence' };
    }
  };

  const pageMeta = getPageMeta();

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim().length > 2) {
      setIsSearching(true);
      setShowSearchDropdown(true);
      const res = await BlockchainService.globalSearch(val);
      setSearchResults(res);
      setIsSearching(false);
    } else {
      setShowSearchDropdown(false);
      setSearchResults(null);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/analyze?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-navy-800 bg-navy-900/90 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMobileMenuOpen}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="text-base font-bold text-white tracking-wide truncate">
              {pageMeta.title}
            </h2>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {pageMeta.breadcrumb}
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchQuery.trim().length > 2 && setShowSearchDropdown(true)}
              placeholder="Search wallet address or transaction hash..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-10 pr-9 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Search Dropdown Results */}
          {showSearchDropdown && searchResults && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-navy-900 border border-navy-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-navy-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Search Results</span>
                {isSearching && <span className="animate-pulse">Searching...</span>}
              </div>

              {/* Wallets section */}
              {searchResults.wallets.length > 0 && (
                <div className="p-2 border-b border-navy-850">
                  <div className="px-2 py-1 text-[10px] font-bold text-blue-400 uppercase">Wallets</div>
                  {searchResults.wallets.map((w) => (
                    <div
                      key={w.address}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        navigate(`/wallet/${encodeURIComponent(w.address)}`);
                      }}
                      className="px-3 py-2 rounded-lg hover:bg-navy-800 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-mono text-slate-200 font-semibold">{w.address.slice(0, 10)}...{w.address.slice(-6)}</div>
                        <div className="text-[11px] text-slate-400">{w.entityName || w.category}</div>
                      </div>
                      <RiskBadge level={w.riskLevel} score={w.riskScore} size="sm" />
                    </div>
                  ))}
                </div>
              )}

              {/* Cases section */}
              {searchResults.cases.length > 0 && (
                <div className="p-2 border-b border-navy-850">
                  <div className="px-2 py-1 text-[10px] font-bold text-purple-400 uppercase">Cases</div>
                  {searchResults.cases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        navigate('/reports');
                      }}
                      className="px-3 py-2 rounded-lg hover:bg-navy-800 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-200">{c.caseNumber}: {c.title}</div>
                        <div className="text-[11px] text-slate-400">{c.entity}</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-800 text-slate-300">
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.wallets.length === 0 && searchResults.cases.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400">
                  No direct match found. Press Enter to audit &quot;{searchQuery}&quot;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifDrawer(!showNotifDrawer)}
            className="p-2 rounded-xl bg-navy-950 border border-navy-800 text-slate-400 hover:text-white hover:border-navy-700 relative transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-xl bg-navy-950 border border-navy-800 text-slate-400 hover:text-white hover:border-navy-700 transition-all hidden sm:flex"
            title="Help & Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-navy-800 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20 border border-blue-400/30">
              AV
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white tracking-wide leading-none">
                Alex Vance
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-none">
                Investigator
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      {showNotifDrawer && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-80 sm:w-96 bg-navy-900 border-l border-navy-800 h-full p-4 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Security Alerts</h3>
              </div>
              <button
                onClick={() => setShowNotifDrawer(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-3">
              <div className="p-3 rounded-xl bg-navy-950 border border-red-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-red-400 uppercase font-mono">Critical Alert</span>
                  <span className="text-[10px] text-slate-400">2 min ago</span>
                </div>
                <h4 className="text-xs font-bold text-white">Circular Flow Detected</h4>
                <p className="text-[11px] text-slate-400 mt-1">Wallet 0x82A7... returned $117,000 USD back to origin node.</p>
                <button
                  onClick={() => {
                    setShowNotifDrawer(false);
                    navigate('/alerts');
                  }}
                  className="mt-2 text-[11px] text-blue-400 font-semibold flex items-center gap-1 hover:underline"
                >
                  View Alert <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-orange-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-orange-400 uppercase font-mono">High Risk</span>
                  <span className="text-[10px] text-slate-400">1 hour ago</span>
                </div>
                <h4 className="text-xs font-bold text-white">Tornado Cash Deposit</h4>
                <p className="text-[11px] text-slate-400 mt-1">100 ETH moved into anonymizing pool.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="CryptoJasoos AI — Easy Quick Guide"
        subtitle="How to use the platform features"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              1. Check Wallet Risk
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Use <strong>Analyze Wallet</strong> to enter any address. The system scores risk from 0 (Safe) to 100 (Critical) and checks OFAC sanctions lists.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              2. Visual Flow Mapping
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Open <strong>Flow Explorer</strong> to trace step-by-step money movements across intermediate addresses and mixers.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800">
            <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              3. Generate Case Reports
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Use <strong>Reports</strong> to create printable case files with transaction evidence for compliance or law enforcement.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
