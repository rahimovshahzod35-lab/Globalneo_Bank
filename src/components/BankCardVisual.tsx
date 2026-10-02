import { useState } from 'react';
import { Wifi, Copy, Check, Lock, Unlock, ShieldAlert, Cpu } from 'lucide-react';
import { IssuedCard, CardType } from '../types';

interface BankCardVisualProps {
  card: Partial<IssuedCard> | null;
  cardType?: CardType;
  fullName?: string;
  isProcessing?: boolean;
  isComplianceRejected?: boolean;
  assignedLimit?: number;
  lang?: 'en' | 'ru';
  onToggleFreeze?: (appId: string) => void;
}

export function BankCardVisual({
  card,
  cardType = 'VIRTUAL_DEBIT',
  fullName = 'SHAHZOD RAHIMOV',
  isProcessing = false,
  isComplianceRejected = false,
  assignedLimit = 0,
  lang = 'ru',
  onToggleFreeze,
}: BankCardVisualProps) {
  const [showBack, setShowBack] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const displayType = card?.card_type || cardType;
  const displayName = (card?.full_name || fullName || 'AUTHORIZED CARDHOLDER').toUpperCase();
  const displayPan = card?.card_number_masked || '4000 12XX XXXX ••••';
  const displayExpiry = card?.expiry_date || '09/31';
  const displayIban = card?.iban || 'GB89GLOB••••••••••••••';
  const displayAppId = card?.application_id || 'GAP-PENDING';
  const isFrozen = card?.is_frozen ?? false;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Card background styling based on card type
  const getCardStyle = () => {
    if (isComplianceRejected) {
      return 'from-rose-950/90 via-zinc-900 to-zinc-950 border-rose-500/40 shadow-rose-950/50';
    }
    if (isFrozen) {
      return 'from-cyan-950/60 via-zinc-900 to-zinc-950 border-cyan-500/30 shadow-cyan-950/40';
    }
    switch (displayType) {
      case 'CORPORATE_CREDIT':
        return 'from-zinc-900 via-amber-950/30 to-zinc-950 border-amber-500/40 shadow-amber-950/30';
      case 'PHYSICAL_DEBIT':
        return 'from-zinc-800 via-zinc-900 to-zinc-950 border-zinc-600/50 shadow-black/60';
      case 'VIRTUAL_DEBIT':
      default:
        return 'from-emerald-950/40 via-zinc-900 to-zinc-950 border-emerald-500/30 shadow-emerald-950/30';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* 3D-like perspective container */}
      <div 
        className="w-full max-w-[420px] aspect-[1.586/1] relative cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.01]"
        onClick={() => !isProcessing && setShowBack(prev => !prev)}
        title={lang === 'ru' ? 'Нажмите для переворота карты' : 'Click to flip card'}
      >
        <div
          className={`w-full h-full rounded-2xl border p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-500 shadow-2xl bg-gradient-to-br ${getCardStyle()}`}
        >
          {/* Subtle background circuit pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Front of Card */}
          {!showBack ? (
            <>
              {/* Top Row: Bank Name + Chip/NFC */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                    <span className="text-amber-300 font-black text-xs font-mono">GB</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-widest text-zinc-100 font-mono">
                      GLOBAL BANK
                    </div>
                    <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                      {displayType.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-zinc-400 rotate-90" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-700 bg-zinc-900/80 text-zinc-300 font-medium">
                    {displayType === 'CORPORATE_CREDIT' ? 'COMMERCIAL' : 'RETAIL'}
                  </span>
                </div>
              </div>

              {/* Middle Section: EMV Chip + Status Indicator */}
              <div className="flex items-center justify-between z-10 my-1">
                <div className="flex items-center gap-3">
                  {/* EMV Chip */}
                  <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-inner flex items-center justify-center">
                    <div className="w-full h-full border border-amber-700/60 rounded flex flex-col justify-around px-1 py-0.5 opacity-85">
                      <div className="h-[1px] bg-amber-900/50 w-full" />
                      <div className="h-[1px] bg-amber-900/50 w-full" />
                      <div className="h-[1px] bg-amber-900/50 w-full" />
                    </div>
                  </div>

                  {isProcessing && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono animate-pulse">
                      <Cpu className="w-3 h-3 animate-spin" />
                      <span>{lang === 'ru' ? 'ЭМИССИЯ...' : 'ISSUING...'}</span>
                    </div>
                  )}

                  {isComplianceRejected && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-mono">
                      <ShieldAlert className="w-3 h-3" />
                      <span>{lang === 'ru' ? '403 KYC ОТКЛОНЕН' : '403 KYC REJECTED'}</span>
                    </div>
                  )}

                  {isFrozen && !isComplianceRejected && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono">
                      <Lock className="w-3 h-3" />
                      <span>{lang === 'ru' ? 'ЗАМОРОЖЕНА' : 'FROZEN'}</span>
                    </div>
                  )}
                </div>

                {displayType === 'CORPORATE_CREDIT' && (
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-zinc-500 block">
                      {lang === 'ru' ? 'КРЕДИТНЫЙ ЛИМИТ' : 'CREDIT LIMIT'}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      ${(card?.assigned_limit ?? assignedLimit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>

              {/* Masked PAN (Card Number) */}
              <div className="z-10 tracking-widest font-mono text-lg sm:text-xl font-bold text-zinc-100 drop-shadow flex items-center justify-between">
                <span>{displayPan}</span>
              </div>

              {/* Bottom Row: Cardholder Name, Expiry, Brand */}
              <div className="flex items-end justify-between z-10 pt-1">
                <div>
                  <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                    {lang === 'ru' ? 'ДЕРЖАТЕЛЬ КАРТЫ' : 'CARDHOLDER'}
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-zinc-200 tracking-wide truncate max-w-[200px]">
                    {displayName}
                  </div>
                </div>

                <div className="text-center px-3">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                    {lang === 'ru' ? 'СРОК' : 'EXP'}
                  </div>
                  <div className="text-xs font-mono font-bold text-zinc-200">
                    {displayExpiry}
                  </div>
                </div>

                {/* Brand Logo */}
                <div className="flex items-center gap-1">
                  {displayType === 'CORPORATE_CREDIT' ? (
                    <div className="flex items-center -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-rose-500/90 shadow" />
                      <div className="w-6 h-6 rounded-full bg-amber-400/90 shadow" />
                    </div>
                  ) : (
                    <div className="italic font-black text-base text-zinc-100 tracking-tighter px-1">
                      VISA
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Back of Card */
            <div className="flex flex-col justify-between h-full z-10">
              {/* Magnetic stripe */}
              <div className="-mx-6 -mt-2 h-10 bg-zinc-950 border-y border-zinc-800" />

              {/* Signature stripe and CVV */}
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1 h-7 bg-zinc-200/90 rounded-sm px-3 flex items-center justify-between text-zinc-900 font-mono text-xs italic">
                    <span className="text-[10px] text-zinc-500 not-italic">AUTHORIZED SIGNATURE</span>
                    <span className="font-bold tracking-widest">{card?.cvv || '742'}</span>
                  </div>
                </div>
                <div className="text-[9px] font-mono text-zinc-500">
                  CVV / CVC2 security validation key (HMAC generated)
                </div>
              </div>

              {/* IBAN & Application ID */}
              <div className="border-t border-zinc-800 pt-2 space-y-1 text-[10px] font-mono text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>IBAN:</span>
                  <span className="text-zinc-200 font-bold">{displayIban}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>APP ID:</span>
                  <span className="text-amber-400">{displayAppId}</span>
                </div>
              </div>

              <div className="text-[8px] font-mono text-zinc-600 text-center">
                GLOBAL BANK AUTONOMOUS CORE • CLICK TO ROTATE TO FRONT
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions / Copy Bar */}
      {card && card.status === 'ISSUED_AND_ACTIVE' && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs font-mono">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(displayIban, 'iban');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 transition-colors"
          >
            {copiedField === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>IBAN: {displayIban.substring(0, 10)}...</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(displayPan, 'pan');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 transition-colors"
          >
            {copiedField === 'pan' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>PAN</span>
          </button>

          {onToggleFreeze && card.application_id && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFreeze(card.application_id!);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                isFrozen 
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30' 
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}
            >
              {isFrozen ? <Unlock className="w-3.5 h-3.5 text-cyan-300" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isFrozen ? (lang === 'ru' ? 'Разморозить' : 'Unfreeze') : (lang === 'ru' ? 'Заморозить' : 'Freeze')}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
