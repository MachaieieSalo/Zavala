import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DissertationQuestion } from '../../data/dissertationText';
import {
  ADVERSARIAL_VULNERABILITIES,
  AdversarialVulnerability,
  getVulnerabilitiesForQuestion,
  scanForEpistemicRisks,
  EpistemicRiskAlert,
} from '../../data/adversarialVulnerabilities';
import {
  evaluateAdversarialResponse,
  AdversarialEvaluationResult,
  QualitativeGrade,
} from './adversarialEvaluation';
import { DefenseAdversarialSummary, AdversarialSessionRecord } from './DefenseAdversarialSummary';
import { Button } from '../common/Button';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Mic,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Volume2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { SupportedLang } from '../../data/translations';

interface DefenseAdversarialViewProps {
  questions: DissertationQuestion[];
  selectedQuestionId?: string | null;
  onSendToStudio: (text: string, title: string, questionId?: string) => void;
  onPlayQuickSpeech: (text: string) => void;
  onRestartSession: () => void;
  onReturnToStudyMode: () => void;
  onNavigateToTab?: (tab: 'dados' | 'campo' | 'estudio' | 'defesa', param?: string) => void;
  questionLang?: SupportedLang;
}

const ADVERSARIAL_RESPONSES_KEY = 'zavalavoz_adversarial_responses_v1';
const ADVERSARIAL_ACTIVE_INDEX_KEY = 'zavalavoz_adversarial_active_question_v1';

