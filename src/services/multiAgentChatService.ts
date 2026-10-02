import { MultiAgentChatMessage, MultiAgentReport, MultiAgentDirectivePreset } from '../types';
import { SecurityCore } from './securityCore';
import { FX_RATES } from './bankEngine';

export const MULTI_AGENT_DIRECTIVES: MultiAgentDirectivePreset[] = [
  {
    id: 'directive-python-de-us',
    title: 'Консилиум по переводу €25,000 (Python Default DE -> US)',
    category: 'SWIFT & AML Audit',
    description: 'Анализ трансграничного перевода 25,000 EUR с BIC SVWBUS6S. Проверка лимитов AML, валютной маржи и FATF.',
    prompt: 'Провести комплексный консилиум по входящей транзакции: 25,000 EUR из DE89370400440532013000 в US64SVWB1000111122223333, SWIFT SVWBUS6S. Оценить риски и выдать заключение.',
    targetAgents: ['swift', 'monitor', 'sanctions', 'fraud', 'economist', 'lawyer', 'accountant', 'audit', 'dispatcher'],
  },
  {
    id: 'directive-liquidity-stress',
    title: 'Стресс-тест ликвидности Nostro и резервов Basel III ($15,000,000)',
    category: 'Treasury & Basel III',
    description: 'Симуляция оттока межбанковской ликвидности $15M. Проверка коэффициентов LCR/NSFR и запасов ностро-корреспондентов.',
    prompt: 'Инициировать экстренное совещание Казначейства и Риск-офиса. Провести стресс-тест оттока ликвидности $15,000,000 через Лондонский и Нью-Йоркский клиринговые хабы.',
    targetAgents: ['treasury', 'monitor', 'economist', 'accountant', 'audit', 'dispatcher'],
  },
  {
    id: 'directive-sanctions-pep',
    title: 'Глубокий санкционный и PEP скрининг контрагента (OFAC & EU)',
    category: 'Sanctions & Legal',
    description: 'Проверка бенефициаров и компаний холдинга по глобальным стоп-листам OFAC SDN, EU Consolidated и UN Security Council.',
    prompt: 'Провести глубокий аудит санкционных списков по бенефициарам группы компаний "Apex Global Trading Ltd" (счет CH93007620116238529574). Проверить аффилированность с PEP.',
    targetAgents: ['sanctions', 'fraud', 'lawyer', 'economist', 'audit'],
  },
  {
    id: 'directive-corporate-card',
    title: 'Согласование эмиссии корпоративной карты Platinum ($100,000)',
    category: 'Card Issuing Core',
    description: 'Межагентная оценка заявки на выпуск карты Corporate Credit: скоринг кредитоспособности, генерация SHA-256 IBAN и резервирование лимита.',
    prompt: 'Заявка на выпуск карты Corporate Commercial для "Quantum Logistics Ltd" (Tax ID: GB902188412) с кредитным лимитом $100,000. Провести скоринг и сформировать решение.',
    targetAgents: ['economist', 'lawyer', 'treasury', 'accountant', 'audit', 'dispatcher'],
  },
  {
    id: 'directive-hmac-security-audit',
    title: 'Криптографическая ревизия блок-реестра и валидация HMAC-SHA256',
    category: 'Security & Forensics',
    description: 'Полная поверка неизменяемости реестра бухгалтерских проводок, сверка цифровых подписей и криптографическая сертификация.',
    prompt: 'Запустить полную судебную ревизию журнала транзакций. Проверить валидность всех цифровых подписей HMAC-SHA256, отсутствие коллизий и целостность мастер-ключа.',
    targetAgents: ['audit', 'accountant', 'swift', 'lawyer', 'dispatcher'],
  },
];

export const INITIAL_CHAT_MESSAGES: MultiAgentChatMessage[] = [
  {
    id: 'msg-init-system-1',
    senderType: 'system',
    content: 'Банковская мультиагентная сеть GlobalBank v2.0.0 инициализирована. Все 10 автономных агентов подключены к единой шине взаимодействия.',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    sentiment: 'positive',
  },
  {
    id: 'msg-init-audit-2',
    senderType: 'agent',
    agentId: 'audit',
    agentName: 'AuditInspectorAgent',
    role: 'Forensic Audit & HMAC Verifier',
    recipientAgentId: 'user',
    recipientName: 'Контролер (Председатель)',
    content: 'Приветствую, господин Председатель! Судебный аудитор и криптографический модуль докладывают: мастер-ключ HMAC-SHA256 активен, целостность реестра 100%. Все 10 агентов консилиума находятся в режиме постоянного ожидания ваших директив.',
    timestamp: new Date(Date.now() - 90000).toISOString(),
    sentiment: 'positive',
    metadata: { algorithm: 'HMAC-SHA256', status: 'SYNCHRONIZED', active_agents: 10 },
  },
  {
    id: 'msg-init-lawyer-3',
    senderType: 'agent',
    agentId: 'lawyer',
    agentName: 'LawyerAgent',
    role: 'Legal & Compliance Officer',
    recipientAgentId: 'all',
    recipientName: 'Все агенты консилиума',
    content: 'Коллеги, напоминаю регламент: любые операции с риском >0.70 или суммами свыше 10,000 у.е. подлежат обязательной перекрёстной верификации между @EconomistAgent, @SanctionsScreenerAgent и юридическим департаментом. Ожидаем указаний Контролера.',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    sentiment: 'neutral',
  },
];

