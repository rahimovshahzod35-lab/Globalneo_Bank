import { sha256Hex, generateUuidHex8, AutonomousAgentCore } from './cardIssuingEngine';
import { CardApplicationResponse, IssuedCard } from '../types';
import { FX_RATES } from './bankEngine';
import { AUTH_USER } from './fintechEngine';

/**
 * Event emitter for newly issued cards via API
 */
export const CARD_ISSUED_EVENT = 'gb:card_issued';

export interface CardIssuedEventDetail {
  response: CardApplicationResponse;
  issuedCard: IssuedCard;
  rawPayload: any;
}

// In-memory collection of issued cards for api mock
const STORED_CARDS: IssuedCard[] = [];

/**
 * Handles /api/v1 calls directly, returning standard Response objects.
 * Falls back to native fetch for non-API requests.
 */
export async function cardApiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  // GET /api/v1/rates
  if (url.includes('/api/v1/rates') && (!init || init.method === 'GET' || !init.method)) {
    return new Response(JSON.stringify({
      base: 'USD',
      timestamp: new Date().toISOString(),
      rates: FX_RATES
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // GET /api/v1/health
  if (url.includes('/api/v1/health') && (!init || init.method === 'GET' || !init.method)) {
    return new Response(JSON.stringify({
      status: 'HEALTHY',
      service: 'Global Bank - Autonomous Card Issuing Core',
      version: '2.0.0',
      agents_online: 10,
      security_core: 'HMAC-SHA256 ACTIVE',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // GET /api/v1/cards
  if (url.endsWith('/api/v1/cards') && (!init || init.method === 'GET' || !init.method)) {
    return new Response(JSON.stringify({
      total: STORED_CARDS.length,
      items: STORED_CARDS
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // POST /api/v1/cards/issue
  if (url.includes('/api/v1/cards/issue') && init && init.method === 'POST') {
    try {
      const bodyText = typeof init.body === 'string' ? init.body : '';
      const data = bodyText ? JSON.parse(bodyText) : {};

      // Support both camelCase and snake_case keys
      const userId = data.userId || data.user_id || AUTH_USER.id;
      const fullName = data.fullName || data.full_name || AUTH_USER.fullName;
      const email = data.email || AUTH_USER.email;
      const taxId = (data.taxId || data.tax_id || AUTH_USER.taxId).trim();
      const accountType = data.accountType || data.account_type || 'CRYPTO_CUSTODY_VAULT';
      const cardType = data.cardType || data.card_type || 'VIRTUAL_DEBIT';
      const requestedLimit = Number(data.requestedCreditLimit ?? data.requested_credit_limit ?? 0);

      // 1. KYC / AML screening (Prefix 000 flagged)
      const kycPassed = await AutonomousAgentCore.runKycAmlCheck(taxId, fullName, 100);

      if (!kycPassed) {
        const errorPayload = {
          detail: 'Compliance check failed: Tax ID flagged in AML watchlists',
          status: 'REJECTED_BY_COMPLIANCE',
          application_id: 'GAP-REJECTED',
          iban: 'UNASSIGNED',
          card_number_masked: 'XXXX XXXX XXXX XXXX',
          assigned_limit: 0.0,
          compliance_approved: false,
        };

        return new Response(JSON.stringify(errorPayload), {
          status: 403,
          statusText: 'Forbidden',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 2. RiskEconomist Credit Scoring
      let assignedLimit = 0.0;
      if (cardType === 'CORPORATE_CREDIT') {
        assignedLimit = await AutonomousAgentCore.runCreditScoring(requestedLimit, taxId, 100);
      }

      // 3. Accountant SHA-256 Generation
      const rawHex = generateUuidHex8();
      const appId = `GAP-${rawHex}`;
      const taxHash = await sha256Hex(taxId || 'TAX-DEFAULT');
      const iban = `GB89GLOB${taxHash.substring(0, 14).toUpperCase()}`;
      const appHash = await sha256Hex(appId);
      const cardMask = `4000 12XX XXXX ${appHash.substring(0, 4)}`;

      const responseData: CardApplicationResponse = {
        application_id: appId,
        iban,
        card_number_masked: cardMask,
        expiry_date: '09/31',
        status: 'ISSUED_AND_ACTIVE',
        assigned_limit: assignedLimit,
        compliance_approved: true,
      };

      const issuedCard: IssuedCard = {
        ...responseData,
        user_id: userId,
        full_name: fullName,
        email,
        tax_id: taxId,
        account_type: accountType,
        card_type: cardType,
        created_at: new Date().toISOString(),
        is_frozen: false,
        card_brand: cardType === 'CORPORATE_CREDIT' ? 'MASTERCARD' : 'VISA',
        card_tier: cardType === 'CORPORATE_CREDIT' 
          ? 'Corporate Commercial' 
          : cardType === 'VIRTUAL_DEBIT' 
          ? 'Digital Elite' 
          : 'Platinum',
        currency: 'USD',
        balance: cardType === 'CORPORATE_CREDIT' ? assignedLimit : 5000.0,
        pin_set: true,
        cvv: String(Math.floor(100 + Math.random() * 900)),
        daily_spend_limit: cardType === 'CORPORATE_CREDIT' ? assignedLimit : 2500.0,
        online_transactions_enabled: true,
        international_enabled: true,
      };

      STORED_CARDS.push(issuedCard);

      // Dispatch window event so App or other tabs can sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent<CardIssuedEventDetail>(CARD_ISSUED_EVENT, {
            detail: {
              response: responseData,
              issuedCard,
              rawPayload: data,
            },
          })
        );
      }

      return new Response(JSON.stringify(responseData), {
        status: 201,
        statusText: 'Created',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('API Interceptor Error:', err);
      return new Response(
        JSON.stringify({ detail: 'Internal Server Error in Autonomous Core' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Fallback to native fetch if available
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    return window.fetch(input, init);
  }

  return new Response(JSON.stringify({ detail: 'Endpoint not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Safely attempts to intercept window.fetch if writable.
 * Never throws if window.fetch is a read-only property.
 */
export function setupCardApiInterceptor() {
  if (typeof window === 'undefined') return;

  try {
    const originalFetch = window.fetch;
    const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (url.includes('/api/v1/')) {
        return cardApiFetch(input, init);
      }
      return originalFetch.apply(window, [input, init]);
    };

    // Check if writable before assigning
    const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (descriptor && descriptor.writable === false && !descriptor.configurable) {
      // In WebKit/Safari where window.fetch is not writable and not configurable,
      // skip mutating window.fetch; cardApiFetch handles calls directly.
      return;
    }

    try {
      window.fetch = customFetch;
    } catch {
      try {
        Object.defineProperty(window, 'fetch', {
          value: customFetch,
          writable: true,
          configurable: true,
        });
      } catch {
        // Silently continue; direct calls to cardApiFetch are used
      }
    }
  } catch (err) {
    // Prevent any unhandled exception on startup
    console.warn('Notice: Global window.fetch is read-only in this environment:', err);
  }
}