export const DefenseAdversarialView: React.FC<DefenseAdversarialViewProps> = ({
  questions,
  selectedQuestionId,
  onSendToStudio,
  onPlayQuickSpeech,
  onRestartSession,
  onReturnToStudyMode,
  onNavigateToTab,
  questionLang = 'pt',
}) => {
  const isPt = questionLang === 'pt';
  const langCode: 'pt' | 'en' = questionLang === 'en' ? 'en' : 'pt';

  // Active question index (0 to 4)
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (selectedQuestionId) {
      const foundIdx = questions.findIndex((q) => q.id === selectedQuestionId);
      if (foundIdx !== -1) return foundIdx;
    }
    try {
      const saved = localStorage.getItem(ADVERSARIAL_ACTIVE_INDEX_KEY);
      if (!saved) return 0;
      const parsed = parseInt(saved, 10);
      return !Number.isNaN(parsed) && parsed >= 0 && parsed < questions.length ? parsed : 0;
    } catch {
      return 0;
    }
  });

  // Sync index if external selectedQuestionId changes
  useEffect(() => {
    if (selectedQuestionId) {
      const idx = questions.findIndex((q) => q.id === selectedQuestionId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [selectedQuestionId, questions]);

  // Candidate drafts state: { [qId]: { primary: string, secondary: string, isDelivered: boolean } }
  const [responses, setResponses] = useState<
    Record<string, { primary: string; secondary: string; isDelivered: boolean }>
  >(() => {
    try {
      const saved = localStorage.getItem(ADVERSARIAL_RESPONSES_KEY);
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
      return {};
    } catch {
      return {};
    }
  });

  // Current question and associated vulnerability
  const currentQuestion = questions[currentIndex] || questions[0];
  const vulnerabilities = useMemo(() => {
    return getVulnerabilitiesForQuestion(currentQuestion.number);
  }, [currentQuestion.number]);

  const activeVulnerability = vulnerabilities[0] || ADVERSARIAL_VULNERABILITIES[0];

  // Stage toggles for the confrontation
  const [showSecondaryPressure, setShowSecondaryPressure] = useState<boolean>(false);
  const [showThesisComparison, setShowThesisComparison] = useState<boolean>(false);
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);

  // Cached evaluations per question ID
  const [evaluations, setEvaluations] = useState<Record<string, AdversarialEvaluationResult>>({});

  // Persist responses and active index
  useEffect(() => {
    try {
      localStorage.setItem(ADVERSARIAL_RESPONSES_KEY, JSON.stringify(responses));
    } catch (e) {
      console.warn('Could not persist adversarial responses to localStorage:', e);
    }
  }, [responses]);

  useEffect(() => {
    try {
      localStorage.setItem(ADVERSARIAL_ACTIVE_INDEX_KEY, currentIndex.toString());
    } catch (e) {
      console.warn('Could not persist active adversarial index:', e);
    }
  }, [currentIndex]);

  // Current drafts
  const currentDraft = responses[currentQuestion.id] || {
    primary: '',
    secondary: '',
    isDelivered: false,
  };

  const primaryText = currentDraft.primary;
  const secondaryText = currentDraft.secondary;
  const isDelivered = currentDraft.isDelivered;

  // Real-time epistemological scanner for primary and secondary text
  const combinedText = `${primaryText} ${secondaryText}`.trim();
  const liveEpistemicAlerts: EpistemicRiskAlert[] = useMemo(() => {
    return scanForEpistemicRisks(combinedText);
  }, [combinedText]);

  // Word count & time estimate
  const wordsCount = combinedText ? combinedText.split(/\s+/).filter(Boolean).length : 0;
  const estimatedMin = Math.max(1, Math.round(wordsCount / 130));

  // Handle draft text update
  const handlePrimaryChange = (val: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { secondary: '', isDelivered: false }),
        primary: val,
      },
    }));
  };

  const handleSecondaryChange = (val: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { primary: '', isDelivered: false }),
        secondary: val,
      },
    }));
  };

  // Submit response to the adversarial board
  const handleSubmitResponse = () => {
    const evalResult = evaluateAdversarialResponse(
      primaryText,
      secondaryText,
      currentQuestion,
      activeVulnerability,
      langCode
    );

    setEvaluations((prev) => ({
      ...prev,
      [currentQuestion.id]: evalResult,
    }));

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        primary: primaryText,
        secondary: secondaryText,
        isDelivered: true,
      },
    }));

    // Auto reveal comparison option
    setShowThesisComparison(true);
  };

  // Evaluate on index change if already delivered
  useEffect(() => {
    if (currentDraft.isDelivered && !evaluations[currentQuestion.id]) {
      const evalResult = evaluateAdversarialResponse(
        primaryText,
        secondaryText,
        currentQuestion,
        activeVulnerability,
        langCode
      );
      setEvaluations((prev) => ({
        ...prev,
        [currentQuestion.id]: evalResult,
      }));
    }
  }, [currentIndex, currentQuestion.id]);

  // Active evaluation result
  const activeEval = evaluations[currentQuestion.id];

  // Send to Studio for speech rehearsal
  const handleSendToStudio = () => {
    const juryQ = isPt ? currentQuestion.juryQuestion : currentQuestion.juryQuestionEn;
    const boardPressure = isPt
      ? activeVulnerability.primaryPressure
      : activeVulnerability.primaryPressureEn;
    const candResponse = combinedText || (isPt ? currentQuestion.candidateResponse : currentQuestion.candidateResponseEn);

    const formattedManuscript = `### PERGUNTA DA BANCA (#${currentQuestion.number})
**Examinador:** ${isPt ? currentQuestion.examinerRole : currentQuestion.examinerRoleEn}
${juryQ}

### OBJECÇÃO DA BANCA (Vulnerabilidade ${activeVulnerability.code}: ${isPt ? activeVulnerability.title : activeVulnerability.titleEn})
${boardPressure}

### RESPOSTA DA CANDIDATA (Eng.ª Yolanda Tamele)
${candResponse}
`;

    const title = `Banca Adversarial #${currentQuestion.number}: ${isPt ? currentQuestion.title : currentQuestion.titleEn}`;
    onSendToStudio(formattedManuscript, title, currentQuestion.id);
  };

  // Build records for final session summary
  const sessionRecords: AdversarialSessionRecord[] = useMemo(() => {
    return questions.map((q) => {
      const draft = responses[q.id] || { primary: '', secondary: '', isDelivered: false };
      const v = getVulnerabilitiesForQuestion(q.number)[0] || activeVulnerability;
      const evaluation =
        evaluations[q.id] ||
        (draft.isDelivered
          ? evaluateAdversarialResponse(draft.primary, draft.secondary, q, v, langCode)
          : undefined);

      return {
        question: q,
        vulnerability: v,
        candidateResponse: draft.primary,
        secondaryResponse: draft.secondary,
        evaluation,
      };
    });
  }, [questions, responses, evaluations, questionLang, activeVulnerability]);

  if (isSessionFinished) {
    return (
      <DefenseAdversarialSummary
        sessionRecords={sessionRecords}
        onRestartSession={() => {
          setIsSessionFinished(false);
          setCurrentIndex(0);
          setShowSecondaryPressure(false);
          setShowThesisComparison(false);
          onRestartSession();
        }}
        onReturnToStudyMode={onReturnToStudyMode}
        onNavigateToTab={onNavigateToTab}
        lang={questionLang}
      />
    );
  }

  return (
    <div className="space-y-4 font-sans text-[#1A2417]">
      {/* CABEÇALHO DO MODO BANCA ADVERSARIAL */}
      <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9CDAF] pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A3A24] text-[#FCFAF6] mb-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D9CDAF]" />
              <span>{isPt ? 'BANCA ADVERSARIAL' : 'ADVERSARIAL BOARD'}</span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#1A2417]">
              {isPt
                ? 'Ensaio de sustentação perante objecções metodológicas e científicas'
                : 'Oral defense rehearsal confronting methodological and scientific objections'}
            </h2>
            <p className="text-xs text-[#4F5C48] mt-0.5">
              {isPt
                ? 'Simulação pedagógica de uma banca que questiona decisões, evidências, métodos e limites da dissertação.'
                : 'Pedagogical viva simulation challenging decisions, evidence, methods, and limitations.'}
            </p>
          </div>

          {/* Selector de Questões (1 a 5) */}
          <div className="flex items-center gap-1 self-start sm:self-auto">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasDelivered = responses[q.id]?.isDelivered;
              const hasDraft = (responses[q.id]?.primary || '').trim().length > 0;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowSecondaryPressure(false);
                    setShowThesisComparison(false);
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                    isCurrent
                      ? 'bg-[#1A2417] text-[#FCFAF6]'
                      : hasDelivered
                      ? 'bg-[#2A3A24]/15 text-[#2A3A24] border border-[#2A3A24]/40 hover:bg-[#2A3A24]/25'
                      : hasDraft
                      ? 'bg-[#A8531E]/15 text-[#A8531E] border border-[#A8531E]/40 hover:bg-[#A8531E]/25'
                      : 'bg-[#EAE2D2]/60 text-[#4F5C48] hover:bg-[#EAE2D2]'
                  }`}
                  title={`${isPt ? 'Pergunta' : 'Question'} ${idx + 1} (${q.title})`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* NOTA INSTITUCIONAL OBRIGATÓRIA */}
        <div className="mt-2 text-[11px] text-[#4F5C48] flex items-center justify-between flex-wrap gap-2">
          <span>
            <strong>{isPt ? 'Nota:' : 'Note:'}</strong>{' '}
            {isPt
              ? 'Construção pedagógica da plataforma. Não constitui classificação oficial da UEM/ESUDER.'
              : 'Pedagogical platform exercise. Does not constitute an official UEM/ESUDER grade.'}
          </span>
          <span className="text-[11px] text-[#2A3A24] font-medium">
            {isPt ? 'Questão' : 'Question'} {currentIndex + 1} / {questions.length} (ID: {currentQuestion.id})
          </span>
        </div>
      </div>

      {/* DISPOSIÇÃO RESPONSIVA: Smartphone: sequência vertical / Desktop: duas áreas equilibradas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ========================================================
            COLUNA 1 (LG: 5 cols): A BANCA EXAMINADORA (Pergunta & Pressão)
            ======================================================== */}
        <div className="lg:col-span-5 space-y-3">
          {/* ETAPA A: PERGUNTA DA BANCA */}
          <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#D9CDAF]/80 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A3A24] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                {isPt ? 'ETAPA A · PERGUNTA DA BANCA' : 'STAGE A · BOARD INQUIRY'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EAE2D2] text-[#1A2417]">
                #{currentQuestion.number} · {currentQuestion.category}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#4F5C48] mb-1">
                {isPt ? currentQuestion.examinerRole : currentQuestion.examinerRoleEn}
              </div>
              <p className="text-sm font-serif font-medium text-[#1A2417] leading-relaxed">
                "{isPt ? currentQuestion.juryQuestion : currentQuestion.juryQuestionEn}"
              </p>
            </div>

            {/* Tags e Vínculos */}
            <div className="flex flex-wrap gap-1 pt-1">
              {currentQuestion.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-[#EAE2D2]/60 text-[#4F5C48] px-1.5 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* ETAPA B: PRESSÃO DA BANCA (Objecção da Matriz de Vulnerabilidades) */}
          <div className="bg-[#FCFAF6] border-2 border-[#2A3A24] rounded-[4px] p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D9CDAF] pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A2E1E] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#7A2E1E]" />
                {isPt ? 'ETAPA B · PRESSÃO DA BANCA' : 'STAGE B · BOARD PRESSURE'}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#2A3A24] bg-[#2A3A24]/10 px-2 py-0.5 rounded">
                {activeVulnerability.code}: {isPt ? activeVulnerability.title : activeVulnerability.titleEn}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-serif font-bold text-[#1A2417] leading-snug">
                "{isPt ? activeVulnerability.primaryPressure : activeVulnerability.primaryPressureEn}"
              </div>

              <p className="text-[11px] text-[#4F5C48] leading-relaxed">
                <strong>{isPt ? 'Exigência da Banca:' : 'Board Demand:'}</strong>{' '}
                {isPt ? activeVulnerability.epistemicGuardrail : activeVulnerability.epistemicGuardrailEn}
              </p>
            </div>

            {/* Localização da Evidência na Tese */}
            <div className="pt-2 border-t border-[#D9CDAF]/60 text-[11px] text-[#4F5C48] flex items-center justify-between">
              <span className="truncate" title={isPt ? activeVulnerability.internalAppEvidence.locationLabel : activeVulnerability.internalAppEvidence.locationLabelEn}>
                {isPt ? activeVulnerability.internalAppEvidence.locationLabel : activeVulnerability.internalAppEvidence.locationLabelEn}
              </span>
              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() =>
                    onNavigateToTab(
                      activeVulnerability.internalAppEvidence.tab,
                      activeVulnerability.internalAppEvidence.param
                    )
                  }
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2A3A24] hover:underline cursor-pointer shrink-0 ml-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{isPt ? 'Ver' : 'View'}</span>
                </button>
              )}
            </div>
          </div>

          {/* SEGUNDA PRESSÃO (Caso accionada) */}
          {showSecondaryPressure && (
            <div className="bg-[#EAE2D2]/30 border border-[#A8531E] rounded-[4px] p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-[#A8531E] flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                {isPt ? 'SEGUNDA PRESSÃO DA BANCA' : 'BOARD SECONDARY CHALLENGE'}
              </span>
              <p className="text-xs font-serif font-medium text-[#1A2417] leading-relaxed">
                "{isPt ? activeVulnerability.secondaryPressure : activeVulnerability.secondaryPressureEn}"
              </p>
              <p className="text-[11px] text-[#4F5C48]">
                {isPt
                  ? 'A banca testa a compreensão epistemológica profunda da candidata, verificando se ela sabe delimitar o alcance da tese.'
                  : 'The board tests deep epistemic understanding, probing if the candidate knows how to scope thesis claims.'}
              </p>
            </div>
          )}
        </div>

        {/* ========================================================
            COLUNA 2 (LG: 7 cols): SUSTENTAÇÃO ORAL & ESCRITA DA CANDIDATA
            ======================================================== */}
        <div className="lg:col-span-7 space-y-3">
          {/* RESPOSTA DA CANDIDATA */}
          <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9CDAF]/80 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A3A24] flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                {isPt ? 'RESPOSTA DA CANDIDATA (ENG.ª YOLANDA TAMELE)' : 'CANDIDATE ORAL RESPONSE (ENG. YOLANDA TAMELE)'}
              </span>

              <div className="flex items-center gap-2 text-xs text-[#4F5C48]">
                <span className="font-mono">{wordsCount} {isPt ? 'palavras' : 'words'}</span>
                <span>•</span>
                <span className="font-mono">~{estimatedMin} min {isPt ? 'de fala' : 'speech'}</span>
              </div>
            </div>

            {/* ÁREA AMPLA DE TEXTO */}
            <div className="space-y-2">
              <label htmlFor="adversarial-response-input" className="sr-only">
                {isPt ? 'Resposta da candidata à banca' : 'Candidate response to the board'}
              </label>
              <textarea
                id="adversarial-response-input"
                rows={7}
                value={primaryText}
                onChange={(e) => handlePrimaryChange(e.target.value)}
                placeholder={
                  isPt
                    ? 'Estruture aqui a sua sustentação formal perante o examinador. Ancore a resposta nos dados da tese (1994–2024), salvaguarde o estatuto de dados observados (2017–2024) vs modelados e evite asserções de causalidade indevida...'
                    : 'Frame your formal oral defense to the board here. Ground arguments in thesis data (1994–2024), safeguard observed (2017–2024) vs modeled status, and avoid undue causal claims...'
                }
                className="w-full p-3 text-xs sm:text-sm text-[#1A2417] bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] focus:border-[#1A2417] focus:outline-hidden leading-relaxed font-sans resize-y"
              />
            </div>

            {/* SEGUNDA PRESSÃO — CAMPO ADICIONAL */}
            {showSecondaryPressure && (
              <div className="space-y-1.5 pt-2 border-t border-[#D9CDAF]/60">
                <label
                  htmlFor="adversarial-secondary-response"
                  className="text-xs font-semibold text-[#1A2417] flex items-center justify-between"
                >
                  <span>{isPt ? 'Resposta à Segunda Objecção:' : 'Response to Secondary Challenge:'}</span>
                </label>
                <textarea
                  id="adversarial-secondary-response"
                  rows={3}
                  value={secondaryText}
                  onChange={(e) => handleSecondaryChange(e.target.value)}
                  placeholder={
                    isPt
                      ? 'Responda à objecção metodológica aprofundando as salvaguardas epistemológicas...'
                      : 'Reply to the methodological challenge deepening epistemic safeguards...'
                  }
                  className="w-full p-2.5 text-xs text-[#1A2417] bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] focus:border-[#1A2417] focus:outline-hidden leading-relaxed resize-y"
                />
              </div>
            )}

            {/* SCANNER EPISTEMOLÓGICO EM TEMPO REAL (ALERTA DE RISCO) */}
            {liveEpistemicAlerts.length > 0 && (
              <div
                role="alert"
                aria-live="polite"
                className="bg-[#7A2E1E]/10 border-2 border-[#7A2E1E] p-3 rounded-[4px] space-y-2 text-xs"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#7A2E1E]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {isPt ? 'ALERTA EPISTEMOLÓGICO DETECTADO' : 'EPISTEMIC RISK ALERT DETECTED'}
                  </span>
                </div>

                {liveEpistemicAlerts.map((alert) => (
                  <div key={alert.id} className="space-y-1 border-t border-[#7A2E1E]/20 pt-1.5">
                    <p className="text-[#1A2417] font-medium">
                      {isPt ? alert.riskMessagePt : alert.riskMessageEn}
                    </p>
                    <p className="text-[11px] text-[#2A3A24] bg-[#FCFAF6] p-2 rounded border border-[#D9CDAF]">
                      <strong>{isPt ? 'Reformulação Prudente:' : 'Prudent Phrasing:'}</strong>{' '}
                      {isPt ? alert.reformulationPt : alert.reformulationEn}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* BARRA DE CONTROLOS E ACÇÕES */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendToStudio}
                  icon={<Volume2 className="w-3.5 h-3.5" />}
                  title={isPt ? 'Enviar sustentação para ensaio oral no Estúdio de Voz' : 'Send defense to Speech Studio for oral practice'}
                >
                  {isPt ? 'Ensaiar no Estúdio' : 'Practice in Studio'}
                </Button>

                {!showSecondaryPressure && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSecondaryPressure(true)}
                    icon={<AlertCircle className="w-3.5 h-3.5 text-[#A8531E]" />}
                  >
                    {isPt ? 'Responder à Objecção' : 'Face Challenge'}
                  </Button>
                )}
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitResponse}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                {isPt ? 'Submeter à Banca' : 'Submit to Board'}
              </Button>
            </div>
          </div>

          {/* AVALIAÇÃO QUALITATIVA (4 DIMENSÕES) */}
          {activeEval && (
            <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#D9CDAF]/80 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A3A24] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2A3A24]" />
                  {isPt ? 'AVALIAÇÃO DA SUSTENTAÇÃO (4 DIMENSÕES QUALITATIVAS)' : 'DEFENSE EVALUATION (4 QUALITATIVE DIMENSIONS)'}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeEval.overallStatus === 'SUSTENTAÇÃO CONSISTENTE'
                      ? 'bg-[#2A3A24] text-[#FCFAF6]'
                      : activeEval.overallStatus === 'PONTOS VULNERÁVEIS'
                      ? 'bg-[#7A2E1E] text-[#FCFAF6]'
                      : 'bg-[#A8531E] text-[#FCFAF6]'
                  }`}
                >
                  {activeEval.overallStatus}
                </span>
              </div>

              {/* Grelha das 4 Dimensões */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* 1. ADEQUAÇÃO À PERGUNTA */}
                <div className="bg-[#EAE2D2]/20 border border-[#D9CDAF]/70 p-2.5 rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A2417]">
                      {isPt ? '1. ADEQUAÇÃO À PERGUNTA' : '1. INQUIRY ALIGNMENT'}
                    </span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#1A2417] text-[#FCFAF6]">
                      {activeEval.adequacy.grade}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4F5C48]">
                    {isPt ? activeEval.adequacy.justificationPt : activeEval.adequacy.justificationEn}
                  </p>
                </div>

                {/* 2. RIGOR EPISTEMOLÓGICO */}
                <div className="bg-[#EAE2D2]/20 border border-[#D9CDAF]/70 p-2.5 rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A2417]">
                      {isPt ? '2. RIGOR EPISTEMOLÓGICO' : '2. EPISTEMIC RIGOR'}
                    </span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#1A2417] text-[#FCFAF6]">
                      {activeEval.epistemicRigor.grade}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4F5C48]">
                    {isPt ? activeEval.epistemicRigor.justificationPt : activeEval.epistemicRigor.justificationEn}
                  </p>
                </div>

                {/* 3. DOMÍNIO METODOLÓGICO */}
                <div className="bg-[#EAE2D2]/20 border border-[#D9CDAF]/70 p-2.5 rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A2417]">
                      {isPt ? '3. DOMÍNIO METODOLÓGICO' : '3. METHODOLOGICAL MASTERY'}
                    </span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#1A2417] text-[#FCFAF6]">
                      {activeEval.methodologicalMastery.grade}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4F5C48]">
                    {isPt ? activeEval.methodologicalMastery.justificationPt : activeEval.methodologicalMastery.justificationEn}
                  </p>
                </div>

                {/* 4. CLAREZA DA SUSTENTAÇÃO */}
                <div className="bg-[#EAE2D2]/20 border border-[#D9CDAF]/70 p-2.5 rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A2417]">
                      {isPt ? '4. CLAREZA DA SUSTENTAÇÃO' : '4. ORAL CLARITY'}
                    </span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#1A2417] text-[#FCFAF6]">
                      {activeEval.oralClarity.grade}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4F5C48]">
                    {isPt ? activeEval.oralClarity.justificationPt : activeEval.oralClarity.justificationEn}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA E: COMPARAR COM A SUSTENTAÇÃO DA DISSERTAÇÃO */}
          {isDelivered && (
            <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 space-y-3">
              <button
                type="button"
                onClick={() => setShowThesisComparison((prev) => !prev)}
                className="w-full flex items-center justify-between text-xs font-serif font-bold text-[#1A2417] hover:text-[#2A3A24] cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#2A3A24]" />
                  {isPt ? 'Comparar com a Sustentação Oficial da Dissertação' : 'Compare with Official Dissertation Defense'}
                </span>
                {showThesisComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showThesisComparison && activeEval && (
                <div className="space-y-3 pt-3 border-t border-[#D9CDAF]/80 text-xs">
                  {/* Resposta de Referência Canónica */}
                  <div className="bg-[#EAE2D2]/30 p-3 rounded-[4px] border border-[#D9CDAF]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-[#1A2417]">
                        {isPt ? 'Sustentação de Referência (Eng.ª Yolanda Tamele):' : 'Official Defense Statement (Eng. Yolanda Tamele):'}
                      </span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() =>
                          onPlayQuickSpeech(
                            isPt ? currentQuestion.candidateResponse : currentQuestion.candidateResponseEn
                          )
                        }
                        icon={<Volume2 className="w-3.5 h-3.5" />}
                      >
                        {isPt ? 'Ouvir' : 'Listen'}
                      </Button>
                    </div>
                    <p className="text-xs text-[#1A2417] leading-relaxed italic">
                      "{isPt ? currentQuestion.candidateResponse : currentQuestion.candidateResponseEn}"
                    </p>
                  </div>

                  {/* As 5 Dimensões de Confronto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* O QUE FOI BEM RESPONDIDO */}
                    <div className="bg-[#FCFAF6] border border-[#2A3A24]/40 p-2.5 rounded-[2px] space-y-1">
                      <span className="font-bold text-[#2A3A24] text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2A3A24]" />
                        {isPt ? 'O QUE FOI BEM RESPONDIDO' : 'WELL ANSWERED'}
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-[#4F5C48] space-y-0.5">
                        {activeEval.wellAnswered.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* O QUE FICOU INCOMPLETO */}
                    <div className="bg-[#FCFAF6] border border-[#A8531E]/40 p-2.5 rounded-[2px] space-y-1">
                      <span className="font-bold text-[#A8531E] text-[11px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#A8531E]" />
                        {isPt ? 'O QUE FICOU INCOMPLETO' : 'WHAT WAS INCOMPLETE'}
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-[#4F5C48] space-y-0.5">
                        {activeEval.incompletePoints.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* ONDE EXISTE RISCO EPISTEMOLÓGICO */}
                    <div className="bg-[#FCFAF6] border border-[#7A2E1E]/40 p-2.5 rounded-[2px] space-y-1">
                      <span className="font-bold text-[#7A2E1E] text-[11px] flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#7A2E1E]" />
                        {isPt ? 'ONDE EXISTE RISCO EPISTEMOLÓGICO' : 'EPISTEMIC RISK LOCATION'}
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-[#4F5C48] space-y-0.5">
                        {activeEval.epistemicRisksFound.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* QUE EVIDÊNCIA DA DISSERTAÇÃO SUSTENTA A RESPOSTA */}
                    <div className="bg-[#FCFAF6] border border-[#D9CDAF] p-2.5 rounded-[2px] space-y-1">
                      <span className="font-bold text-[#1A2417] text-[11px] flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#1A2417]" />
                        {isPt ? 'EVIDÊNCIA QUE SUSTENTA A RESPOSTA' : 'SUPPORTING THESIS EVIDENCE'}
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-[#4F5C48] space-y-0.5">
                        {activeEval.supportingEvidence.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* QUE LIMITAÇÃO DEVERIA TER SIDO DECLARADA */}
                  <div className="bg-[#EAE2D2]/40 border border-[#D9CDAF] p-2.5 rounded-[2px] space-y-1">
                    <span className="font-bold text-[#1A2417] text-[11px]">
                      {isPt ? 'QUE LIMITAÇÃO DEVERIA TER SIDO DECLARADA:' : 'LIMITATION THAT SHOULD HAVE BEEN STATED:'}
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-[#4F5C48] space-y-0.5">
                      {activeEval.declaredLimitations.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NAVEGAÇÃO ENTRE AS 5 PERGUNTAS */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((prev) => prev - 1);
                  setShowSecondaryPressure(false);
                  setShowThesisComparison(false);
                }
              }}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              {isPt ? 'Pergunta Anterior' : 'Previous Question'}
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setCurrentIndex((prev) => prev + 1);
                  setShowSecondaryPressure(false);
                  setShowThesisComparison(false);
                }}
              >
                <span>{isPt ? 'Próxima Pergunta' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsSessionFinished(true)}
                icon={<ShieldAlert className="w-3.5 h-3.5" />}
              >
                {isPt ? 'Concluir Ensaio e Ver Mapa' : 'Finish Trial & View Blueprint'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
