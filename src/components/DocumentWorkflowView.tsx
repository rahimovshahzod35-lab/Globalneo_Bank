import React, { useState } from 'react';
import { 
  FileText, 
  Receipt, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Search, 
  Plus, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Hash, 
  FileCheck2, 
  Printer, 
  Lock,
  ArrowRightLeft,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { OfficialReceipt, BankDocument } from '../types';
import { AUTH_USER } from '../services/fintechEngine';
import { OfficialReceiptModal } from './OfficialReceiptModal';

interface DocumentWorkflowViewProps {
  receipts: OfficialReceipt[];
  documents: BankDocument[];
  onGenerateDocument: (category: 'CONTRACT' | 'PROOF_OF_FUNDS' | 'RESERVE_AUDIT' | 'TAX_DECLARATION' | 'CARD_AGREEMENT') => void;
  lang?: 'ru' | 'en';
}

export const DocumentWorkflowView: React.FC<DocumentWorkflowViewProps> = ({
  receipts,
  documents,
  onGenerateDocument,
  lang = 'ru',
}) => {
  const [subTab, setSubTab] = useState<'receipts' | 'documents'>('receipts');
  const [searchQuery, setSearchQuery] = useState('');
  const [receiptFilter, setReceiptFilter] = useState<string>('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState<OfficialReceipt | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<BankDocument | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Filtered receipts
  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = 
      r.receiptId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sourceCurrency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetCurrency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.receiverName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (receiptFilter === 'ALL') return matchesSearch;
    return matchesSearch && r.operationType === receiptFilter;
  });

  // Filtered documents
  const filteredDocuments = documents.filter(d => {
    return d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           d.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
           d.summary.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
                FINTECH E-DOCUMENT SUITE v2.0
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                {AUTH_USER.fintechLicense}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 font-mono tracking-tight flex items-center gap-3">
              <FileCheck2 className="w-7 h-7 text-emerald-400" />
              <span>{lang === 'ru' ? 'Электронный Документооборот и Квитанции' : 'Electronic Document Flow & Receipts'}</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              {lang === 'ru' 
                ? 'Автоматическая генерация юридически обязывающих квитанций с QR-кодами и ЭЦП HMAC-SHA256, смарт-договоров крипто-кастоди, справок Proof of Reserves и налоговой отчетности.'
                : 'Automated generation of legally notarized receipts with QR codes and HMAC-SHA256 digital signatures, crypto-custody agreements, Proof of Reserves and tax statements.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Сформировать документ / справку' : 'Issue Statement / Certificate'}</span>
            </button>
          </div>
        </div>

        {/* Quick Workflow Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800/80 font-mono text-xs">
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-zinc-500 block">{lang === 'ru' ? 'ВЫДАННЫХ КВИТАНЦИЙ:' : 'RECEIPTS ISSUED:'}</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">{receipts.length}</span>
            <span className="text-[10px] text-zinc-400">100% криптографически заверены</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-zinc-500 block">{lang === 'ru' ? 'АКТИВНЫХ ДОГОВОРОВ:' : 'ACTIVE CONTRACTS:'}</span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block">{documents.length}</span>
            <span className="text-[10px] text-zinc-400">Включая кастоди и Proof of Reserves</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-zinc-500 block">{lang === 'ru' ? 'СТАТУС НОТАРИУСА:' : 'NOTARY STATUS:'}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE (SHA-256)</span>
            </span>
            <span className="text-[10px] text-zinc-400">Мгновенная заверка</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <span className="text-zinc-500 block">{lang === 'ru' ? 'БЕНЕФИЦИАР:' : 'BENEFICIARY:'}</span>
            <span className="text-zinc-200 font-semibold block truncate mt-0.5">{AUTH_USER.fullName}</span>
            <span className="text-[10px] text-zinc-400">{AUTH_USER.taxId}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
        {/* Toggle between Receipts & Documents */}
        <div className="flex items-center gap-2 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
          <button
            onClick={() => setSubTab('receipts')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'receipts'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'Автоматические Квитанции' : 'Automatic Receipts'} ({receipts.length})</span>
          </button>

          <button
            onClick={() => setSubTab('documents')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'documents'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'Договоры и Сертификаты' : 'Contracts & Proofs'} ({documents.length})</span>
          </button>
        </div>

        {/* Search input & Sub-filters */}
        <div className="flex items-center gap-2">
          {subTab === 'receipts' && (
            <select
              value={receiptFilter}
              onChange={(e) => setReceiptFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">{lang === 'ru' ? 'Все типы квитанций' : 'All Operation Types'}</option>
              <option value="CRYPTO_SWAP">{lang === 'ru' ? 'Крипто-свап' : 'Crypto Swap'}</option>
              <option value="CROSS_CURRENCY_CONVERSION">{lang === 'ru' ? 'Кросс-валютные' : 'Cross-Currency'}</option>
              <option value="VIRTUAL_CARD_TRANSACTION">{lang === 'ru' ? 'По картам' : 'Card Transactions'}</option>
              <option value="DEPOSIT_CREDIT">{lang === 'ru' ? 'Пополнения' : 'Deposits'}</option>
            </select>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'ru' ? 'Поиск по номеру, хэшу или валюте...' : 'Search by ID, hash or currency...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Tab 1: Automatic Receipts Table */}
      {subTab === 'receipts' && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">{lang === 'ru' ? 'Квитанция / ID' : 'Receipt ID'}</th>
                  <th className="py-3 px-4">{lang === 'ru' ? 'Тип операции' : 'Type'}</th>
                  <th className="py-3 px-4">{lang === 'ru' ? 'Сумма списания' : 'From Amount'}</th>
                  <th className="py-3 px-4">{lang === 'ru' ? 'Зачислено' : 'To Amount'}</th>
                  <th className="py-3 px-4">{lang === 'ru' ? 'Курс' : 'Rate'}</th>
                  <th className="py-3 px-4">{lang === 'ru' ? 'Дата / Время' : 'Timestamp'}</th>
                  <th className="py-3 px-4">{lang === 'ru' ? 'Статус / ЭЦП' : 'Signature'}</th>
                  <th className="py-3 px-4 text-right">{lang === 'ru' ? 'Действия' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                {filteredReceipts.map((r) => (
                  <tr 
                    key={r.receiptId}
                    className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedReceipt(r)}
                  >
                    <td className="py-3.5 px-4 font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 shrink-0" />
                      <span>{r.receiptId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {r.operationType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-100">
                      {r.sourceAmount.toLocaleString()} <span className="text-amber-400">{r.sourceCurrency}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">
                      {r.targetAmount.toLocaleString()} <span className="text-emerald-300">{r.targetCurrency}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {r.appliedRate}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                      {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-[10px] text-emerald-300 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>SHA-256 NOTARIZED</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReceipt(r);
                        }}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 text-xs transition-colors cursor-pointer"
                      >
                        {lang === 'ru' ? 'Квитанция' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Document Repository (Contracts, Proof of Funds, Tax Declarations) */}
      {subTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.documentId}
              onClick={() => setSelectedDoc(doc)}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer space-y-3 group shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      {doc.category} • {doc.documentId}
                    </span>
                    <h3 className="text-sm font-semibold text-zinc-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono shrink-0">
                  {doc.status}
                </span>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2">
                {doc.summary}
              </p>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Подписант: {doc.signedBy}</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'ru' ? 'Открыть документ' : 'Open'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: View Legal Document Details */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 font-mono">
                    {selectedDoc.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {selectedDoc.documentId} • {selectedDoc.status}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-zinc-300">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="text-zinc-400 font-semibold">{lang === 'ru' ? 'РЕЗЮМЕ ДОКУМЕНТА:' : 'EXECUTIVE SUMMARY:'}</div>
                <p className="text-zinc-300 leading-relaxed">{selectedDoc.summary}</p>
              </div>

              <div className="space-y-1">
                <div className="text-zinc-400 font-semibold">{lang === 'ru' ? 'ПОЛНЫЙ ЮРИДИЧЕСКИЙ ТЕКСТ / СЕРТИФИКАТ:' : 'FULL TEXT:'}</div>
                <pre className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-[11px] text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {selectedDoc.content}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Криптографическая поверка неизменяемости SHA-256</span>
                </div>
                <div className="text-[10px] text-zinc-400 break-all">
                  Хэш документа: {selectedDoc.hashSha256}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">
                Заверено: {new Date(selectedDoc.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                {lang === 'ru' ? 'Закрыть' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Generate On-Demand Document */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-zinc-100 font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ru' ? 'Сформировать официальный документ' : 'Issue Official Bank Document'}</span>
            </h3>
            <p className="text-xs text-zinc-400">
              {lang === 'ru' 
                ? 'Выберите тип документа для автоматической генерации, подписания цифровым ключом и включения в нотариальный реестр.'
                : 'Select document type to generate with cryptographic notary seal.'}
            </p>

            <div className="space-y-2 font-mono text-xs">
              <button
                onClick={() => {
                  onGenerateDocument('PROOF_OF_FUNDS');
                  setIsGenerateModalOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-zinc-100">Справка Proof of Funds</div>
                  <div className="text-[11px] text-zinc-500">Подтверждение остатка крипто/фиат активов</div>
                </div>
                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  onGenerateDocument('RESERVE_AUDIT');
                  setIsGenerateModalOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-zinc-100">Аудит резервов Merkle-Tree</div>
                  <div className="text-[11px] text-zinc-500">Ончейн-доказательство 100% покрытия</div>
                </div>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => {
                  onGenerateDocument('TAX_DECLARATION');
                  setIsGenerateModalOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-zinc-100">Фискальная декларация за квартал</div>
                  <div className="text-[11px] text-zinc-500">Реестр конверсий для налогового контроля</div>
                </div>
                <FileText className="w-4 h-4 text-blue-400" />
              </button>
            </div>

            <button
              onClick={() => setIsGenerateModalOpen(false)}
              className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              {lang === 'ru' ? 'Отмена' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <OfficialReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        lang={lang}
      />
    </div>
  );
};
