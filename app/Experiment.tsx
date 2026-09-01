'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ATTENTION_CHECKS,
  CONDITION_KEYS,
  CRITICAL_ITEMS,
  FILLERS,
  PRACTICE_TRIALS,
  type ConditionKey,
  type Marker,
} from './stimuli';

type Stage =
  | 'welcome'
  | 'consent'
  | 'demographics'
  | 'instructions'
  | 'practice'
  | 'ready'
  | 'trials'
  | 'submitting'
  | 'complete'
  | 'error'
  | 'withdrawn';

type RecruitmentSource = 'prolific' | 'network';

type CriticalTrial = {
  type: 'critical';
  trialId: string;
  itemId: string;
  context: string;
  target: string;
  condition: ConditionKey;
  marker: Marker;
};

type FillerTrial = {
  type: 'filler';
  trialId: string;
  itemId: string;
  context: string;
  target: string;
  intended: 'good' | 'bad';
};

type AttentionTrial = {
  type: 'attention';
  trialId: string;
  itemId: string;
  context: string;
  target: string;
  requiredRating: number;
};

type Trial = CriticalTrial | FillerTrial | AttentionTrial;

type TrialResponse = {
  trialId: string;
  itemId: string;
  itemType: Trial['type'];
  sequence: number;
  rating: number;
  responseTimeMs: number;
  condition: ConditionKey | null;
  marker: Marker | null;
  evidenceSource: 'own' | 'reportative' | null;
  evidenceStrength: 'strong' | 'weak' | null;
  acquisitionTiming: 'realtime' | 'after' | null;
  fillerIntended: 'good' | 'bad' | null;
  attentionExpected: number | null;
  attentionPassed: boolean | null;
};

type PracticeResponse = {
  practiceId: string;
  rating: number;
  expectedMin: number;
  expectedMax: number;
  correct: boolean;
};

type Demographics = {
  ageBand: string;
  gender: string;
  education: string;
  nativeTurkish: string;
  turkishLearningStart: string;
  speaksOtherLanguages: string;
  otherLanguages: string;
  currentCountry: string;
  longestResidenceCountry: string;
};

type ExperimentConfig = {
  endpoint?: string;
  raffleEndpoint?: string;
  completionUrl?: string;
  prolificCompletionUrl?: string;
  studyId?: string;
  researcherName?: string;
  institution?: string;
  contactEmail?: string;
  ethicsReference?: string;
  protocolTitle?: string;
  approvalDate?: string;
  expirationDate?: string;
  rafflePrize?: string;
  fillerCount?: number;
  proofOfHumanSiteKey?: string;
};

declare global {
  interface Window {
    EXPERIMENT_CONFIG?: ExperimentConfig;
    getRoundtableSessionId?: () => string | undefined;
  }
}

const CONTENT_LISTS = CRITICAL_ITEMS.length / 2;
const TOTAL_LISTS = CONTENT_LISTS * 2;
const SCALE = [1, 2, 3, 4, 5, 6, 7];
const STIMULUS_VERSION = '2026-09-01-r3';

const EMPTY_DEMOGRAPHICS: Demographics = {
  ageBand: '',
  gender: '',
  education: '',
  nativeTurkish: '',
  turkishLearningStart: '',
  speaksOtherLanguages: '',
  otherLanguages: '',
  currentCountry: '',
  longestResidenceCountry: '',
};

const CONDITION_FACTORS: Record<
  ConditionKey,
  {
    evidenceSource: 'own' | 'reportative';
    evidenceStrength: 'strong' | 'weak';
    acquisitionTiming: 'realtime' | 'after';
  }
> = {
  own_strong_realtime: {
    evidenceSource: 'own',
    evidenceStrength: 'strong',
    acquisitionTiming: 'realtime',
  },
  own_strong_after: {
    evidenceSource: 'own',
    evidenceStrength: 'strong',
    acquisitionTiming: 'after',
  },
  own_weak_realtime: {
    evidenceSource: 'own',
    evidenceStrength: 'weak',
    acquisitionTiming: 'realtime',
  },
  own_weak_after: {
    evidenceSource: 'own',
    evidenceStrength: 'weak',
    acquisitionTiming: 'after',
  },
  reportative_strong_realtime: {
    evidenceSource: 'reportative',
    evidenceStrength: 'strong',
    acquisitionTiming: 'realtime',
  },
  reportative_strong_after: {
    evidenceSource: 'reportative',
    evidenceStrength: 'strong',
    acquisitionTiming: 'after',
  },
  reportative_weak_realtime: {
    evidenceSource: 'reportative',
    evidenceStrength: 'weak',
    acquisitionTiming: 'realtime',
  },
  reportative_weak_after: {
    evidenceSource: 'reportative',
    evidenceStrength: 'weak',
    acquisitionTiming: 'after',
  },
};

