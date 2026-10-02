import { 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  KeyRound, 
  Globe2, 
  Activity, 
  Code2, 
  CreditCard, 
  MessageSquare, 
  FileText, 
  Repeat, 
  UserCheck,
  Wallet
} from 'lucide-react';
import { EngineStats } from '../types';
import { AUTH_USER } from '../services/fintechEngine';

interface HeaderProps {
  stats: EngineStats;
  masterKey: string;
  onOpenChat?: () => void;
  onOpenDocuments?: () => void;
  isProcessing: boolean;
  lang: 'en' | 'ru';
  onToggleLang: () => void;
}

export const Header = ({
  stats,
  masterKey,
  onOpenChat,
  onOpenDocuments,
  isProcessing,
  lang,
  onToggleLang,
}: HeaderProps) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & System Status */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-zinc-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold tracking-wide text-zinc-100 font-mono">
                  APEX FINTECH
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-semibold">
                  VIRTUAL NEOBANK
                </span>
                <button
                  id="btn-header-agents-status"
                  type="button"
                  onClick={onOpenChat}
                  className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-800/50 flex items-center gap-1.5 cursor-pointer transition-colors"
                  title={lang === 'ru' ? 'Открыть командный чат с 10 агентами' : 'Open Multi-Agent Chat'}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lang === 'ru' ? '10 АГЕНТОВ ONLINE' : '10 AGENTS ONLINE'}</span>
                </button>
                {isProcessing && (
                  <span className="px-2 py-0.5 text-[11px] font-mono rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-spin" />
                    {lang === 'ru' ? 'ОБРАБОТКА' : 'EXECUTING'}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                {lang === 'ru'
                  ? 'Мультивалютный виртуальный банк: EUR, USD, USDT, Crypto, Авто-свап и Электронный документооборот'
                  : 'Multi-Currency NeoBank: EUR, USD, USDT, Crypto, Auto-Conversion & Document Flow'}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar & Authentic User Profile */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
            {/* Total Net Worth */}
            <div className="px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center gap-2">
              <span className="text-zinc-500">{lang === 'ru' ? 'ПОРТФЕЛЬ:' : 'ASSETS:'}</span>
              <span className="text-emerald-400 font-bold">
                ${stats.totalNetWorthUSD ? stats.totalNetWorthUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : stats.totalVolumeUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>

            {/* Receipts Count */}
            {onOpenDocuments && (
              <button
                type="button"
                onClick={onOpenDocuments}
                className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex items-center gap-1.5 text-zinc-300 transition-colors cursor-pointer"
                title={lang === 'ru' ? 'Открыть реестр квитанций и документооборот' : 'View Receipts and Documents'}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-zinc-500">{lang === 'ru' ? 'КВИТАНЦИИ:' : 'RECEIPTS:'}</span>
                <span className="text-zinc-100 font-semibold">{stats.totalReceiptsCount || stats.executedCount}</span>
              </button>
            )}

            {/* User Profile Pill (Shahzod Rahimov) */}
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="text-left">
                <div className="text-zinc-200 font-bold truncate max-w-[130px] leading-none">
                  {AUTH_USER.fullName}
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-[130px] leading-none mt-0.5">
                  {AUTH_USER.email}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 ml-auto md:ml-2">
              {onOpenChat && (
                <button
                  id="btn-header-chat"
                  type="button"
                  onClick={onOpenChat}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold shadow-sm"
                  title={lang === 'ru' ? 'Командный чат Консилиума' : 'Multi-Agent Command Chat'}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{lang === 'ru' ? 'Чат Консилиума' : 'Council Chat'}</span>
                </button>
              )}

              <div className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/60 text-emerald-400 font-mono text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline">FINMA #FT-2026-CH</span>
              </div>

              <button
                type="button"
                onClick={onToggleLang}
                className="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                title="Переключить язык (RU/EN)"
              >
                <Globe2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>{lang.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