export class MultiAgentChatOrchestrator {
  private sec: SecurityCore;

  constructor(masterKey: string = 'GLOBAL_BANK_SUPER_SECRET_HMAC_KEY_2026') {
    this.sec = new SecurityCore(masterKey);
  }

  public setMasterKey(key: string) {
    this.sec.setSecretKey(key);
  }

  /**
   * Generates step-by-step inter-agent conversation and final Executive Report
   */
  public async executeDirective(
    directiveId: string,
    options: {
      requireControllerApproval?: boolean;
      lang?: 'en' | 'ru';
      onMessage?: (msg: MultiAgentChatMessage) => void;
      delayMs?: number;
    } = {}
  ): Promise<MultiAgentChatMessage[]> {
    const directive = MULTI_AGENT_DIRECTIVES.find(d => d.id === directiveId) || MULTI_AGENT_DIRECTIVES[0];
    return this.runScenario(directive.title, directive.prompt, directive.id, options);
  }

  /**
   * Processes free-form prompt from user / Controller
   */
  public async handleUserPrompt(
    promptText: string,
    options: {
      requireControllerApproval?: boolean;
      lang?: 'en' | 'ru';
      onMessage?: (msg: MultiAgentChatMessage) => void;
      delayMs?: number;
    } = {}
  ): Promise<MultiAgentChatMessage[]> {
    // Deduce title and mode
    const title = promptText.length > 50 ? `${promptText.substring(0, 47)}...` : promptText;
    return this.runScenario(title, promptText, 'custom-user-directive', options);
  }

