import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Repeat, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  Globe, 
  Sparkles, 
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { WalletAccount, OfficialReceipt } from '../types';
import { AUTH_USER, SUPPORTED_CURRENCIES } from '../services/fintechEngine';

interface FintechWalletsViewProps {
  wallets: WalletAccount[];
  onNavigateToSwap: (fromCurrency?: string) => void;
  onDeposit: (currency: string, amount: number, network?: string) => { receipt: OfficialReceipt; updatedWallet: WalletAccount };
  onViewReceipt: (receipt: OfficialReceipt) => void;
  lang?: 'ru' | 'en';
}

export const FintechWalletsView: React.FC<FintechWalletsViewProps> = ({
  wallets,
  onNavigateToSwap,
  onDeposit,
  onViewReceipt,
  lang = 'ru',
}) => {
  const [selectedWallet, setSelectedWallet] = useState<WalletAccount | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositCurrency, setDepositCurrency] = useState('USDT');
  const [depositAmount, setDepositAmount] = useState('5000');
  const [depositNetwork, setDepositNetwork] = useState('TRC-20');
  const [copied, setCopied] = useState(false);
  const [currencyFilter, setCurrencyFilter] = useState<'ALL' | 'CRYPTO' | 'FIAT' | 'CBDC'>('ALL');

  // Compute total net worth in USD
  const totalNetWorthUSD = wallets.reduce((acc, w) => acc + w.usdValue, 0);

  // Filter wallets
  const filteredWallets = wallets.filter(w => {
    if (currencyFilter === 'ALL') return true;
    return w.category === currencyFilter;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    const result = onDeposit(depositCurrency, amt, depositNetwork);
    setIsDepositModalOpen(false);
    if (result && result.receipt) {
      onViewReceipt(result.receipt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Banner */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
                VIRTUAL FINTECH ACCOUNT • VERIFIED MASTER
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                {AUTH_USER.tier}
              </span>
            </div>

            <div className="text-xs font-mono text-zinc-400">
              {lang === 'ru' ? 'Общий баланс портфеля (Net Worth USD):' : 'Total Portfolio Net Worth:'}
            </div>

            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-zinc-100 tracking-tight flex items-baseline gap-2">
              <span>${totalNetWorthUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1 font-sans">
                <TrendingUp className="w-4 h-4" />
                <span>+4.2% (24ч)</span>
              </span>
            </div>

            <div className="text-xs font-mono text-zinc-400 flex flex-wrap items-center gap-3 pt-1">
              <span>Владелец: <strong className="text-zinc-200">{AUTH_USER.fullName}</strong></span>
              <span>•</span>
              <span>Организация: <strong className="text-zinc-200">{AUTH_USER.corporateEntity}</strong></span>
              <span>•</span>
              <span className="text-emerald-400">IBAN: {AUTH_USER.primaryIban}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setDepositCurrency('USDT');
                setIsDepositModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Пополнить баланс' : 'Deposit Assets'}</span>
            </button>

            <button
              onClick={() => onNavigateToSwap()}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono font-semibold text-xs flex items-center gap-2 border border-zinc-700 transition-all cursor-pointer"
            >
              <Repeat className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ru' ? 'Авто-свап / Обмен' : 'Instant Swap'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Accounts Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold font-mono text-zinc-100 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ru' ? 'Мультивалютные счета и кошельки' : 'Multi-Currency & Crypto Accounts'}</span>
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs font-mono">
            {wallets.length} {lang === 'ru' ? 'активов' : 'assets'}
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 font-mono text-xs">
          {(['ALL', 'CRYPTO', 'FIAT', 'CBDC'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCurrencyFilter(cat)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                currencyFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat === 'ALL' ? (lang === 'ru' ? 'Все' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWallets.map((wallet) => (
          <div
            key={wallet.id}
            onClick={() => setSelectedWallet(wallet)}
            className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/40 transition-all cursor-pointer space-y-4 group shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-emerald-400 font-mono font-bold text-base group-hover:scale-105 transition-transform">
                  {wallet.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-zinc-100 font-mono">{wallet.currency}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400">
                      {wallet.category}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 truncate max-w-[170px]">{wallet.name}</div>
                </div>
              </div>

              <div className={`text-xs font-mono font-semibold ${wallet.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {wallet.change24h >= 0 ? `+${wallet.change24h}%` : `${wallet.change24h}%`}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xl font-bold font-mono text-zinc-100">
                {wallet.balance.toLocaleString()} <span className="text-xs text-zinc-400">{wallet.currency}</span>
              </div>
              <div className="text-xs font-mono text-zinc-500">
                ≈ ${wallet.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </div>
            </div>

            {/* Address / IBAN snippet */}
            <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="truncate max-w-[190px]">
                {wallet.iban || wallet.address || 'APEX CUSTODY LEDGER'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(wallet.iban || wallet.address || wallet.id);
                }}
                className="text-zinc-500 hover:text-emerald-400 transition-colors p-1"
                title="Скопировать реквизиты"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action Bar inside Card */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs font-mono">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToSwap(wallet.currency);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>{lang === 'ru' ? 'Свапнуть' : 'Swap'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDepositCurrency(wallet.currency);
                  setIsDepositModalOpen(true);
                }}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {lang === 'ru' ? 'Пополнить' : 'Top-up'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Quick Deposit / Top-Up */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-100 font-mono flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ru' ? 'Пополнение счета / адреса' : 'Deposit Assets'}</span>
              </h3>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">
                  {lang === 'ru' ? 'Выберите валюту пополнения:' : 'Select Asset:'}
                </label>
                <select
                  value={depositCurrency}
                  onChange={(e) => setDepositCurrency(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">
                  {lang === 'ru' ? 'Сумма пополнения:' : 'Amount:'}
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500 text-base font-bold"
                />
              </div>

              {/* QR Code and Deposit Address */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center gap-3 text-center">
                <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-md">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      AUTH_USER.usdtTrc20Address
                    )}`}
                    alt="QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-full space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase">Адрес для зачисления ({depositCurrency}):</span>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-emerald-400 break-all select-all flex items-center justify-between gap-2">
                    <span>{AUTH_USER.usdtTrc20Address}</span>
                    <button
                      onClick={() => handleCopy(AUTH_USER.usdtTrc20Address)}
                      className="text-zinc-400 hover:text-white shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirmDeposit}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold text-xs shadow-lg transition-colors cursor-pointer"
              >
                {lang === 'ru' ? 'Подтвердить зачисление и выдать квитанцию' : 'Confirm Deposit & Issue Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
