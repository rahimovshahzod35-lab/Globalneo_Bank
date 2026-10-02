import { CardApplicationRequest, CardApplicationResponse, IssuedCard, AgentLog } from '../types';

/**
 * SHA-256 helper using Web Crypto API to match Python's hashlib.sha256().hexdigest()
 */
export async function sha256Hex(message: string): Promise<string> {
  const enc = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', enc.encode(message));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generates a pseudo-random hex string matching Python uuid.uuid4().hex[:8].upper()
 */
export function generateUuidHex8(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
  }
  return Math.random().toString(16).substring(2, 10).toUpperCase();
}

export interface CardIssuanceCallbacks {
  onStepStart?: (agentId: string, stepName: string) => void;
  onStepComplete?: (agentId: string, log: AgentLog) => void;
}

/**
 * AutonomousAgentCore: matching Python implementation
 */
export class AutonomousAgentCore {
  /**
   * KYC & AML verification against sanctions registries
   * Python: await asyncio.sleep(0.05); return True if not tax_id.startswith("000") else False
   */
  public static async runKycAmlCheck(taxId: string, _name: string, delayMs: number = 200): Promise<boolean> {
    if (delayMs > 0) {
      await new Promise(r => setTimeout(r, delayMs));
    }
    const cleanTax = taxId.trim();
    if (cleanTax.startsWith('000')) {
      return false; // Flagged tax ID
    }
    return true;
  }

  /**
   * Autonomous credit scoring algorithm
   * Python: await asyncio.sleep(0.05); return min(requested_limit, 15000.0)
   */
  public static async runCreditScoring(requestedLimit: number, _taxId: string, delayMs: number = 200): Promise<number> {
    if (delayMs > 0) {
      await new Promise(r => setTimeout(r, delayMs));
    }
    return Math.min(requestedLimit || 0, 15000.0);
  }
}

/**
 * Autonomous Card Issuing Core v2.0.0
 * Translates FastAPI endpoint: POST /api/v1/cards/issue
 */
