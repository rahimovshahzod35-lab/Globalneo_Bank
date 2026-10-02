import React, { useState, useMemo } from 'react';
import { 
  ArrowRightLeft, 
  Repeat, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Receipt, 
  TrendingUp, 
  Lock, 
  Settings2, 
  Clock, 
  Zap,
  Check
} from 'lucide-react';
import { WalletAccount, AutoConversionRule, OfficialReceipt } from '../types';
import { SUPPORTED_CURRENCIES, BASE_USD_RATES } from '../services/fintechEngine';

interface AutoConversionSwapTerminalProps {
  wallets: WalletAccount[];
  autoRules: AutoConversionRule[];
  onExecuteConversion: (fromCurrency: string, toCurrency: string, amount: number, slippage: number) => { success: boolean; receipt: OfficialReceipt };
  onToggleRule: (ruleId: string) => void;
  lang?: 'ru' | 'en';
}

export const AutoConversionSwapTerminal: React.FC<AutoConversionSwapTerminalProps> = ({
  wallets,
  autoRules,
  onExecuteConversion,
  onToggleRule,
  lang = 'ru',
}) => {
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USDT');
  const [fromAmount, setFromAmount] = useState<string>('5000');
  const [slippage, setSlippage] = useState<number>(0.1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<OfficialReceipt | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available source wallet
  const sourceWallet = useMemo(() => {
    return wallets.find(w => w.currency === fromCurrency) || { balance: 0, availableBalance: 0 };
  }, [wallets, fromCurrency]);

  // Target wallet
  const targetWallet = useMemo(() => {
    return wallets.find(w => w.currency === toCurrency) || { balance: 0, availableBalance: 0 };
  }, [wallets, toCurrency]);

  // Current rate
  const currentRate = useMemo(() => {
    const fromRateUsd = BASE_USD_RATES[fromCurrency] || 1.0;
    const toRateUsd = BASE_USD_RATES[toCurrency] || 1.0;
    return fromRateUsd / toRateUsd;
  }, [fromCurrency, toCurrency]);

  // Estimated target amount
  const estimatedToAmount = useMemo(() => {
    const num = parseFloat(fromAmount) || 0;
    const gross = num * currentRate;
    const slipDeduction = gross * (slippage / 100) * 0.05;
    return (gross - slipDeduction).toFixed(4);
  }, [fromAmount, currentRate, slippage]);

  // Swap currencies button
  const handleReverseCurrencies = () => {
    const prevFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(prevFrom);
    setErrorMsg(null);
  };

  // Quick percentage buttons
  const handleQuickPercent = (percent: number) => {
    const total = sourceWallet.availableBalance || 0;
    const calculated = (total * (percent / 100)).toFixed(2);
    setFromAmount(calculated);
    setErrorMsg(null);
  };

  // Execute Swap
  const handleSwap = () => {
    setErrorMsg(null);
    const num = parseFloat(fromAmount);
    if (!num || num <= 0) {
      setErrorMsg(lang === 'ru' ? 'Введите корректную сумму для конвертации' : 'Enter valid amount');
      return;
    }
    if (num > (sourceWallet.availableBalance || 0)) {
      setErrorMsg(lang === 'ru' ? 'Недостаточно средств на балансе кошелька' : 'Insufficient funds');
      return;
    }

    setIsExecuting(true);
    setTimeout(() => {
      try {
        const result = onExecuteConversion(fromCurrency, toCurrency, num, slippage);
        if (result && result.receipt) {
          setLastReceipt(result.receipt);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Ошибка исполнения конвертации');
      } finally {
        setIsExecuting(false);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
                INSTANT CROSS-CURRENCY LIQUIDITY ENGINE
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                0% SPREAD MARKUP • SLIPPAGE SHIELD
              </span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 font-mono tracking-tight flex items-center gap-3">
              <ArrowRightLeft className="w-7 h-7 text-emerald-400" />
              <span>{lang === 'ru' ? 'Автоматическая Конвертация и Свап Валют' : 'Auto-Conversion & Multi-Currency Swap'}</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              {lang === 'ru'
                ? 'Мгновенный обмен любых мировых фиатных валют (EUR, USD, GBP, CHF, AED) и криптовалют (USDT, BTC, ETH, TON, SOL) с автоматическим выпуском нотариальной квитанции.'
                : 'Instant cross-currency exchange across all fiat and crypto assets with automated verifiable receipts.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ru' ? 'Скорость исполнения: < 120ms' : 'Execution: < 120ms'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Swap Terminal (Left) & Automated Rules (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SWAP TERMINAL */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-100 font-mono flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ru' ? 'Мгновенный обменный терминал' : 'Instant Exchange Terminal'}</span>
            </h2>

            {/* Slippage Selector */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span className="text-zinc-500 mr-1">{lang === 'ru' ? 'Проскальзывание:' : 'Slippage:'}</span>
              {[0.1, 0.5, 1.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    slippage === s
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>

          {/* From Currency Block */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>{lang === 'ru' ? 'Вы отдаете (Списание):' : 'You Pay:'}</span>
              <span>
                {lang === 'ru' ? 'Доступно:' : 'Available:'}{' '}
                <span className="text-zinc-200 font-semibold">
                  {(sourceWallet.availableBalance || 0).toLocaleString()} {fromCurrency}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => {
                  setFromAmount(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="0.00"
                className="w-full bg-transparent text-2xl font-bold font-mono text-zinc-100 focus:outline-none placeholder-zinc-600"
              />

              <select
                value={fromCurrency}
                onChange={(e) => {
                  setFromCurrency(e.target.value);
                  setErrorMsg(null);
                }}
                className="bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-sm font-mono font-semibold text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer shrink-0"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Percentage Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              {[25, 50, 75, 100].map((p) => (
                <button
                  key={p}
                  onClick={() => handleQuickPercent(p)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 cursor-pointer transition-colors"
                >
                  {p === 100 ? 'MAX' : `${p}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Reverse Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleReverseCurrencies}
              className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={lang === 'ru' ? 'Поменять местами валюты' : 'Reverse currencies'}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* To Currency Block */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>{lang === 'ru' ? 'Вы получаете (Зачисление):' : 'You Receive:'}</span>
              <span>
                {lang === 'ru' ? 'Текущий остаток:' : 'Balance:'}{' '}
                <span className="text-zinc-200 font-semibold">
                  {(targetWallet.availableBalance || 0).toLocaleString()} {toCurrency}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={estimatedToAmount}
                className="w-full bg-transparent text-2xl font-bold font-mono text-emerald-400 focus:outline-none"
              />

              <select
                value={toCurrency}
                onChange={(e) => {
                  setToCurrency(e.target.value);
                  setErrorMsg(null);
                }}
                className="bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-sm font-mono font-semibold text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer shrink-0"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rate and Fee Details */}
          <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800/60 text-xs font-mono space-y-1.5 text-zinc-400">
            <div className="flex justify-between items-center">
              <span>{lang === 'ru' ? 'Гарантированный курс конвертации:' : 'Guaranteed Exchange Rate:'}</span>
              <span className="text-zinc-200 font-semibold">
                1 {fromCurrency} = {currentRate.toFixed(6)} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>{lang === 'ru' ? 'Комиссия виртуального банка:' : 'Bank Service Fee:'}</span>
              <span className="text-emerald-400 font-semibold">$0.00 (0.00% Promo)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{lang === 'ru' ? 'Автоматическая квитанция:' : 'Automated Receipt:'}</span>
              <span className="text-zinc-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ЭЦП SHA-256</span>
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-xs font-mono text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSwap}
            disabled={isExecuting}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold text-sm transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{lang === 'ru' ? 'Исполнение и заверение квитанции...' : 'Executing & Notarizing...'}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>
                  {lang === 'ru' 
                    ? `Мгновенно конвертировать ${fromCurrency} в ${toCurrency}`
                    : `Instant Convert ${fromCurrency} to ${toCurrency}`}
                </span>
              </>
            )}
          </button>
        </div>

        {/* AUTOMATED CONVERSION RULES */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-100 font-mono flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ru' ? 'Авто-Правила Конвертации' : 'Automated Conversion Rules'}</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                24/7 ACTIVE
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {lang === 'ru'
                ? 'Настройте автономное поведение необанка: автоматический свап входящих поступлений, авто-списание USDT при оплате картой или пороговый ребалансинг.'
                : 'Configure automated rules for incoming transfers, POS auto-convert and threshold rebalancing.'}
            </p>

            <div className="space-y-3 font-mono text-xs">
              {autoRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    rule.isActive
                      ? 'bg-zinc-950/80 border-emerald-500/40'
                      : 'bg-zinc-950/40 border-zinc-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>{rule.title}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-sans leading-snug">
                        {rule.description}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold cursor-pointer transition-colors shrink-0 ${
                        rule.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {rule.isActive ? (lang === 'ru' ? 'ВКЛЮЧЕНО' : 'ACTIVE') : (lang === 'ru' ? 'ВЫКЛ' : 'OFF')}
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>
                      {rule.sourceCurrency} ➔ {rule.targetCurrency}
                    </span>
                    <span>
                      {lang === 'ru' ? 'Обработано:' : 'Total:'} ${rule.totalConvertedUSD.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Rate Ticker Matrix */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ru' ? 'Рыночные котировки в реальном времени' : 'Live Cross-Rate Matrix'}</span>
              </span>
              <span className="text-[10px] text-emerald-400 animate-pulse">● LIVE</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">EUR/USD:</span>
                <span className="text-emerald-400 font-bold">1.0850 (+0.3%)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">BTC/USDT:</span>
                <span className="text-emerald-400 font-bold">$64,800 (+2.8%)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">ETH/USDT:</span>
                <span className="text-zinc-200 font-bold">$3,450 (-1.1%)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">TON/USDT:</span>
                <span className="text-emerald-400 font-bold">$5.65 (+4.1%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
