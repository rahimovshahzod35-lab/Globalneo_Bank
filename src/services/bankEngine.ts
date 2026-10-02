import { Transaction, AgentLog, BankAgent, TransactionStatus } from '../types';
import { SecurityCore } from './securityCore';

export const INITIAL_AGENTS: BankAgent[] = [
  {
    id: 'monitor',
    name: 'MonitoringAgent',
    role: 'Currency & Market Monitor',
    system_prompt: 'Отслеживает курсы валют, котировки и аномальные колебания 24/7.',
    category: 'Market & Liquidity',
    status: 'IDLE',
    totalTasks: 42,
    approvals: 42,
    rejections: 0,
    iconName: 'TrendingUp',
    isCorePythonAgent: true,
  },
  {
    id: 'economist',
    name: 'EconomistAgent',
    role: 'Risk & AML Officer',
    system_prompt: 'Анализирует финансовую стабильность и проверяет транзакции на фрод.',
    category: 'Risk & AML',
    status: 'IDLE',
    totalTasks: 42,
    approvals: 34,
    rejections: 8,
    iconName: 'ShieldAlert',
    isCorePythonAgent: true,
  },
  {
    id: 'lawyer',
    name: 'LawyerAgent',
    role: 'Legal & Compliance Officer',
    system_prompt: 'Проверяет соответствие транзакций международным правилам SWIFT, FATF и GDPR.',
    category: 'Legal & Compliance',
    status: 'IDLE',
    totalTasks: 42,
    approvals: 31,
    rejections: 11,
    iconName: 'Scale',
    isCorePythonAgent: true,
  },
  {
    id: 'accountant',
    name: 'AccountantAgent',
    role: 'Chief Accountant',
    system_prompt: 'Проводит бухгалтерские проводки, формирует балансы и закрывает реестры.',
    category: 'Treasury & Ledger',
    status: 'IDLE',
    totalTasks: 42,
    approvals: 31,
    rejections: 11,
    iconName: 'BookCheck',
    isCorePythonAgent: true,
  },
  {
    id: 'swift',
    name: 'SwiftGatewayAgent',
    role: 'SWIFT MT103 / ISO 20022 Gateway',
    system_prompt: 'Валидация форматов BIC/SWIFT, структуры pacs.008 и целостности пакета сообщений.',
    category: 'Security & Infrastructure',
    status: 'IDLE',
    totalTasks: 42,
    approvals: 42,
    rejections: 0,
    iconName: 'Globe',
    isCorePythonAgent: false,
  },
  {
    id: 'sanctions',
    name: 'SanctionsScreenerAgent',
    role: 'OFAC & PEP Sanctions Officer',
    system_prompt: 'Скрининг участников платежа по санкционным базам данных (OFAC, EU, UN, PEP).',
    category: 'Risk & AML',
    status: 'IDLE',
    totalTasks: 42,
    approvals: 41,
    rejections: 1,
    iconName: 'UserCheck',
    isCorePythonAgent: false,
  },
  {
    id: 'fraud',
    name: 'FraudDetectorAgent',
    role: 'Behavioral AI Fraud Sentinel',
    system_prompt: 'Анализ паттернов поведения, геолокации и частоты переводов между счетами.',
    category: 'Risk & AML',
    status: 'IDLE',
    totalTasks: 42,
    approvals: 38,
    rejections: 4,
    iconName: 'Eye',
    isCorePythonAgent: false,
  },
  {
    id: 'treasury',
    name: 'LiquidityReserveAgent',
    role: 'Treasury & Basel III Manager',
    system_prompt: 'Контроль резервов ликвидности ностро-корреспондентских счетов в банках-клирингах.',
    category: 'Treasury & Ledger',
    status: 'IDLE',
    totalTasks: 42,
    approvals: 40,
    rejections: 2,
    iconName: 'Coins',
    isCorePythonAgent: false,
  },
  {
    id: 'audit',
    name: 'AuditInspectorAgent',
    role: 'Forensic Audit & HMAC Verifier',
    system_prompt: 'Контроль криптографической подписи HMAC-SHA256 и неизменяемости блок-реестра.',
    category: 'Security & Infrastructure',
    status: 'IDLE',
    totalTasks: 42,
    approvals: 42,
    rejections: 0,
    iconName: 'KeyRound',
    isCorePythonAgent: false,
  },
  {
    id: 'dispatcher',
    name: 'NotificationDispatcherAgent',
    role: 'SWIFT ACK/NAK Dispatcher',
    system_prompt: 'Формирование подтверждений MT199, клиентских авизо и отправка банковских уведомлений.',
    category: 'Security & Infrastructure',
    status: 'IDLE',
    totalTasks: 42,
    approvals: 31,
    rejections: 11,
    iconName: 'BellRing',
    isCorePythonAgent: false,
  },
];

