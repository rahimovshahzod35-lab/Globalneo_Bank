export type TransactionStatus = 
  | 'PENDING' 
  | 'PROCESSING' 
  | 'EXECUTED' 
  | 'BLOCKED' 
  | 'REJECTED_BY_COMPLIANCE';

export type CurrencyCategory = 'FIAT' | 'CRYPTO' | 'CBDC';

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  category: CurrencyCategory;
  decimals: number;
  icon: string;
  network?: string;
  flag?: string;
}

export interface WalletAccount {
  id: string;
  currency: string;
  name: string;
  category: CurrencyCategory;
  symbol: string;
  balance: number;
  availableBalance: number;
  usdRate: number;
  usdValue: number;
  change24h: number;
  address?: string;
  network?: string;
  iban?: string;
  swift?: string;
  qrCodeUrl?: string;
}

export interface ExchangeRate {
  pair: string; // e.g. "EUR/USD", "BTC/USDT", "USDT/EUR"
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  bid: number;
  ask: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdated: string;
}

export interface AutoConversionRule {
  id: string;
  title: string;
  description: string;
  sourceCurrency: string;
  targetCurrency: string;
  triggerType: 'ALWAYS_ON_DEPOSIT' | 'THRESHOLD_REBALANCE' | 'CARD_POS_AUTOCONVERT' | 'SCHEDULED';
  thresholdAmount?: number;
  targetAllocationPercent?: number;
  isActive: boolean;
  totalConvertedUSD: number;
  lastExecuted?: string;
}

export interface OfficialReceipt {
  receiptId: string;
  txHash: string;
  operationType: 
    | 'CRYPTO_SWAP' 
    | 'CROSS_CURRENCY_CONVERSION' 
    | 'SEPA_WIRE_TRANSFER' 
    | 'CRYPTO_BLOCKCHAIN_PAYMENT' 
    | 'VIRTUAL_CARD_TRANSACTION' 
    | 'DEPOSIT_CREDIT' 
    | 'YIELD_PAYOUT';
  timestamp: string;
  senderName: string;
  senderAccount: string;
  receiverName: string;
  receiverAccount: string;
  sourceAmount: number;
  sourceCurrency: string;
  targetAmount: number;
  targetCurrency: string;
  appliedRate: number;
  bankFee: number;
  networkFee: number;
  status: 'EXECUTED_AND_NOTARIZED' | 'PROCESSING' | 'FLAGGED';
  digitalSignature: string;
  qrPayload: string;
  bankNotarySeal: string;
  legalEntity: string;
  vatTaxNumber: string;
  notes?: string;
}

export interface BankDocument {
  documentId: string;
  title: string;
  category: 'CONTRACT' | 'PROOF_OF_FUNDS' | 'RESERVE_AUDIT' | 'TAX_DECLARATION' | 'RECEIPT' | 'CARD_AGREEMENT';
  status: 'NOTARIZED' | 'ACTIVE' | 'SIGNED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  hashSha256: string;
  signedBy: string;
  fileSize: string;
  summary: string;
  content: string;
  downloadUrl?: string;
  metadata?: Record<string, any>;
}

export interface Transaction {
  tx_id: string;
  sender_iban: string;
  receiver_iban: string;
  amount: number;
  currency: string;
  swift_code?: string;
  network?: string;
  status: TransactionStatus;
  risk_score: number;
  approvals: string[];
  signature?: string;
  timestamp: string;
  fx_rate?: number;
  converted_usd?: number;
  rejection_reason?: string;
  receipt_id?: string;
  target_currency?: string;
  target_amount?: number;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agentName: string;
  role: string;
  action: string;
  details: Record<string, any>;
  level?: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  raw_text?: string;
}

