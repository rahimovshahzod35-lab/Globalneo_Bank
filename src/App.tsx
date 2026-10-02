import { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  CreditCard, 
  Wallet, 
  Sparkles, 
  MessageSquare, 
  Repeat, 
  FileCheck2, 
  BarChart3,
  Layers
} from 'lucide-react';
import { 
  Transaction, 
  AgentLog, 
  EngineStats, 
  BankAgent, 
  IssuedCard, 
  WalletAccount, 
  OfficialReceipt, 
  BankDocument, 
  AutoConversionRule 
} from './types';
import { GlobalBankOrchestrator } from './services/bankEngine';
import { FintechBankEngine, AUTH_USER } from './services/fintechEngine';
import { Header } from './components/Header';
import { MultiAgentChat } from './components/MultiAgentChat';
import { FintechWalletsView } from './components/FintechWalletsView';
import { AutoConversionSwapTerminal } from './components/AutoConversionSwapTerminal';
import { DocumentWorkflowView } from './components/DocumentWorkflowView';
import { OfficialReceiptModal } from './components/OfficialReceiptModal';
import { CosmicSuccessModal, CosmicSuccessData } from './components/CosmicSuccessModal';
import { CosmicPaymentAnalyticsView } from './components/CosmicPaymentAnalyticsView';
import { CardVaultView } from './components/CardVaultView';
import { CARD_ISSUED_EVENT, CardIssuedEventDetail } from './services/apiMock';

// Initial realistic FinTech transactions for the authentic user
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    tx_id: 'REC-2026-889104',
    sender_iban: 'Apex USDT Vault (TRC-20)',
    receiver_iban: AUTH_USER.primaryIban,
    amount: 10000.0,
    currency: 'USDT',
    target_currency: 'EUR',
    target_amount: 9216.59,
    swift_code: 'APEXCHZZ',
    status: 'EXECUTED',
    risk_score: 0.05,
    approvals: ['FXEngineAgent', 'DocumentNotaryAgent', 'AccountantAgent'],
    signature: '9f81a7b2c019284e71928b4c0a19283e74829104bfa928172649102837461928',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    fx_rate: 0.921659,
    converted_usd: 10000.0,
    receipt_id: 'REC-2026-889104',
  },
  {
    tx_id: 'REC-2026-771920',
    sender_iban: AUTH_USER.primaryIban,
    receiver_iban: 'Apex USDT Liquidity Pool',
    amount: 15000.0,
    currency: 'EUR',
    target_currency: 'USDT',
    target_amount: 16275.0,
    swift_code: 'APEXCHZZ',
    status: 'EXECUTED',
    risk_score: 0.08,
    approvals: ['FXEngineAgent', 'LawyerAgent', 'AccountantAgent'],
    signature: '1092837461928374a8192837461928374a8192837461928374a8192837461928',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    fx_rate: 1.085,
    converted_usd: 16275.0,
    receipt_id: 'REC-2026-771920',
  },
  {
    tx_id: 'REC-2026-665201',
    sender_iban: 'Apex Crypto Infinite Visa (*7421)',
    receiver_iban: 'Apple Store Zurich / Bahnhofstrasse',
    amount: 3299.0,
    currency: 'USDT',
    target_currency: 'CHF',
    target_amount: 2958.74,
    status: 'EXECUTED',
    risk_score: 0.02,
    approvals: ['CardProcessorAgent', 'FraudDetectorAgent'],
    signature: '7728192038471928374619283746192837461928374619283746192837461928',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    fx_rate: 0.89686,
    converted_usd: 3299.0,
    receipt_id: 'REC-2026-665201',
  },
];

