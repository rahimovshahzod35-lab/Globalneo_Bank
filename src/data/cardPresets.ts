import { CardApplicationRequest } from '../types';
import { AUTH_USER } from '../services/fintechEngine';

export interface CardPresetScenario {
  id: string;
  name: string;
  badge: 'Approved' | 'Limit Capped' | 'KYC Blocked' | 'VIP Corporate';
  description: string;
  expectedOutcome: 'APPROVED' | 'CAPPED' | 'REJECTED';
  request: CardApplicationRequest;
}

export const CARD_PRESET_SCENARIOS: CardPresetScenario[] = [
  {
    id: 'preset-apex-crypto-usdt',
    name: 'Apex Crypto Infinite Visa — USDT Web3 Settlement',
    badge: 'Approved',
    description: 'Мгновенный выпуск виртуальной карты Visa Infinite с авто-конвертацией USDT TRC-20/ERC-20 при покупках по всему миру. Нулевой спред.',
    expectedOutcome: 'APPROVED',
    request: {
      user_id: AUTH_USER.id,
      full_name: AUTH_USER.fullName,
      email: AUTH_USER.email,
      tax_id: AUTH_USER.taxId,
      account_type: 'CRYPTO_CUSTODY_VAULT',
      card_type: 'VIRTUAL_DEBIT',
      requested_credit_limit: 0.0,
      primary_currency: 'USDT',
      auto_convert_crypto: true,
    },
  },
  {
    id: 'preset-apex-euro-sepa',
    name: 'Euro Digital SEPA Mastercard — Instant EUR / CBDC',
    badge: 'Approved',
    description: 'Эмиссия дебетовой карты Platinum Mastercard, привязанной к европейскому счету SEPA Instant и Digital Euro DLT.',
    expectedOutcome: 'APPROVED',
    request: {
      user_id: AUTH_USER.id,
      full_name: AUTH_USER.fullName,
      email: AUTH_USER.email,
      tax_id: AUTH_USER.taxId,
      account_type: 'PERSONAL_FINTECH',
      card_type: 'VIRTUAL_DEBIT',
      requested_credit_limit: 0.0,
      primary_currency: 'EUR',
      auto_convert_crypto: true,
    },
  },
  {
    id: 'preset-apex-corporate-capped',
    name: 'Apex Corporate Commercial Visa — $50,000 Credit Pool',
    badge: 'VIP Corporate',
    description: 'Корпоративная кредитная карта для Apex Digital Assets & FinTech Holdings Ltd. Лимит согласован Казначейством под залог крипто-резервов.',
    expectedOutcome: 'APPROVED',
    request: {
      user_id: AUTH_USER.id,
      full_name: `${AUTH_USER.fullName} (${AUTH_USER.corporateEntity})`,
      email: AUTH_USER.email,
      tax_id: AUTH_USER.taxId,
      account_type: 'CORPORATE_SETTLEMENT',
      card_type: 'CORPORATE_CREDIT',
      requested_credit_limit: 50000.0,
      primary_currency: 'USD',
      auto_convert_crypto: false,
    },
  },
  {
    id: 'preset-apex-private-nomad',
    name: 'Apex Web3 Nomad Multi-Currency Card (TON & SOL Direct)',
    badge: 'Approved',
    description: 'Приватная мультивалютная карта с прямой привязкой к некастодиальным кошелькам TON & Solana и мгновенным POS авто-списанием.',
    expectedOutcome: 'APPROVED',
    request: {
      user_id: AUTH_USER.id,
      full_name: AUTH_USER.fullName,
      email: AUTH_USER.email,
      tax_id: AUTH_USER.taxId,
      account_type: 'CRYPTO_CUSTODY_VAULT',
      card_type: 'VIRTUAL_DEBIT',
      requested_credit_limit: 0.0,
      primary_currency: 'USDT',
      auto_convert_crypto: true,
    },
  },
];
