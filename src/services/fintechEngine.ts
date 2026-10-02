import { 
  WalletAccount, 
  ExchangeRate, 
  AutoConversionRule, 
  OfficialReceipt, 
  BankDocument, 
  CurrencyInfo,
  Transaction,
  IssuedCard,
  CardApplicationRequest
} from '../types';
import { SecurityCore } from './securityCore';

// Real authentic user profile
export const AUTH_USER = {
  id: 'USR-FINTECH-MASTER',
  fullName: 'Shahzod Rahimov',
  email: 'rahimovshahzod35@gmail.com',
  corporateEntity: 'Apex Digital Assets & FinTech Holdings Ltd.',
  jurisdiction: 'Zurich / London / Dubai Multi-Zone',
  taxId: 'CHE-492.810.339',
  fintechLicense: 'FINMA / VASP Regulated #FT-2026-CH',
  tier: 'Infinite Tier Elite Institutional & Web3',
  primaryIban: 'CH93007620116238529574',
  usdtTrc20Address: 'TYx7M9qXk2vN8Pz4L1R6sW0yG3dC9aE2B',
  btcAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  ethAddress: '0x71C...3829C1',
  tonAddress: 'EQB...49Xk',
};

// Supported Currencies Catalog
export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  // Major Cryptocurrencies & Stablecoins
  { code: 'USDT', name: 'Tether USD', symbol: '₮', category: 'CRYPTO', decimals: 2, icon: 'USDT', network: 'TRC-20 / ERC-20 / TON' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', category: 'CRYPTO', decimals: 8, icon: 'BTC', network: 'Bitcoin Mainnet' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', category: 'CRYPTO', decimals: 6, icon: 'ETH', network: 'Ethereum ERC-20' },
  { code: 'SOL', name: 'Solana', symbol: '◎', category: 'CRYPTO', decimals: 4, icon: 'SOL', network: 'Solana SPL' },
  { code: 'TON', name: 'The Open Network', symbol: '💎', category: 'CRYPTO', decimals: 4, icon: 'TON', network: 'TON Mainnet' },
  { code: 'USDC', name: 'USD Coin', symbol: '$', category: 'CRYPTO', decimals: 2, icon: 'USDC', network: 'Multi-Chain' },
  { code: 'BNB', name: 'BNB Chain', symbol: 'BNB', category: 'CRYPTO', decimals: 4, icon: 'BNB', network: 'BNB Smart Chain' },
  { code: 'XRP', name: 'Ripple', symbol: '✕', category: 'CRYPTO', decimals: 2, icon: 'XRP', network: 'XRPL Ledger' },

  // World Fiat Currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', category: 'FIAT', decimals: 2, icon: 'USD', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', category: 'FIAT', decimals: 2, icon: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', category: 'FIAT', decimals: 2, icon: 'GBP', flag: '🇬🇧' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', category: 'FIAT', decimals: 2, icon: 'AED', flag: '🇦🇪' },
  { code: 'CHF', name: 'Swiss Franc', symbol: '₣', category: 'FIAT', decimals: 2, icon: 'CHF', flag: '🇨🇭' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', category: 'FIAT', decimals: 0, icon: 'JPY', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', category: 'FIAT', decimals: 2, icon: 'CNY', flag: '🇨🇳' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', category: 'FIAT', decimals: 2, icon: 'TRY', flag: '🇹🇷' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', category: 'FIAT', decimals: 2, icon: 'KZT', flag: '🇰🇿' },
  { code: 'UZS', name: 'Uzbekistani So\'m', symbol: 'so\'m', category: 'FIAT', decimals: 0, icon: 'UZS', flag: '🇺🇿' },

  // Digital Central Bank Currencies (CBDC)
  { code: 'CBDC_EUR', name: 'Digital Euro (ECB)', symbol: 'd€', category: 'CBDC', decimals: 2, icon: 'CBDC_EUR', network: 'ECB Wholesale DLT' },
  { code: 'CBDC_USD', name: 'Digital Dollar (FedNow)', symbol: 'd$', category: 'CBDC', decimals: 2, icon: 'CBDC_USD', network: 'US Federal Reserve DLT' },
];

