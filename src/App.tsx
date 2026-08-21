import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { AnalyzeWallet } from './pages/AnalyzeWallet';
import { FlowExplorer } from './pages/FlowExplorer';
import { WalletProfile } from './pages/WalletProfile';
import { Alerts } from './pages/Alerts';
import { AIInvestigation } from './pages/AIInvestigation';
import { Reports } from './pages/Reports';
import { Toast, ToastMessage } from './components/common/Toast';

export const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 't-1',
      type: 'info',
      title: 'DEMO MODE ACTIVE',
      message: 'Simulated blockchain data active for demonstration.'
    }
  ]);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-navy-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white antialiased">
        {/* Left Sidebar (Desktop Persistent & Mobile Drawer) */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analyze" element={<AnalyzeWallet />} />
              <Route path="/flow-explorer" element={<FlowExplorer />} />
              <Route path="/wallet" element={<WalletProfile />} />
              <Route path="/wallet/:address" element={<WalletProfile />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/ai-investigation" element={<AIInvestigation />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>

        {/* Toast Notifications */}
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    </Router>
  );
};

export default App;
