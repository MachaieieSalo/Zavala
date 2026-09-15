import React, { useState, useMemo, useEffect } from 'react';
import {
  DissertationQuestion,
  DISSERTATION_FULL_QUESTIONS,
} from '../data/dissertationText';
import {
  Languages,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  ListFilter,
} from 'lucide-react';
import { SupportedLang } from '../data/translations';
import { Button } from './common/Button';
import { DefenseQuestionList } from './defense/DefenseQuestionList';
import { DefenseQuestionViewer } from './defense/DefenseQuestionViewer';
import { DefenseResponseArea } from './defense/DefenseResponseArea';
import { DefenseFeedbackView } from './defense/DefenseFeedbackView';
import {
  DefenseSimulationSummary,
  QuestionSimulationRecord,
} from './defense/DefenseSimulationSummary';
import { DefenseAdversarialView } from './defense/DefenseAdversarialView';
import {
  selectAdversarialSessionQuestions,
} from '../data/adversarialVulnerabilities';
import {
  generateAcademicEvaluation,
  EvaluationFeedback,
} from './defense/defenseKnowledge';
import { ShieldAlert } from 'lucide-react';

interface SectionSelectorProps {
  onSelectQuestionText: (text: string, title: string, questionId?: string) => void;
  onPlayQuickSpeech: (text: string) => void;
  selectedQuestionId: string | null;
  currentLoadedTitle: string;
  currentLang?: SupportedLang;
  initialAdversarialCode?: string;
  onNavigateToTab?: (tab: 'dados' | 'campo' | 'estudio' | 'defesa', param?: string) => void;
}

const DEFENSE_DRAFTS_KEY = 'zavalavoz_defense_drafts_v2';
const DEFENSE_DELIVERED_KEY = 'zavalavoz_defense_delivered_v2';
const DEFENSE_EVALUATIONS_KEY = 'zavalavoz_defense_evaluations_v2';
const DEFENSE_ACTIVE_QID_KEY = 'zavalavoz_defense_active_qid_v2';
const ADVERSARIAL_SESSION_KEY = 'zavalavoz_adversarial_sessions_v1';

