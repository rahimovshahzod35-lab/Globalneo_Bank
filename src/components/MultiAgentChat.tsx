import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Users, 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Scale, 
  BookCheck, 
  Globe, 
  Coins, 
  KeyRound, 
  BellRing, 
  Eye, 
  TrendingUp, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  ArrowRight, 
  Activity,
  Sliders,
  ChevronDown,
  ChevronUp,
  Lock,
  Compass
} from 'lucide-react';
import { 
  BankAgent, 
  MultiAgentChatMessage, 
  MultiAgentReport, 
  MultiAgentDirectivePreset 
} from '../types';
import { 
  MultiAgentChatOrchestrator, 
  MULTI_AGENT_DIRECTIVES, 
  INITIAL_CHAT_MESSAGES 
} from '../services/multiAgentChatService';

interface MultiAgentChatProps {
  agents: BankAgent[];
  masterKey: string;
  lang: 'en' | 'ru';
}

const AGENT_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  monitor: TrendingUp,
  economist: ShieldAlert,
  lawyer: Scale,
  accountant: BookCheck,
  swift: Globe,
  sanctions: UserCheck,
  fraud: Eye,
  treasury: Coins,
  audit: KeyRound,
  dispatcher: BellRing,
};

const AGENT_COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  monitor: { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-800/60', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
  economist: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/60', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  lawyer: { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-800/60', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
  accountant: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/60', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  swift: { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-800/60', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
  sanctions: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/60', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
  fraud: { bg: 'bg-orange-950/40', text: 'text-orange-400', border: 'border-orange-800/60', badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30' },
  treasury: { bg: 'bg-yellow-950/40', text: 'text-yellow-400', border: 'border-yellow-800/60', badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' },
  audit: { bg: 'bg-indigo-950/40', text: 'text-indigo-400', border: 'border-indigo-800/60', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
  dispatcher: { bg: 'bg-teal-950/40', text: 'text-teal-400', border: 'border-teal-800/60', badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30' },
};

export const MultiAgentChat: React.FC<MultiAgentChatProps> = ({
  agents,
  masterKey,
  lang,
}) => {
  const orchestrator = useMemo(() => new MultiAgentChatOrchestrator(masterKey), [masterKey]);

  const [messages, setMessages] = useState<MultiAgentChatMessage[]>(() => {
    const saved = localStorage.getItem('globalbank_agent_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CHAT_MESSAGES;
      }
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [inputText, setInputText] = useState('');
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [requireControllerApproval, setRequireControllerApproval] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [copiedReportId, setCopiedReportId] = useState<string | null>(null);
  const [isDirectivesOpen, setIsDirectivesOpen] = useState(true);
  const [pendingActionScenario, setPendingActionScenario] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRu = lang === 'ru';

  // Save messages to local storage
  useEffect(() => {
    try {
      localStorage.setItem('globalbank_agent_chat_messages', JSON.stringify(messages.slice(-50)));
    } catch (e) {
      console.error('Failed to cache chat messages:', e);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDeliberating]);

  // Run a preset directive
  const handleRunDirective = async (preset: MultiAgentDirectivePreset) => {
    if (isDeliberating) return;
    setIsDeliberating(true);
    setPendingActionScenario(preset.title);

    try {
      await orchestrator.executeDirective(preset.id, {
        requireControllerApproval,
        lang,
        delayMs: 260,
        onMessage: (newMsg) => {
          if (newMsg.agentId) {
            setActiveSpeakerId(newMsg.agentId);
          }
          setMessages((prev) => [...prev, newMsg]);
        },
      });
    } catch (err) {
      console.error('Directive run error:', err);
    } finally {
      setIsDeliberating(false);
      setActiveSpeakerId(null);
    }
  };

  // Submit custom prompt from input
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || isDeliberating) return;

    setInputText('');
    setIsDeliberating(true);
    setPendingActionScenario(cleanText);

    try {
      await orchestrator.handleUserPrompt(cleanText, {
        requireControllerApproval,
        lang,
        delayMs: 260,
        onMessage: (newMsg) => {
          if (newMsg.agentId) {
            setActiveSpeakerId(newMsg.agentId);
          }
          setMessages((prev) => [...prev, newMsg]);
        },
      });
    } catch (err) {
      console.error('User prompt error:', err);
    } finally {
      setIsDeliberating(false);
      setActiveSpeakerId(null);
    }
  };

  // Controller Decision (Human-in-the-loop)
  const handleControllerAction = async (action: 'approved' | 'vetoed' | 'delegated') => {
    if (isDeliberating) return;
    setIsDeliberating(true);

    try {
      const scenarioTitle = pendingActionScenario || 'Executive Transaction Review';
      const followupMessages = await orchestrator.handleControllerDecision(action, scenarioTitle, lang);
      setMessages((prev) => [...prev, ...followupMessages]);
      setPendingActionScenario(null);
    } catch (err) {
      console.error('Controller decision error:', err);
    } finally {
      setIsDeliberating(false);
      setActiveSpeakerId(null);
    }
  };

  // Clear chat
  const handleClearChat = () => {
    if (window.confirm(isRu ? 'Очистить протокол диалога агентов?' : 'Clear agent council transcript?')) {
      setMessages(INITIAL_CHAT_MESSAGES);
      localStorage.removeItem('globalbank_agent_chat_messages');
    }
  };

  // Copy report
  const handleCopyReport = (report: MultiAgentReport) => {
    const text = `
=== GLOBAL BANK EXECUTIVE MULTI-AGENT REPORT ===
ID: ${report.reportId}
Title: ${report.title}
Subject: ${report.targetSubject}
Verdict: ${report.overallVerdict}
Timestamp: ${report.timestamp}

SUMMARY:
${report.executiveSummary}

KEY METRICS:
${report.metrics.map(m => `- ${m.label}: ${m.value}`).join('\n')}

AGENT CONSENSUS VOTES:
${report.agentVotes.map(v => `[${v.vote}] ${v.agentName}: ${v.comment}`).join('\n')}

SECURITY AUDIT PROOF:
Algorithm: ${report.securityProof.hashAlg}
HMAC Signature: ${report.securityProof.hmacSignature}
Status: ${report.securityProof.verified ? 'CERTIFIED & VALID' : 'FAILED'}

ACTION ITEMS:
${report.actionItems.map(a => `* ${a}`).join('\n')}
================================================
    `.trim();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedReportId(report.reportId);
      setTimeout(() => setCopiedReportId(null), 2500);
    }
  };

  // Download entire transcript
  const handleExportTranscript = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(messages, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `globalbank_multiagent_council_${Date.now()}.json`);
    dl.click();
  };

  // Add mention to input
  const handleAddMention = (agentName: string) => {
    setInputText((prev) => {
      const prefix = prev.length > 0 && !prev.endsWith(' ') ? `${prev} ` : prev;
      return `${prefix}@${agentName} `;
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Control Deck */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100 font-mono tracking-tight flex items-center gap-2">
                <span>{isRu ? 'ОБЩИЙ ЧАТ С МУЛЬТИАГЕНТАМИ' : 'MULTI-AGENT COMMAND CENTER'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  {isRu ? '10 АГЕНТОВ В СВЯЗКЕ' : '10 AGENTS LINKED'}
                </span>
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              {isRu
                ? 'Единая шина коммуникации. Вы выступаете в роли Председателя Правления (Контролера): отдавайте директивы, наблюдайте за межагентным консилиумом и получайте сводный криптографический отчёт.'
                : 'Central inter-agent communication bus. As Chief Controller & Chairman, issue operational directives, supervise agent-to-agent debate, and receive certified executive reports.'}
            </p>
          </div>

          {/* Controller Settings Strip */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Human-in-the-loop toggle */}
            <button
              id="btn-toggle-approval"
              type="button"
              onClick={() => setRequireControllerApproval(!requireControllerApproval)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
                requireControllerApproval
                  ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                  : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:text-zinc-200'
              }`}
              title={isRu ? 'Агенты запросят вашу финальную резолюцию перед проводкой' : 'Require human approval before finalizing'}
            >
              {requireControllerApproval ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{isRu ? 'Виза Контролера:' : 'Chairman Approval:'}</span>
              <span className={`font-bold ${requireControllerApproval ? 'text-amber-300' : 'text-zinc-400'}`}>
                {requireControllerApproval ? (isRu ? 'ВКЛЮЧЕНА' : 'ENABLED') : (isRu ? 'АВТОМАТ' : 'AUTO')}
              </span>
            </button>

            {/* Export transcript */}
            <button
              id="btn-export-chat"
              type="button"
              onClick={handleExportTranscript}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title={isRu ? 'Экспорт протокола в JSON' : 'Export transcript as JSON'}
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{isRu ? 'Экспорт' : 'Export'}</span>
            </button>

            {/* Clear chat */}
            <button
              id="btn-clear-chat"
              type="button"
              onClick={handleClearChat}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-red-950/50 border border-zinc-700/60 hover:border-red-700/60 text-zinc-400 hover:text-red-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              title={isRu ? 'Очистить историю чата' : 'Clear chat history'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 10 Autonomous Agents Live Strip */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <div className="text-[11px] font-mono text-zinc-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRu ? 'Статус консилиума (нажмите на агента для @обращения):' : 'Council Agents (click to @mention):'}</span>
            </span>
            {isDeliberating && (
              <span className="text-amber-400 flex items-center gap-1 text-[10px] animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {isRu ? 'Агенты ведут межагентный обмен данными...' : 'Agents cross-examining data...'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
            {agents.map((ag) => {
              const IconComp = AGENT_ICON_MAP[ag.id] || Bot;
              const colorInfo = AGENT_COLOR_MAP[ag.id] || {
                bg: 'bg-zinc-800',
                text: 'text-zinc-300',
                border: 'border-zinc-700',
                badge: 'bg-zinc-800 text-zinc-300',
              };
              const isSpeaking = activeSpeakerId === ag.id;

              return (
                <button
                  key={ag.id}
                  id={`agent-strip-${ag.id}`}
                  type="button"
                  onClick={() => handleAddMention(ag.name)}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                    isSpeaking
                      ? 'ring-2 ring-amber-400 bg-amber-950/50 border-amber-400'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/50'
                  }`}
                  title={`${ag.name} (${ag.role}) - ${ag.system_prompt}`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${colorInfo.bg} ${colorInfo.text}`}>
                      <IconComp className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold truncate text-zinc-200">
                      {ag.name.replace('Agent', '')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 mt-1">
                    <span className="truncate">{ag.category.split(' ')[0]}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preset Directives Shelf (Collapsible) */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
        <button
          id="btn-toggle-directives"
          type="button"
          onClick={() => setIsDirectivesOpen(!isDirectivesOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-mono font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer bg-zinc-900/90"
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{isRu ? 'БЫСТРЫЕ ДИРЕКТИВЫ КОНТРОЛЕРА (ГОТОВЫЕ СЦЕНАРИИ КОНСИЛИУМА)' : 'EXECUTIVE DIRECTIVES (ONE-CLICK SCENARIOS)'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              5
            </span>
          </span>
          {isDirectivesOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {isDirectivesOpen && (
          <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 bg-zinc-950/40 border-t border-zinc-800/80">
            {MULTI_AGENT_DIRECTIVES.map((preset) => (
              <div
                key={preset.id}
                id={`preset-${preset.id}`}
                className="p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-2.5 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {preset.category}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-amber-300 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isDeliberating}
                  onClick={() => handleRunDirective(preset)}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-amber-500/20 hover:text-amber-300 border border-zinc-700 hover:border-amber-500/40 text-zinc-300 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isRu ? 'Запустить консилиум' : 'Dispatch Council'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Interactive Chat Stream */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[650px] shadow-2xl">
        {/* Messages Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-sm">
          {messages.map((msg, idx) => {
            // System Announcement
            if (msg.senderType === 'system') {
              return (
                <div key={msg.id || idx} className="flex justify-center my-2">
                  <div className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono flex items-center gap-2 max-w-xl text-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{msg.content}</span>
                  </div>
                </div>
              );
            }

            // User / Chairman Message
            if (msg.senderType === 'user') {
              return (
                <div key={msg.id || idx} className="flex justify-end">
                  <div className="max-w-2xl w-full bg-gradient-to-r from-zinc-900 to-zinc-900/90 border border-amber-500/40 rounded-2xl rounded-tr-sm p-4 shadow-lg">
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-zinc-800/80 font-mono text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="font-bold text-amber-300">
                          {isRu ? 'ПРЕДСЕДАТЕЛЬ КОНСИЛИУМА (КОНТРОЛЕР)' : 'SUPREME CONTROLLER / CHAIRMAN'}
                        </span>
                      </div>
                      <span className="text-zinc-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            }

            // Agent Message
            const agentColors = msg.agentId ? AGENT_COLOR_MAP[msg.agentId] : null;
            const AgentIcon = msg.agentId ? (AGENT_ICON_MAP[msg.agentId] || Bot) : Bot;

            return (
              <div key={msg.id || idx} className="flex justify-start">
                <div className="max-w-3xl w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl rounded-tl-sm p-4 shadow-md space-y-3">
                  {/* Agent Header & Hand-off Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${agentColors?.bg || 'bg-zinc-800'} ${agentColors?.text || 'text-zinc-300'} border ${agentColors?.border || 'border-zinc-700'}`}>
                        <AgentIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-100">{msg.agentName}</span>
                          {msg.role && (
                            <span className="text-[10px] text-zinc-400 hidden sm:inline">
                              ({msg.role})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      {/* Recipient / Target badge */}
                      {msg.recipientName && (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1">
                          <span className="text-zinc-400">➔</span>
                          <span className="text-amber-300 font-semibold">{msg.recipientName}</span>
                        </span>
                      )}

                      <span className="text-zinc-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap pl-1">
                    {msg.content}
                  </div>

                  {/* Hand-off Alert if present */}
                  {msg.handOffTo && (
                    <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>{isRu ? 'Эстафета консилиума передана:' : 'Hand-off delegated to:'}</span>
                      <span className="font-semibold text-amber-300">@{msg.handOffTo.toUpperCase()}</span>
                    </div>
                  )}

                  {/* Attached Executive Report if present */}
                  {msg.reportData && (
                    <div className="mt-4 pt-3 border-t border-zinc-800">
                      <div className="rounded-xl border border-zinc-700/80 bg-zinc-950 p-4 sm:p-5 shadow-2xl space-y-4">
                        {/* Report Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                          <div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-amber-400" />
                              <h3 className="text-sm sm:text-base font-bold text-zinc-100 font-mono tracking-tight">
                                {msg.reportData.title}
                              </h3>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                              ID: {msg.reportData.reportId} | {new Date(msg.reportData.timestamp).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Verdict Badge */}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border ${
                                msg.reportData.overallVerdict === 'APPROVED'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600/60'
                                  : msg.reportData.overallVerdict === 'REJECTED'
                                  ? 'bg-red-950 text-red-300 border-red-600/60'
                                  : 'bg-amber-950 text-amber-300 border-amber-600/60'
                              }`}
                            >
                              {msg.reportData.overallVerdict === 'APPROVED' ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : msg.reportData.overallVerdict === 'REJECTED' ? (
                                <XCircle className="w-3.5 h-3.5" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5" />
                              )}
                              <span>{msg.reportData.overallVerdict}</span>
                            </span>

                            {/* Copy Report Button */}
                            <button
                              id={`btn-copy-report-${msg.reportData.reportId}`}
                              type="button"
                              onClick={() => handleCopyReport(msg.reportData!)}
                              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                              title={isRu ? 'Скопировать весь отчет' : 'Copy report'}
                            >
                              {copiedReportId === msg.reportData.reportId ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">{isRu ? 'Скопировано' : 'Copied'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                  <span>{isRu ? 'Копия' : 'Copy'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Executive Summary Box */}
                        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90 space-y-1.5">
                          <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                            {isRu ? 'СИНТЕЗИРОВАННОЕ ЗАКЛЮЧЕНИЕ КОНСИЛИУМА:' : 'EXECUTIVE CONSENSUS SUMMARY:'}
                          </div>
                          <p className="text-xs text-zinc-200 leading-relaxed">
                            {msg.reportData.executiveSummary}
                          </p>
                        </div>

                        {/* Metrics Grid */}
                        <div>
                          <div className="text-[11px] font-mono text-zinc-400 mb-2">
                            {isRu ? 'КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ РИСКА И ЛИКВИДНОСТИ:' : 'KEY RISK & FINANCIAL METRICS:'}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                            {msg.reportData.metrics.map((metric, mIdx) => (
                              <div
                                key={mIdx}
                                className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between"
                              >
                                <span className="text-[10px] text-zinc-400">{metric.label}</span>
                                <span
                                  className={`text-xs font-bold mt-1 ${
                                    metric.status === 'good'
                                      ? 'text-emerald-400'
                                      : metric.status === 'bad'
                                      ? 'text-red-400'
                                      : metric.status === 'warn'
                                      ? 'text-amber-400'
                                      : 'text-zinc-200'
                                  }`}
                                >
                                  {metric.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Agent Consensus Table */}
                        <div>
                          <div className="text-[11px] font-mono text-zinc-400 mb-2">
                            {isRu ? 'РЕЗУЛЬТАТЫ ГОЛОСОВАНИЯ И АРГУМЕНТАЦИЯ (10 АГЕНТОВ):' : 'COUNCIL VOTING & ARGUMENTATION (10 AGENTS):'}
                          </div>
                          <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800/80 text-xs font-mono">
                            {msg.reportData.agentVotes.map((vote, vIdx) => (
                              <div
                                key={vIdx}
                                className="p-2 sm:px-3 bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      vote.vote === 'APPROVED'
                                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                                        : vote.vote === 'REJECTED'
                                        ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                                        : 'bg-zinc-800 text-zinc-300'
                                    }`}
                                  >
                                    {vote.vote}
                                  </span>
                                  <span className="font-semibold text-zinc-200">{vote.agentName}</span>
                                </div>
                                <span className="text-zinc-400 text-[11px] sm:text-right">
                                  {vote.comment}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cryptographic Proof Strip */}
                        <div className="p-3 rounded-xl bg-zinc-900/90 border border-indigo-900/40 font-mono text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-indigo-400">
                            <span className="flex items-center gap-1.5 font-bold">
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>{isRu ? 'СЕРТИФИКАТ ЦЕЛОСТНОСТИ HMAC-SHA256:' : 'HMAC-SHA256 FORENSIC SEAL:'}</span>
                            </span>
                            <span className="text-emerald-400 font-semibold">{isRu ? 'ВЕРИФИЦИРОВАНО' : 'VERIFIED'}</span>
                          </div>
                          <div className="p-2 rounded bg-black/60 border border-zinc-800 text-[11px] text-amber-300/90 break-all select-all font-mono">
                            {msg.reportData.securityProof.hmacSignature}
                          </div>
                        </div>

                        {/* Action Items */}
                        {msg.reportData.actionItems.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-mono text-zinc-400">
                              {isRu ? 'РЕКОМЕНДУЕМЫЕ ДЕЙСТВИЯ ДЛЯ КОНТРОЛЕРА:' : 'ACTION ITEMS FOR CONTROLLER:'}
                            </div>
                            <ul className="space-y-1 text-xs text-zinc-300">
                              {msg.reportData.actionItems.map((item, itIdx) => (
                                <li key={itIdx} className="flex items-start gap-2">
                                  <span className="text-amber-400 font-bold">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pending Human Controller Action Box */}
          {pendingActionScenario && !isDeliberating && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/60 shadow-xl space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>{isRu ? 'ТРЕБУЕТСЯ РЕЗОЛЮЦИЯ ПРЕДСЕДАТЕЛЯ КОНСИЛИУМА (ВЫ):' : 'CHAIRMAN RESOLUTION REQUIRED (YOU):'}</span>
              </div>
              <p className="text-xs text-zinc-300">
                {isRu
                  ? `Агенты завершили коллегиальный анализ по запросу: "${pendingActionScenario}". Реестр ожидает вашей электронной визы для проведения или блокировки операции.`
                  : `Agents concluded deliberation on: "${pendingActionScenario}". Awaiting your executive veto or signature.`}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleControllerAction('approved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-emerald-950/50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRu ? 'УТВЕРДИТЬ И ПОДПИСАТЬ HMAC' : 'APPROVE & SIGN HMAC'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleControllerAction('vetoed')}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-red-950/50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{isRu ? 'НАЛОЖИТЬ ВЕТО' : 'IMPOSE VETO'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleControllerAction('delegated')}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>{isRu ? 'Направить на доработку' : 'Request Further Review'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Typing / Deliberation Indicator */}
          {isDeliberating && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 max-w-sm">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{isRu ? 'Консилиум мультиагентов в процессе дебатов...' : 'Council deliberating and exchanging data...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Mentions */}
        <div className="p-3 sm:p-4 bg-zinc-900 border-t border-zinc-800 space-y-2.5">
          {/* Quick Mention Toolbar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono">
            <span className="text-zinc-500 text-[11px] whitespace-nowrap mr-1">
              {isRu ? 'Адресовать:' : 'Target:'}
            </span>
            <button
              type="button"
              onClick={() => handleAddMention('all')}
              className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap cursor-pointer transition-colors"
            >
              @all
            </button>
            {agents.map((ag) => (
              <button
                key={ag.id}
                type="button"
                onClick={() => handleAddMention(ag.name)}
                className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap cursor-pointer transition-colors"
              >
                @{ag.name.replace('Agent', '')}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              id="multi-agent-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isRu
                  ? 'Введите директиву для консилиума (например: "Проверить транзакцию на 500,000 USD" или "@LawyerAgent...")'
                  : 'Enter directive for the council (e.g. "Run stress test on EUR liquidity" or "@SanctionsScreener...")'
              }
              disabled={isDeliberating}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors font-sans disabled:opacity-50"
            />

            <button
              id="btn-send-agent-prompt"
              type="submit"
              disabled={isDeliberating || !inputText.trim()}
              className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{isRu ? 'Отправить' : 'Dispatch'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
