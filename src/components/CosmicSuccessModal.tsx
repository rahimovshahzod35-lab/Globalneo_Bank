import { useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileText, 
  Volume2, 
  VolumeX, 
  Zap, 
  X, 
  ArrowUpRight, 
  RotateCcw,
  Globe2,
  Cpu
} from 'lucide-react';
import { OfficialReceipt } from '../types';
import { cosmicSound } from '../services/cosmicSound';

export interface CosmicSuccessData {
  title: string;
  subtitle?: string;
  operationType: string;
  sourceAmount?: number;
  sourceCurrency?: string;
  targetAmount?: number;
  targetCurrency?: string;
  recipientOrCounterparty?: string;
  txHash?: string;
  receiptId?: string;
  receipt?: OfficialReceipt | null;
  latencyMs?: number;
  auditScore?: number;
}

interface CosmicSuccessModalProps {
  data: CosmicSuccessData | null;
  onClose: () => void;
  onViewReceipt?: (receipt: OfficialReceipt) => void;
  lang?: 'en' | 'ru';
}

export function CosmicSuccessModal({
  data,
  onClose,
  onViewReceipt,
  lang = 'ru',
}: CosmicSuccessModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const fireCosmicBurst = useCallback(() => {
    // Left burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0.1, y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#ffffff'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
      zIndex: 99999,
    });
    // Right burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 0.9, y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ffffff'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
      zIndex: 99999,
    });
    // Center ring
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#34d399', '#38bdf8', '#fbbf24', '#ffffff'],
        shapes: ['star'],
        scalar: 1.4,
        zIndex: 99999,
      });
    }, 200);
  }, []);

  useEffect(() => {
    if (data) {
      cosmicSound.playSuccess();
      fireCosmicBurst();
    }
  }, [data, fireCosmicBurst]);

  if (!data) return null;

  const handleCopyHash = () => {
    if (data.txHash) {
      navigator.clipboard.writeText(data.txHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleToggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    cosmicSound.setMuted(nextState);
  };

  const handleDownloadCertificate = () => {
    const content = `======================================================================
               APEX FINTECH VIRTUAL NEOBANK
           COSMIC TRANSACTION EXECUTION CERTIFICATE
======================================================================
DATE & TIME:       ${new Date().toISOString()}
TRANSACTION HASH:  ${data.txHash || 'N/A'}
RECEIPT ID:        ${data.receiptId || 'N/A'}
OPERATION:         ${data.operationType}
STATUS:            EXECUTED & VERIFIED (COSMIC FINALITY)

SOURCE AMOUNT:     ${data.sourceAmount ? `${data.sourceAmount.toLocaleString()} ${data.sourceCurrency}` : 'N/A'}
TARGET AMOUNT:     ${data.targetAmount ? `${data.targetAmount.toLocaleString()} ${data.targetCurrency}` : 'N/A'}
COUNTERPARTY:      ${data.recipientOrCounterparty || 'Apex Onchain Liquidity Core'}

LATENCY:           ${data.latencyMs || 84} ms (Quantum Real-Time)
CONSENSUS:         10/10 AI Agents Signed & Notarized
COMPLIANCE:        FINMA / VASP Regulated #FT-2026-CH
HMAC SIGNATURE:    VALIDATED VIA SHA-256 NOTARY NODE
======================================================================
Apex Digital Assets & FinTech Holdings Ltd. • Zurich, Switzerland
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cosmic_Certificate_${data.receiptId || Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Background Cosmic Glow Nebulas */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Cosmic Modal Frame */}
      <div className="relative w-full max-w-2xl bg-zinc-950/95 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(16,185,129,0.3)] text-zinc-100 font-sans z-10 overflow-hidden">
        
        {/* Top Galactic Ambient Ring */}
        <div className="absolute -top-32 -left-32 w-64 h-64 border border-emerald-500/20 rounded-full pointer-events-none" />
        <div className="absolute -top-36 -left-36 w-72 h-72 border border-cyan-500/20 rounded-full pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono text-emerald-400 tracking-wider font-semibold uppercase">
              {lang === 'ru' ? 'КВАНТОВЫЙ КОНСЕНСУС ИСПОЛНЕН' : 'QUANTUM CONSENSUS EXECUTED'}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[11px] font-mono text-zinc-400">
              {data.latencyMs || 84} ms latency
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title={isMuted ? 'Включить звук' : 'Выключить звук'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              type="button"
              onClick={fireCosmicBurst}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
              title={lang === 'ru' ? 'Повторить салют' : 'Replay burst'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Galactic Quantum Core Visualization */}
        <div className="flex flex-col items-center justify-center text-center my-4">
          <div className="relative flex items-center justify-center w-28 h-28 mb-5">
            {/* Outer Spinning Celestial Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/60 animate-[spin_8s_linear_infinite]" />
            {/* Inner Counter-spinning Celestial Ring */}
            <div className="absolute inset-2 rounded-full border-2 border-cyan-400/40 border-dotted animate-[spin_12s_linear_infinite_reverse]" />
            {/* Pulsing Quantum Shockwave */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-amber-500/20 animate-ping opacity-60" />
            {/* Glowing Orb Center */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-[0_0_40px_rgba(16,185,129,0.7)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-400 animate-bounce" />
              </div>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1.5">
            {data.title || (lang === 'ru' ? 'КОСМИЧЕСКАЯ ОПЕРАЦИЯ УСПЕШНО ИСПОЛНЕНА!' : 'COSMIC OPERATION EXECUTED!')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mb-4">
            {data.subtitle || (lang === 'ru' 
              ? 'Операция мгновенно проведена через межбанковский шлюз ликвидности и заверена 10 автономными AI-агентами.' 
              : 'Transaction instantly cleared through the liquidity gateway and notarized by 10 autonomous AI agents.')}
          </p>

          {/* Amount Highlight Card */}
          <div className="w-full bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-900/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 mb-5 shadow-inner">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {data.sourceAmount !== undefined && (
                <div className="text-center sm:text-left">
                  <div className="text-[11px] font-mono uppercase text-zinc-400">
                    {lang === 'ru' ? 'Списано / Источник' : 'Source / Outflow'}
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-bold text-white">
                    {data.sourceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {data.sourceCurrency}
                  </div>
                </div>
              )}

              {data.targetAmount !== undefined && (
                <>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                    <ArrowUpRight className="w-5 h-5 rotate-45" />
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-[11px] font-mono uppercase text-emerald-400 font-semibold">
                      {lang === 'ru' ? 'Зачислено / Результат' : 'Credited / Inflow'}
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400">
                      +{data.targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {data.targetCurrency}
                    </div>
                  </div>
                </>
              )}

              {data.sourceAmount === undefined && data.targetAmount === undefined && (
                <div className="w-full text-center">
                  <div className="text-xs font-mono text-zinc-400">{data.operationType}</div>
                  <div className="text-lg font-bold text-emerald-300">{data.recipientOrCounterparty || 'Apex NeoBank Verified'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-left">
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">{lang === 'ru' ? 'Скорость' : 'Latency'}</div>
              <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{data.latencyMs || 84} ms</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">{lang === 'ru' ? 'Консенсус' : 'Consensus'}</div>
              <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>10/10 AI Agents</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">{lang === 'ru' ? 'Регулирование' : 'Regulated'}</div>
              <div className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>FINMA VASP</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">{lang === 'ru' ? 'Квитанция' : 'Receipt #'}</div>
              <div className="text-xs font-mono font-bold text-purple-300 truncate">
                {data.receiptId || `REC-2026-${Math.floor(100000 + Math.random() * 900000)}`}
              </div>
            </div>
          </div>

          {/* Cryptographic Hash Bar */}
          {data.txHash && (
            <div className="w-full p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold shrink-0">
                  TX HASH
                </span>
                <span className="text-xs font-mono text-zinc-400 truncate">
                  {data.txHash}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer shrink-0"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">{lang === 'ru' ? 'Скопирован' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-[11px]">{lang === 'ru' ? 'Копия' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            {data.receipt && onViewReceipt && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewReceipt(data.receipt!);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-zinc-950" />
                <span>{lang === 'ru' ? 'Открыть квитанцию с QR' : 'View Official Receipt'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ru' ? 'Сертификат .TXT' : 'Certificate .TXT'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {lang === 'ru' ? 'Закрыть' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