export const SectionSelector: React.FC<SectionSelectorProps> = ({
  onSelectQuestionText,
  onPlayQuickSpeech,
  selectedQuestionId,
  currentLoadedTitle,
  currentLang = 'pt',
  initialAdversarialCode,
  onNavigateToTab,
}) => {
  const isPt = currentLang === 'pt';

  // Mode: 'estudo' (exploração de perguntas) vs 'simulador' (banca aleatória) vs 'adversarial' (banca com objecções reais)
  const [activeMode, setActiveMode] = useState<'estudo' | 'simulador' | 'adversarial'>('estudo');

  useEffect(() => {
    if (initialAdversarialCode) {
      setActiveMode('adversarial');
    }
  }, [initialAdversarialCode]);

  // Question language (independent toggle for reading in PT or EN)
  const [questionLang, setQuestionLang] = useState<SupportedLang>(currentLang);

  useEffect(() => {
    setQuestionLang(currentLang);
  }, [currentLang]);

  // Filters for question bank
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todas');

  // Active question in study mode
  const [activeQuestionId, setActiveQuestionId] = useState<string>(() => {
    if (selectedQuestionId) return selectedQuestionId;
    try {
      const saved = localStorage.getItem(DEFENSE_ACTIVE_QID_KEY);
      if (saved && DISSERTATION_FULL_QUESTIONS.some((q) => q.id === saved)) {
        return saved;
      }
    } catch {}
    return 'q_1';
  });

  // Sync if external selectedQuestionId changes
  useEffect(() => {
    if (selectedQuestionId) {
      setActiveQuestionId(selectedQuestionId);
    }
  }, [selectedQuestionId]);

  // Candidate drafted responses cache (stored per question ID with safe persistence)
  const [draftedResponses, setDraftedResponses] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(DEFENSE_DRAFTS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Delivered set to track submissions
  const [deliveredQuestions, setDeliveredQuestions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(DEFENSE_DELIVERED_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active evaluation feedback per question
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationFeedback>>(() => {
    try {
      const saved = localStorage.getItem(DEFENSE_EVALUATIONS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Persist defense states safely
  useEffect(() => {
    try {
      localStorage.setItem(DEFENSE_DRAFTS_KEY, JSON.stringify(draftedResponses));
    } catch (e) {
      console.warn('Could not persist defense drafts to localStorage:', e);
    }
  }, [draftedResponses]);

  useEffect(() => {
    try {
      localStorage.setItem(DEFENSE_DELIVERED_KEY, JSON.stringify(deliveredQuestions));
    } catch (e) {
      console.warn('Could not persist delivered questions to localStorage:', e);
    }
  }, [deliveredQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem(DEFENSE_EVALUATIONS_KEY, JSON.stringify(evaluations));
    } catch (e) {
      console.warn('Could not persist evaluations to localStorage:', e);
    }
  }, [evaluations]);

  useEffect(() => {
    try {
      localStorage.setItem(DEFENSE_ACTIVE_QID_KEY, activeQuestionId);
    } catch (e) {
      console.warn('Could not persist active question ID to localStorage:', e);
    }
  }, [activeQuestionId]);

  // Mobile list sheet toggle
  const [isMobileListOpen, setIsMobileListOpen] = useState<boolean>(false);

  // Simulator State (5 randomized questions)
  const [mockQuestions, setMockQuestions] = useState<DissertationQuestion[]>([]);
  const [mockIndex, setMockIndex] = useState<number>(0);
  const [isMockFinished, setIsMockFinished] = useState<boolean>(false);

  // Start / Draw new mock panel
  const startMockDefense = (count = 5) => {
    const shuffled = [...DISSERTATION_FULL_QUESTIONS].sort(() => 0.5 - Math.random());
    setMockQuestions(shuffled.slice(0, count));
    setMockIndex(0);
    setIsMockFinished(false);
    setActiveMode('simulador');
  };

  // Adversarial State (5 vulnerability-confronting questions)
  const [adversarialQuestions, setAdversarialQuestions] = useState<DissertationQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(ADVERSARIAL_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const mapped = parsed
            .map((id) => DISSERTATION_FULL_QUESTIONS.find((q) => q.id === id))
            .filter(Boolean) as DissertationQuestion[];
          if (mapped.length === 5) return mapped;
        }
      }
    } catch {}
    // Conjunto canónico de referência para validação da arguição metodológica: q_2, q_9, q_10, q_13, q_40
    const benchmarkQuestions = ['q_2', 'q_9', 'q_10', 'q_13', 'q_40']
      .map((id) => DISSERTATION_FULL_QUESTIONS.find((q) => q.id === id))
      .filter(Boolean) as DissertationQuestion[];
    if (benchmarkQuestions.length === 5) return benchmarkQuestions;
    return selectAdversarialSessionQuestions(5);
  });

  const startAdversarialSession = () => {
    const selected = selectAdversarialSessionQuestions(5);
    setAdversarialQuestions(selected);
    try {
      localStorage.setItem(ADVERSARIAL_SESSION_KEY, JSON.stringify(selected.map((q) => q.id)));
    } catch (e) {
      console.warn('Could not persist adversarial session:', e);
    }
  };

  // Filtered questions list
  const filteredQuestions = useMemo(() => {
    return DISSERTATION_FULL_QUESTIONS.filter((q) => {
      const matchScenario =
        selectedScenarioId === 'todos' || q.scenarioId === selectedScenarioId;
      const matchDifficulty =
        selectedDifficulty === 'todas' || q.difficulty === selectedDifficulty;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        q.title.toLowerCase().includes(query) ||
        q.titleEn.toLowerCase().includes(query) ||
        q.juryQuestion.toLowerCase().includes(query) ||
        q.candidateResponse.toLowerCase().includes(query) ||
        q.tags.some((t) => t.toLowerCase().includes(query));
      return matchScenario && matchDifficulty && matchQuery;
    });
  }, [selectedScenarioId, selectedDifficulty, searchQuery]);

  // Current active question object
  const currentQuestion = useMemo(() => {
    if (activeMode === 'simulador' && mockQuestions.length > 0) {
      return mockQuestions[mockIndex] || mockQuestions[0];
    }
    const found = DISSERTATION_FULL_QUESTIONS.find((q) => q.id === activeQuestionId);
    return found || DISSERTATION_FULL_QUESTIONS[0];
  }, [activeMode, mockQuestions, mockIndex, activeQuestionId]);

  // Index of current question in full array for linear navigation
  const currentQuestionIndex = useMemo(() => {
    return DISSERTATION_FULL_QUESTIONS.findIndex((q) => q.id === currentQuestion.id);
  }, [currentQuestion.id]);

  const hasPrevious =
    activeMode === 'simulador' ? mockIndex > 0 : currentQuestionIndex > 0;
  const hasNext =
    activeMode === 'simulador'
      ? mockIndex < mockQuestions.length - 1
      : currentQuestionIndex < DISSERTATION_FULL_QUESTIONS.length - 1;

  const handlePreviousQuestion = () => {
    if (activeMode === 'simulador') {
      setMockIndex((prev) => Math.max(0, prev - 1));
    } else {
      if (currentQuestionIndex > 0) {
        setActiveQuestionId(DISSERTATION_FULL_QUESTIONS[currentQuestionIndex - 1].id);
      }
    }
  };

  const handleNextQuestion = () => {
    if (activeMode === 'simulador') {
      if (mockIndex < mockQuestions.length - 1) {
        setMockIndex((prev) => prev + 1);
      } else {
        setIsMockFinished(true);
      }
    } else {
      if (currentQuestionIndex < DISSERTATION_FULL_QUESTIONS.length - 1) {
        setActiveQuestionId(DISSERTATION_FULL_QUESTIONS[currentQuestionIndex + 1].id);
      }
    }
  };

  const handleResponseChange = (newText: string) => {
    setDraftedResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: newText,
    }));
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    // Mark as delivered
    setDeliveredQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));

    const candidateText =
      draftedResponses[currentQuestion.id] ||
      (questionLang === 'pt' ? currentQuestion.candidateResponse : currentQuestion.candidateResponseEn);

    setTimeout(() => {
      const evalLang = currentLang === 'en' ? 'en' : 'pt';
      const result = generateAcademicEvaluation(candidateText, currentQuestion, evalLang);
      setEvaluations((prev) => ({
        ...prev,
        [currentQuestion.id]: result,
      }));
      setIsEvaluating(false);
    }, 250);
  };

  const activeResponseText = draftedResponses[currentQuestion.id] ?? '';
  const activeFeedback = evaluations[currentQuestion.id];

  // Build factual simulation session records for summary
  const simulationRecords: Record<string, QuestionSimulationRecord> = useMemo(() => {
    const records: Record<string, QuestionSimulationRecord> = {};
    for (const q of mockQuestions) {
      const text = (draftedResponses[q.id] || '').trim();
      const wordCount = text ? text.split(/\s+/).length : 0;
      const isVerified = !!evaluations[q.id];
      const isDelivered = !!deliveredQuestions[q.id] || isVerified;

      let status: QuestionSimulationRecord['status'] = 'NÃO RESPONDIDA';
      if (isVerified) {
        status = 'VERIFICADA';
      } else if (isDelivered) {
        status = 'ENTREGUE';
      } else if (wordCount > 0) {
        status = 'RASCUNHO';
      }

      records[q.id] = {
        question: q,
        status,
        wordCount,
        isDelivered,
        isVerified,
      };
    }
    return records;
  }, [mockQuestions, draftedResponses, evaluations, deliveredQuestions]);

  return (
    <div className="space-y-4 font-sans text-[#1A2417]">
      {/* NÍVEL 1: BARRA DE NAVEGAÇÃO DA SALA DE ARGUIÇÃO */}
      <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Accessible Mode Switcher (role="tablist") */}
        <div className="flex items-center gap-2">
          <div
            role="tablist"
            aria-label={isPt ? 'Modo de Arguição' : 'Examination Mode'}
            className="flex items-center p-0.5 rounded-[4px] border border-[#D9CDAF] bg-[#EAE2D2]/40 text-xs font-medium"
          >
            <button
              id="tab-estudo"
              role="tab"
              aria-selected={activeMode === 'estudo'}
              aria-controls="panel-defesa"
              type="button"
              onClick={() => {
                setActiveMode('estudo');
                setIsMockFinished(false);
              }}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                activeMode === 'estudo'
                  ? 'bg-[#1A2417] text-[#FCFAF6] font-semibold'
                  : 'text-[#4F5C48] hover:text-[#1A2417]'
              }`}
            >
              {isPt ? `Modo Estudo (${DISSERTATION_FULL_QUESTIONS.length} Perguntas)` : `Study Mode (${DISSERTATION_FULL_QUESTIONS.length} Questions)`}
            </button>
            <button
              id="tab-simulador"
              role="tab"
              aria-selected={activeMode === 'simulador'}
              aria-controls="panel-defesa"
              type="button"
              onClick={() => {
                if (mockQuestions.length === 0) startMockDefense(5);
                else {
                  setActiveMode('simulador');
                  setIsMockFinished(false);
                }
              }}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                activeMode === 'simulador'
                  ? 'bg-[#1A2417] text-[#FCFAF6] font-semibold'
                  : 'text-[#4F5C48] hover:text-[#1A2417]'
              }`}
            >
              {isPt ? 'Simulador de Banca (5 Perguntas)' : 'Mock Panel (5 Questions)'}
            </button>
            <button
              id="tab-adversarial"
              role="tab"
              aria-selected={activeMode === 'adversarial'}
              aria-controls="panel-defesa"
              type="button"
              onClick={() => {
                setActiveMode('adversarial');
                setIsMockFinished(false);
              }}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                activeMode === 'adversarial'
                  ? 'bg-[#2A3A24] text-[#FCFAF6] font-semibold'
                  : 'text-[#4F5C48] hover:text-[#1A2417]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#D9CDAF]" />
              <span>{isPt ? 'Banca Adversarial' : 'Adversarial Board'}</span>
            </button>
          </div>

          {activeMode === 'simulador' && !isMockFinished && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startMockDefense(5)}
              icon={<Shuffle className="w-3.5 h-3.5" />}
              title={isPt ? 'Sortear novo grupo de 5 perguntas' : 'Draw new 5-question panel'}
            >
              {isPt ? 'Sortear Nova' : 'Redraw'}
            </Button>
          )}

          {activeMode === 'adversarial' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={startAdversarialSession}
              icon={<Shuffle className="w-3.5 h-3.5" />}
              title={isPt ? 'Sortear novo grupo de 5 perguntas adversariais' : 'Draw new 5 adversarial questions'}
            >
              {isPt ? 'Novo Sorteio' : 'New Draw'}
            </Button>
          )}
        </div>

        {/* Question Text Lang Toggle (PT / EN) - Discrete, Contextual */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setQuestionLang((prev) => (prev === 'pt' ? 'en' : 'pt'))}
            title={isPt ? 'Alternar idioma das perguntas e respostas' : 'Toggle language of questions and answers'}
            icon={<Languages className="w-3.5 h-3.5" />}
          >
            {questionLang.toUpperCase()}
          </Button>
        </div>
      </div>

      {/* ADVERSARIAL BOARD WORKSTATION */}
      {activeMode === 'adversarial' ? (
        <DefenseAdversarialView
          questions={adversarialQuestions}
          selectedQuestionId={selectedQuestionId}
          onSendToStudio={(textToLoad, title, qId) => {
            onSelectQuestionText(textToLoad, title, qId);
          }}
          onPlayQuickSpeech={onPlayQuickSpeech}
          onRestartSession={startAdversarialSession}
          onReturnToStudyMode={() => setActiveMode('estudo')}
          onNavigateToTab={onNavigateToTab}
          questionLang={questionLang}
        />
      ) : activeMode === 'simulador' && isMockFinished ? (
        /* SIMULATOR COMPLETED SUMMARY VIEW (Factual Session Record) */
        <DefenseSimulationSummary
          questions={mockQuestions}
          records={simulationRecords}
          onRestartSimulation={() => startMockDefense(5)}
          onReturnToQuestionBank={() => {
            setActiveMode('estudo');
            setIsMockFinished(false);
          }}
          questionLang={questionLang}
          currentLang={currentLang}
        />
      ) : (
        /* MAIN WORKSTATION LAYOUT */
        <div
          id="panel-defesa"
          role="tabpanel"
          aria-labelledby={activeMode === 'estudo' ? 'tab-estudo' : 'tab-simulador'}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
        >
          {/* LEFT COLUMN: QUESTION BANK INDEX (Progressive Disclosure, Study Mode only) */}
          {activeMode === 'estudo' && (
            <>
              {/* Mobile Drawer/Toggle Button */}
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileListOpen(!isMobileListOpen)}
                  className="w-full p-3 rounded-[4px] bg-[#FCFAF6] border border-[#D9CDAF] flex items-center justify-between text-xs font-semibold text-[#1A2417] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-[#354D2C]" />
                    <span>
                      {isPt
                        ? `Pergunta Atual: #${currentQuestion.number < 10 ? `0${currentQuestion.number}` : currentQuestion.number} (Ver Índice de ${DISSERTATION_FULL_QUESTIONS.length})`
                        : `Current Question: #${currentQuestion.number} (View ${DISSERTATION_FULL_QUESTIONS.length} Index)`}
                    </span>
                  </div>
                  <span className="text-[#354D2C]">
                    {isMobileListOpen ? (isPt ? 'Ocultar' : 'Hide') : (isPt ? 'Abrir' : 'Open')}
                  </span>
                </button>
              </div>

              {/* Sidebar Question List (Desktop or Mobile Expanded) */}
              <div
                className={`lg:col-span-4 ${
                  isMobileListOpen ? 'block' : 'hidden lg:block'
                } sticky top-20`}
              >
                <DefenseQuestionList
                  questions={filteredQuestions}
                  selectedQuestionId={currentQuestion.id}
                  onSelectQuestion={(q) => {
                    setActiveQuestionId(q.id);
                    setIsMobileListOpen(false);
                  }}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedScenarioId={selectedScenarioId}
                  onScenarioChange={setSelectedScenarioId}
                  selectedDifficulty={selectedDifficulty}
                  onDifficultyChange={setSelectedDifficulty}
                  draftedResponses={draftedResponses}
                  deliveredQuestions={deliveredQuestions}
                  evaluations={evaluations}
                  questionLang={questionLang}
                  currentLang={currentLang}
                />
              </div>
            </>
          )}

          {/* RIGHT COLUMN: DOMINANT DIGITAL EXAMINATION ROOM */}
          <div
            className={`${
              activeMode === 'estudo' ? 'lg:col-span-8' : 'max-w-3xl mx-auto w-full'
            } space-y-4`}
          >
            {/* NÍVEL 3: PERGUNTA DA BANCA (Elemento Dominante com Navegação Superior) */}
            <DefenseQuestionViewer
              question={currentQuestion}
              totalQuestions={
                activeMode === 'simulador'
                  ? mockQuestions.length
                  : DISSERTATION_FULL_QUESTIONS.length
              }
              onPlaySpeech={onPlayQuickSpeech}
              questionLang={questionLang}
              currentLang={currentLang}
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
            />

            {/* NÍVEL 4 & 5: FOLHA DE RESPOSTA DO CANDIDATO E CRONÓMETRO */}
            <DefenseResponseArea
              question={currentQuestion}
              responseText={activeResponseText}
              onChangeResponse={handleResponseChange}
              onEvaluate={handleEvaluate}
              isEvaluating={isEvaluating}
              onPlaySpeech={onPlayQuickSpeech}
              onSendToStudio={(textToLoad, title, qId) => {
                onSelectQuestionText(textToLoad, title, qId || currentQuestion.id);
              }}
              questionLang={questionLang}
              currentLang={currentLang}
            />

            {/* NÍVEL 6: GRELHA DE AUTO-VERIFICAÇÃO E RÉPLICA DA BANCA */}
            {activeFeedback && (
              <DefenseFeedbackView
                question={currentQuestion}
                feedback={activeFeedback}
                candidateResponse={activeResponseText}
                onPlaySpeech={onPlayQuickSpeech}
                questionLang={questionLang}
                currentLang={currentLang}
              />
            )}

            {/* NÍVEL 7: NAVEGAÇÃO COMPLEMENTAR INFERIOR ENTRE PERGUNTAS */}
            <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-3.5 flex items-center justify-between gap-3 text-xs">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePreviousQuestion}
                disabled={!hasPrevious}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                {isPt ? 'Pergunta Anterior' : 'Previous Question'}
              </Button>

              <div className="text-center font-mono font-medium text-[#4F5C48]">
                {activeMode === 'simulador' ? (
                  <span>
                    {isPt ? 'Pergunta' : 'Question'} {mockIndex + 1} de {mockQuestions.length}
                  </span>
                ) : (
                  <span>
                    {currentQuestionIndex + 1} / {DISSERTATION_FULL_QUESTIONS.length}{' '}
                    {isPt ? 'perguntas' : 'questions'}
                  </span>
                )}
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleNextQuestion}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                {activeMode === 'simulador' && mockIndex === mockQuestions.length - 1
                  ? isPt ? 'Concluir Arguição' : 'Finish Examination'
                  : isPt ? 'Próxima Pergunta' : 'Next Question'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