  private async runScenario(
    title: string,
    prompt: string,
    scenarioType: string,
    options: {
      requireControllerApproval?: boolean;
      lang?: 'en' | 'ru';
      onMessage?: (msg: MultiAgentChatMessage) => void;
      delayMs?: number;
    }
  ): Promise<MultiAgentChatMessage[]> {
    const {
      requireControllerApproval = false,
      lang = 'ru',
      onMessage = () => {},
      delayMs = 280,
    } = options;

    const delay = (ms: number) => (ms > 0 ? new Promise(r => setTimeout(r, ms)) : Promise.resolve());
    const generatedMessages: MultiAgentChatMessage[] = [];

    const emit = (msg: MultiAgentChatMessage) => {
      generatedMessages.push(msg);
      onMessage(msg);
    };

    const isRu = lang === 'ru';
    const lower = prompt.toLowerCase();

    // Determine domain scenario
    const isLiquidity = lower.includes('ликвид') || lower.includes('liquidity') || lower.includes('basel') || lower.includes('nostro');
    const isSanctions = lower.includes('санкци') || lower.includes('sanction') || lower.includes('ofac') || lower.includes('pep');
    const isCard = lower.includes('карт') || lower.includes('card') || lower.includes('credit') || lower.includes('эмисси');
    const isCryptoAudit = lower.includes('hmac') || lower.includes('ревизи') || lower.includes('аудит') || lower.includes('ключ');
    const isPythonDefault = lower.includes('25000') || lower.includes('25,000') || lower.includes('de89') || lower.includes('svwbus6s') || scenarioType === 'directive-python-de-us';

    const timestampNow = () => new Date().toISOString();

    // 1. User Message (Controller Directive)
    const userMsg: MultiAgentChatMessage = {
      id: `usr-${Date.now()}`,
      senderType: 'user',
      content: prompt,
      timestamp: timestampNow(),
      sentiment: 'neutral',
    };
    emit(userMsg);
    await delay(delayMs);

    // 2. Initial Gateway / Receiver
    if (isLiquidity) {
      // Liquidity Council
      emit({
        id: `msg-${Date.now()}-1`,
        senderType: 'agent',
        agentId: 'treasury',
        agentName: 'LiquidityReserveAgent',
        role: 'Treasury & Basel III Manager',
        recipientAgentId: 'monitor',
        recipientName: 'MonitoringAgent',
        content: isRu 
          ? 'Директива Контролера принята! Открываю экстренную сессию Казначейства. Запрашиваю у @MonitoringAgent текущие межбанковские спрэды SOFR/EURIBOR и котировки ликвидности.'
          : 'Controller directive acknowledged! Opening Emergency Treasury Session. Requesting interbank SOFR/EURIBOR spreads and live FX quotes from @MonitoringAgent.',
        timestamp: timestampNow(),
        sentiment: 'neutral',
        handOffTo: 'monitor',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-2`,
        senderType: 'agent',
        agentId: 'monitor',
        agentName: 'MonitoringAgent',
        role: 'Currency & Market Monitor',
        recipientAgentId: 'treasury',
        recipientName: 'LiquidityReserveAgent',
        content: isRu
          ? 'Отвечаю @LiquidityReserveAgent: Спрэд USD/EUR стабилен (+1.2 bps), но на азиатской сессии зафиксирован всплеск волатильности JPY/USD. Передаю данные в модель стресс-теста.'
          : 'Replying to @LiquidityReserveAgent: USD/EUR spread stable (+1.2 bps), volatility bump observed on JPY/USD. Streaming market data to the stress model.',
        timestamp: timestampNow(),
        sentiment: 'neutral',
        handOffTo: 'economist',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-3`,
        senderType: 'agent',
        agentId: 'economist',
        agentName: 'EconomistAgent',
        role: 'Risk & AML Officer',
        recipientAgentId: 'accountant',
        recipientName: 'AccountantAgent',
        content: isRu
          ? 'Провел расчёт оттока $15,000,000: Показатель покрытия ликвидности LCR снизится со 142% до 118%, что строго ВЫШЕ регуляторного минимума Basel III (100%). Чистый стабильный баланс NSFR = 124%. Дефицита резервов нет. @AccountantAgent, проверьте распределение по корр-счетам.'
          : 'Completed $15M outflow simulation: LCR drops from 142% to 118%, safely ABOVE Basel III regulatory requirement (100%). NSFR sits at 124%. No liquidity shortfall. @AccountantAgent, verify Nostro allocation.',
        timestamp: timestampNow(),
        sentiment: 'positive',
        handOffTo: 'accountant',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-4`,
        senderType: 'agent',
        agentId: 'accountant',
        agentName: 'AccountantAgent',
        role: 'Chief Accountant',
        recipientAgentId: 'audit',
        recipientName: 'AuditInspectorAgent',
        content: isRu
          ? 'Подтверждаю: Остаток на Nostro JP Morgan NY: $8.4M, Barclays London: £5.1M, Deutsche Bank Frankfurt: €6.2M. Лимиты перекрывают стресс-сценарий с запасом $4.6M. Передаю в крипто-аудит @AuditInspectorAgent.'
          : 'Confirmed: Nostro balance JP Morgan NY: $8.4M, Barclays London: £5.1M, Deutsche Bank: €6.2M. Excess liquidity buffer stands at $4.6M. Passing to forensic audit @AuditInspectorAgent.',
        timestamp: timestampNow(),
        sentiment: 'positive',
        handOffTo: 'audit',
      });
      await delay(delayMs);

    } else if (isSanctions) {
      // Sanctions & PEP Deep Screening
      emit({
        id: `msg-${Date.now()}-1`,
        senderType: 'agent',
        agentId: 'sanctions',
        agentName: 'SanctionsScreenerAgent',
        role: 'OFAC & PEP Sanctions Officer',
        recipientAgentId: 'fraud',
        recipientName: 'FraudDetectorAgent',
        content: isRu
          ? 'Директива Контролера принята! Запущен глубокий парсинг баз данных: OFAC SDN, EU Restrictive Measures, UN Consolidated List, UK HMT, Interpol Red Notices. @FraudDetectorAgent, проверь историю связей и транзитные цепочки.'
          : 'Controller directive received! Initiating deep watchlist matching: OFAC SDN, EU Restrictive Measures, UN Sanctions, UK HMT, Interpol. @FraudDetectorAgent, inspect behavioral topology and transit hops.',
        timestamp: timestampNow(),
        sentiment: 'neutral',
        handOffTo: 'fraud',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-2`,
        senderType: 'agent',
        agentId: 'fraud',
        agentName: 'FraudDetectorAgent',
        role: 'Behavioral AI Fraud Sentinel',
        recipientAgentId: 'sanctions',
        recipientName: 'SanctionsScreenerAgent',
        content: isRu
          ? 'Анализ топологии завершен: 14 связанных юридических лиц в юрисдикциях Швейцарии, Сингапура и Великобритании. Прямых связей с PEP и санкционными бенефициарами первого порядка не выявлено, однако зафиксирован один офшорный сателлит на Маршалловых островах. @LawyerAgent, требуется правовая оценка допустимости.'
          : 'Topology mapped: 14 linked corporate entities across Switzerland, Singapore and UK. No Tier-1 PEP or designated SDN hits. However, 1 Marshall Islands SPV detected. @LawyerAgent, legal clearance required.',
        timestamp: timestampNow(),
        sentiment: 'warning',
        handOffTo: 'lawyer',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-3`,
        senderType: 'agent',
        agentId: 'lawyer',
        agentName: 'LawyerAgent',
        role: 'Legal & Compliance Officer',
        recipientAgentId: 'economist',
        recipientName: 'EconomistAgent',
        content: isRu
          ? 'Юридическая экспертиза FATF: Конечные бенефициары (UBO) раскрыты на 100%. Офшорный сателлит не находится под секторальными санкциями EU/US. Применяем стандарт Enhanced Due Diligence (EDD) с установкой обязательного мониторинга транзакций. Санкционный блок НЕ требуется.'
          : 'Legal FATF clearance: Ultimate Beneficial Owners (UBO) fully unmasked. No sectoral sanctions violations. Mandating Enhanced Due Diligence (EDD) with telemetry monitoring. Sanctions block NOT required.',
        timestamp: timestampNow(),
        sentiment: 'positive',
        handOffTo: 'economist',
      });
      await delay(delayMs);

    } else if (isCard) {
      // Corporate Card Approval
      emit({
        id: `msg-${Date.now()}-1`,
        senderType: 'agent',
        agentId: 'swift',
        agentName: 'SwiftGatewayAgent',
        role: 'SWIFT MT103 / ISO 20022 Gateway',
        recipientAgentId: 'economist',
        recipientName: 'EconomistAgent',
        content: isRu
          ? 'Получен запрос на эмиссию корпоративной карты от Контролера. Структура заявки соответствует спецификации ISO 8583 / FastAPI v2. Передаю пакет скоринга в @EconomistAgent.'
          : 'Received corporate card application from Controller. Data structure compliant with ISO 8583 / FastAPI v2. Routing scoring payload to @EconomistAgent.',
        timestamp: timestampNow(),
        sentiment: 'neutral',
        handOffTo: 'economist',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-2`,
        senderType: 'agent',
        agentId: 'economist',
        agentName: 'EconomistAgent',
        role: 'Risk & AML Officer',
        recipientAgentId: 'treasury',
        recipientName: 'LiquidityReserveAgent',
        content: isRu
          ? 'Финансовый скоринг завершен: Кредитный рейтинг заявителя AAA (Financial Health 94/100). Запрошенный лимит $100,000 одобрен в полном объеме. @LiquidityReserveAgent, подтверди обеспечение резервом ликвидности.'
          : 'Financial scoring complete: Applicant credit health AAA (Score 94/100). Requested $100k credit line fully approved. @LiquidityReserveAgent, confirm liquidity backing.',
        timestamp: timestampNow(),
        sentiment: 'positive',
        handOffTo: 'treasury',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-3`,
        senderType: 'agent',
        agentId: 'treasury',
        agentName: 'LiquidityReserveAgent',
        role: 'Treasury & Basel III Manager',
        recipientAgentId: 'lawyer',
        recipientName: 'LawyerAgent',
        content: isRu
          ? 'Резерв в $100,000 заблокирован на специальном субсчете Card-Issuing Pool. Достаточность капитала не нарушена. @LawyerAgent, согласуй выпуск договора.'
          : '$100,000 buffer earmarked in Card-Issuing Pool. Capital adequacy intact. @LawyerAgent, finalize terms agreement.',
        timestamp: timestampNow(),
        sentiment: 'positive',
        handOffTo: 'lawyer',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-4`,
        senderType: 'agent',
        agentId: 'lawyer',
        agentName: 'LawyerAgent',
        role: 'Legal & Compliance Officer',
        recipientAgentId: 'accountant',
        recipientName: 'AccountantAgent',
        content: isRu
          ? 'Юридическая экспертиза KYC/AML: Tax ID верифицирован в налоговом реестре Великобритании. Санкций нет. Согласовано: APPROVE_ISSUANCE. @AccountantAgent, сгенерируй криптографический IBAN и маскированный PAN.'
          : 'Legal KYC/AML cleared: UK Tax ID verified in Companies House. Sanctions clear. Approved: APPROVE_ISSUANCE. @AccountantAgent, generate cryptographic IBAN and masked PAN.',
        timestamp: timestampNow(),
        sentiment: 'positive',
        handOffTo: 'accountant',
      });
      await delay(delayMs);

    } else if (isCryptoAudit) {
      // Cryptographic Audit
      emit({
        id: `msg-${Date.now()}-1`,
        senderType: 'agent',
        agentId: 'audit',
        agentName: 'AuditInspectorAgent',
        role: 'Forensic Audit & HMAC Verifier',
        recipientAgentId: 'accountant',
        recipientName: 'AccountantAgent',
        content: isRu
          ? 'Директива Контролера принята! Инициирую сквозную криптографическую ревизию. Сверяю все транзакции из реестра с мастер-ключом HMAC-SHA256. @AccountantAgent, предоставь снимок журнала проводок.'
          : 'Controller directive received! Launching cryptographic forensic sweep. Cross-validating all ledger entries against master HMAC-SHA256 key. @AccountantAgent, snapshot ledger state.',
        timestamp: timestampNow(),
        sentiment: 'neutral',
        handOffTo: 'accountant',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-2`,
        senderType: 'agent',
        agentId: 'accountant',
        agentName: 'AccountantAgent',
        role: 'Chief Accountant',
        recipientAgentId: 'audit',
        recipientName: 'AuditInspectorAgent',
        content: isRu
          ? 'Снимок журнала передан: Всего записей в Главной книге: 42. Хэш-цепочка непрерывна, расхождений в сальдо дебета и кредита 0.00. @AuditInspectorAgent, приступай к сверке подписей.'
          : 'Ledger snapshot delivered: 42 total posted transactions. Continuous Merkle chain, zero debit/credit discrepancy. @AuditInspectorAgent, proceed with signature audit.',
        timestamp: timestampNow(),
        sentiment: 'positive',
        handOffTo: 'audit',
      });
      await delay(delayMs);

    } else {
      // Standard / Python Transaction Cross-Examination
      emit({
        id: `msg-${Date.now()}-1`,
        senderType: 'agent',
        agentId: 'swift',
        agentName: 'SwiftGatewayAgent',
        role: 'SWIFT MT103 / ISO 20022 Gateway',
        recipientAgentId: 'monitor',
        recipientName: 'MonitoringAgent',
        content: isRu
          ? 'Директива Председателя принята! Валидирую пакет сообщения pacs.008 (MT103). Синтаксис полей :20:, :32A:, :50K:, :59: корректен. Передаю валютные параметры в @MonitoringAgent.'
          : 'Chairman directive accepted! Validating pacs.008 (MT103) message syntax. Tags :20:, :32A:, :50K:, :59: valid. Passing FX parameters to @MonitoringAgent.',
        timestamp: timestampNow(),
        sentiment: 'neutral',
        handOffTo: 'monitor',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-2`,
        senderType: 'agent',
        agentId: 'monitor',
        agentName: 'MonitoringAgent',
        role: 'Currency & Market Monitor',
        recipientAgentId: 'treasury',
        recipientName: 'LiquidityReserveAgent',
        content: isRu
          ? 'Котировка зафиксирована: EUR/USD = 1.0870. Сумма в эквиваленте: $27,175.00 USD. Спрэд межбанка в пределах 0.04%. @LiquidityReserveAgent, подтверди доступность ликвидности в европейском пуле.'
          : 'Market rate locked: EUR/USD = 1.0870. Converted volume: $27,175.00 USD. Interbank spread at 0.04%. @LiquidityReserveAgent, confirm EU liquidity availability.',
        timestamp: timestampNow(),
        sentiment: 'neutral',
        handOffTo: 'treasury',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-3`,
        senderType: 'agent',
        agentId: 'treasury',
        agentName: 'LiquidityReserveAgent',
        role: 'Treasury & Basel III Manager',
        recipientAgentId: 'sanctions',
        recipientName: 'SanctionsScreenerAgent',
        content: isRu
          ? 'Резервы Франкфуртского клирингового пула достаточны. Ликвидность забронирована. @SanctionsScreenerAgent, проверь участников сделки.'
          : 'Frankfurt pool liquidity sufficient. Funds earmarked. @SanctionsScreenerAgent, verify transaction counterparts.',
        timestamp: timestampNow(),
        sentiment: 'positive',
        handOffTo: 'sanctions',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-4`,
        senderType: 'agent',
        agentId: 'sanctions',
        agentName: 'SanctionsScreenerAgent',
        role: 'OFAC & PEP Sanctions Officer',
        recipientAgentId: 'fraud',
        recipientName: 'FraudDetectorAgent',
        content: isRu
          ? 'Скрининг по базам OFAC SDN, EU, UN завершен: Прямых совпадений по отправителю DE89... и получателю US64... нет. @FraudDetectorAgent, проверь поведенческий паттерн.'
          : 'Screening across OFAC SDN, EU, UN complete: No direct hits on DE89... and US64... @FraudDetectorAgent, evaluate behavioral velocity.',
        timestamp: timestampNow(),
        sentiment: 'positive',
        handOffTo: 'fraud',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-5`,
        senderType: 'agent',
        agentId: 'fraud',
        agentName: 'FraudDetectorAgent',
        role: 'Behavioral AI Fraud Sentinel',
        recipientAgentId: 'economist',
        recipientName: 'EconomistAgent',
        content: isRu
          ? 'Внимание консилиума! Маршрут транзакции нестандартный: перевод между разными юрисдикциями (Германия -> США) со сторонним SWIFT BIC SVWBUS6S. Передаю маркеры риска в @EconomistAgent.'
          : 'Council alert! Non-standard routing pattern: Cross-border wire (Germany -> USA) via third-party BIC SVWBUS6S. Escalating anomaly markers to @EconomistAgent.',
        timestamp: timestampNow(),
        sentiment: 'warning',
        handOffTo: 'economist',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-6`,
        senderType: 'agent',
        agentId: 'economist',
        agentName: 'EconomistAgent',
        role: 'Risk & AML Officer',
        recipientAgentId: 'lawyer',
        recipientName: 'LawyerAgent',
        content: isRu
          ? 'Расчёт AML Risk Score по формуле ядра: Базовый риск 0.10 + Превышение порога 10k (+0.40) + Международный BIC non-GB (+0.30) = ИТОГОВЫЙ СКОРИНГ 0.80! Внимание: 0.80 превышает максимальный допустимый лимит безопасности 0.70! Передаю в @LawyerAgent.'
          : 'AML Risk Score calculated: Base risk 0.10 + Exceeds 10k threshold (+0.40) + Non-GB international BIC (+0.30) = TOTAL RISK 0.80! Warning: 0.80 exceeds threshold limit of 0.70! Escalating to @LawyerAgent.',
        timestamp: timestampNow(),
        sentiment: 'critical',
        handOffTo: 'lawyer',
      });
      await delay(delayMs);

      emit({
        id: `msg-${Date.now()}-7`,
        senderType: 'agent',
        agentId: 'lawyer',
        agentName: 'LawyerAgent',
        role: 'Legal & Compliance Officer',
        recipientAgentId: 'accountant',
        recipientName: 'AccountantAgent',
        content: isRu
          ? 'РЕШЕНИЕ ЮРИДИЧЕСКОГО ДЕПАРТАМЕНТА: В соответствии с правилами AML/FATF транзакция отклонена (REJECT_TX). Причина: High risk AML score (0.80 > 0.70). @AccountantAgent, блокируй списание и не вноси проводку в активный баланс!'
          : 'LEGAL & COMPLIANCE VERDICT: Under FATF/AML guidelines, transaction is rejected (REJECT_TX). Reason: High risk AML score (0.80 > 0.70). @AccountantAgent, abort ledger posting and freeze execution!',
        timestamp: timestampNow(),
        sentiment: 'critical',
        handOffTo: 'accountant',
      });
      await delay(delayMs);
    }

    // Step: Finalizing consensus and forensic signing
    const sigPayload = `${title}:${prompt}:${Date.now()}`;
    const hmacSig = await this.sec.generateSignature(sigPayload);

    // Human-in-the-loop Controller Prompt
    if (requireControllerApproval) {
      emit({
        id: `action-prompt-${Date.now()}`,
        senderType: 'system',
        content: isRu
          ? '⚠️ РЕЖИМ КОНТРОЛЕРА: Мультиагенты завершили коллегиальное обсуждение. Перед фиксацией в балансе требуется резолюция Председателя Консилиума (ваша личная виза).'
          : '⚠️ CONTROLLER GATEWAY: Agents have completed their deliberations. Chairman sign-off is required before committing to the immutable ledger.',
        timestamp: timestampNow(),
        sentiment: 'warning',
        requiresUserAction: true,
        metadata: {
          pendingScenario: title,
          hmacPreview: `${hmacSig.substring(0, 16)}...`,
        },
      });
      return generatedMessages;
    }

    // Otherwise complete final steps automatically
    await delay(delayMs);

    emit({
      id: `msg-${Date.now()}-audit-seal`,
      senderType: 'agent',
      agentId: 'audit',
      agentName: 'AuditInspectorAgent',
      role: 'Forensic Audit & HMAC Verifier',
      recipientAgentId: 'dispatcher',
      recipientName: 'NotificationDispatcherAgent',
      content: isRu
        ? `Криптографическая печать наложена. Подпись HMAC-SHA256: [${hmacSig.substring(0, 24)}...]. Целостность решений консилиума сертифицирована. @NotificationDispatcherAgent, формируй официальный отчет Председателю.`
        : `Cryptographic seal affixed. Signature HMAC-SHA256: [${hmacSig.substring(0, 24)}...]. Council deliberation certified. @NotificationDispatcherAgent, prepare executive report for Chairman.`,
      timestamp: timestampNow(),
      sentiment: 'positive',
      handOffTo: 'dispatcher',
    });
    await delay(delayMs);

    // Generate Executive Report
    const report = await this.buildExecutiveReport(title, prompt, scenarioType, hmacSig, isRu);

    emit({
      id: `msg-${Date.now()}-executive-report`,
      senderType: 'agent',
      agentId: 'dispatcher',
      agentName: 'NotificationDispatcherAgent',
      role: 'SWIFT ACK/NAK Dispatcher',
      recipientAgentId: 'user',
      recipientName: 'Контролер (Председатель)',
      content: isRu
        ? 'Господин Председатель! Все 10 агентов завершили взаимодействие и выработали коллегиальное решение. Ниже представлен официальный Сводный исполнительный отчёт.'
        : 'Mr. Chairman! All 10 agents have completed mutual cross-examination and arrived at a consensus. The official Executive Multi-Agent Report is attached below.',
      timestamp: timestampNow(),
      sentiment: report.overallVerdict === 'APPROVED' ? 'positive' : 'warning',
      reportData: report,
    });

    return generatedMessages;
  }