export default function App() {
  const orchestrator = useMemo(() => new GlobalBankOrchestrator(), []);
  const fintechEngine = useMemo(() => new FintechBankEngine(), []);
  
  // Real NeoBank Navigation Tabs: wallets, analytics, swap, documents, cards, chat
  const [activeTab, setActiveTab] = useState<'wallets' | 'analytics' | 'swap' | 'documents' | 'cards' | 'chat'>('wallets');
  const [cosmicSuccessData, setCosmicSuccessData] = useState<CosmicSuccessData | null>(null);
  const [lang, setLang] = useState<'en' | 'ru'>('ru');
  const [isProcessing, setIsProcessing] = useState(false);

  // FinTech State: Wallets, Receipts, Documents, Rules
  const [wallets, setWallets] = useState<WalletAccount[]>(() => fintechEngine.getWallets());
  const [receipts, setReceipts] = useState<OfficialReceipt[]>(() => fintechEngine.getReceipts());
  const [documents, setDocuments] = useState<BankDocument[]>(() => fintechEngine.getDocuments());
  const [autoRules, setAutoRules] = useState<AutoConversionRule[]>(() => fintechEngine.getAutoRules());
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState<OfficialReceipt | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Cards State (Tied strictly to Shahzod Rahimov)
  const [issuedCards, setIssuedCards] = useState<IssuedCard[]>(() => fintechEngine.getCards());

  // Agents & Security
  const [agents] = useState<BankAgent[]>(() => orchestrator.getAgents());
  const [masterKey] = useState<string>('APEX_FINTECH_SUPER_SECRET_HMAC_KEY_2026');

  // Compute exact live stats (no fake additions)
  const stats: EngineStats = useMemo(() => {
    const executed = transactions.filter(t => t.status === 'EXECUTED').length;
    const rejected = transactions.filter(t => t.status === 'REJECTED_BY_COMPLIANCE').length;
    const blocked = transactions.filter(t => t.status === 'BLOCKED').length;
    const volume = transactions.reduce((acc, t) => acc + (t.converted_usd || t.amount), 0);
    const totalNetWorth = wallets.reduce((acc, w) => acc + w.usdValue, 0);

    return {
      totalProcessed: transactions.length,
      totalVolumeUSD: volume,
      executedCount: executed,
      rejectedCount: rejected,
      blockedCount: blocked,
      activeAgentsCount: 10,
      cardsIssuedCount: issuedCards.filter(c => c.status === 'ISSUED_AND_ACTIVE').length,
      totalNetWorthUSD: totalNetWorth,
      totalReceiptsCount: receipts.length,
      totalDocumentsCount: documents.length,
    };
  }, [transactions, issuedCards, wallets, receipts, documents]);

  // Listen to GlobalBankCardOrder API fetch calls via window event
  useEffect(() => {
    const handleCardIssued = (e: Event) => {
      const customEvent = e as CustomEvent<CardIssuedEventDetail>;
      const { issuedCard } = customEvent.detail;
      setIssuedCards(prev => [issuedCard, ...prev.filter(c => c.application_id !== issuedCard.application_id)]);

      setCosmicSuccessData({
        title: lang === 'ru' ? 'ВИРТУАЛЬНАЯ КАРТА ВЫПУЩЕНА!' : 'VIRTUAL CARD ISSUED!',
        subtitle: lang === 'ru'
          ? `Карта ${issuedCard.card_type} успешно эмитирована для ${issuedCard.full_name}`
          : `Card ${issuedCard.card_type} issued for ${issuedCard.full_name}`,
        operationType: 'CARD_PROVISIONING',
        recipientOrCounterparty: issuedCard.full_name,
        txHash: issuedCard.iban,
        receiptId: issuedCard.application_id,
        latencyMs: 88,
      });
    };

    window.addEventListener(CARD_ISSUED_EVENT, handleCardIssued);
    return () => {
      window.removeEventListener(CARD_ISSUED_EVENT, handleCardIssued);
    };
  }, [lang]);

  // Handle Instant Conversion / Swap
  const handleExecuteConversion = useCallback((
    fromCurrency: string,
    toCurrency: string,
    fromAmount: number,
    slippage: number
  ) => {
    setIsProcessing(true);
    try {
      const result = fintechEngine.executeInstantConversion(fromCurrency, toCurrency, fromAmount, slippage);
      setWallets([...fintechEngine.getWallets()]);
      setReceipts([...fintechEngine.getReceipts()]);
      setTransactions(prev => [result.transaction, ...prev]);

      // Open receipt modal
      setSelectedReceiptForModal(result.receipt);

      // Trigger Cosmic Success Celebration Animation!
      setCosmicSuccessData({
        title: lang === 'ru' ? 'КОСМИЧЕСКИЙ СВАП ВЫПОЛНЕН!' : 'COSMIC SWAP EXECUTED!',
        subtitle: lang === 'ru'
          ? `Мгновенный обмен ${fromAmount.toLocaleString()} ${fromCurrency} ➔ ${result.toAmount.toLocaleString()} ${toCurrency} через мультивалютный шлюз`
          : `Instant conversion ${fromAmount.toLocaleString()} ${fromCurrency} ➔ ${result.toAmount.toLocaleString()} ${toCurrency} through liquidity gateway`,
        operationType: 'CRYPTO_SWAP',
        sourceAmount: fromAmount,
        sourceCurrency: fromCurrency,
        targetAmount: result.toAmount,
        targetCurrency: toCurrency,
        recipientOrCounterparty: 'Apex Multi-Crypto Liquidity Vault',
        txHash: result.receipt.txHash,
        receiptId: result.receipt.receiptId,
        receipt: result.receipt,
        latencyMs: 74,
      });

      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [fintechEngine, lang]);

  // Handle Deposit
  const handleDeposit = useCallback((currency: string, amount: number, network?: string) => {
    setIsProcessing(true);
    try {
      const result = fintechEngine.executeDeposit(currency, amount, network);
      setWallets([...fintechEngine.getWallets()]);
      setReceipts([...fintechEngine.getReceipts()]);

      setCosmicSuccessData({
        title: lang === 'ru' ? 'ДЕПОЗИТ УСПЕШНО ЗАЧИСЛЕН!' : 'DEPOSIT CREDITED!',
        subtitle: lang === 'ru'
          ? `Пополнение казначейства на +${amount.toLocaleString()} ${currency} (${network || 'Onchain'})`
          : `Treasury ingress of +${amount.toLocaleString()} ${currency} (${network || 'Onchain'})`,
        operationType: 'VAULT_DEPOSIT',
        targetAmount: amount,
        targetCurrency: currency,
        recipientOrCounterparty: 'Apex Treasury Vault',
        txHash: result.receipt.txHash,
        receiptId: result.receipt.receiptId,
        receipt: result.receipt,
        latencyMs: 62,
      });

      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [fintechEngine, lang]);

  // Toggle Auto-Rule
  const handleToggleAutoRule = useCallback((ruleId: string) => {
    const updated = fintechEngine.toggleAutoRule(ruleId);
    setAutoRules([...updated]);
  }, [fintechEngine]);

  // Generate on-demand Document
  const handleGenerateDocument = useCallback((category: 'CONTRACT' | 'PROOF_OF_FUNDS' | 'RESERVE_AUDIT' | 'TAX_DECLARATION' | 'CARD_AGREEMENT') => {
    const doc = fintechEngine.generateOfficialDocument(category);
    setDocuments([...fintechEngine.getDocuments()]);

    setCosmicSuccessData({
      title: lang === 'ru' ? 'ДОКУМЕНТ УСПЕШНО ЗАВЕРЕН!' : 'DOCUMENT NOTARIZED!',
      subtitle: lang === 'ru'
        ? `Документ ${doc.title} заверен нотариальной подписью SHA-256`
        : `Document ${doc.title} notarized with SHA-256`,
      operationType: 'EDO_DOCUMENT_NOTARIZATION',
      recipientOrCounterparty: AUTH_USER.corporateEntity,
      txHash: doc.hashSha256,
      receiptId: doc.documentId,
      latencyMs: 48,
    });
  }, [fintechEngine, lang]);

  // Toggle Freeze Card
  const handleToggleFreezeCard = useCallback((cardId: string) => {
    const updated = fintechEngine.toggleCardFreeze(cardId);
    setIssuedCards([...updated]);
  }, [fintechEngine]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Global Header */}
      <Header
        stats={stats}
        masterKey={masterKey}
        onOpenChat={() => setActiveTab('chat')}
        onOpenDocuments={() => setActiveTab('documents')}
        isProcessing={isProcessing}
        lang={lang}
        onToggleLang={() => setLang(l => (l === 'ru' ? 'en' : 'ru'))}
      />

      {/* Primary Clean Navigation Tabs */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-[69px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none" aria-label="Tabs">
            {/* 1. FinTech Wallets & Balances */}
            <button
              id="tab-wallets"
              onClick={() => setActiveTab('wallets')}
              className={`py-2.5 px-3.5 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'wallets'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ru' ? 'СЧЕТА & КОШЕЛЬКИ' : 'WALLETS & ASSETS'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 font-bold">
                {wallets.length}
              </span>
            </button>

            {/* 2. Cosmic Payment History & Diagrams */}
            <button
              id="tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`py-2.5 px-3.5 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ru' ? 'ИСТОРИЯ & АНАЛИТИКА' : 'PAYMENTS & ANALYTICS'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold">
                COSMIC
              </span>
            </button>

            {/* 3. Auto-Conversion & Swap */}
            <button
              id="tab-swap"
              onClick={() => setActiveTab('swap')}
              className={`py-2.5 px-3.5 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'swap'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Repeat className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ru' ? 'АВТО-КОНВЕРТАЦИЯ & СВАП' : 'AUTO-CONVERSION & SWAP'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold">
                INSTANT
              </span>
            </button>

            {/* 4. Document Flow & Automated Receipts */}
            <button
              id="tab-documents"
              onClick={() => setActiveTab('documents')}
              className={`py-2.5 px-3.5 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'documents'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ru' ? 'ДОКУМЕНТООБОРОТ & КВИТАНЦИИ' : 'DOCUMENTS & RECEIPTS'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 font-bold">
                {receipts.length}
              </span>
            </button>

            {/* 5. Virtual Crypto Cards */}
            <button
              id="tab-cards"
              onClick={() => setActiveTab('cards')}
              className={`py-2.5 px-3.5 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'cards'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ru' ? 'ВИРТУАЛЬНЫЕ КАРТЫ' : 'VIRTUAL CARDS'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400">
                {issuedCards.length}
              </span>
            </button>

            {/* 6. Multi-Agent Consilium Command Chat */}
            <button
              id="tab-chat"
              onClick={() => setActiveTab('chat')}
              className={`py-2.5 px-3.5 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ru' ? 'ЧАТ КОНСИЛИУМА (10 АГЕНТОВ)' : 'COUNCIL CHAT (10 AGENTS)'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-bold">
                10 ONLINE
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TAB 1: FINTECH WALLETS & BALANCES */}
        {activeTab === 'wallets' && (
          <FintechWalletsView
            wallets={wallets}
            onNavigateToSwap={() => setActiveTab('swap')}
            onDeposit={handleDeposit}
            onViewReceipt={(receipt) => setSelectedReceiptForModal(receipt)}
            lang={lang}
          />
        )}

        {/* TAB 2: COSMIC PAYMENT HISTORY & DIAGRAMS */}
        {activeTab === 'analytics' && (
          <CosmicPaymentAnalyticsView
            transactions={transactions}
            wallets={wallets}
            receipts={receipts}
            onViewReceipt={(receipt) => setSelectedReceiptForModal(receipt)}
            onTriggerCosmicAnimation={(data) => setCosmicSuccessData(data)}
            onNavigateToSwap={() => setActiveTab('swap')}
            lang={lang}
          />
        )}

        {/* TAB 3: AUTO-CONVERSION & SWAP TERMINAL */}
        {activeTab === 'swap' && (
          <AutoConversionSwapTerminal
            wallets={wallets}
            autoRules={autoRules}
            onExecuteConversion={handleExecuteConversion}
            onToggleRule={handleToggleAutoRule}
            lang={lang}
          />
        )}

        {/* TAB 4: DOCUMENT WORKFLOW & AUTOMATED RECEIPTS */}
        {activeTab === 'documents' && (
          <DocumentWorkflowView
            receipts={receipts}
            documents={documents}
            onGenerateDocument={handleGenerateDocument}
            lang={lang}
          />
        )}

        {/* TAB 5: CARDS VAULT */}
        {activeTab === 'cards' && (
          <CardVaultView
            cards={issuedCards}
            onToggleFreeze={handleToggleFreezeCard}
            lang={lang}
          />
        )}

        {/* TAB 6: MULTI-AGENT COLLABORATIVE CHAT & COMMAND CENTER */}
        {activeTab === 'chat' && (
          <MultiAgentChat
            agents={agents}
            masterKey={masterKey}
            lang={lang}
          />
        )}
      </main>

      {/* Footer info banner */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950 py-4 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Apex Fintech Virtual NeoBank v2.0 • Multi-Currency, Crypto & Electronic Document Flow</span>
          </div>
          <div className="flex items-center gap-3">
            <span>FINMA / VASP Regulated #FT-2026-CH</span>
            <span>•</span>
            <span>HMAC-SHA256 E-Signatures</span>
            <span>•</span>
            <span>Proof of Reserves: 108.4%</span>
          </div>
        </div>
      </footer>

      {/* Official Receipt Modal */}
      <OfficialReceiptModal
        receipt={selectedReceiptForModal}
        onClose={() => setSelectedReceiptForModal(null)}
        lang={lang}
      />

      {/* Cosmic Scale Success Animation Celebration Modal */}
      <CosmicSuccessModal
        data={cosmicSuccessData}
        onClose={() => setCosmicSuccessData(null)}
        onViewReceipt={(receipt) => setSelectedReceiptForModal(receipt)}
        lang={lang}
      />
    </div>
  );
}
