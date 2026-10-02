import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink,
  ArrowRight,
  FileText
} from 'lucide-react';
import { OfficialReceipt } from '../types';

interface OfficialReceiptModalProps {
  receipt: OfficialReceipt | null;
  onClose: () => void;
  lang?: 'ru' | 'en';
}

export const OfficialReceiptModal: React.FC<OfficialReceiptModalProps> = ({
  receipt,
  onClose,
  lang = 'ru',
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!receipt) return null;

  const handleCopy = () => {
    const textToCopy = `Квитанция: ${receipt.receiptId}\nTX Hash: ${receipt.txHash}\nСумма: ${receipt.sourceAmount} ${receipt.sourceCurrency} -> ${receipt.targetAmount} ${receipt.targetCurrency}\nКурс: ${receipt.appliedRate}\nПодпись HMAC-SHA256: ${receipt.digitalSignature}\nСтатус: ${receipt.status}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate clean text/HTML receipt export
    const receiptContent = `
================================================================================
                    APEX FINTECH VIRTUAL NEOBANK
           ОФИЦИАЛЬНАЯ БАНКОВСКАЯ И КРИПТОГРАФИЧЕСКАЯ КВИТАНЦИЯ
================================================================================
Номер квитанции:     ${receipt.receiptId}
Дата и время:        ${new Date(receipt.timestamp).toLocaleString()}
Тип операции:        ${receipt.operationType}
Статус:              ${receipt.status}
--------------------------------------------------------------------------------
ОТПРАВИТЕЛЬ:
Имя / Субъект:       ${receipt.senderName}
Счет / Кошелек:      ${receipt.senderAccount}

ПОЛУЧАТЕЛЬ:
Имя / Субъект:       ${receipt.receiverName}
Счет / Кошелек:      ${receipt.receiverAccount}
--------------------------------------------------------------------------------
ДЕТАЛИЗАЦИЯ СУММЫ И КОНВЕРТАЦИИ:
Списано:             ${receipt.sourceAmount.toLocaleString()} ${receipt.sourceCurrency}
Зачислено:           ${receipt.targetAmount.toLocaleString()} ${receipt.targetCurrency}
Примененный курс:    1 ${receipt.sourceCurrency} = ${receipt.appliedRate} ${receipt.targetCurrency}
Комиссия банка:      $${receipt.bankFee.toFixed(2)} USD (0.00%)
Сетевой сбор:        ${receipt.networkFee} ${receipt.sourceCurrency}
--------------------------------------------------------------------------------
КРИПТОГРАФИЧЕСКАЯ БЕЗОПАСНОСТЬ:
TX Hash:             ${receipt.txHash}
ЭЦП HMAC-SHA256:     ${receipt.digitalSignature}
Нотариальная печать: ${receipt.bankNotarySeal}
Юридическое лицо:    ${receipt.legalEntity}
Налоговый номер:     ${receipt.vatTaxNumber}
================================================================================
Настоящий электронный документ имеет юридическую силу согласно стандарту DLT 2026.
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${receipt.receiptId}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 font-mono">
                {lang === 'ru' ? 'Официальная Квитанция об Операции' : 'Official Transaction Receipt'}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                {receipt.receiptId} • {receipt.operationType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Печать квитанции"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              title="Скачать квитанцию"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable/Viewable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200 font-sans print:p-0 print:text-black">
          {/* Bank Brand Header & Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold font-mono tracking-wider text-amber-400">
                  APEX FINTECH
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                  VIRTUAL NEOBANK
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Лицензия FINMA & VASP Regulated #FT-2026-CH • SWIFT: APEXCHZZ
              </p>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                {receipt.legalEntity} • Tax ID: {receipt.vatTaxNumber}
              </p>
            </div>

            {/* Verification Status Badge */}
            <div className="flex flex-col items-end">
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-xs font-mono font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{receipt.status}</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono mt-1">
                {new Date(receipt.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Transfer Summary Display */}
          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
            <div className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider mb-2">
              {lang === 'ru' ? 'Результат конвертации / проводки' : 'Conversion & Settlement Result'}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-zinc-400">{lang === 'ru' ? 'Списано:' : 'Sent:'}</span>
                <div className="text-xl font-bold font-mono text-zinc-100">
                  {receipt.sourceAmount.toLocaleString()} <span className="text-amber-400">{receipt.sourceCurrency}</span>
                </div>
              </div>

              <div className="hidden sm:flex items-center text-zinc-500">
                <ArrowRight className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-zinc-400">{lang === 'ru' ? 'Зачислено:' : 'Received:'}</span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {receipt.targetAmount.toLocaleString()} <span className="text-emerald-300">{receipt.targetCurrency}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">{lang === 'ru' ? 'Фиксированный курс:' : 'Applied Rate:'}</span>
              <span className="text-zinc-200 font-semibold">
                1 {receipt.sourceCurrency} = {receipt.appliedRate} {receipt.targetCurrency}
              </span>
            </div>
          </div>

          {/* Counterparties Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800/60 space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                {lang === 'ru' ? 'Отправитель (Счет списания)' : 'Sender (Debit Account)'}
              </div>
              <div className="text-sm font-semibold text-zinc-200">{receipt.senderName}</div>
              <div className="text-xs font-mono text-zinc-400 break-all">{receipt.senderAccount}</div>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800/60 space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                {lang === 'ru' ? 'Получатель (Счет зачисления)' : 'Receiver (Credit Account)'}
              </div>
              <div className="text-sm font-semibold text-zinc-200">{receipt.receiverName}</div>
              <div className="text-xs font-mono text-zinc-400 break-all">{receipt.receiverAccount}</div>
            </div>
          </div>

          {/* Fees & Execution Details */}
          <div className="space-y-1.5 text-xs font-mono text-zinc-400 bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/40">
            <div className="flex justify-between">
              <span>{lang === 'ru' ? 'Комиссия виртуального банка:' : 'Virtual Bank Fee:'}</span>
              <span className="text-emerald-400 font-semibold">$0.00 (0% Institutional Promo)</span>
            </div>
            <div className="flex justify-between">
              <span>{lang === 'ru' ? 'Сетевой сбор (Gas / Mining):' : 'Network Fee (Gas / Mining):'}</span>
              <span className="text-zinc-300">{receipt.networkFee} {receipt.sourceCurrency}</span>
            </div>
            {receipt.notes && (
              <div className="flex justify-between pt-1 border-t border-zinc-800/60">
                <span>{lang === 'ru' ? 'Назначение платежа:' : 'Payment Memo:'}</span>
                <span className="text-zinc-300 text-right max-w-[65%]">{receipt.notes}</span>
              </div>
            )}
          </div>

          {/* Security & Cryptographic Stamp / QR */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-emerald-900/40 flex flex-col sm:flex-row items-center gap-4">
            {/* Dynamic QR Code */}
            <div className="w-24 h-24 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 shadow-md">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(receipt.qrPayload)}`}
                alt="Receipt QR"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Cryptographic Signatures */}
            <div className="flex-1 space-y-1.5 w-full">
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'ru' ? 'КРИПТОГРАФИЧЕСКАЯ ПОДПИСЬ HMAC-SHA256' : 'HMAC-SHA256 DIGITAL NOTARY'}</span>
              </div>

              <div className="text-[11px] font-mono text-zinc-400 break-all">
                <span className="text-zinc-500">TX Hash: </span>
                <span className="text-zinc-300">{receipt.txHash}</span>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 break-all">
                <span>Sig: </span>
                <span className="text-amber-400/90">{receipt.digitalSignature}</span>
              </div>

              {/* Notary Seal */}
              <div className="pt-2">
                <span className="inline-block text-[9px] font-mono uppercase px-2 py-0.5 rounded border border-emerald-600/40 bg-emerald-950/40 text-emerald-300">
                  🛡️ {receipt.bankNotarySeal}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (lang === 'ru' ? 'Скопировано!' : 'Copied!') : (lang === 'ru' ? 'Скопировать реквизиты' : 'Copy Payload')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? (lang === 'ru' ? 'Сохранено!' : 'Downloaded!') : (lang === 'ru' ? 'Скачать квитанцию (TXT/PDF)' : 'Download Receipt')}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
            >
              {lang === 'ru' ? 'Закрыть' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
