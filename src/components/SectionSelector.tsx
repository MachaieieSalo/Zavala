import React, { useState, useMemo, useEffect } from 'react';
import {
  DissertationQuestion,
  DISSERTATION_FULL_QUESTIONS,
  getAllDissertationText,
} from '../data/dissertationText';
import {
  Languages,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  ListFilter,
  BookOpen,
} from 'lucide-react';
import { SupportedLang } from '../data/translations';
import { Button } from './common/Button';
import { DefenseQuestionList } from './defense/DefenseQuestionList';
import { DefenseQuestionViewer } from './defense/DefenseQuestionViewer';
import { DefenseResponseArea } from './defense/DefenseResponseArea';
import { DefenseFeedbackView } from './defense/DefenseFeedbackView';
import { DefenseSimulationSummary } from './defense/DefenseSimulationSummary';
import {
  generateAcademicEvaluation,
  EvaluationFeedback,
} from './defense/defenseKnowledge';

interface SectionSelectorProps {
  onSelectQuestionText: (text: string, title: string) => void;
  onPlayQuickSpeech: (text: string) => void;
  selectedQuestionId: string | null;
  currentLoadedTitle: string;
  currentLang?: SupportedLang;
}

export const SectionSelector: React.FC<SectionSelectorProps> = ({
  onSelectQuestionText,
  onPlayQuickSpeech,
  selectedQuestionId,
  currentLoadedTitle,
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';

  // Mode: 'estudo' (exploração de 60 perguntas) vs 'simulador' (banca de foco com 5 perguntas)
  const [activeMode, setActiveMode] = useState<'estudo' | 'simulador'>('estudo');

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
  const [activeQuestionId, setActiveQuestionId] = useState<string>(
    selectedQuestionId || 'q_1'
  );

  // Sync if external selectedQuestionId changes
  useEffect(() => {
    if (selectedQuestionId) {
      setActiveQuestionId(selectedQuestionId);
    }
  }, [selectedQuestionId]);

  // Candidate drafted responses cache (stored per question ID)
  const [draftedResponses, setDraftedResponses] = useState<Record<string, string>>({});

  // Active evaluation feedback per question
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationFeedback>>({});
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

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

  const handleLoadFullDissertation = () => {
    const fullText = getAllDissertationText();
    onSelectQuestionText(
      fullText,
      isPt
        ? 'Dissertação Completa de Zavala (Todas as 60 Perguntas)'
        : 'Complete Zavala Dissertation (All 60 Questions)'
    );
  };

  const activeResponseText = draftedResponses[currentQuestion.id] ?? '';
  const activeFeedback = evaluations[currentQuestion.id];

  return (
    <div className="space-y-4 font-sans text-[#1A2417]">
      {/* NÍVEL 1: BARRA DE FERRAMENTAS DA SALA DE ARGUIÇÃO */}
      <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-[4px] border border-[#D9CDAF] bg-[#EAE2D2]/40 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setActiveMode('estudo');
                setIsMockFinished(false);
              }}
              aria-pressed={activeMode === 'estudo'}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                activeMode === 'estudo'
                  ? 'bg-[#1A2417] text-[#FCFAF6] font-semibold'
                  : 'text-[#4F5C48] hover:text-[#1A2417]'
              }`}
            >
              {isPt ? 'Modo Estudo (60 Perguntas)' : 'Study Mode (60 Questions)'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (mockQuestions.length === 0) startMockDefense(5);
                else {
                  setActiveMode('simulador');
                  setIsMockFinished(false);
                }
              }}
              aria-pressed={activeMode === 'simulador'}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                activeMode === 'simulador'
                  ? 'bg-[#1A2417] text-[#FCFAF6] font-semibold'
                  : 'text-[#4F5C48] hover:text-[#1A2417]'
              }`}
            >
              {isPt ? 'Simulador de Banca (5 Perguntas)' : 'Mock Panel (5 Questions)'}
            </button>
          </div>

          {activeMode === 'simulador' && !isMockFinished && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startMockDefense(5)}
              icon={<Shuffle className="w-3.5 h-3.5" />}
            >
              {isPt ? 'Sortear Nova' : 'Redraw'}
            </Button>
          )}
        </div>

        {/* Global actions: Language & Full Text */}
        <div className="flex items-center gap-2">
          {/* Question Text Lang Toggle (PT / EN) */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setQuestionLang((prev) => (prev === 'pt' ? 'en' : 'pt'))}
            title={isPt ? 'Alternar idioma das perguntas e respostas' : 'Toggle language of questions and answers'}
            icon={<Languages className="w-3.5 h-3.5" />}
          >
            {questionLang.toUpperCase()}
          </Button>

          {activeMode === 'estudo' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLoadFullDissertation}
              title={isPt ? 'Carregar todas as 60 perguntas no estúdio' : 'Load all 60 questions into studio'}
              icon={<BookOpen className="w-3.5 h-3.5" />}
            >
              {isPt ? 'Carregar Todas no Estúdio' : 'Load All into Studio'}
            </Button>
          )}
        </div>
      </div>

      {/* SIMULATOR COMPLETED SUMMARY VIEW */}
      {activeMode === 'simulador' && isMockFinished ? (
        <DefenseSimulationSummary
          questions={mockQuestions}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
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
                        ? `Pergunta Atual: #${currentQuestion.number < 10 ? `0${currentQuestion.number}` : currentQuestion.number} (Ver Índice de 60)`
                        : `Current Question: #${currentQuestion.number} (View 60 Index)`}
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
            {/* NÍVEL 3: PERGUNTA DA BANCA (Elemento Dominante) */}
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
            />

            {/* NÍVEL 4 & 5: FOLHA DE RESPOSTA DO CANDIDATO E CRONÓMETRO */}
            <DefenseResponseArea
              question={currentQuestion}
              responseText={activeResponseText}
              onChangeResponse={handleResponseChange}
              onEvaluate={handleEvaluate}
              isEvaluating={isEvaluating}
              onPlaySpeech={onPlayQuickSpeech}
              onSendToStudio={onSelectQuestionText}
              questionLang={questionLang}
              currentLang={currentLang}
            />

            {/* NÍVEL 6: AVALIAÇÃO, PARECER E RÉPLICA DA BANCA */}
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

            {/* NÍVEL 7: NAVEGAÇÃO ENTRE PERGUNTAS (Discreta, Funcional) */}
            <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-3.5 flex items-center justify-between gap-3 text-xs">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePreviousQuestion}
                disabled={
                  activeMode === 'simulador'
                    ? mockIndex === 0
                    : currentQuestionIndex === 0
                }
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