  /**
   * Resumes and finalizes scenario after human controller approval or veto
   */
  public async handleControllerDecision(
    action: 'approved' | 'vetoed' | 'delegated',
    pendingScenarioTitle: string,
    lang: 'en' | 'ru' = 'ru'
  ): Promise<MultiAgentChatMessage[]> {
    const isRu = lang === 'ru';
    const timestampNow = () => new Date().toISOString();
    const result: MultiAgentChatMessage[] = [];

    const sigPayload = `CONTROLLER_${action.toUpperCase()}:${pendingScenarioTitle}:${Date.now()}`;
    const hmacSig = await this.sec.generateSignature(sigPayload);

    if (action === 'approved') {
      result.push({
        id: `ctrl-msg-${Date.now()}`,
        senderType: 'user',
        content: isRu
          ? 'РЕЗОЛЮЦИЯ ПРЕДСЕДАТЕЛЯ: ОДОБРЕНО И ПОДПИСАНО КРИПТОКЛЮЧОМ. Разрешаю фиксацию проводки и выпуск документов.'
          : 'CHAIRMAN RESOLUTION: APPROVED & CRYPTOGRAPHICALLY SIGNED. Authorizing ledger commit and document dispatch.',
        timestamp: timestampNow(),
        sentiment: 'positive',
      });

      result.push({
        id: `agent-msg-${Date.now()}-post`,
        senderType: 'agent',
        agentId: 'accountant',
        agentName: 'AccountantAgent',
        role: 'Chief Accountant',
        content: isRu
          ? 'Виза Контролера получена! Запись зафиксирована в Главной книге баланса. Проводка подтверждена.'
          : 'Controller authorization received! Transaction committed to General Ledger balance.',
        timestamp: timestampNow(),
        sentiment: 'positive',
      });
    } else if (action === 'vetoed') {
      result.push({
        id: `ctrl-msg-${Date.now()}`,
        senderType: 'user',
        content: isRu
          ? 'РЕЗОЛЮЦИЯ ПРЕДСЕДАТЕЛЯ: НАЛОЖЕНО ВЕТО. Операция заблокирована моим распоряжением. Провести внутреннюю проверку.'
          : 'CHAIRMAN RESOLUTION: VETO IMPOSED. Operation blocked by executive order. Initiate internal compliance review.',
        timestamp: timestampNow(),
        sentiment: 'critical',
      });

      result.push({
        id: `agent-msg-${Date.now()}-veto`,
        senderType: 'agent',
        agentId: 'audit',
        agentName: 'AuditInspectorAgent',
        role: 'Forensic Audit & HMAC Verifier',
        content: isRu
          ? 'ВЕТО ПРЕДСЕДАТЕЛЯ ЗАФИКСИРОВАНО: Проводка аннулирована, субсчет заморожен до особого распоряжения.'
          : 'CHAIRMAN VETO RECORDED: Posting aborted, sub-account frozen pending further instruction.',
        timestamp: timestampNow(),
        sentiment: 'critical',
      });
    } else {
      result.push({
        id: `ctrl-msg-${Date.now()}`,
        senderType: 'user',
        content: isRu
          ? 'РЕЗОЛЮЦИЯ ПРЕДСЕДАТЕЛЯ: НАПРАВИТЬ НА ДОПОЛНИТЕЛЬНУЮ ЭКСПЕРТИЗУ В ЮРИДИЧЕСКИЙ ДЕПАРТАМЕНТ.'
          : 'CHAIRMAN RESOLUTION: REFER BACK FOR ADDITIONAL LEGAL SCRUTINY.',
        timestamp: timestampNow(),
        sentiment: 'warning',
      });
    }

    const report = await this.buildExecutiveReport(
      pendingScenarioTitle,
      `Controller Manual Action: ${action}`,
      action === 'approved' ? 'approved-scenario' : 'veto-scenario',
      hmacSig,
      isRu,
      action
    );

    result.push({
      id: `report-after-ctrl-${Date.now()}`,
      senderType: 'agent',
      agentId: 'dispatcher',
      agentName: 'NotificationDispatcherAgent',
      role: 'SWIFT ACK/NAK Dispatcher',
      recipientAgentId: 'user',
      recipientName: 'Контролер (Председатель)',
      content: isRu
        ? 'Итоговый исполнительный отчет с учетом резолюции Контролера сформирован.'
        : 'Final Executive Report updated with Controller resolution.',
      timestamp: timestampNow(),
      sentiment: action === 'approved' ? 'positive' : 'critical',
      reportData: report,
    });

    return result;
  }