export interface BankAgent {
  id: string;
  name: string;
  role: string;
  system_prompt: string;
  category: 'Market & Liquidity' | 'Risk & AML' | 'Legal & Compliance' | 'Treasury & Ledger' | 'Security & Infrastructure';
  status: 'IDLE' | 'ACTIVE' | 'PROCESSING' | 'FLAGGED';
  totalTasks: number;
  approvals: number;
  rejections: number;
  iconName: string;
  isCorePythonAgent?: boolean;
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  tag: 'Crypto Swap' | 'EUR SEPA' | 'USDT TRC20' | 'AML Blocked' | 'Sanctions Alert' | 'Swiss Clearing';
  expectedOutcome: 'REJECTED' | 'EXECUTED' | 'BLOCKED';
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  swiftCode: string;
  targetCurrency?: string;
}

export interface EngineStats {
  totalProcessed: number;
  totalVolumeUSD: number;
  executedCount: number;
  rejectedCount: number;
  blockedCount: number;
  activeAgentsCount: number;
  cardsIssuedCount?: number;
  totalNetWorthUSD: number;
  totalReceiptsCount: number;
  totalDocumentsCount: number;
}

export type AccountType = 
  | 'PERSONAL_FINTECH'
  | 'CORPORATE_SETTLEMENT'
  | 'CRYPTO_CUSTODY_VAULT';

export type CardType = 
  | 'VIRTUAL_DEBIT'
  | 'PHYSICAL_DEBIT'
  | 'CORPORATE_CREDIT';

export interface CardApplicationRequest {
  user_id: string;
  full_name: string;
  email: string;
  tax_id: string;
  account_type: AccountType;
  card_type: CardType;
  requested_credit_limit: number;
  primary_currency?: string;
  linked_wallet_id?: string;
  auto_convert_crypto?: boolean;
}

export interface CardApplicationResponse {
  application_id: string;
  iban: string;
  card_number_masked: string;
  expiry_date: string;
  status: string;
  assigned_limit: number;
  compliance_approved: boolean;
  rejection_reason?: string;
}

export interface IssuedCard extends CardApplicationResponse {
  user_id: string;
  full_name: string;
  email: string;
  tax_id: string;
  account_type: AccountType;
  card_type: CardType;
  created_at: string;
  is_frozen: boolean;
  card_brand: 'VISA' | 'MASTERCARD';
  card_tier: 'Infinite' | 'Platinum' | 'Corporate Commercial' | 'Digital Elite';
  currency: string;
  balance: number;
  pin_set: boolean;
  cvv: string;
  daily_spend_limit: number;
  online_transactions_enabled: boolean;
  international_enabled: boolean;
  auto_convert_crypto?: boolean;
  linked_crypto_currency?: string;
}

export interface MultiAgentReport {
  reportId: string;
  title: string;
  targetSubject: string;
  timestamp: string;
  overallVerdict: 'APPROVED' | 'REJECTED' | 'WARNING' | 'NEEDS_OVERRIDE';
  executiveSummary: string;
  metrics: {
    label: string;
    value: string;
    status: 'good' | 'warn' | 'bad' | 'neutral';
  }[];
  agentVotes: {
    agentId: string;
    agentName: string;
    vote: 'APPROVED' | 'REJECTED' | 'NEUTRAL';
    comment: string;
  }[];
  securityProof: {
    hmacSignature: string;
    timestamp: string;
    verified: boolean;
    hashAlg: string;
  };
  actionItems: string[];
  receiptGenerated?: OfficialReceipt;
}

export interface MultiAgentChatMessage {
  id: string;
  senderType: 'user' | 'agent' | 'system';
  agentId?: string;
  agentName?: string;
  role?: string;
  recipientAgentId?: string;
  recipientName?: string;
  content: string;
  timestamp: string;
  sentiment?: 'neutral' | 'positive' | 'warning' | 'critical';
  metadata?: Record<string, any>;
  handOffTo?: string;
  requiresUserAction?: boolean;
  actionTaken?: 'approved' | 'vetoed' | 'delegated';
  reportData?: MultiAgentReport;
  receiptData?: OfficialReceipt;
}

export interface MultiAgentDirectivePreset {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  targetAgents: string[];
}
