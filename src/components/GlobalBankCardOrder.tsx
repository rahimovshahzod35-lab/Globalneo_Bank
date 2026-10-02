import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldAlert, 
  RotateCcw, 
  Wallet, 
  Sparkles, 
  Copy, 
  Check, 
  AlertTriangle,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { cardApiFetch } from '../services/apiMock';
import { AUTH_USER } from '../services/fintechEngine';

interface GlobalBankCardOrderProps {
  onCardIssued?: (data: any) => void;
  onViewVault?: () => void;
  isEmbedded?: boolean;
}

export default function GlobalBankCardOrder({ 
  onCardIssued, 
  onViewVault,
  isEmbedded = false 
}: GlobalBankCardOrderProps) {
  const [formData, setFormData] = useState({
    userId: AUTH_USER.id,
    fullName: AUTH_USER.fullName,
    email: AUTH_USER.email,
    taxId: AUTH_USER.taxId,
    accountType: 'CRYPTO_CUSTODY_VAULT',
    cardType: 'VIRTUAL_DEBIT',
    requestedCreditLimit: 0,
    primaryCurrency: 'USDT',
    autoConvertCrypto: true,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await cardApiFetch('/api/v1/cards/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (!response.ok || data.status === 'REJECTED_BY_COMPLIANCE' || data.detail) {
        setResult(data);
        if (data.detail) {
          setErrorMessage(data.detail);
        }
      } else {
        setResult(data);
        onCardIssued?.(data);
      }
    } catch (err) {
      console.error("Issuing error:", err);
      setErrorMessage("Network or server connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  const handleApplyPreset = (preset: 'apex_usdt' | 'apex_corporate' | 'apex_private_metal') => {
    if (preset === 'apex_usdt') {
      setFormData({
        userId: AUTH_USER.id,
        fullName: AUTH_USER.fullName,
        email: AUTH_USER.email,
        taxId: AUTH_USER.taxId,
        accountType: 'CRYPTO_CUSTODY_VAULT',
        cardType: 'VIRTUAL_DEBIT',
        requestedCreditLimit: 0,
        primaryCurrency: 'USDT',
        autoConvertCrypto: true,
      });
    } else if (preset === 'apex_corporate') {
      setFormData({
        userId: AUTH_USER.id,
        fullName: `${AUTH_USER.fullName} (${AUTH_USER.corporateEntity})`,
        email: AUTH_USER.email,
        taxId: AUTH_USER.taxId,
        accountType: 'CORPORATE_SETTLEMENT',
        cardType: 'CORPORATE_CREDIT',
        requestedCreditLimit: 50000,
        primaryCurrency: 'USD',
        autoConvertCrypto: false,
      });
    } else if (preset === 'apex_private_metal') {
      setFormData({
        userId: AUTH_USER.id,
        fullName: AUTH_USER.fullName,
        email: AUTH_USER.email,
        taxId: AUTH_USER.taxId,
        accountType: 'CRYPTO_CUSTODY_VAULT',
        cardType: 'PHYSICAL_DEBIT',
        requestedCreditLimit: 0,
        primaryCurrency: 'USDT',
        autoConvertCrypto: true,
      });
    }
  };

  const isRejected = result && (result.status === 'REJECTED_BY_COMPLIANCE' || errorMessage);

  return (
    <div className={`${isEmbedded ? 'w-full py-2' : 'min-h-screen bg-slate-950 text-white flex items-center justify-center p-6'} font-sans`}>
      <div className="w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white">APEX FINTECH | Card Core</h1>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 hidden sm:inline">
            POST /api/v1/cards/issue
          </span>
        </div>

        {/* Preset quick test buttons */}
        {!result && (
          <div className="mb-5 p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Быстрый выбор конфигурации карты:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                id="btn-preset-usdt"
                onClick={() => handleApplyPreset('apex_usdt')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-800/40 transition-colors cursor-pointer"
              >
                Apex USDT Crypto Visa
              </button>
              <button
                type="button"
                id="btn-preset-corp"
                onClick={() => handleApplyPreset('apex_corporate')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-900/40 transition-colors cursor-pointer"
              >
                Corporate Commercial ($50k)
              </button>
              <button
                type="button"
                id="btn-preset-metal"
                onClick={() => handleApplyPreset('apex_private_metal')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-900/40 transition-colors cursor-pointer"
              >
                Private Black Metal (Web3)
              </button>
            </div>
          </div>
        )}

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">ФИО Держателя</label>
              <input
                id="input-fullName"
                type="text"
                required
                value={formData.fullName}
                placeholder="Shahzod Rahimov"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email</label>
                <input
                  id="input-email"
                  type="email"
                  required
                  value={formData.email}
                  placeholder="rahimovshahzod35@gmail.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Налоговый ID / ИНН</label>
                <input
                  id="input-taxId"
                  type="text"
                  required
                  value={formData.taxId}
                  placeholder="CHE-492.810.339"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Тип аккаунта</label>
                <select
                  id="select-accountType"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                >
                  <option value="CRYPTO_CUSTODY_VAULT">CRYPTO CUSTODY VAULT (USDT / Web3)</option>
                  <option value="PERSONAL_FINTECH">PERSONAL FINTECH (EUR / USD)</option>
                  <option value="CORPORATE_SETTLEMENT">CORPORATE SETTLEMENT (Institutional)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Тип карты</label>
                <select
                  id="select-cardType"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  value={formData.cardType}
                  onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                >
                  <option value="VIRTUAL_DEBIT">VIRTUAL DEBIT (Visa Infinite)</option>
                  <option value="CORPORATE_CREDIT">CORPORATE CREDIT (Mastercard Commercial)</option>
                  <option value="PHYSICAL_DEBIT">PHYSICAL METAL CARD</option>
                </select>
              </div>
            </div>

            {formData.cardType === 'CORPORATE_CREDIT' && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Запрашиваемый кредитный лимит ($)</label>
                <input
                  id="input-creditLimit"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.requestedCreditLimit}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, requestedCreditLimit: Number(e.target.value) })}
                />
              </div>
            )}

            <button
              id="btn-submit-order"
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold p-3.5 rounded-lg flex items-center justify-center space-x-2 transition-all mt-6 shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Проверка комплаенс и генерация IBAN...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Мгновенно выпустить карту Apex FinTech</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-in fade-in">
            {isRejected ? (
              <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-5 text-rose-200">
                <div className="flex items-center space-x-3 mb-3">
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                  <h3 className="font-bold text-lg text-rose-300">Отказ Комплаенс (HTTP 403 Forbidden)</h3>
                </div>
                <p className="text-sm text-rose-200/90 mb-2">
                  {errorMessage || result.detail || 'Заявка отклонена алгоритмом комплаенс-контроля.'}
                </p>
                <div className="font-mono text-xs bg-rose-950/80 p-3 rounded border border-rose-900/60 text-rose-300 space-y-1">
                  <div>Status: {result.status || 'REJECTED_BY_COMPLIANCE'}</div>
                  <div>Tax ID Flag: {formData.taxId}</div>
                  <div>Jurisdiction: Offshore Blacklist Check</div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/90 border border-emerald-900/40 rounded-xl p-5 text-emerald-300 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-mono font-bold text-white text-base">Карта успешно выпущена</span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
                    HTTP 201 Created
                  </span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400">Application ID:</span>
                    <span className="text-white font-bold">{result.application_id}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400">IBAN:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-400 font-bold">{result.iban}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(result.iban, 'iban')}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        {copiedKey === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400">Маска PAN:</span>
                    <span className="text-white font-bold tracking-wider">{result.card_number_masked}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400">Лимит:</span>
                    <span className="text-amber-400 font-bold">${result.assigned_limit?.toLocaleString() || '0'} USD</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setErrorMessage(null);
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Новая заявка</span>
              </button>

              {onViewVault && !isRejected && (
                <button
                  type="button"
                  onClick={onViewVault}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer text-xs shadow-md"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Открыть портфель карт</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
