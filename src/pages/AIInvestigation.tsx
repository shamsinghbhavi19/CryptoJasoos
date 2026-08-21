import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Shield,
  ShieldAlert,
  GitMerge,
  FileSpreadsheet,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MOCK_AI_CONVERSATION, MOCK_WALLETS } from '../data/mockData';
import { AIMessage } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { AddressCopy } from '../components/common/AddressCopy';

export const AIInvestigation: React.FC = () => {
  const navigate = useNavigate();

  const activeWallet = MOCK_WALLETS['0x82A7656EC7ab88b098defB751B7401B5f6d8976F'];

  const [messages, setMessages] = useState<AIMessage[]>(MOCK_AI_CONVERSATION);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'Why is this wallet risky?',
    'Where did the funds go?',
    'Show suspicious wallets',
    'Explain the transaction flow',
    'Summarize this investigation',
    'Generate investigation report'
  ];

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = '';
      let evidenceItems: any[] = [];

      const q = promptText.toLowerCase();

      if (q.includes('why') || q.includes('risky')) {
        aiText = `Target wallet ${activeWallet.address.slice(0, 8)}... was evaluated with a Risk Score of ${activeWallet.riskScore}/100 (HIGH RISK) based on four specific behavioral indicators:\n\n1. Rapid Transfer Velocity: 82% of incoming funds were redistributed within 12 minutes of arrival.\n2. Mixer Interactivity: Direct deposits routed through Tornado Cash 100 ETH pool.\n3. Circular Looping: Funds returned to originator via intermediate hop address 0x3F9A...2B1.\n4. Sanctions Co-Location: Associated with OFAC SDN list cluster #SDN-ETH-98412.`;
        evidenceItems = [
          { type: 'wallet', label: 'Target Wallet', value: activeWallet.address, riskLevel: 'high' },
          { type: 'mixer', label: 'Tornado Cash Pool', value: '0x47ac0fb3F2D84898e4D9E7b4DaB3C24507a6D503', riskLevel: 'critical' }
        ];
      } else if (q.includes('where') || q.includes('funds') || q.includes('flow')) {
        aiText = `Forensic tracing across 4 hop layers reveals the total $248,420 USD moved along two primary channels:\n\n• Off-Ramp Channel ($117,000 USD): Transferred via Peel-Chain Hop B to Kraken Hot Wallet (0x9A48...1C2).\n• Mixer Channel ($131,420 USD): Deposited into Tornado Cash, with subsequent anonymized exits linked to Hydra Darknet vendor (bc1qxy...0wlh).`;
        evidenceItems = [
          { type: 'entity', label: 'VASP Off-Ramp', value: 'Kraken Hot Wallet (0x9A48...1C2)', riskLevel: 'low' },
          { type: 'entity', label: 'Darknet Vendor', value: 'Hydra Vendor (bc1qxy...0wlh)', riskLevel: 'critical' }
        ];
      } else if (q.includes('report') || q.includes('summarize')) {
        aiText = `FORENSIC SUMMARY REPORT FOR CASE CF-2026-014:\n\n• Target Address: ${activeWallet.address}\n• Risk Score: ${activeWallet.riskScore}/100 (HIGH RISK)\n• Primary Pattern: Rapid Multi-Hop Peeling + Anonymizing Mixer Funneling\n• Recommended Legal Action: Submit formal FinCEN SAR filing and issue emergency freeze request to exchange off-ramp Kraken.`;
        evidenceItems = [
          { type: 'entity', label: 'Case Reference', value: 'CF-2026-014', riskLevel: 'high' }
        ];
      } else {
        aiText = `Based on current blockchain evidence, address ${activeWallet.address.slice(0, 8)}... exhibits suspicious transaction behavior with an overall threat score of ${activeWallet.riskScore}/100. Additional multi-hop graph analysis is recommended.`;
      }

      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidenceItems
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-purple-400" />
            <span>AI Investigation Assistant</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              Copilot v2.4
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous blockchain forensic assistant for querying multi-hop networks, explaining threat scores, and drafting SAR evidence.
          </p>
        </div>
      </div>

      {/* Current Case Context Box */}
      <div className="bg-navy-900 border border-navy-800 p-4 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Active Case Context
            </span>
            <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mt-0.5">
              <span>CF-2026-014: Lazarus Exploit Sub-Cluster</span>
              <RiskBadge level={activeWallet.riskLevel} score={activeWallet.riskScore} size="sm" />
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] block">Target Address:</span>
            <AddressCopy address={activeWallet.address} />
          </div>
          <div className="h-6 w-px bg-navy-800" />
          <div>
            <span className="text-slate-400 text-[10px] block">Txs Count:</span>
            <span className="font-bold text-white">{activeWallet.transactionCount}</span>
          </div>
          <div className="h-6 w-px bg-navy-800" />
          <div>
            <span className="text-slate-400 text-[10px] block">Hop Wallets:</span>
            <span className="font-bold text-white">{activeWallet.connectedWalletsCount}</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-navy-950 text-slate-200 border border-navy-800 rounded-tl-none shadow-inner'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Structured Evidence Items */}
                {msg.evidenceItems && msg.evidenceItems.length > 0 && (
                  <div className="pt-2 border-t border-navy-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider font-mono">
                      Extracted Evidence References:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {msg.evidenceItems.map((ev, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800 flex items-center justify-between font-mono text-[11px]"
                        >
                          <span className="text-slate-400">{ev.label}:</span>
                          <span className="text-slate-200 font-bold">{ev.value}</span>
                          {ev.riskLevel && <RiskBadge level={ev.riskLevel} size="sm" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[10px] opacity-60 text-right font-mono">{msg.timestamp}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  AV
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-purple-400 font-mono animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>AI Copilot analyzing transaction network lineage...</span>
            </div>
          )}
        </div>

        {/* Quick Questions Buttons */}
        <div className="pt-4 border-t border-navy-800 space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 font-mono">
              Quick Questions:
            </span>
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendPrompt(q)}
                className="px-3 py-1.5 bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs rounded-xl border border-navy-800 whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputPrompt);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask questions about the current transaction network, risk score, or hop lineage..."
              className="flex-1 bg-navy-950 border border-navy-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 font-sans"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim()}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