function uuid(prefix: string) {
  const value =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${value}`;
}

function hashString(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seedText: string) {
  let state = hashString(seedText) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: readonly T[], random: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function hasLongRun(trials: Array<CriticalTrial | FillerTrial>, maxRun = 4) {
  let previous = '';
  let run = 0;
  for (const trial of trials) {
    if (trial.type === previous) run += 1;
    else {
      previous = trial.type;
      run = 1;
    }
    if (run > maxRun) return true;
  }
  return false;
}

function selectFillers(count: number, random: () => number): FillerTrial[] {
  const safeCount = Math.max(0, Math.min(FILLERS.length, Math.floor(count)));
  const goodCount = Math.ceil(safeCount / 2);
  const badCount = Math.floor(safeCount / 2);
  const good = shuffle(
    FILLERS.filter((item) => item.intended === 'good'),
    random,
  ).slice(0, goodCount);
  const bad = shuffle(
    FILLERS.filter((item) => item.intended === 'bad'),
    random,
  ).slice(0, badCount);

  return shuffle([...good, ...bad], random).map((item) => ({
    type: 'filler',
    trialId: item.id,
    itemId: item.id,
    context: item.context,
    target: item.target,
    intended: item.intended,
  }));
}

export function buildTrials(
  listIndex: number,
  seed: string,
  fillerCount: number = FILLERS.length,
): Trial[] {
  const random = seededRandom(seed);
  const contentListIndex = listIndex % CONTENT_LISTS;
  const marker: Marker = listIndex < CONTENT_LISTS ? 'di' : 'mis';
  const critical: CriticalTrial[] = CONDITION_KEYS.flatMap(
    (condition, conditionIndex) => {
      const itemRow = (contentListIndex + conditionIndex) % CONTENT_LISTS;
      return [itemRow, itemRow + CONTENT_LISTS].map((itemIndex) => {
        const item = CRITICAL_ITEMS[itemIndex];
        return {
          type: 'critical' as const,
          trialId: `${item.id}-${condition}-${marker}`,
          itemId: item.id,
          context: item.contexts[condition],
          target: item.target[marker],
          condition,
          marker,
        };
      });
    },
  );

  const fillers = selectFillers(fillerCount, random);

  let mixed: Array<CriticalTrial | FillerTrial> = [...critical, ...fillers];
  for (let attempt = 0; attempt < 200; attempt += 1) {
    mixed = shuffle(mixed, random);
    if (!hasLongRun(mixed)) break;
  }

  const attentionTrials: AttentionTrial[] = ATTENTION_CHECKS.map((item) => ({
    type: 'attention',
    trialId: item.id,
    itemId: item.id,
    context: item.context,
    target: item.target,
    requiredRating: item.requiredRating,
  }));

  const result: Trial[] = [...mixed];
  const firstAttentionIndex = Math.max(4, Math.floor(result.length / 3));
  result.splice(firstAttentionIndex, 0, attentionTrials[0]);
  const secondAttentionIndex = Math.max(
    firstAttentionIndex + 5,
    Math.floor((result.length * 2) / 3),
  );
  result.splice(secondAttentionIndex, 0, attentionTrials[1]);
  return result;
}

function readLaunchData() {
  if (typeof window === 'undefined') {
    return {
      participantId: 'pending',
      participantIdSource: 'generated',
      prolificStudyId: null,
      prolificSessionId: null,
      sessionId: 'pending',
      listIndex: 0,
      recruitmentSource: 'network' as RecruitmentSource,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const prolificId = params.get('PROLIFIC_PID');
  const suppliedId = params.get('participant_id');
  const requestedSource = params.get('source');
  const recruitmentSource: RecruitmentSource =
    requestedSource === 'prolific' || prolificId ? 'prolific' : 'network';
  const participantId = prolificId || suppliedId || uuid('P');
  const listParam = Number(params.get('list'));
  const listIndex =
    Number.isInteger(listParam) && listParam >= 1 && listParam <= TOTAL_LISTS
      ? listParam - 1
      : hashString(participantId) % TOTAL_LISTS;

  return {
    participantId,
    participantIdSource: prolificId ? 'prolific' : suppliedId ? 'url' : 'generated',
    prolificStudyId: params.get('STUDY_ID'),
    prolificSessionId: params.get('SESSION_ID'),
    sessionId: uuid('S'),
    listIndex,
    recruitmentSource,
  };
}

function Button({
  children,
  onClick,
  disabled = false,
  type = 'button',
  quiet = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  quiet?: boolean;
}) {
  return (
    <button
      className={quiet ? 'button button-quiet' : 'button'}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

function Page({
  children,
  step,
}: {
  children: React.ReactNode;
  step?: string;
}) {
  return (
    <main className="page">
      <header className="topbar">
        <span>Türkçe Cümle Değerlendirme Çalışması</span>
        {step ? <span className="topbar-step">{step}</span> : null}
      </header>
      <section className="page-content">{children}</section>
    </main>
  );
}

function RatingScale({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (rating: number) => void;
}) {
  return (
    <fieldset className="rating-fieldset">
      <legend>Bu cümle yukarıdaki bağlama ne kadar uygun?</legend>
      <div className="scale-labels">
        <span>Hiç uygun değil</span>
        <span>Tamamen uygun</span>
      </div>
      <div className="rating-scale">
        {SCALE.map((rating) => (
          <button
            className={value === rating ? 'selected' : ''}
            key={rating}
            type="button"
            aria-pressed={value === rating}
            aria-label={`${rating} puan`}
            onClick={() => onChange(rating)}
          >
            {rating}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ScalePreview() {
  return (
    <div
      className="scale-preview"
      role="img"
      aria-label="1 hiç uygun değil, 4 ne uygun ne de uygun değil, 7 tamamen uygun"
    >
      <div className="rating-scale" aria-hidden="true">
        {SCALE.map((rating) => (
          <button key={rating} type="button" tabIndex={-1} disabled>
            {rating}
          </button>
        ))}
      </div>
      <div className="preview-scale-labels" aria-hidden="true">
        <span>Hiç uygun değil</span>
        <span>
          Ne uygun ne de uygun <strong>değil</strong>
        </span>
        <span>Tamamen uygun</span>
      </div>
    </div>
  );
}

function ConsentContent({
  source,
  config,
}: {
  source: RecruitmentSource;
  config: ExperimentConfig;
}) {
  const protocolTitle =
    config.protocolTitle ||
    'Communication and social cognition in natural audiovisual contexts';

  return (
    <div className="consent-copy">
      <div className="consent-metadata">
        <p>
          <span>Protokol sorumlusu:</span>{' '}
          {config.researcherName || 'Robert Hawkins'}
        </p>
        <p>
          <span>Protokol başlığı:</span> {protocolTitle}
        </p>
        <p>
          <span>IRB:</span> {config.ethicsReference || '77226'}
        </p>
        <p>
          <span>Onay tarihi:</span> {config.approvalDate || '18 Haziran 2026'}
        </p>
        <p>
          <span>Geçerlilik bitiş tarihi:</span>{' '}
          {config.expirationDate || '31 Mayıs 2027'}
        </p>
      </div>

      <section className="consent-section">
        <h2>Açıklama</h2>
        <p>
          Türkçede anlamın bağlam içinde nasıl yorumlandığını inceleyen bir
          araştırma çalışmasına katılmaya davet ediliyorsunuz. Araştırmanın
          amacı, Türkçe konuşurların cümleleri farklı bağlamlarda ne kadar doğal
          ve uygun bulduklarını anlamaktır. Katılmayı seçerseniz kısa bağlamlar
          ve bunları izleyen cümleler okuyacak, her cümlenin bağlama uygunluğunu
          1 ile 7 arasında değerlendirecek ve dil geçmişiniz ile bazı genel
          demografik bilgilerinize ilişkin soruları yanıtlayacaksınız.
        </p>
      </section>

      <section className="consent-section">
        <h2>Süre</h2>
        <p>
          Çalışma yaklaşık 15 dakika sürecektir. Cep telefonu veya tabletle
          katılabilirsiniz. Daha rahat bir deneyim için masaüstü ya da dizüstü
          bilgisayar kullanmanızı öneririz. İstediğiniz zaman çalışmadan
          ayrılabilirsiniz.
        </p>
      </section>

      <section className="consent-section">
        <h2>Riskler ve yararlar</h2>
        <p>
          Bu çalışma, günlük internet kullanımının ötesinde önemli bir risk
          taşımaz. Bazı cümleleri değerlendirmek yorucu veya tekrarlı gelebilir.
          Yanıtlarınız, gizlilik ihlali riskini en aza indirmek için Stanford
          Üniversitesi standartlarına uygun özel bir Google Drive alanında
          güvenli olarak saklanacaktır.
        </p>
        <p>
          Veri kalitesini korumak için Proof of Human adlı üçüncü taraf araç;
          imleç hareketleri, tuş ritmi, kaydırma, sayfa odağı ile cihaz ve ağ
          bilgilerini işleyerek otomatik veya şüpheli oturumlar için bir risk
          puanı üretecektir. Bu çalışma kapsamında yalnızca izleme amacıyla
          kullanılacak ve tek başına katılımcıları engellemek ya da yanıtları
          dışlamak için kullanılmayacaktır.
        </p>
        <p>
          Bu çalışma, Türkçede anlamın bağlam içinde nasıl yorumlandığına ilişkin
          bilimsel bilgimizi geliştirebilir. Bu çalışmadan herhangi bir yarar
          sağlayacağınızı garanti edemeyiz veya vaat edemeyiz.
        </p>
      </section>

      <section className="consent-section">
        <h2>{source === 'prolific' ? 'Ödeme' : 'Çekiliş'}</h2>
        {source === 'prolific' ? (
          <p>
            Prolific üzerinden katılıyorsanız, Prolific&apos;te ilan edilen
            tutarda ödeme alacaksınız. Çalışmayı tamamlamazsanız, harcadığınız
            süreye orantılı ödeme alacaksınız. Prolific kimliğiniz,
            katılımınızı eşleştirmek ve ödemenizi yönetmek amacıyla
            kaydedilebilir.
          </p>
        ) : (
          <p>
            Çalışmayı tamamladıktan sonra e-posta adresinizi paylaşarak bir
            katılımcıya verilecek{' '}
            {config.rafflePrize || '1.000 TL değerindeki Amazon hediye kartı'}{' '}
            çekilişine katılabilirsiniz. E-posta adresinizi paylaşmak isteğe
            bağlıdır. Adresiniz deney yanıtlarından ayrı tutulacak, yalnızca
            çekiliş için kullanılacak ve çekiliş tamamlandıktan sonra
            silinecektir. Kazanma olasılığı geçerli çekiliş katılımı sayısına
            bağlıdır.
          </p>
        )}
      </section>

      <section className="consent-section">
        <h2>Katılımcı hakları</h2>
        <p>
          Katılımınız gönüllüdür. Herhangi bir ceza almadan veya hak sahibi
          olduğunuz yararları kaybetmeden onamınızı geri çekebilir ya da
          katılımınızı istediğiniz zaman sonlandırabilirsiniz. Alternatif,
          araştırmaya katılmamaktır. Belirli soruları yanıtlamayı
          reddedebilirsiniz.
        </p>
        <p>
          Araştırmanın sonuçları bilimsel veya mesleki toplantılarda sunulabilir
          ya da bilimsel dergilerde yayımlanabilir. Yayımlanmış ve yazılı
          verilerde bireysel gizliliğiniz korunacaktır. Bu çalışmanın verileri,
          doğrudan kimliğinizi belirleyen bilgiler çıkarıldıktan sonra ek
          onamınız alınmadan gelecekteki araştırmalarda kullanılabilir veya
          diğer araştırmacılarla paylaşılabilir.
        </p>
      </section>

      <section className="consent-section">
        <h2>İletişim bilgileri</h2>
        <p>
          Araştırma hakkında sorunuz, endişeniz veya şikayetiniz varsa Robert
          Hawkins ile{' '}
          <a href={`mailto:${config.contactEmail || 'rdhawkins@stanford.edu'}`}>
            {config.contactEmail || 'rdhawkins@stanford.edu'}
          </a>{' '}
          adresinden ya da 217-549-6923 numarasından iletişime geçebilirsiniz.
        </p>
        <p>
          Araştırma ekibinden bağımsız biriyle görüşmek için Stanford Kurumsal
          İnceleme Kurulu ile 650-723-2480 numarasından, ücretsiz
          1-866-680-2906 numarasından veya{' '}
          <a href="mailto:irbnonmed@stanford.edu">irbnonmed@stanford.edu</a>{' '}
          adresinden iletişime geçebilirsiniz.
        </p>
      </section>
    </div>
  );
}

export default function Experiment() {
  const [stage, setStage] = useState<Stage>('welcome');
  const [launch] = useState(() => readLaunchData());
  const [consentAdult, setConsentAdult] = useState(false);
  const [consentStudy, setConsentStudy] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState('');
  const [demographics, setDemographics] =
    useState<Demographics>(EMPTY_DEMOGRAPHICS);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceRating, setPracticeRating] = useState<number | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<boolean | null>(null);
  const [practiceResponses, setPracticeResponses] = useState<PracticeResponse[]>([]);
  const [trialIndex, setTrialIndex] = useState(0);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [responses, setResponses] = useState<TrialResponse[]>([]);
  const [trialStartedAt, setTrialStartedAt] = useState(0);
  const [submissionError, setSubmissionError] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [raffleToken, setRaffleToken] = useState('');
  const [raffleEmail, setRaffleEmail] = useState('');
  const [raffleStatus, setRaffleStatus] = useState<
    'idle' | 'submitting' | 'complete' | 'error'
  >('idle');
  const [raffleError, setRaffleError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastRecordedTrialRef = useRef('');
  const submissionPendingRef = useRef(false);
  const config = typeof window === 'undefined' ? {} : window.EXPERIMENT_CONFIG ?? {};
  const configuredFillerCount =
    Number.isInteger(config.fillerCount) && (config.fillerCount ?? 0) >= 0
      ? Math.min(config.fillerCount ?? FILLERS.length, FILLERS.length)
      : FILLERS.length;
  const trials = useMemo(
    () =>
      buildTrials(
        launch.listIndex,
        `${launch.participantId}:${launch.sessionId}`,
        configuredFillerCount,
      ),
    [configuredFillerCount, launch],
  );

  const currentTrial = trials[trialIndex];
  const currentPractice = PRACTICE_TRIALS[practiceIndex];

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}${window.location.hash}`,
      );
    }
  }, []);

  useEffect(() => {
    if (stage === 'trials' || stage === 'practice') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      requestAnimationFrame(() => headingRef.current?.focus());
    }
  }, [stage, trialIndex, practiceIndex]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (stage === 'trials' || stage === 'submitting') event.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [stage]);

  useEffect(() => {
    const siteKey = config.proofOfHumanSiteKey?.trim();
    if (!consentTimestamp || !siteKey) return;
    if (document.querySelector('script[data-proof-of-human="true"]')) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.poh.org/v1/rt.js';
    script.async = true;
    script.dataset.siteKey = siteKey;
    script.dataset.userId = launch.sessionId;
    script.dataset.tags = `${config.studyId || 'turkish-evidentiality-v1'},${launch.recruitmentSource}`;
    script.dataset.proofOfHuman = 'true';
    document.head.appendChild(script);
  }, [config.proofOfHumanSiteKey, config.studyId, consentTimestamp, launch]);

  function updateDemographic(field: keyof Demographics, value: string) {
    setDemographics((current) => {
      const next = { ...current, [field]: value };
      if (field === 'speaksOtherLanguages' && value === 'no') {
        next.otherLanguages = '';
      }
      return next;
    });
  }

  function demographicsComplete() {
    return Boolean(
      demographics.ageBand &&
        demographics.education &&
        demographics.nativeTurkish &&
        demographics.turkishLearningStart &&
        demographics.speaksOtherLanguages &&
        demographics.currentCountry.trim() &&
        demographics.longestResidenceCountry.trim() &&
        (demographics.speaksOtherLanguages === 'no' ||
          demographics.otherLanguages.trim()),
    );
  }

  function handleDemographics(event: FormEvent) {
    event.preventDefault();
    if (demographicsComplete()) setStage('instructions');
  }

  function checkPracticeResponse() {
    if (practiceRating === null || practiceFeedback !== null) return;
    const correct =
      practiceRating >= currentPractice.expectedMin &&
      practiceRating <= currentPractice.expectedMax;
    setPracticeResponses((current) => [
      ...current,
      {
        practiceId: currentPractice.id,
        rating: practiceRating,
        expectedMin: currentPractice.expectedMin,
        expectedMax: currentPractice.expectedMax,
        correct,
      },
    ]);
    setPracticeFeedback(correct);
  }

  function continuePractice() {
    if (practiceIndex === PRACTICE_TRIALS.length - 1) {
      setStage('ready');
      return;
    }
    setPracticeIndex((current) => current + 1);
    setPracticeRating(null);
    setPracticeFeedback(null);
  }

  function recordResponse() {
    if (
      selectedRating === null ||
      !currentTrial ||
      lastRecordedTrialRef.current === currentTrial.trialId
    ) {
      return;
    }
    lastRecordedTrialRef.current = currentTrial.trialId;

    const factors =
      currentTrial.type === 'critical'
        ? CONDITION_FACTORS[currentTrial.condition]
        : null;

    const response: TrialResponse = {
      trialId: currentTrial.trialId,
      itemId: currentTrial.itemId,
      itemType: currentTrial.type,
      sequence: trialIndex + 1,
      rating: selectedRating,
      responseTimeMs: Math.round(performance.now() - trialStartedAt),
      condition: currentTrial.type === 'critical' ? currentTrial.condition : null,
      marker: currentTrial.type === 'critical' ? currentTrial.marker : null,
      evidenceSource: factors?.evidenceSource ?? null,
      evidenceStrength: factors?.evidenceStrength ?? null,
      acquisitionTiming: factors?.acquisitionTiming ?? null,
      fillerIntended: currentTrial.type === 'filler' ? currentTrial.intended : null,
      attentionExpected:
        currentTrial.type === 'attention' ? currentTrial.requiredRating : null,
      attentionPassed:
        currentTrial.type === 'attention'
          ? selectedRating === currentTrial.requiredRating
          : null,
    };

    const completedResponses = [...responses, response];
    setResponses(completedResponses);
    if (trialIndex === trials.length - 1) {
      void submitData(completedResponses);
    } else {
      setTrialStartedAt(performance.now());
      setSelectedRating(null);
      setTrialIndex((current) => current + 1);
    }
  }

  async function submitData(responsesToSubmit = responses) {
    if (submissionPendingRef.current) return;
    submissionPendingRef.current = true;
    setStage('submitting');
    setSubmissionError('');

    const endpoint = config.endpoint?.trim();
    if (!endpoint || !endpoint.startsWith('https://')) {
      submissionPendingRef.current = false;
      setSubmissionError(
        'Güvenli veri gönderim adresi yapılandırılmamış. Lütfen araştırmacıya haber verin.',
      );
      setStage('error');
      return;
    }

    const payload = {
      schemaVersion: 3,
      studyId: config.studyId || 'turkish-evidentiality-v1',
      stimulusVersion: STIMULUS_VERSION,
      participant: {
        participantId: launch.participantId,
        participantIdSource: launch.participantIdSource,
        recruitmentSource: launch.recruitmentSource,
        prolificStudyId: launch.prolificStudyId,
        prolificSessionId: launch.prolificSessionId,
      },
      session: {
        sessionId: launch.sessionId,
        listId: launch.listIndex + 1,
        totalLists: TOTAL_LISTS,
        contentListId: (launch.listIndex % CONTENT_LISTS) + 1,
        marker: launch.listIndex < CONTENT_LISTS ? 'di' : 'mis',
        criticalTrialCount: 16,
        fillerTrialCount: configuredFillerCount,
        consentedAt: consentTimestamp,
        completedAt: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        proofOfHumanSessionId: window.getRoundtableSessionId?.() ?? null,
      },
      demographics,
      practiceResponses,
      responses: responsesToSubmit,
    };

    try {
      const result = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
      });
      if (!result.ok) throw new Error(`HTTP ${result.status}`);
      const body = (await result.json().catch(() => ({}))) as {
        confirmationCode?: unknown;
        raffleToken?: unknown;
      };
      setConfirmationCode(
        typeof body.confirmationCode === 'string'
          ? body.confirmationCode
          : launch.sessionId,
      );
      setRaffleToken(
        typeof body.raffleToken === 'string' ? body.raffleToken : '',
      );
      setStage('complete');
    } catch {
      submissionPendingRef.current = false;
      setSubmissionError(
        'Yanıtlar gönderilemedi. İnternet bağlantınızı kontrol edip yeniden deneyin. Bu sayfayı kapatmayın.',
      );
      setStage('error');
    }
  }

  async function submitRaffleEntry(event: FormEvent) {
    event.preventDefault();
    if (launch.recruitmentSource !== 'network' || raffleStatus === 'submitting') {
      return;
    }

    const endpoint = (config.raffleEndpoint || config.endpoint)?.trim();
    if (!endpoint || !endpoint.startsWith('https://')) {
      setRaffleError(
        'Çekiliş kayıt adresi henüz yapılandırılmamış. Lütfen araştırmacıya haber verin.',
      );
      setRaffleStatus('error');
      return;
    }
    if (!raffleToken) {
      setRaffleError(
        'Çekiliş uygunluk kodu alınamadı. Lütfen araştırmacıya onay kodunuzu iletin.',
      );
      setRaffleStatus('error');
      return;
    }

    setRaffleStatus('submitting');
    setRaffleError('');
    try {
      const result = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'raffleEntry',
          studyId: config.studyId || 'turkish-evidentiality-v1',
          raffleToken,
          email: raffleEmail.trim(),
        }),
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
      });
      if (!result.ok) throw new Error(`HTTP ${result.status}`);
      setRaffleStatus('complete');
      setRaffleEmail('');
    } catch {
      setRaffleStatus('error');
      setRaffleError(
        'E-posta adresiniz kaydedilemedi. İnternet bağlantınızı kontrol edip yeniden deneyin.',
      );
    }
  }

  if (stage === 'welcome') {
    const isProlific = launch.recruitmentSource === 'prolific';
    return (
      <Page>
        <div className="plain-panel">
          <h1>Türkçede anlamı nasıl yorumladığımızı araştırıyoruz.</h1>
          <p className="lead">
            Bu çalışmada sizden, kısa bağlamlar içinde sunulan Türkçe cümleleri
            değerlendirmenizi isteyeceğiz. Katılım yaklaşık 15 dakika sürer.
          </p>
          <p className="source-note">
            {isProlific
              ? 'Ödemeniz, çalışmanın Prolific sayfasında belirtilen tutarda Prolific üzerinden yapılacaktır.'
              : `Çalışmayı tamamladıktan sonra ${config.rafflePrize || '1.000 TL değerindeki Amazon hediye kartı'} çekilişine katılabilirsiniz.`}
          </p>
          <p className="device-note">
            Telefon veya tabletle katılabilirsiniz. Daha rahat bir deneyim için
            masaüstü ya da dizüstü bilgisayar kullanmanızı öneririz.
          </p>
          <Button onClick={() => setStage('consent')}>Başla</Button>
        </div>
      </Page>
    );
  }

  if (stage === 'consent') {
    return (
      <Page step="1 / 3">
        <div className="plain-panel form-panel">
          <h1>Araştırma bilgilendirme ve onam formu</h1>
          <ConsentContent source={launch.recruitmentSource} config={config} />
          <label className="check-row">
            <input
              type="checkbox"
              checked={consentAdult}
              onChange={(event) => setConsentAdult(event.target.checked)}
            />
            <span>18 yaşında veya daha büyük olduğumu onaylıyorum.</span>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={consentStudy}
              onChange={(event) => setConsentStudy(event.target.checked)}
            />
            <span>
              Bilgileri okudum ve çalışmaya gönüllü olarak katılmayı kabul
              ediyorum.
            </span>
          </label>
          <div className="actions split-actions">
            <Button quiet onClick={() => setStage('withdrawn')}>
              Katılmak istemiyorum
            </Button>
            <Button
              disabled={!consentAdult || !consentStudy}
              onClick={() => {
                setConsentTimestamp(new Date().toISOString());
                setStage('demographics');
              }}
            >
              Devam et
            </Button>
          </div>
        </div>
      </Page>
    );
  }

  if (stage === 'demographics') {
    return (
      <Page step="2 / 3">
        <form className="plain-panel form-panel" onSubmit={handleDemographics}>
          <h1>Katılımcı bilgileri</h1>
          <p className="form-note">
            Yanıtlarınızı daha iyi yorumlayabilmek için katılımcılarımızın yaş
            ve dil geçmişi gibi bazı genel özelliklerini bilmemiz gerekiyor.
            Bu formda ad, e-posta adresi veya telefon numarası istemiyoruz. Bu
            bilgiler yalnızca araştırma verilerini anlamak ve analiz etmek
            amacıyla kullanılacaktır.{' '}
            {launch.recruitmentSource === 'network'
              ? 'Çekilişe katılmak isterseniz e-posta adresiniz deney bittikten sonra ayrı bir formda istenecek ve deney yanıtlarından ayrı tutulacaktır. '
              : 'Prolific kimliğiniz yalnızca katılımınızı eşleştirmek ve ödemenizi yönetmek amacıyla kaydedilebilir. '}
            Yıldızlı alanlar zorunludur. Cinsiyet sorusunu yanıtsız
            bırakabilirsiniz.
          </p>
          <div className="form-list">
            <label>
              <span>Yaş aralığınız *</span>
              <select
                required
                value={demographics.ageBand}
                onChange={(event) =>
                  updateDemographic('ageBand', event.target.value)
                }
              >
                <option value="">Seçin</option>
                <option>18–24</option>
                <option>25–34</option>
                <option>35–44</option>
                <option>45–54</option>
                <option>55–64</option>
                <option>65+</option>
              </select>
            </label>

            <label>
              <span>Cinsiyetiniz</span>
              <select
                value={demographics.gender}
                onChange={(event) =>
                  updateDemographic('gender', event.target.value)
                }
              >
                <option value="">Yanıtlamak istemiyorum</option>
                <option>Kadın</option>
                <option>Erkek</option>
                <option>İkili olmayan</option>
                <option>Başka</option>
              </select>
            </label>

            <label>
              <span>Eğitim düzeyiniz *</span>
              <select
                required
                value={demographics.education}
                onChange={(event) =>
                  updateDemographic('education', event.target.value)
                }
              >
                <option value="">Seçin</option>
                <option>Lise veya altı</option>
                <option>Ön lisans</option>
                <option>Lisans</option>
                <option>Yüksek lisans</option>
                <option>Doktora</option>
              </select>
            </label>

            <label>
              <span>Türkçe ana diliniz mi? *</span>
              <select
                required
                value={demographics.nativeTurkish}
                onChange={(event) =>
                  updateDemographic('nativeTurkish', event.target.value)
                }
              >
                <option value="">Seçin</option>
                <option value="yes">Evet</option>
                <option value="no">Hayır</option>
              </select>
            </label>

            <label>
              <span>Türkçe öğrenmeye ne zaman başladınız? *</span>
              <select
                required
                value={demographics.turkishLearningStart}
                onChange={(event) =>
                  updateDemographic('turkishLearningStart', event.target.value)
                }
              >
                <option value="">Seçin</option>
                <option>Doğumdan itibaren</option>
                <option>0–3 yaş arasında</option>
                <option>4–6 yaş arasında</option>
                <option>7–12 yaş arasında</option>
                <option>13–17 yaş arasında</option>
                <option>18 yaşından sonra</option>
              </select>
            </label>

            <label>
              <span>Başka diller de konuşuyor musunuz? *</span>
              <select
                required
                value={demographics.speaksOtherLanguages}
                onChange={(event) =>
                  updateDemographic('speaksOtherLanguages', event.target.value)
                }
              >
                <option value="">Seçin</option>
                <option value="yes">Evet</option>
                <option value="no">Hayır</option>
              </select>
            </label>

            {demographics.speaksOtherLanguages === 'yes' ? (
              <label>
                <span>Hangi dilleri konuşuyorsunuz? *</span>
                <input
                  required
                  value={demographics.otherLanguages}
                  onChange={(event) =>
                    updateDemographic('otherLanguages', event.target.value)
                  }
                />
              </label>
            ) : null}

            <label>
              <span>Şu anda hangi ülkede yaşıyorsunuz? *</span>
              <input
                required
                value={demographics.currentCountry}
                onChange={(event) =>
                  updateDemographic('currentCountry', event.target.value)
                }
              />
            </label>

            <label>
              <span>Hayatınızın çoğunu hangi ülkede geçirdiniz? *</span>
              <input
                required
                value={demographics.longestResidenceCountry}
                onChange={(event) =>
                  updateDemographic(
                    'longestResidenceCountry',
                    event.target.value,
                  )
                }
              />
            </label>
          </div>
          <div className="actions">
            <Button type="submit" disabled={!demographicsComplete()}>
              Devam et
            </Button>
          </div>
        </form>
      </Page>
    );
  }

  if (stage === 'instructions') {
    return (
      <Page step="3 / 3">
        <div className="plain-panel">
          <h1>Deneye hoş geldiniz!</h1>
          <p className="lead">
            Bu deneyde size bazı bağlamlar ve bu bağlamlarda söylenen cümleler
            göstereceğiz. Her cümleyi, içinde bulunduğu bağlamda ne kadar doğal
            ve uygun olduğuna göre değerlendirmenizi isteyeceğiz.
          </p>
          <ScalePreview />
          <p className="instructions-copy">
            Deneyde sizden beklenen değerlendirmeyi daha iyi anlatmak için önce
            üç alıştırma göstereceğiz. Her alıştırmadan sonra yanıtınız hakkında
            geri bildirim alacaksınız. Alıştırma turu bittikten sonra deney
            başlayacak ve yanıtlarınıza ilişkin geri bildirim almayacaksınız.
          </p>
          <Button onClick={() => setStage('practice')}>Alıştırmalara geç</Button>
        </div>
      </Page>
    );
  }

  if (stage === 'practice') {
    return (
      <Page step={`Alıştırma ${practiceIndex + 1} / ${PRACTICE_TRIALS.length}`}>
        <div className="trial-panel">
          <p className="section-label">BAĞLAM:</p>
          <p className="context-text">{currentPractice.context}</p>
          <h1 ref={headingRef} tabIndex={-1} className="target-text">
            {currentPractice.target}
          </h1>
          <RatingScale value={practiceRating} onChange={setPracticeRating} />

          {practiceFeedback !== null ? (
            <div
              className={practiceFeedback ? 'feedback feedback-good' : 'feedback feedback-bad'}
              role="status"
            >
              <strong>{practiceFeedback ? 'Doğru.' : 'Beklenen yanıt farklı.'}</strong>
              <span>{currentPractice.explanation}</span>
            </div>
          ) : null}

          <div className="actions">
            {practiceFeedback === null ? (
              <Button
                disabled={practiceRating === null}
                onClick={checkPracticeResponse}
              >
                Yanıtı kontrol et
              </Button>
            ) : (
              <Button onClick={continuePractice}>
                {practiceIndex === PRACTICE_TRIALS.length - 1
                  ? 'Alıştırmaları tamamla'
                  : 'Sonraki alıştırma'}
              </Button>
            )}
          </div>
        </div>
      </Page>
    );
  }

  if (stage === 'ready') {
    return (
      <Page>
        <div className="plain-panel">
          <h1>Alıştırmaları tamamladınız.</h1>
          <p className="lead">
            Asıl deney şimdi başlayacak. Bundan sonraki yanıtlarınıza ilişkin
            geri bildirim verilmeyecek. Hazır olduğunuzda deneye başlayın.
          </p>
          <Button
            onClick={() => {
              setTrialStartedAt(performance.now());
              setStage('trials');
            }}
          >
            Deneye başla
          </Button>
        </div>
      </Page>
    );
  }

  if (stage === 'trials' && currentTrial) {
    const isAttention = currentTrial.type === 'attention';
    return (
      <main className="page">
        <header className="topbar">
          <span>Türkçe Cümle Değerlendirme Çalışması</span>
          <span className="topbar-step">
            {trialIndex + 1} / {trials.length}
          </span>
        </header>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${((trialIndex + 1) / trials.length) * 100}%` }} />
        </div>
        <section className="page-content trial-page">
          <div className="trial-panel">
            {isAttention ? (
              <>
                <p className="section-label">DİKKAT KONTROLÜ:</p>
                <p className="context-text">{currentTrial.context}</p>
                <h1 ref={headingRef} tabIndex={-1} className="target-text">
                  {currentTrial.target}
                </h1>
              </>
            ) : (
              <>
                <p className="section-label">BAĞLAM:</p>
                <p className="context-text">{currentTrial.context}</p>
                <h1 ref={headingRef} tabIndex={-1} className="target-text">
                  {currentTrial.target}
                </h1>
              </>
            )}

            <RatingScale value={selectedRating} onChange={setSelectedRating} />

            <div className="actions">
              <Button
                disabled={selectedRating === null}
                onClick={recordResponse}
              >
                Devam et
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (stage === 'submitting') {
    return (
      <Page>
        <div className="plain-panel status-panel" role="status">
          <h1>Yanıtlarınız kaydediliyor.</h1>
          <p>Lütfen bu pencereyi kapatmayın.</p>
        </div>
      </Page>
    );
  }

  if (stage === 'complete') {
    const prolificCompletionUrl =
      config.prolificCompletionUrl || config.completionUrl;
    return (
      <Page>
        <div className="plain-panel status-panel">
          <h1>Teşekkür ederiz.</h1>
          <p>Yanıtlarınız başarıyla gönderildi.</p>
          <p className="confirmation">
            Onay kodu: <strong>{confirmationCode}</strong>
          </p>
          {launch.recruitmentSource === 'prolific' ? (
            prolificCompletionUrl ? (
              <a className="button link-button" href={prolificCompletionUrl}>
                Prolific&apos;e dön
              </a>
            ) : (
              <p className="completion-note">
                Prolific tamamlama bağlantısı henüz yapılandırılmamış. Yukarıdaki
                onay kodunu saklayın.
              </p>
            )
          ) : raffleStatus === 'complete' ? (
            <div className="raffle-complete" role="status">
              <h2>Çekiliş kaydınız tamamlandı.</h2>
              <p>
                Kazanmanız halinde sizinle paylaştığınız e-posta adresi üzerinden
                iletişime geçeceğiz.
              </p>
            </div>
          ) : (
            <form className="raffle-form" onSubmit={submitRaffleEntry}>
              <h2>Amazon hediye kartı çekilişi</h2>
              <p>
                {config.rafflePrize || '1.000 TL değerindeki Amazon hediye kartı'}{' '}
                çekilişine katılmak için e-posta adresinizi yazın. Bu adres deney
                yanıtlarından ayrı kaydedilecektir.
              </p>
              <label>
                <span>E-posta adresiniz</span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={raffleEmail}
                  onChange={(event) => setRaffleEmail(event.target.value)}
                />
              </label>
              {raffleStatus === 'error' ? (
                <p className="form-error" role="alert">
                  {raffleError}
                </p>
              ) : null}
              <Button
                type="submit"
                disabled={!raffleEmail.trim() || raffleStatus === 'submitting'}
              >
                {raffleStatus === 'submitting'
                  ? 'Kaydediliyor…'
                  : 'Çekilişe katıl'}
              </Button>
              <p className="raffle-optional">
                Çekilişe katılmak isteğe bağlıdır. Katılmadan da bu pencereyi
                kapatabilirsiniz.
              </p>
            </form>
          )}
        </div>
      </Page>
    );
  }

  if (stage === 'error') {
    return (
      <Page>
        <div className="plain-panel status-panel" role="alert">
          <h1>Gönderim tamamlanamadı.</h1>
          <p>{submissionError}</p>
          <Button onClick={() => submitData()}>Yeniden dene</Button>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="plain-panel status-panel">
        <h1>Çalışmadan ayrıldınız.</h1>
        <p>Herhangi bir yanıt gönderilmedi.</p>
      </div>
    </Page>
  );
}