  private async buildExecutiveReport(
    title: string,
    prompt: string,
    scenarioType: string,
    hmacSignature: string,
    isRu: boolean,
    controllerOverride?: 'approved' | 'vetoed' | 'delegated'
  ): Promise<MultiAgentReport> {
    const isPythonRejected = scenarioType.includes('python') || prompt.includes('25000') || prompt.includes('0.8');
    const isSanctions = scenarioType.includes('sanctions') || prompt.toLowerCase().includes('санкци');
    const isLiquidity = scenarioType.includes('liquidity') || prompt.toLowerCase().includes('ликвид');
    const isCard = scenarioType.includes('card') || prompt.toLowerCase().includes('карт');

    let overallVerdict: 'APPROVED' | 'REJECTED' | 'WARNING' | 'NEEDS_OVERRIDE' = 'APPROVED';
    if (controllerOverride === 'vetoed') {
      overallVerdict = 'REJECTED';
    } else if (controllerOverride === 'approved') {
      overallVerdict = 'APPROVED';
    } else if (isPythonRejected) {
      overallVerdict = 'REJECTED';
    } else if (isSanctions) {
      overallVerdict = 'WARNING';
    }

    const reportId = `REP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const summaryText = isRu
      ? isPythonRejected
        ? 'КОЛЛЕГИАЛЬНОЕ РЕШЕНИЕ: ОПЕРАЦИЯ ОТКЛОНЕНА (REJECTED_BY_COMPLIANCE). Агент-экономист выявил превышение допустимого AML скоринга (0.80 > 0.70) из-за не-британского SWIFT кода и крупной суммы. Юридический агент подтвердил отказ в проводке. Бухгалтерский баланс сохранен в неприкосновенности.'
        : isLiquidity
        ? 'КОЛЛЕГИАЛЬНОЕ РЕШЕНИЕ: СТРЕСС-ТЕСТ УСПЕШНО ПРОЙДЕН (APPROVED). Резервы Ностро-счетов в Нью-Йорке, Лондоне и Франкфурте полностью покрывают отток ликвидности. Коэффициент LCR (118%) превышает норматив Basel III (100%). Дефицита фондирования нет.'
        : isSanctions
        ? 'КОЛЛЕГИАЛЬНОЕ РЕШЕНИЕ: УСЛОВНО ОДОБРЕНО С МОНИТОРИНГОМ (EDD REQUIRED). Прямых совпадений в санкционных списках OFAC/EU нет. Выявлен офшорный сателлит на Маршалловых о-вах. Юридический офицер назначил расширенную проверку Enhanced Due Diligence.'
        : isCard
        ? 'КОЛЛЕГИАЛЬНОЕ РЕШЕНИЕ: ЭМИССИЯ КАРТЫ СОГЛАСОВАНА (APPROVED). Скоринг кредитоспособности клиента AAA (94/100). Ликвидность в $100,000 задепонирована. Сформированы криптографический IBAN и маскированный PAN.'
        : 'КОЛЛЕГИАЛЬНОЕ РЕШЕНИЕ: ВСЕ ПАРАМЕТРЫ ПРОВЕРЕНЫ И СОГЛАСОВАНЫ (APPROVED). Операция соответствует международным регламентам FATF, SWIFT ISO 20022 и стандартам криптографической безопасности банка.'
      : isPythonRejected
      ? 'CONSENSUS VERDICT: TRANSACTION REJECTED (REJECTED_BY_COMPLIANCE). Economist agent calculated AML risk score 0.80 > 0.70 threshold. Legal officer vetoed execution. Zero balance impact on core ledger.'
      : 'CONSENSUS VERDICT: OPERATION FULLY VALIDATED & APPROVED. All regulatory thresholds, liquidity cushions, and HMAC cryptographic checks certified by the 10-Agent Council.';

    return {
      reportId,
      title: isRu ? `Сводный отчёт: ${title}` : `Executive Report: ${title}`,
      targetSubject: prompt.length > 80 ? `${prompt.substring(0, 77)}...` : prompt,
      timestamp: new Date().toISOString(),
      overallVerdict,
      executiveSummary: summaryText,
      metrics: [
        {
          label: isRu ? 'Консилиум агентов' : 'Council Participation',
          value: '10 / 10 Online',
          status: 'good',
        },
        {
          label: isRu ? 'AML Риск-скоринг' : 'AML Risk Score',
          value: isPythonRejected ? '0.80 (КРИТИЧЕСКИЙ)' : '0.15 (В НОРМЕ)',
          status: isPythonRejected ? 'bad' : 'good',
        },
        {
          label: isRu ? 'Статус SWIFT pacs.008' : 'SWIFT Protocol',
          value: isPythonRejected ? 'pacs.002 RJCT' : 'pacs.002 ACCP',
          status: isPythonRejected ? 'bad' : 'good',
        },
        {
          label: isRu ? 'Коэффициент LCR (Basel III)' : 'LCR Liquidity Ratio',
          value: '118% (Норма >100%)',
          status: 'good',
        },
        {
          label: isRu ? 'Скрининг OFAC & PEP' : 'Sanctions Screening',
          value: isSanctions ? 'EDD Monitored' : 'Clear / Clean',
          status: isSanctions ? 'warn' : 'good',
        },
        {
          label: isRu ? 'Криптозащита HMAC' : 'HMAC-SHA256 Seal',
          value: 'VALID & VERIFIED',
          status: 'good',
        },
      ],
      agentVotes: [
        {
          agentId: 'swift',
          agentName: 'SwiftGatewayAgent',
          vote: 'APPROVED',
          comment: isRu ? 'Синтаксис ISO 20022 / pacs.008 валиден.' : 'ISO 20022 / pacs.008 syntax valid.',
        },
        {
          agentId: 'monitor',
          agentName: 'MonitoringAgent',
          vote: 'APPROVED',
          comment: isRu ? 'Котировки проверены, рыночный спрэд 0.04%.' : 'Market quotes locked, spread 0.04%.',
        },
        {
          agentId: 'treasury',
          agentName: 'LiquidityReserveAgent',
          vote: 'APPROVED',
          comment: isRu ? 'Резерв ликвидности в банках-корреспондентах подтвержден.' : 'Nostro liquidity reserve confirmed.',
        },
        {
          agentId: 'sanctions',
          agentName: 'SanctionsScreenerAgent',
          vote: isSanctions ? 'NEUTRAL' : 'APPROVED',
          comment: isRu ? 'Прямых санкционных совпадений нет.' : 'No direct sanctions hits.',
        },
        {
          agentId: 'fraud',
          agentName: 'FraudDetectorAgent',
          vote: isPythonRejected ? 'REJECTED' : 'APPROVED',
          comment: isRu ? 'Нестандартная геолокация и не-GB маршрут.' : 'Non-GB routing anomaly detected.',
        },
        {
          agentId: 'economist',
          agentName: 'EconomistAgent',
          vote: isPythonRejected ? 'REJECTED' : 'APPROVED',
          comment: isRu ? 'AML скоринг 0.80 превышает порог 0.70.' : 'AML risk score 0.80 exceeds threshold.',
        },
        {
          agentId: 'lawyer',
          agentName: 'LawyerAgent',
          vote: isPythonRejected ? 'REJECTED' : 'APPROVED',
          comment: isRu ? 'Юридическое решение: отклонить по правилам FATF.' : 'Legal ruling: Reject under FATF rules.',
        },
        {
          agentId: 'accountant',
          agentName: 'AccountantAgent',
          vote: isPythonRejected ? 'REJECTED' : 'APPROVED',
          comment: isRu ? 'Проводка заблокирована, баланс защищен.' : 'Ledger protected, posting blocked.',
        },
        {
          agentId: 'audit',
          agentName: 'AuditInspectorAgent',
          vote: 'APPROVED',
          comment: isRu ? 'Хэш-подпись HMAC-SHA256 заверена.' : 'HMAC-SHA256 signature verified.',
        },
        {
          agentId: 'dispatcher',
          agentName: 'NotificationDispatcherAgent',
          vote: 'APPROVED',
          comment: isRu ? 'Официальный авизо сформирован для Контролера.' : 'Official advice generated for Controller.',
        },
      ],
      securityProof: {
        hmacSignature,
        timestamp: new Date().toISOString(),
        verified: true,
        hashAlg: 'HMAC-SHA256',
      },
      actionItems: isRu
        ? isPythonRejected
          ? [
              'Передать досье по инциденту в Департамент финансового мониторинга (ФСФМ).',
              'Запросить у контрагента подтверждающие документы происхождения средств (KYC Pack).',
              'Сохранить криптографический отчёт в судебном архивном реестре.',
            ]
          : [
              'Одобрить проводку в системе и уведомить клиринговый шлюз SWIFT.',
              'Автоматически архивировать хэш-подпись в блок-реестре.',
              'Оставить профиль под стандартным телеметрическим наблюдением.',
            ]
        : [
            'Archive HMAC forensic proof in court-admissible bank records.',
            'Transmit MT103 confirmation advice to designated counterpart.',
          ],
    };
  }
}