export class CardIssuingEngine {
  /**
   * Processes a card application through the Autonomous Multi-Agent Core
   */
  public async processCardApplication(
    payload: CardApplicationRequest,
    callbacks?: CardIssuanceCallbacks,
    stepDelayMs: number = 400
  ): Promise<{
    response: CardApplicationResponse;
    issuedCard?: IssuedCard;
    logs: AgentLog[];
    httpStatus: number;
    errorDetail?: string;
  }> {
    const logs: AgentLog[] = [];

    // Init Log
    const initLog: AgentLog = {
      id: `log-card-${Date.now()}-0`,
      timestamp: new Date().toISOString(),
      agentName: 'GlobalBankEngine',
      role: 'Card Issuing Core v2.0.0',
      action: '--- INITIATE CARD ISSUING PROTOCOL ---',
      details: {
        user_id: payload.user_id,
        account_type: payload.account_type,
        card_type: payload.card_type,
        requested_limit: payload.requested_credit_limit,
      },
      level: 'INFO',
      raw_text: `POST /api/v1/cards/issue - Payload: user=${payload.user_id} card=${payload.card_type} tax=${payload.tax_id}`,
    };
    logs.push(initLog);
    callbacks?.onStepComplete?.('audit', initLog);

    // 1. ComplianceLawyerAgent KYC/AML
    callbacks?.onStepStart?.('lawyer', 'KYC/AML Compliance Screening');
    const kycPassed = await AutonomousAgentCore.runKycAmlCheck(payload.tax_id, payload.full_name, stepDelayMs);

    if (!kycPassed) {
      const kycErrorLog: AgentLog = {
        id: `log-card-${Date.now()}-1`,
        timestamp: new Date().toISOString(),
        agentName: 'LawyerAgent',
        role: 'Legal & Compliance Officer',
        action: 'KYC_AML_REJECTION',
        details: {
          tax_id: payload.tax_id,
          full_name: payload.full_name,
          error: 'Tax ID flag detected (prefix 000)',
          sanction_status: 'FLAGGED_HIGH_RISK',
        },
        level: 'ERROR',
        raw_text: `HTTP 403 Forbidden: KYC/AML Compliance rejection: Tax ID flag detected for ${payload.tax_id}`,
      };
      logs.push(kycErrorLog);
      callbacks?.onStepComplete?.('lawyer', kycErrorLog);

      return {
        response: {
          application_id: `GAP-REJECTED`,
          iban: 'UNASSIGNED',
          card_number_masked: 'XXXX XXXX XXXX XXXX',
          expiry_date: '09/31',
          status: 'REJECTED_BY_COMPLIANCE',
          assigned_limit: 0.0,
          compliance_approved: false,
          rejection_reason: 'KYC/AML Compliance rejection: Tax ID flag detected.',
        },
        logs,
        httpStatus: 403,
        errorDetail: 'KYC/AML Compliance rejection: Tax ID flag detected.',
      };
    }

    const kycSuccessLog: AgentLog = {
      id: `log-card-${Date.now()}-1`,
      timestamp: new Date().toISOString(),
      agentName: 'LawyerAgent',
      role: 'Legal & Compliance Officer',
      action: 'KYC_AML_APPROVED',
      details: {
        tax_id: payload.tax_id,
        sanctions_match: false,
        pep_registry: 'CLEARED',
      },
      level: 'SUCCESS',
      raw_text: `ComplianceLawyerAgent: KYC/AML cleared for tax ID ${payload.tax_id}. Verification pass granted.`,
    };
    logs.push(kycSuccessLog);
    callbacks?.onStepComplete?.('lawyer', kycSuccessLog);

    // 2. RiskEconomistAgent Credit Scoring
    callbacks?.onStepStart?.('economist', 'Credit Scoring & Underwriting');
    let approvedLimit = 0.0;
    if (payload.card_type === 'CORPORATE_CREDIT') {
      approvedLimit = await AutonomousAgentCore.runCreditScoring(
        payload.requested_credit_limit,
        payload.tax_id,
        stepDelayMs
      );
      const scoringLog: AgentLog = {
        id: `log-card-${Date.now()}-2`,
        timestamp: new Date().toISOString(),
        agentName: 'EconomistAgent',
        role: 'Risk & AML Officer',
        action: 'CREDIT_LIMIT_CALCULATION',
        details: {
          requested: payload.requested_credit_limit,
          algorithmic_ceiling: 15000.0,
          assigned_limit: approvedLimit,
        },
        level: 'INFO',
        raw_text: `RiskEconomistAgent: Credit scoring calculated limit $${approvedLimit.toLocaleString()} (Requested: $${payload.requested_credit_limit.toLocaleString()})`,
      };
      logs.push(scoringLog);
      callbacks?.onStepComplete?.('economist', scoringLog);
    } else {
      const debitLog: AgentLog = {
        id: `log-card-${Date.now()}-2`,
        timestamp: new Date().toISOString(),
        agentName: 'EconomistAgent',
        role: 'Risk & AML Officer',
        action: 'DEBIT_TIER_APPROVED',
        details: {
          card_type: payload.card_type,
          credit_exposure: 0.0,
        },
        level: 'INFO',
        raw_text: `RiskEconomistAgent: Zero credit exposure required for ${payload.card_type}. Proceeding to settlement tier.`,
      };
      logs.push(debitLog);
      callbacks?.onStepComplete?.('economist', debitLog);
    }

    // 3. AccountantAgent - Profile & Account Generation
    callbacks?.onStepStart?.('accountant', 'Financial Profile & PAN Generation');
    if (stepDelayMs > 0) {
      await new Promise(r => setTimeout(r, stepDelayMs));
    }

    const rawHex = generateUuidHex8();
    const appId = `GAP-${rawHex}`;

    // SHA-256 hash of tax_id
    const taxHash = await sha256Hex(payload.tax_id);
    const generatedIban = `GB89GLOB${taxHash.substring(0, 14).toUpperCase()}`;

    // SHA-256 hash of app_id
    const appHash = await sha256Hex(appId);
    const panMasked = `4000 12XX XXXX ${appHash.substring(0, 4)}`;

    const accountantLog: AgentLog = {
      id: `log-card-${Date.now()}-3`,
      timestamp: new Date().toISOString(),
      agentName: 'AccountantAgent',
      role: 'Chief Accountant & Ledger Officer',
      action: 'FINANCIAL_PROFILE_GENERATED',
      details: {
        application_id: appId,
        iban: generatedIban,
        pan_masked: panMasked,
        expiry: '09/31',
        status: 'ISSUED_AND_ACTIVE',
      },
      level: 'SUCCESS',
      raw_text: `AccountantAgent: Provisioned IBAN ${generatedIban} with PAN ${panMasked}. Status: ISSUED_AND_ACTIVE`,
    };
    logs.push(accountantLog);
    callbacks?.onStepComplete?.('accountant', accountantLog);

    const response: CardApplicationResponse = {
      application_id: appId,
      iban: generatedIban,
      card_number_masked: panMasked,
      expiry_date: '09/31',
      status: 'ISSUED_AND_ACTIVE',
      assigned_limit: approvedLimit,
      compliance_approved: true,
    };

    const issuedCard: IssuedCard = {
      ...response,
      user_id: payload.user_id,
      full_name: payload.full_name,
      email: payload.email,
      tax_id: payload.tax_id,
      account_type: payload.account_type,
      card_type: payload.card_type,
      created_at: new Date().toISOString(),
      is_frozen: false,
      card_brand: payload.card_type === 'CORPORATE_CREDIT' ? 'MASTERCARD' : 'VISA',
      card_tier: payload.card_type === 'CORPORATE_CREDIT' 
        ? 'Corporate Commercial' 
        : payload.card_type === 'VIRTUAL_DEBIT' 
        ? 'Digital Elite' 
        : 'Platinum',
      currency: 'USD',
      balance: payload.card_type === 'CORPORATE_CREDIT' ? approvedLimit : 5000.0,
      pin_set: true,
      cvv: String(Math.floor(100 + Math.random() * 900)),
      daily_spend_limit: payload.card_type === 'CORPORATE_CREDIT' ? approvedLimit : 2500.0,
      online_transactions_enabled: true,
      international_enabled: true,
    };

    return {
      response,
      issuedCard,
      logs,
      httpStatus: 201,
    };
  }
}