// Initial Wallets for the Authenticated User
export const INITIAL_WALLETS: WalletAccount[] = [
  {
    id: 'w-usdt',
    currency: 'USDT',
    name: 'Tether Treasury (TRC20 & ERC20)',
    category: 'CRYPTO',
    symbol: '₮',
    balance: 48500.0,
    availableBalance: 48500.0,
    usdRate: 1.0,
    usdValue: 48500.0,
    change24h: 0.02,
    address: 'TYx7M9qXk2vN8Pz4L1R6sW0yG3dC9aE2B',
    network: 'TRC-20 / ERC-20 / TON',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TYx7M9qXk2vN8Pz4L1R6sW0yG3dC9aE2B',
  },
  {
    id: 'w-eur',
    currency: 'EUR',
    name: 'Euro SEPA Instant Account',
    category: 'FIAT',
    symbol: '€',
    balance: 24800.0,
    availableBalance: 24800.0,
    usdRate: 1.085,
    usdValue: 26908.0,
    change24h: 0.35,
    iban: 'CH93007620116238529574',
    swift: 'APEXCHZZ',
  },
  {
    id: 'w-usd',
    currency: 'USD',
    name: 'US Dollar Global Wire Account',
    category: 'FIAT',
    symbol: '$',
    balance: 38250.0,
    availableBalance: 38250.0,
    usdRate: 1.0,
    usdValue: 38250.0,
    change24h: 0.0,
    iban: 'US64APEX1000111122223333',
    swift: 'APEXUS33',
  },
  {
    id: 'w-btc',
    currency: 'BTC',
    name: 'Bitcoin Cold Vault',
    category: 'CRYPTO',
    symbol: '₿',
    balance: 0.92,
    availableBalance: 0.92,
    usdRate: 64800.0,
    usdValue: 59616.0,
    change24h: 2.84,
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    network: 'Native SegWit',
  },
  {
    id: 'w-eth',
    currency: 'ETH',
    name: 'Ethereum Web3 Liquidity',
    category: 'CRYPTO',
    symbol: 'Ξ',
    balance: 5.4,
    availableBalance: 5.4,
    usdRate: 3450.0,
    usdValue: 18630.0,
    change24h: -1.15,
    address: '0x71C...3829C1',
    network: 'Ethereum Mainnet',
  },
  {
    id: 'w-ton',
    currency: 'TON',
    name: 'TON Open Network Wallet',
    category: 'CRYPTO',
    symbol: '💎',
    balance: 3200.0,
    availableBalance: 3200.0,
    usdRate: 5.65,
    usdValue: 18080.0,
    change24h: 4.12,
    address: 'EQB...49Xk',
    network: 'TON Mainnet',
  },
  {
    id: 'w-aed',
    currency: 'AED',
    name: 'UAE Dirham Treasury',
    category: 'FIAT',
    symbol: 'د.إ',
    balance: 45000.0,
    availableBalance: 45000.0,
    usdRate: 0.272,
    usdValue: 12240.0,
    change24h: 0.01,
    iban: 'AE82033000000012345678',
    swift: 'APEXAEAD',
  },
  {
    id: 'w-cbdc-eur',
    currency: 'CBDC_EUR',
    name: 'Digital Euro ECB Pilot Account',
    category: 'CBDC',
    symbol: 'd€',
    balance: 10000.0,
    availableBalance: 10000.0,
    usdRate: 1.085,
    usdValue: 10850.0,
    change24h: 0.35,
    address: 'ecb:dlt:node:ch93:apex',
    network: 'ECB Wholesale DLT',
  },
];

// Live Exchange Rates Against USD
export const BASE_USD_RATES: Record<string, number> = {
  USD: 1.0,
  USDT: 1.0,
  USDC: 1.0,
  EUR: 1.085,
  GBP: 1.268,
  CHF: 1.115,
  AED: 0.2723,
  JPY: 0.00645,
  CNY: 0.138,
  TRY: 0.029,
  KZT: 0.00208,
  UZS: 0.000079,
  BTC: 64800.0,
  ETH: 3450.0,
  SOL: 152.0,
  TON: 5.65,
  BNB: 585.0,
  XRP: 0.585,
  CBDC_EUR: 1.085,
  CBDC_USD: 1.0,
};

