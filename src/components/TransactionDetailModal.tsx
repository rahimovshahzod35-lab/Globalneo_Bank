import { X, ShieldCheck, ShieldAlert, KeyRound, CheckCircle2, XCircle, Copy, Check } from 'lucide-react';
import { Transaction } from '../types';
import { useState } from 'react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  lang: 'en' | 'ru';
}

export const TransactionDetailModal = ({
  transaction,
  onClose,
  lang,
}: TransactionDetailModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const isExecuted = transaction.status === 'EXECUTED';

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(transaction, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isExecuted ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}>
              {isExecuted ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-zinc-100 flex items-center gap-2">
                <span>{transaction.tx_id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isExecuted ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'
                }`}>
                  {transaction.status}
                </span>
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                {new Date(transaction.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono transition-colors cursor-pointer"
              title="Copy JSON"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs font-mono">
          {/* Amount and FX */}
          <div className="grid grid-cols-2 gap-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Transaction Amount</span>
              <span className="text-base font-bold text-zinc-100">
                {transaction.amount.toLocaleString()} {transaction.currency}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">FX Converted (USD)</span>
              <span className="text-base font-bold text-emerald-400">
                ${transaction.converted_usd?.toLocaleString() || transaction.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* IBAN details */}
          <div className="space-y-2">
            <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80">
              <span className="text-zinc-500 text-[10px] uppercase block">Sender IBAN</span>
              <span className="text-zinc-200 text-xs break-all">{transaction.sender_iban}</span>
            </div>
            <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80">
              <span className="text-zinc-500 text-[10px] uppercase block">Receiver IBAN</span>
              <span className="text-zinc-200 text-xs break-all">{transaction.receiver_iban}</span>
            </div>
            <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">SWIFT / BIC Code</span>
                <span className="text-zinc-200 text-xs">{transaction.swift_code || 'N/A'}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 text-[10px] uppercase block">AML Risk Score</span>
                <span className={`font-bold ${transaction.risk_score > 0.7 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {transaction.risk_score.toFixed(2)} / 1.00
                </span>
              </div>
            </div>
          </div>

          {/* HMAC Signature */}
          <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80">
            <div className="flex items-center gap-1.5 mb-1 text-amber-400 font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>HMAC-SHA256 Cryptographic Signature</span>
            </div>
            <p className="text-[11px] text-amber-300 break-all leading-relaxed">
              {transaction.signature || 'Unsigned'}
            </p>
          </div>

          {/* Approvals */}
          <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-500 text-[10px] uppercase block mb-1.5">Agent Approvals Trail</span>
            <div className="flex flex-wrap gap-1.5">
              {transaction.approvals.length > 0 ? (
                transaction.approvals.map(app => (
                  <span key={app} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]">
                    ✓ {app}
                  </span>
                ))
              ) : (
                <span className="text-rose-400 text-xs">
                  None. Blocked by Compliance ({transaction.rejection_reason || 'High risk AML score'})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