export const FX_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  RUB: 90.5,
  CHF: 0.88,
  JPY: 154.2,
  AED: 3.67,
  SGD: 1.34,
};

export interface ExecutionStepCallback {
  onStepStart?: (agentId: string, stepName: string) => void;
  onStepComplete?: (agentId: string, log: AgentLog) => void;
  onTransactionUpdate?: (tx: Transaction) => void;
}

export class GlobalBankOrchestrator {
  public sec: SecurityCore;
  private agents: Map<string, BankAgent>;
  public rates: Record<string, number>;

  constructor(masterKey: string = 'GLOBAL_BANK_SUPER_SECRET_HMAC_KEY_2026') {
    this.sec = new SecurityCore(masterKey);
    this.rates = { ...FX_RATES };
    this.agents = new Map();
    INITIAL_AGENTS.forEach(a => this.agents.set(a.id, { ...a }));
  }

  public getAgents(): BankAgent[] {
    return Array.from(this.agents.values());
  }

  public getAgent(id: string): BankAgent | undefined {
    return this.agents.get(id);
  }

  public updateSecretKey(newKey: string): void {
    this.sec.setSecretKey(newKey);
  }

  private createLog(
    agentName: string,
    role: string,
    action: string,
    details: Record<string, any>,
    level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' = 'INFO'
  ): AgentLog {
    const timestamp = new Date().toISOString();
    const raw_text = `[${timestamp}] [AGENT: ${agentName}] (${role}): ${action} | Details: ${JSON.stringify(details)}`;
    return {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      agentName,
      role,
      action,
      details,
      level,
      raw_text,
    };
  }