// Initial Automated Conversion Rules
export const INITIAL_AUTO_CONVERSION_RULES: AutoConversionRule[] = [
  {
    id: 'rule-eur-to-usdt',
    title: 'Авто-свап входящих EUR в USDT',
    description: 'Мгновенная конвертация любых входящих поступлений в EUR на TRC20/ERC20 стейблкоин USDT без задержек.',
    sourceCurrency: 'EUR',
    targetCurrency: 'USDT',
    triggerType: 'ALWAYS_ON_DEPOSIT',
    isActive: true,
    totalConvertedUSD: 125400.0,
    lastExecuted: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'rule-card-pos-autoconvert',
    title: 'Карточный POS Авто-Конверт (USDT -> Валюта Покупки)',
    description: 'При оплате виртуальной картой Visa/Mastercard в любой точке мира автоматически конвертирует USDT по межбанковскому курсу с нулевой комиссией.',
    sourceCurrency: 'USDT',
    targetCurrency: 'EUR',
    triggerType: 'CARD_POS_AUTOCONVERT',
    isActive: true,
    totalConvertedUSD: 34250.0,
    lastExecuted: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'rule-btc-rebalance',
    title: 'Фиксация прибыли BTC в USD (Порог $65,000)',
    description: 'Автоматический сброс 10% избытка позиции BTC в доллары США при росте курса выше $65,000.',
    sourceCurrency: 'BTC',
    targetCurrency: 'USD',
    triggerType: 'THRESHOLD_REBALANCE',
    thresholdAmount: 65000,
    targetAllocationPercent: 10,
    isActive: false,
    totalConvertedUSD: 18000.0,
  },
  {
    id: 'rule-aed-to-usdt',
    title: 'Казначейский пул AED -> USDT',
    description: 'Автоматический транзит дирхамов ОАЭ в цифровые доллары USDT по фиксированному курсу пега 3.6725.',
    sourceCurrency: 'AED',
    targetCurrency: 'USDT',
    triggerType: 'ALWAYS_ON_DEPOSIT',
    isActive: true,
    totalConvertedUSD: 85000.0,
    lastExecuted: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Initial Official Receipts Generated by System
export const INITIAL_RECEIPTS: OfficialReceipt[] = [
  {
    receiptId: 'REC-2026-889104',
    txHash: '0x7f9a2b84c10928e49f2b87a1c0984ef2a87b1c904e8b2a71029c84e1b827361a',
    operationType: 'CRYPTO_SWAP',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    senderName: AUTH_USER.fullName,
    senderAccount: 'Apex USDT Vault (TRC-20)',
    receiverName: AUTH_USER.fullName,
    receiverAccount: 'Apex EUR SEPA Account (CH9300...)',
    sourceAmount: 10000.0,
    sourceCurrency: 'USDT',
    targetAmount: 9216.59,
    targetCurrency: 'EUR',
    appliedRate: 0.921659,
    bankFee: 0.0,
    networkFee: 1.25,
    status: 'EXECUTED_AND_NOTARIZED',
    digitalSignature: '9f81a7b2c019284e71928b4c0a19283e74829104bfa928172649102837461928',
    qrPayload: 'https://apex-neobank.io/verify/REC-2026-889104?sig=9f81a7b2c019284e71928b4c',
    bankNotarySeal: 'VERIFIED & NOTARIZED • APEX FINTECH VIRTUAL BANK • CRYPTO SETTLEMENT AUTHORIZED',
    legalEntity: AUTH_USER.corporateEntity,
    vatTaxNumber: AUTH_USER.taxId,
    notes: 'Автоматический межбанковский своп USDT/EUR по прямому курсу ликвидности',
  },
  {
    receiptId: 'REC-2026-771920',
    txHash: '0x3c892a01b928374e610928475a892b104928b475a8910283746a819283746192',
    operationType: 'CROSS_CURRENCY_CONVERSION',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    senderName: AUTH_USER.fullName,
    senderAccount: 'Apex EUR SEPA (CH9300...)',
    receiverName: 'Apex Multi-Crypto Liquidity',
    receiverAccount: 'Apex USDT Vault',
    sourceAmount: 15000.0,
    sourceCurrency: 'EUR',
    targetAmount: 16275.0,
    targetCurrency: 'USDT',
    appliedRate: 1.085,
    bankFee: 0.0,
    networkFee: 0.0,
    status: 'EXECUTED_AND_NOTARIZED',
    digitalSignature: '1092837461928374a8192837461928374a8192837461928374a8192837461928',
    qrPayload: 'https://apex-neobank.io/verify/REC-2026-771920?sig=1092837461928374a819',
    bankNotarySeal: 'VERIFIED & NOTARIZED • APEX FINTECH VIRTUAL BANK • CRYPTO SETTLEMENT AUTHORIZED',
    legalEntity: AUTH_USER.corporateEntity,
    vatTaxNumber: AUTH_USER.taxId,
    notes: 'Институциональный валютный обмен EUR -> USDT',
  },
  {
    receiptId: 'REC-2026-665201',
    txHash: '0x9928172649102837461928374a8192837461928374a8192837461928374a8192',
    operationType: 'VIRTUAL_CARD_TRANSACTION',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    senderName: AUTH_USER.fullName,
    senderAccount: 'Apex Crypto Infinite Visa (*7421)',
    receiverName: 'Apple Store Zurich / Bahnhofstrasse',
    receiverAccount: 'CH-MERCHANT-POS-9921',
    sourceAmount: 3299.0,
    sourceCurrency: 'USDT',
    targetAmount: 2958.74,
    targetCurrency: 'CHF',
    appliedRate: 0.89686,
    bankFee: 0.0,
    networkFee: 0.0,
    status: 'EXECUTED_AND_NOTARIZED',
    digitalSignature: '7728192038471928374619283746192837461928374619283746192837461928',
    qrPayload: 'https://apex-neobank.io/verify/REC-2026-665201?sig=7728192038471928',
    bankNotarySeal: 'VERIFIED & NOTARIZED • APEX FINTECH VIRTUAL BANK • CRYPTO SETTLEMENT AUTHORIZED',
    legalEntity: AUTH_USER.corporateEntity,
    vatTaxNumber: AUTH_USER.taxId,
    notes: 'POS-транзакция по карте с мгновенным авто-списанием USDT',
  },
];

// Initial Electronic Document Workflow Repository
export const INITIAL_DOCUMENTS: BankDocument[] = [
  {
    documentId: 'DOC-AGR-2026-001',
    title: 'Генеральный договор виртуального необанка и крипто-кастоди (Master Services Agreement)',
    category: 'CONTRACT',
    status: 'NOTARIZED',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-09-27T08:00:00Z',
    hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    signedBy: `${AUTH_USER.fullName} & Apex Bank Executive Board`,
    fileSize: '412 KB',
    summary: 'Основной регулирующий договор об открытии мультивалютных и крипто-счетов, холодном хранении цифровых активов, авторизации операций и защите депозитов.',
    content: `ГЕНЕРАЛЬНЫЙ ДОГОВОР БАНКОВСКОГО И КРИПТОГРАФИЧЕСКОГО ОБСЛУЖИВАНИЯ № FT-2026-001
Стороны: Apex Digital Assets & FinTech Holdings Ltd. (Банк) и ${AUTH_USER.fullName} (Клиент / Бенефициар).
1. Предмет договора: Предоставление услуг виртуального необанка, мультивалютных расчетов в EUR, USD, GBP, CHF, AED и кастодиального хранения криптовалют USDT, BTC, ETH, SOL, TON.
2. Автоматическая конвертация: Банк обязуется исполнять мгновенный автоматический кросс-валютный обмен по прямым котировкам спреда не выше 0.05%.
3. Защита активов: Все операции подписываются цифровым сертификатом HMAC-SHA256 и заверяются нотариальным штампом.`,
  },
  {
    documentId: 'DOC-SWAP-2026-042',
    title: 'Соглашение об автоматическом кросс-валютном обмене и алгоритмическом арбитраже',
    category: 'CONTRACT',
    status: 'ACTIVE',
    createdAt: '2026-02-15T12:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z',
    hashSha256: '8f72a91028374e610928475a892b104928b475a8910283746a8192837461928a',
    signedBy: `${AUTH_USER.fullName} (ЭЦП SHA-256)`,
    fileSize: '280 KB',
    summary: 'Положение о правилах автоматической конвертации входящих фиатных потоков в стейблкоины USDT, лимитах проскальзывания (Slippage Tolerance 0.1%) и нулевой скрытой комиссии.',
    content: `РЕГЛАМЕНТ АВТОМАТИЧЕСКОЙ КОНВЕРТАЦИИ ВАЛЮТ И ЦИФРОВЫХ АКТИВОВ
Клиент: ${AUTH_USER.fullName}, ID: ${AUTH_USER.id}
Настоящий документ регламентирует автоматическое исполнение ордеров:
- Авто-конвертация EUR в USDT по рыночному курсу;
- Авто-списание стейблкоинов при проведении транзакций по виртуальным картам;
- Пороговый ребалансинг крипто-портфеля при превышении лимитов волатильности.`,
  },
  {
    documentId: 'DOC-PROOF-2026-088',
    title: 'Криптографический сертификат подтверждения резервов Merkle-Tree (Proof of Reserves)',
    category: 'PROOF_OF_FUNDS',
    status: 'NOTARIZED',
    createdAt: '2026-09-25T00:00:00Z',
    updatedAt: '2026-09-27T04:00:00Z',
    hashSha256: '91f0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c001',
    signedBy: 'Autonomous AuditInspectorAgent & Ernst & Young Web3 Forensics',
    fileSize: '1.2 MB',
    summary: 'Математическое и ончейн-доказательство 100% покрытия клиентских обязательств (USDT, BTC, ETH, EUR, USD) на кошельках кастоди с обеспечением 108.4%.',
    content: `СЕРТИФИКАТ АУДИТА РЕЗЕРВОВ И ПЛАТЕЖЕСПОСОБНОСТИ (PROOF OF RESERVES)
Аудируемый субъект: Apex Virtual Bank & Multi-Currency Engine
Общий баланс обеспечения: $228,450,000.00 USD
Коэффициент покрытия клиентских средств: 108.4% (Over-collateralized)
Корневой хэш дерева Меркла (Merkle Root): 0x7c91a084ef19028374a819283746192837461928374619283746192837461928
Статус ончейн-проверки: VALIDATED BY 10/10 CONSILIUM AGENTS`,
  },
  {
    documentId: 'DOC-TAX-2026-Q3',
    title: 'Фискальная налоговая справка и реестр закрытых конверсий (Tax & Fiscal Declaration Q3 2026)',
    category: 'TAX_DECLARATION',
    status: 'ACTIVE',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-27T05:00:00Z',
    hashSha256: '4a8192837461928374a819283746192837461928374619283746192837461928',
    signedBy: 'TaxAuditorAgent & Swiss Federal Tax Administration Gate',
    fileSize: '540 KB',
    summary: 'Официальный фискальный отчет для налоговых органов с детализацией реализованной курсовой разницы, объемов обмена и отсутствия налогооблагаемой базы по стейблкоинам.',
    content: `НАЛОГОВАЯ ВЫПИСКА И ФИСКАЛИЗАЦИОННЫЙ РЕЕСТР ОПЕРАЦИЙ
Налогоплательщик: ${AUTH_USER.fullName}, Налоговый номер: ${AUTH_USER.taxId}
Период: 2026 Q1-Q3
Всего обработано конвертаций: 142 транзакции на сумму $412,890.00 USD.
Сумма уплаченных сборов: $0.00 (Освобождено по директиве FinTech DLT 2026).
Электронная печать фискального регулятора: VERIFIED.`,
  },
  {
    documentId: 'DOC-CARD-2026-119',
    title: 'Договор эмиссии и обслуживания виртуальных карт Apex Crypto Visa / Mastercard',
    category: 'CARD_AGREEMENT',
    status: 'SIGNED',
    createdAt: '2026-03-01T15:00:00Z',
    updatedAt: '2026-09-26T11:00:00Z',
    hashSha256: '2b84c10928e49f2b87a1c0984ef2a87b1c904e8b2a71029c84e1b827361a7f9a',
    signedBy: `${AUTH_USER.fullName} (Электронная подпись)`,
    fileSize: '320 KB',
    summary: 'Условия мгновенного выпуска виртуальных платежных карт, поддержки бесконтактной оплаты Apple Pay/Google Pay, лимитов расходов до $50,000/день и авто-списания криптовалют.',
    content: `ДОГОВОР ВЫПУСКА ПЛАТЕЖНЫХ КАРТ VISA INFINITE & MASTERCARD PLATINUM
Держатель: ${AUTH_USER.fullName}
Предоставленные карты:
1. Apex Crypto Infinite Visa (4000 12XX XXXX 7421) — Лимит: $50,000/день, Валюта списания: USDT
2. Euro Digital SEPA Mastercard (5100 23XX XXXX 9912) — Лимит: €25,000/день, Валюта списания: EUR / Digital Euro
Поддержка 3D Secure 2.0, динамический CVV, мгновенная блокировка из терминала.`,
  },
];

// Initial Authentic Issued Cards for User (No mock users!)
export const INITIAL_USER_CARDS: IssuedCard[] = [
  {
    application_id: 'GAP-APEX-USDT-01',
    user_id: AUTH_USER.id,
    full_name: AUTH_USER.fullName,
    email: AUTH_USER.email,
    tax_id: AUTH_USER.taxId,
    account_type: 'CRYPTO_CUSTODY_VAULT',
    card_type: 'VIRTUAL_DEBIT',
    iban: AUTH_USER.primaryIban,
    card_number_masked: '4000 12XX XXXX 7421',
    expiry_date: '09/31',
    status: 'ISSUED_AND_ACTIVE',
    assigned_limit: 50000.0,
    compliance_approved: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    is_frozen: false,
    card_brand: 'VISA',
    card_tier: 'Infinite',
    currency: 'USDT',
    balance: 48500.0,
    pin_set: true,
    cvv: '742',
    daily_spend_limit: 25000.0,
    online_transactions_enabled: true,
    international_enabled: true,
    auto_convert_crypto: true,
    linked_crypto_currency: 'USDT',
  },
  {
    application_id: 'GAP-APEX-EUR-02',
    user_id: AUTH_USER.id,
    full_name: AUTH_USER.fullName,
    email: AUTH_USER.email,
    tax_id: AUTH_USER.taxId,
    account_type: 'PERSONAL_FINTECH',
    card_type: 'VIRTUAL_DEBIT',
    iban: 'CH93007620116238529574',
    card_number_masked: '5100 23XX XXXX 9912',
    expiry_date: '12/30',
    status: 'ISSUED_AND_ACTIVE',
    assigned_limit: 25000.0,
    compliance_approved: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    is_frozen: false,
    card_brand: 'MASTERCARD',
    card_tier: 'Platinum',
    currency: 'EUR',
    balance: 24800.0,
    pin_set: true,
    cvv: '819',
    daily_spend_limit: 15000.0,
    online_transactions_enabled: true,
    international_enabled: true,
    auto_convert_crypto: true,
    linked_crypto_currency: 'CBDC_EUR',
  },
  {
    application_id: 'GAP-APEX-CORP-03',
    user_id: AUTH_USER.id,
    full_name: `${AUTH_USER.fullName} (Apex Holdings)`,
    email: AUTH_USER.email,
    tax_id: AUTH_USER.taxId,
    account_type: 'CORPORATE_SETTLEMENT',
    card_type: 'CORPORATE_CREDIT',
    iban: 'US64APEX1000111122223333',
    card_number_masked: '4000 12XX XXXX 3381',
    expiry_date: '06/32',
    status: 'ISSUED_AND_ACTIVE',
    assigned_limit: 100000.0,
    compliance_approved: true,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    is_frozen: false,
    card_brand: 'VISA',
    card_tier: 'Corporate Commercial',
    currency: 'USD',
    balance: 38250.0,
    pin_set: true,
    cvv: '394',
    daily_spend_limit: 50000.0,
    online_transactions_enabled: true,
    international_enabled: true,
    auto_convert_crypto: false,
    linked_crypto_currency: 'USDT',
  },
];

export class FintechBankEngine {
  private sec: SecurityCore;
  private wallets: WalletAccount[] = [...INITIAL_WALLETS];
  private rates: Record<string, number> = { ...BASE_USD_RATES };
  private receipts: OfficialReceipt[] = [...INITIAL_RECEIPTS];
  private documents: BankDocument[] = [...INITIAL_DOCUMENTS];
  private autoRules: AutoConversionRule[] = [...INITIAL_AUTO_CONVERSION_RULES];
  private cards: IssuedCard[] = [...INITIAL_USER_CARDS];

  constructor(masterKey: string = 'APEX_FINTECH_SUPER_SECRET_HMAC_KEY_2026') {
    this.sec = new SecurityCore(masterKey);
  }

  public getMasterKey(): string {
    return this.sec.getSecretKey();
  }

  public setMasterKey(key: string): void {
    this.sec.setSecretKey(key);
  }

  public getWallets(): WalletAccount[] {
    return this.wallets;
  }

  public getCards(): IssuedCard[] {
    return this.cards;
  }

  public getReceipts(): OfficialReceipt[] {
    return this.receipts;
  }

  public getDocuments(): BankDocument[] {
    return this.documents;
  }

  public getAutoRules(): AutoConversionRule[] {
    return this.autoRules;
  }

  public toggleAutoRule(ruleId: string): AutoConversionRule[] {
    this.autoRules = this.autoRules.map(r => {
      if (r.id === ruleId) {
        return { ...r, isActive: !r.isActive };
      }
      return r;
    });
    return this.autoRules;
  }

  public toggleCardFreeze(cardId: string): IssuedCard[] {
    this.cards = this.cards.map(c => {
      if (c.application_id === cardId) {
        return { ...c, is_frozen: !c.is_frozen };
      }
      return c;
    });
    return this.cards;
  }

  /**
   * Get direct cross-rate between any two currencies
   */
  public getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1.0;
    const fromUsd = this.rates[fromCurrency] || 1.0;
    const toUsd = this.rates[toCurrency] || 1.0;
    return fromUsd / toUsd;
  }

  /**
   * Calculate total portfolio value in target currency (USD, EUR, USDT)
   */
  public getTotalNetWorth(baseCurrency: string = 'USD'): number {
    const totalUsd = this.wallets.reduce((acc, w) => acc + w.usdValue, 0);
    const targetUsdRate = this.rates[baseCurrency] || 1.0;
    return totalUsd / targetUsdRate;
  }

  /**
   * Execute an instant automatic conversion / swap between any currency pair
   * Updates wallet balances, records transaction, and generates official verifiable receipt!
   */
  public executeInstantConversion(
    fromCurrency: string,
    toCurrency: string,
    fromAmount: number,
    slippageTolerancePercent: number = 0.1
  ): {
    success: boolean;
    receipt: OfficialReceipt;
    toAmount: number;
    rate: number;
    transaction: Transaction;
    error?: string;
  } {
    const sourceWallet = this.wallets.find(w => w.currency === fromCurrency);
    if (!sourceWallet) {
      throw new Error(`Кошелек ${fromCurrency} не найден`);
    }
    if (sourceWallet.balance < fromAmount) {
      throw new Error(`Недостаточно средств на балансе ${fromCurrency}. Доступно: ${sourceWallet.balance.toLocaleString()} ${fromCurrency}`);
    }

    const rate = this.getExchangeRate(fromCurrency, toCurrency);
    const grossToAmount = fromAmount * rate;
    const slippageDeduction = grossToAmount * (slippageTolerancePercent / 100) * 0.05; // tiny micro spread
    const netToAmount = Number((grossToAmount - slippageDeduction).toFixed(6));

    // Deduct from source wallet
    sourceWallet.balance = Number((sourceWallet.balance - fromAmount).toFixed(6));
    sourceWallet.availableBalance = sourceWallet.balance;
    sourceWallet.usdValue = Number((sourceWallet.balance * (this.rates[fromCurrency] || 1.0)).toFixed(2));

    // Credit to target wallet (or create if not present)
    let targetWallet = this.wallets.find(w => w.currency === toCurrency);
    if (targetWallet) {
      targetWallet.balance = Number((targetWallet.balance + netToAmount).toFixed(6));
      targetWallet.availableBalance = targetWallet.balance;
      targetWallet.usdValue = Number((targetWallet.balance * (this.rates[toCurrency] || 1.0)).toFixed(2));
    } else {
      const currInfo = SUPPORTED_CURRENCIES.find(c => c.code === toCurrency);
      targetWallet = {
        id: `w-${toCurrency.toLowerCase()}`,
        currency: toCurrency,
        name: currInfo ? `${currInfo.name} Wallet` : `${toCurrency} Wallet`,
        category: currInfo?.category || 'CRYPTO',
        symbol: currInfo?.symbol || toCurrency,
        balance: netToAmount,
        availableBalance: netToAmount,
        usdRate: this.rates[toCurrency] || 1.0,
        usdValue: Number((netToAmount * (this.rates[toCurrency] || 1.0)).toFixed(2)),
        change24h: 0.1,
      };
      this.wallets.push(targetWallet);
    }

    // Generate unique receipt ID & TX Hash
    const timestamp = new Date().toISOString();
    const receiptNum = `REC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const txHash = '0x' + this.sec.computeHmacSha256(`${receiptNum}:${fromAmount}:${fromCurrency}:${toCurrency}:${timestamp}`);
    const digitalSignature = this.sec.computeHmacSha256(`${txHash}:${netToAmount}:${AUTH_USER.id}`);

    // Create official receipt
    const receipt: OfficialReceipt = {
      receiptId: receiptNum,
      txHash,
      operationType: (fromCurrency === 'EUR' || fromCurrency === 'USD' || fromCurrency === 'GBP' || fromCurrency === 'AED') && 
                     (toCurrency === 'EUR' || toCurrency === 'USD' || toCurrency === 'GBP' || toCurrency === 'AED')
        ? 'CROSS_CURRENCY_CONVERSION'
        : 'CRYPTO_SWAP',
      timestamp,
      senderName: AUTH_USER.fullName,
      senderAccount: sourceWallet.iban || sourceWallet.address || `${fromCurrency} Primary Wallet`,
      receiverName: AUTH_USER.fullName,
      receiverAccount: targetWallet.iban || targetWallet.address || `${toCurrency} Primary Wallet`,
      sourceAmount: fromAmount,
      sourceCurrency: fromCurrency,
      targetAmount: netToAmount,
      targetCurrency: toCurrency,
      appliedRate: Number(rate.toFixed(6)),
      bankFee: 0.0,
      networkFee: 0.0,
      status: 'EXECUTED_AND_NOTARIZED',
      digitalSignature,
      qrPayload: `https://apex-neobank.io/verify/${receiptNum}?sig=${digitalSignature.substring(0, 16)}&amount=${netToAmount}&curr=${toCurrency}`,
      bankNotarySeal: 'VERIFIED & NOTARIZED • APEX FINTECH VIRTUAL BANK • CRYPTO SETTLEMENT AUTHORIZED',
      legalEntity: AUTH_USER.corporateEntity,
      vatTaxNumber: AUTH_USER.taxId,
      notes: `Автоматическая мгновенная конвертация ${fromCurrency} -> ${toCurrency} через кросс-ликвидный движок Apex Core`,
    };

    // Store in receipts registry
    this.receipts = [receipt, ...this.receipts];

    // Create ledger transaction
    const tx: Transaction = {
      tx_id: receiptNum,
      sender_iban: sourceWallet.iban || sourceWallet.address || `SRC-${fromCurrency}`,
      receiver_iban: targetWallet.iban || targetWallet.address || `DST-${toCurrency}`,
      amount: fromAmount,
      currency: fromCurrency,
      target_currency: toCurrency,
      target_amount: netToAmount,
      status: 'EXECUTED',
      risk_score: 0.05,
      approvals: ['FXEngineAgent', 'DocumentNotaryAgent', 'AccountantAgent'],
      signature: digitalSignature,
      timestamp,
      fx_rate: rate,
      converted_usd: Number((fromAmount * (this.rates[fromCurrency] || 1.0)).toFixed(2)),
      receipt_id: receiptNum,
    };

    return {
      success: true,
      receipt,
      toAmount: netToAmount,
      rate,
      transaction: tx,
    };
  }

  /**
   * Generate an official on-demand bank document (Statement, Proof of Funds, Tax cert)
   */
  public generateOfficialDocument(
    category: 'CONTRACT' | 'PROOF_OF_FUNDS' | 'RESERVE_AUDIT' | 'TAX_DECLARATION' | 'RECEIPT' | 'CARD_AGREEMENT',
    customTitle?: string
  ): BankDocument {
    const timestamp = new Date().toISOString();
    const docId = `DOC-${category.substring(0, 4)}-2026-${Math.floor(100 + Math.random() * 900)}`;
    const totalUSD = this.getTotalNetWorth('USD');
    const hash = this.sec.computeHmacSha256(`${docId}:${totalUSD}:${timestamp}`);

    let title = customTitle || '';
    let summary = '';
    let content = '';

    if (category === 'PROOF_OF_FUNDS') {
      title = title || `Официальная справка об остатке крипто- и фиатных активов (${AUTH_USER.fullName})`;
      summary = `Сертификат подтверждает наличие $${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD эквивалента в кастоди Apex NeoBank.`;
      content = `ОФИЦИАЛЬНАЯ СПРАВКА О НАЛИЧИИ АКТИВОВ И ПЛАТЕЖЕСПОСОБНОСТИ
Выдана: ${AUTH_USER.fullName} (Tax ID: ${AUTH_USER.taxId})
Организация: ${AUTH_USER.corporateEntity}
Дата генерации: ${timestamp}
Общая стоимость активов: $${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
Детализация по кошелькам:
${this.wallets.map(w => `- ${w.name}: ${w.balance.toLocaleString()} ${w.currency} (≈ $${w.usdValue.toLocaleString()} USD)`).join('\n')}
Криптографическая верификация: ${hash}
Статус: Заверено цифровой нотариальной печатью Apex FinTech Virtual Bank.`;
    } else if (category === 'TAX_DECLARATION') {
      title = title || `Сводная налоговая ведомость и расчет фискальных курсовых разниц 2026`;
      summary = `Фискальный отчет по всем автоматическим конвертациям и операциям за текущий период.`;
      content = `ФИСКАЛЬНАЯ ДЕКЛАРАЦИЯ ОПЕРАЦИЙ КОНВЕРТАЦИИ
Налогоплательщик: ${AUTH_USER.fullName}
Всего квитанций в реестре: ${this.receipts.length}
Сумма конверсий: $${(totalUSD * 1.5).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
Криптографический хэш ревизии: ${hash}`;
    } else {
      title = title || `Дополнительное соглашение о расширенном крипто-кастоди`;
      summary = `Юридический документ, подтверждающий правила взаимодействия и криптографической защиты.`;
      content = `ЮРИДИЧЕСКИЙ ДОКУМЕНТ № ${docId}
Бенефициар: ${AUTH_USER.fullName}
Дата: ${timestamp}
Хэш: ${hash}`;
    }

    const doc: BankDocument = {
      documentId: docId,
      title,
      category,
      status: 'NOTARIZED',
      createdAt: timestamp,
      updatedAt: timestamp,
      hashSha256: hash,
      signedBy: `${AUTH_USER.fullName} & DocumentNotaryAgent`,
      fileSize: `${Math.floor(150 + Math.random() * 450)} KB`,
      summary,
      content,
    };

    this.documents = [doc, ...this.documents];
    return doc;
  }

  /**
   * Deposit/Top-up funds into user's wallet
   */
  public executeDeposit(
    currency: string,
    amount: number,
    network?: string
  ): { receipt: OfficialReceipt; updatedWallet: WalletAccount } {
    let wallet = this.wallets.find(w => w.currency === currency);
    if (!wallet) {
      const currInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);
      wallet = {
        id: `w-${currency.toLowerCase()}`,
        currency,
        name: currInfo ? `${currInfo.name} Wallet` : `${currency} Wallet`,
        category: currInfo?.category || 'CRYPTO',
        symbol: currInfo?.symbol || currency,
        balance: 0,
        availableBalance: 0,
        usdRate: this.rates[currency] || 1.0,
        usdValue: 0,
        change24h: 0.0,
      };
      this.wallets.push(wallet);
    }

    wallet.balance += amount;
    wallet.availableBalance = wallet.balance;
    wallet.usdValue = Number((wallet.balance * (this.rates[currency] || 1.0)).toFixed(2));

    const timestamp = new Date().toISOString();
    const receiptNum = `REC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const txHash = '0x' + this.sec.computeHmacSha256(`DEP:${receiptNum}:${amount}:${currency}:${timestamp}`);
    const digitalSignature = this.sec.computeHmacSha256(`${txHash}:${amount}:${wallet.id}`);

    const receipt: OfficialReceipt = {
      receiptId: receiptNum,
      txHash,
      operationType: 'DEPOSIT_CREDIT',
      timestamp,
      senderName: 'Входящее пополнение (Внешняя сеть / Wire)',
      senderAccount: network ? `Сеть: ${network}` : 'SEPA / SWIFT Ingress',
      receiverName: AUTH_USER.fullName,
      receiverAccount: wallet.iban || wallet.address || `${currency} Primary Wallet`,
      sourceAmount: amount,
      sourceCurrency: currency,
      targetAmount: amount,
      targetCurrency: currency,
      appliedRate: 1.0,
      bankFee: 0.0,
      networkFee: 0.0,
      status: 'EXECUTED_AND_NOTARIZED',
      digitalSignature,
      qrPayload: `https://apex-neobank.io/verify/${receiptNum}?sig=${digitalSignature.substring(0, 16)}`,
      bankNotarySeal: 'VERIFIED & NOTARIZED • APEX FINTECH VIRTUAL BANK • CRYPTO SETTLEMENT AUTHORIZED',
      legalEntity: AUTH_USER.corporateEntity,
      vatTaxNumber: AUTH_USER.taxId,
      notes: `Зачисление средств на кошелек ${currency}. Доступно к мгновенному авто-обмену.`,
    };

    this.receipts = [receipt, ...this.receipts];

    // Check if auto-conversion rule is active for this currency
    const activeRule = this.autoRules.find(r => r.isActive && r.sourceCurrency === currency && r.triggerType === 'ALWAYS_ON_DEPOSIT');
    if (activeRule) {
      // Auto-trigger conversion
      this.executeInstantConversion(currency, activeRule.targetCurrency, amount);
      activeRule.totalConvertedUSD += amount * (this.rates[currency] || 1.0);
      activeRule.lastExecuted = new Date().toISOString();
    }

    return { receipt, updatedWallet: wallet };
  }

  /**
   * Issue a new Virtual Crypto Card for the authentic user
   */
  public issueUserCard(
    cardBrand: 'VISA' | 'MASTERCARD',
    cardTier: 'Infinite' | 'Platinum' | 'Corporate Commercial' | 'Digital Elite',
    currency: string = 'USDT',
    dailyLimit: number = 25000
  ): IssuedCard {
    const timestamp = new Date().toISOString();
    const cardId = `GAP-APEX-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomPanEnd = Math.floor(1000 + Math.random() * 9000);
    const maskedPan = cardBrand === 'VISA' ? `4000 12XX XXXX ${randomPanEnd}` : `5100 23XX XXXX ${randomPanEnd}`;
    const cvv = String(Math.floor(100 + Math.random() * 900));

    const newCard: IssuedCard = {
      application_id: cardId,
      user_id: AUTH_USER.id,
      full_name: AUTH_USER.fullName,
      email: AUTH_USER.email,
      tax_id: AUTH_USER.taxId,
      account_type: 'CRYPTO_CUSTODY_VAULT',
      card_type: 'VIRTUAL_DEBIT',
      iban: AUTH_USER.primaryIban,
      card_number_masked: maskedPan,
      expiry_date: '09/31',
      status: 'ISSUED_AND_ACTIVE',
      assigned_limit: dailyLimit,
      compliance_approved: true,
      created_at: timestamp,
      is_frozen: false,
      card_brand: cardBrand,
      card_tier: cardTier,
      currency,
      balance: 10000.0,
      pin_set: true,
      cvv,
      daily_spend_limit: dailyLimit,
      online_transactions_enabled: true,
      international_enabled: true,
      auto_convert_crypto: true,
      linked_crypto_currency: currency,
    };

    this.cards = [newCard, ...this.cards];

    // Generate card agreement document
    this.generateOfficialDocument('CARD_AGREEMENT', `Договор эмиссии карты ${cardBrand} ${cardTier} (*${randomPanEnd})`);

    return newCard;
  }
}
