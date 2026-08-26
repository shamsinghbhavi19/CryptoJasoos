import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Wallet,
  Bell,
  Bot,
  FileSpreadsheet,
  Shield,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface TopNavbarProps {
  activeSection?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ activeSection = 'dashboard' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Combined Feature Navigation Items (Analyze Wallet & Flow Explorer unified as Wallet Analyzer)
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { id: 'wallet-analyzer', name: 'Wallet Analyzer', path: '/wallet-analyzer', icon: Search },
    { id: 'wallet', name: 'Wallet Profile', path: '/wallet', icon: Wallet },
    { id: 'alerts', name: 'Alerts', path: '/alerts', icon: Bell, badge: '7' },
    { id: 'ai-investigation', name: 'AI Assistant', path: '/ai-investigation', icon: Bot, badge: 'Copilot' },
    { id: 'reports', name: 'Reports', path: '/reports', icon: FileSpreadsheet },
  ];

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPosition) {
          setCurrentSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler to target section
  const handleNavClick = (itemId: string, path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetEl = document.getElementById(itemId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentSection(itemId);
    } else {
      navigate(path);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const analyzeEl = document.getElementById('wallet-analyzer');
    if (analyzeEl) {
      analyzeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/wallet-analyzer?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-800 shadow-xl select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Title */}
          <div
            onClick={(e) => handleNavClick('dashboard', '/', e)}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-all shadow-md shadow-blue-500/10">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-base tracking-wider text-white">CRYPTO-JASOOS</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-none">
                Forensics &amp; Crypto Investigation
              </p>
            </div>
          </div>

          {/* Center: Desktop Horizontal Feature Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-navy-950/80 p-1.5 rounded-xl border border-navy-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={(e) => handleNavClick(item.id, item.path, e)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-navy-850'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                        item.badge === 'Copilot'
                          ? 'bg-purple-500/30 text-purple-300'
                          : 'bg-red-500/30 text-red-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Search, Help & DEMO Badge */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="hidden sm:block relative w-48 xl:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Audit address..."
                className="w-full bg-navy-950 border border-navy-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </form>

            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-lg bg-navy-950 border border-navy-800 text-slate-400 hover:text-white transition-colors"
              title="Platform Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* DEMO Indicator Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-mono text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>DEMO MODE</span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-850"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Feature Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-navy-900 border-t border-navy-800 px-4 py-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={(e) => handleNavClick(item.id, item.path, e)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-navy-950 text-slate-300 hover:bg-navy-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Quick Guide Modal */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="Crypto-Jasoos — Top Navigation & Features"
        subtitle="Platform Overview"
      >
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            Welcome to <strong>Crypto-Jasoos</strong>! Scroll vertically down the home page to access all feature modules seamlessly:
          </p>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="p-2 bg-navy-950 rounded border border-navy-800 text-blue-400">1. 3D Hero Frontpage &amp; Command Center (#dashboard)</div>
            <div className="p-2 bg-navy-950 rounded border border-navy-800 text-purple-400">2. Wallet Analyzer (Combined Audit &amp; Flow Explorer Graph) (#wallet-analyzer)</div>
            <div className="p-2 bg-navy-950 rounded border border-navy-800 text-emerald-400">3. Wallet Profile &amp; Risk Rationale (#wallet)</div>
            <div className="p-2 bg-navy-950 rounded border border-navy-800 text-amber-400">4. Security Alerts Engine (#alerts)</div>
            <div className="p-2 bg-navy-950 rounded border border-navy-800 text-indigo-400">5. AI Investigation Assistant (#ai-investigation)</div>
            <div className="p-2 bg-navy-950 rounded border border-navy-800 text-slate-200">6. FinCEN SAR &amp; Forensic Reports (#reports)</div>
          </div>
        </div>
      </Modal>
    </>
  );
};
