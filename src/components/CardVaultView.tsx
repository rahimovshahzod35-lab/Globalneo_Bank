import { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ShieldCheck, 
  Filter, 
  Download,
  Plus,
  ExternalLink,
  X
} from 'lucide-react';
import { IssuedCard, CardType } from '../types';
import { BankCardVisual } from './BankCardVisual';
import GlobalBankCardOrder from './GlobalBankCardOrder';

interface CardVaultViewProps {
  cards: IssuedCard[];
  onToggleFreeze: (appId: string) => void;
  onNavigateToIssue?: () => void;
  lang?: 'en' | 'ru';
}

export function CardVaultView({
  cards,
  onToggleFreeze,
  onNavigateToIssue,
  lang = 'ru',
}: CardVaultViewProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const filteredCards = cards.filter(card => {
    if (filterType === 'ALL') return true;
    return card.card_type === filterType;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCardsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `global_bank_issued_cards_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-wide">
              {lang === 'ru' ? 'РЕЕСТР ЭМИССИИ ПЛАТЕЖНЫХ КАРТ' : 'ISSUED CARDS VAULT & PORTFOLIO'}
            </h2>
            <p className="text-xs text-zinc-400">
              {lang === 'ru' 
                ? `Активных профилей: ${cards.length} • Генерация по стандарту SHA-256 + FIPS 198-1` 
                : `Active profiles: ${cards.length} • SHA-256 & FIPS 198-1 standard issuance`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter pills */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
            <Filter className="w-3 h-3 text-zinc-500 mx-1" />
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-amber-400/20 text-amber-300 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {lang === 'ru' ? 'Все' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('VIRTUAL_DEBIT')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                filterType === 'VIRTUAL_DEBIT'
                  ? 'bg-amber-400/20 text-amber-300 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Virtual
            </button>
            <button
              type="button"
              onClick={() => setFilterType('CORPORATE_CREDIT')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                filterType === 'CORPORATE_CREDIT'
                  ? 'bg-amber-400/20 text-amber-300 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Corporate
            </button>
          </div>

          <button
            type="button"
            onClick={exportCardsJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onNavigateToIssue) onNavigateToIssue();
              setIsIssueModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'Выпустить новую' : 'Issue Card'}</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center text-zinc-400 font-mono text-xs">
          <CreditCard className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p>{lang === 'ru' ? 'Нет выпущенных карт по заданному фильтру' : 'No cards found matching current filter'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div
              key={card.application_id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col justify-between gap-4 group hover:border-zinc-700 transition-all"
            >
              {/* Card visual render */}
              <div className="w-full flex justify-center py-2">
                <BankCardVisual
                  card={card}
                  cardType={card.card_type}
                  fullName={card.full_name}
                  lang={lang}
                  onToggleFreeze={onToggleFreeze}
                />
              </div>

              {/* Card meta specifications */}
              <div className="border-t border-zinc-800/80 pt-3 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>{lang === 'ru' ? 'Держатель:' : 'Holder:'}</span>
                  <span className="text-zinc-200 font-bold truncate max-w-[180px]">{card.full_name}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>{lang === 'ru' ? 'Тип аккаунта:' : 'Account Type:'}</span>
                  <span className="text-zinc-300">{card.account_type}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>IBAN:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(card.iban, card.application_id + '-iban')}
                    className="flex items-center gap-1 text-zinc-200 font-bold hover:text-amber-300 cursor-pointer"
                  >
                    <span>{card.iban.substring(0, 14)}...</span>
                    {copiedId === card.application_id + '-iban' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-zinc-500" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>{lang === 'ru' ? 'Кредитный лимит:' : 'Credit Limit:'}</span>
                  <span className="text-amber-300 font-bold">
                    ${card.assigned_limit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-400">
                  <span>{lang === 'ru' ? 'Комплаенс аудит:' : 'Compliance Audit:'}</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>PASSED</span>
                  </span>
                </div>
              </div>

              {/* Action bar */}
              <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-zinc-500">
                  APP: {card.application_id}
                </span>

                <button
                  type="button"
                  onClick={() => onToggleFreeze(card.application_id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    card.is_frozen
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                      : 'bg-zinc-950 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  {card.is_frozen ? (
                    <>
                      <Unlock className="w-3 h-3 text-cyan-300" />
                      <span>{lang === 'ru' ? 'Разморозить' : 'Unfreeze'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-zinc-400" />
                      <span>{lang === 'ru' ? 'Заморозить' : 'Freeze'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1-Click Card Issuance Modal for Shahzod Rahimov */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl">
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <GlobalBankCardOrder
              isEmbedded={false}
              onCardIssued={() => setIsIssueModalOpen(false)}
              onViewVault={() => setIsIssueModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
