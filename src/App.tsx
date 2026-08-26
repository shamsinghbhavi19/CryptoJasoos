import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TopNavbar } from './components/layout/TopNavbar';
import { Dashboard } from './pages/Dashboard';
import { AnalyzeWallet } from './pages/AnalyzeWallet';
import { FlowExplorer } from './pages/FlowExplorer';
import { WalletProfile } from './pages/WalletProfile';
import { Alerts } from './pages/Alerts';
import { AIInvestigation } from './pages/AIInvestigation';
import { Reports } from './pages/Reports';
import { Toast, ToastMessage } from './components/common/Toast';

export const App: React.FC = () => {
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
      <div className="min-h-screen bg-navy-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white antialiased flex flex-col">
        {/* Top Navbar Header (Feature tabs at top instead of left sidebar) */}
        <TopNavbar />

        {/* Main Content View Area */}
        <main className="flex-1">
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

        {/* Toast Notifications */}
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    </Router>
  );
};

export default App;