  /**
   * Runs the full multi-agent banking pipeline matching Python's execute_swift_transfer
   */
  public async executeSwiftTransfer(
    sender: string,
    receiver: string,
    amount: number,
    currency: string,
    swiftCode: string,
    callbacks?: ExecutionStepCallback,
    stepDelayMs: number = 300
  ): Promise<{ transaction: Transaction; logs: AgentLog[]; finalResult: any }> {
    const logs: AgentLog[] = [];
    const nowIso = new Date().toISOString();

    // 1. Generate Transaction ID and initial model
    const txId = await this.sec.generateTxId(sender, receiver, amount, nowIso);
    
    // Create payload and generate cryptographic HMAC signature
    const payload = `${txId}:${sender}:${receiver}:${amount}:${currency}:${swiftCode}`;
    const signature = await this.sec.generateSignature(payload);

    const tx: Transaction = {
      tx_id: txId,
      sender_iban: sender,
      receiver_iban: receiver,
      amount: amount,
      currency: currency,
      swift_code: swiftCode,
      status: 'PROCESSING',
      risk_score: 0.0,
      approvals: [],
      signature,
      timestamp: nowIso,
    };

    callbacks?.onTransactionUpdate?.({ ...tx });

    const delay = (ms: number) => (ms > 0 ? new Promise(res => setTimeout(res, ms)) : Promise.resolve());

    // Ingress Log
    const ingressLog: AgentLog = {
      id: `log-ingress-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: 'GlobalBankEngine',
      role: 'Core Orchestrator',
      action: `--- НАЧАЛО ОБРАБОТКИ ТРАНЗАКЦИИ ${tx.tx_id} ---`,
      details: {
        tx_id: tx.tx_id,
        sender,
        receiver,
        amount,
        currency,
        swift_code: swiftCode,
        hmac_sig_preview: `${signature.substring(0, 16)}...`,
      },
      level: 'INFO',
      raw_text: `--- НАЧАЛО ОБРАБОТКИ ТРАНЗАКЦИИ ${tx.tx_id} ---`,
    };
    logs.push(ingressLog);
    callbacks?.onStepComplete?.('ingress', ingressLog);

    // STEP 1: Audit Inspector - HMAC verification
    callbacks?.onStepStart?.('audit', 'HMAC Signature Verification');
    await delay(stepDelayMs);
    const isSigValid = await this.sec.verifySignature(payload, signature);
    const auditLog = this.createLog(
      'AuditInspectorAgent',
      'Forensic Audit & HMAC Verifier',
      'VERIFY_HMAC_SIGNATURE',
      { tx_id: tx.tx_id, valid: isSigValid, algorithm: 'HMAC-SHA256' },
      isSigValid ? 'SUCCESS' : 'ERROR'
    );
    logs.push(auditLog);
    callbacks?.onStepComplete?.('audit', auditLog);

    // STEP 2: SwiftGateway validation
    callbacks?.onStepStart?.('swift', 'SWIFT BIC & ISO 20022 Check');
    await delay(stepDelayMs);
    const isSwiftValid = swiftCode.length >= 8 && swiftCode.length <= 11;
    const swiftLog = this.createLog(
      'SwiftGatewayAgent',
      'SWIFT MT103 / ISO 20022 Gateway',
      'VALIDATE_BIC_FORMAT',
      { bic: swiftCode, standard: 'ISO 9362 / pacs.008', valid: isSwiftValid },
      isSwiftValid ? 'INFO' : 'WARN'
    );
    logs.push(swiftLog);
    callbacks?.onStepComplete?.('swift', swiftLog);

    // STEP 3: Currency Monitoring Agent (Python: self.monitor.get_live_rate)
    callbacks?.onStepStart?.('monitor', 'Currency & Market Monitoring');
    await delay(stepDelayMs);
    const baseRate = this.rates[currency] || 1.0;
    const targetRate = this.rates['USD'] || 1.0;
    const fxRate = targetRate / baseRate;
    const convertedUsd = Number((amount * fxRate).toFixed(2));
    tx.fx_rate = Number(fxRate.toFixed(4));
    tx.converted_usd = convertedUsd;

    const monitorLog = this.createLog(
      'MonitoringAgent',
      'Currency & Market Monitor',
      'FETCH_RATE',
      { pair: `${currency}/USD`, rate: Number(fxRate.toFixed(4)), converted_usd: convertedUsd },
      'INFO'
    );
    logs.push(monitorLog);
    callbacks?.onStepComplete?.('monitor', monitorLog);
    callbacks?.onTransactionUpdate?.({ ...tx });

    // STEP 4: Sanctions Screening (Council Agent)
    callbacks?.onStepStart?.('sanctions', 'Sanctions & PEP Screening');
    await delay(stepDelayMs);
    const isSanctioned = sender.includes('OFAC') || receiver.includes('BLOCKED');
    const sanctionsLog = this.createLog(
      'SanctionsScreenerAgent',
      'OFAC & PEP Sanctions Officer',
      'SCREEN_ENTITIES',
      { status: isSanctioned ? 'MATCH_FOUND' : 'CLEAR', lists: ['OFAC_SDN', 'EU_SANCTIONS', 'UN_PEP'] },
      isSanctioned ? 'ERROR' : 'SUCCESS'
    );
    logs.push(sanctionsLog);
    callbacks?.onStepComplete?.('sanctions', sanctionsLog);

    // STEP 5: Risk Economist Agent (Python: self.economist.evaluate_risk)
    // Python code:
    // risk_score = 0.1
    // if tx.amount > 10000: risk_score += 0.4
    // if tx.swift_code and not tx.swift_code.startswith("GB"): risk_score += 0.3
    callbacks?.onStepStart?.('economist', 'AML & Financial Risk Evaluation');
    await delay(stepDelayMs);
    let calculatedRisk = 0.1;
    const riskFactors: string[] = ['Base operational risk (0.1)'];

    if (amount > 10000) {
      calculatedRisk += 0.4;
      riskFactors.push('High-value threshold exceeded > 10,000 (+0.4)');
    }
    if (swiftCode && !swiftCode.startsWith('GB')) {
      calculatedRisk += 0.3;
      riskFactors.push('Non-GB jurisdiction international SWIFT route (+0.3)');
    }
    if (isSanctioned) {
      calculatedRisk = 1.0;
      riskFactors.push('CRITICAL: Sanctions hit (1.0)');
    }

    calculatedRisk = Number(calculatedRisk.toFixed(2));
    tx.risk_score = calculatedRisk;

    const economistLog = this.createLog(
      'EconomistAgent',
      'Risk & AML Officer',
      'EVALUATE_RISK',
      {
        tx_id: tx.tx_id,
        risk_score: calculatedRisk,
        factors: riskFactors,
      },
      calculatedRisk > 0.7 ? 'WARN' : 'INFO'
    );
    logs.push(economistLog);
    callbacks?.onStepComplete?.('economist', economistLog);
    callbacks?.onTransactionUpdate?.({ ...tx });

    // STEP 6: Legal & Compliance Lawyer Agent (Python: self.lawyer.validate_compliance)
    // Python code:
    // if tx.risk_score > 0.7:
    //     await self.log_action("REJECT_TX", {"tx_id": tx.tx_id, "reason": "High risk AML score"})
    //     return False
    // tx.approvals.append(self.name)
    // await self.log_action("APPROVE_COMPLIANCE", {"tx_id": tx.tx_id})
    // return True
    callbacks?.onStepStart?.('lawyer', 'Regulatory SWIFT/FATF Validation');
    await delay(stepDelayMs);
    let complianceApproved = false;

    if (tx.risk_score > 0.7) {
      const reason = isSanctioned ? 'Sanctions list match' : 'High risk AML score';
      tx.rejection_reason = reason;
      const lawyerLog = this.createLog(
        'LawyerAgent',
        'Legal & Compliance Officer',
        'REJECT_TX',
        { tx_id: tx.tx_id, reason, risk_score: tx.risk_score, threshold: 0.7 },
        'ERROR'
      );
      logs.push(lawyerLog);
      callbacks?.onStepComplete?.('lawyer', lawyerLog);
    } else {
      complianceApproved = true;
      tx.approvals.push('LawyerAgent');
      const lawyerLog = this.createLog(
        'LawyerAgent',
        'Legal & Compliance Officer',
        'APPROVE_COMPLIANCE',
        { tx_id: tx.tx_id, standards: ['SWIFT', 'FATF', 'GDPR'], status: 'APPROVED' },
        'SUCCESS'
      );
      logs.push(lawyerLog);
      callbacks?.onStepComplete?.('lawyer', lawyerLog);
    }
    callbacks?.onTransactionUpdate?.({ ...tx });

    // STEP 7: Chief Accountant Agent (Python: self.accountant.process_ledger)
    // Python code:
    // if approved:
    //     await self.accountant.process_ledger(tx)
    // else:
    //     tx.status = "REJECTED_BY_COMPLIANCE"
    callbacks?.onStepStart?.('accountant', 'Ledger Execution & Ledger Balancing');
    await delay(stepDelayMs);

    if (complianceApproved) {
      if (tx.approvals.includes('LawyerAgent')) {
        tx.status = 'EXECUTED';
        const accountantLog = this.createLog(
          'AccountantAgent',
          'Chief Accountant',
          'EXECUTE_PAYMENT',
          {
            tx_id: tx.tx_id,
            status: tx.status,
            debit_account: sender,
            credit_account: receiver,
            amount: `${amount} ${currency}`,
            journal_ref: `JRN-${Date.now().toString().slice(-6)}`,
          },
          'SUCCESS'
        );
        logs.push(accountantLog);
        callbacks?.onStepComplete?.('accountant', accountantLog);
      } else {
        tx.status = 'BLOCKED';
        const accountantLog = this.createLog(
          'AccountantAgent',
          'Chief Accountant',
          'BLOCK_PAYMENT',
          { tx_id: tx.tx_id, reason: 'Missing compliance approval' },
          'WARN'
        );
        logs.push(accountantLog);
        callbacks?.onStepComplete?.('accountant', accountantLog);
      }
    } else {
      tx.status = 'REJECTED_BY_COMPLIANCE';
      const accountantLog = this.createLog(
        'AccountantAgent',
        'Chief Accountant',
        'ABORT_LEDGER_POSTING',
        { tx_id: tx.tx_id, status: tx.status, reason: 'Compliance reject gate' },
        'WARN'
      );
      logs.push(accountantLog);
      callbacks?.onStepComplete?.('accountant', accountantLog);
    }
    callbacks?.onTransactionUpdate?.({ ...tx });

    // STEP 8: Dispatcher & Notification
    callbacks?.onStepStart?.('dispatcher', 'SWIFT Notification Generation');
    await delay(stepDelayMs);
    const isExecuted = tx.status === 'EXECUTED';
    const dispatchLog = this.createLog(
      'NotificationDispatcherAgent',
      'SWIFT ACK/NAK Dispatcher',
      isExecuted ? 'DISPATCH_SWIFT_ACK' : 'DISPATCH_SWIFT_NAK',
      {
        tx_id: tx.tx_id,
        swift_status: isExecuted ? 'pacs.002.001.10 - ACCP (Accepted)' : 'pacs.002.001.10 - RJCT (Rejected)',
        destination_bic: swiftCode,
      },
      isExecuted ? 'SUCCESS' : 'WARN'
    );
    logs.push(dispatchLog);
    callbacks?.onStepComplete?.('dispatcher', dispatchLog);

    // Final result matching Python script return:
    // return {
    //     "transaction_id": tx.tx_id,
    //     "status": tx.status,
    //     "risk_score": tx.risk_score,
    //     "approvals": tx.approvals
    // }
    const finalResult = {
      transaction_id: tx.tx_id,
      status: tx.status,
      risk_score: tx.risk_score,
      approvals: tx.approvals,
    };

    callbacks?.onTransactionUpdate?.({ ...tx });

    return {
      transaction: tx,
      logs,
      finalResult,
    };
  }
}
