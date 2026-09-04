import React, { useState, useMemo, useEffect } from 'react';
import {
  DissertationQuestion,
  DISSERTATION_FULL_QUESTIONS,
  DEFENSE_SCENARIOS,
  getAllDissertationText,
} from '../data/dissertationText';
import {
  BookOpen,
  Search,
  Volume2,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Shuffle,
  Eye,
  EyeOff,
  Flame,
  Languages,
} from 'lucide-react';
import { TRANSLATIONS, SupportedLang } from '../data/translations';

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
  const t = TRANSLATIONS[currentLang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todas');
  const [expandedId, setExpandedId] = useState<string | null>(selectedQuestionId || 'q_1');
  const [questionLang, setQuestionLang] = useState<SupportedLang>(currentLang);

  // Synchronize when currentLang changes from header
  useEffect(() => {
    setQuestionLang(currentLang);
  }, [currentLang]);

  // Defense Modes: 'estudo' vs 'simulador'
  const [activeMode, setActiveMode] = useState<'estudo' | 'simulador'>('estudo');

  // Simulator State (Mock Defense)
  const [mockQuestions, setMockQuestions] = useState<DissertationQuestion[]>([]);
  const [mockIndex, setMockIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(180); // 3 minutes standard
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [revealMockAnswer, setRevealMockAnswer] = useState<boolean>(false);

  // Initialize or redraw mock examination panel
  const startMockDefense = (count = 5) => {
    const shuffled = [...DISSERTATION_FULL_QUESTIONS].sort(() => 0.5 - Math.random());
    setMockQuestions(shuffled.slice(0, count));
    setMockIndex(0);
    setTimerSeconds(180);
    setIsTimerRunning(true);
    setRevealMockAnswer(false);
    setActiveMode('simulador');
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Filter questions for study mode
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

  const handleSelectAll = () => {
    const fullText = getAllDissertationText();
    onSelectQuestionText(
      fullText,
      currentLang === 'pt'
        ? 'Dissertação Completa de Zavala (Todas as 60 Perguntas da Defesa)'
        : 'Complete Zavala Dissertation (All 60 Defense Questions)'
    );
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentMock = mockQuestions[mockIndex];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Top Header & Mode Switcher */}
      <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/50 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                {t.defense.title}
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                {DISSERTATION_FULL_QUESTIONS.length} {t.defense.totalQuestions}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {t.defense.subtitle}
            </p>
          </div>

          {/* Quick Actions & Language Toggle */}
          <div className="flex items-center gap-2">
            {/* Question Text Lang Toggle (PT / EN) */}
            <button
              type="button"
              onClick={() => setQuestionLang((prev) => (prev === 'pt' ? 'en' : 'pt'))}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors cursor-pointer border border-zinc-200"
              title="Alternar idioma dos textos de perguntas e respostas"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>{questionLang.toUpperCase()}</span>
            </button>

            <button
              type="button"
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-colors cursor-pointer shadow-xs shrink-0"
              title="Carregar todas as perguntas no estúdio"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.defense.btnFullText}</span>
            </button>
          </div>
        </div>

        {/* Tab Mode Pills: Estudo vs Simulador */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-200/60">
          <div className="flex items-center bg-zinc-200/70 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMode('estudo')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMode === 'estudo'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {t.defense.studyMode}
            </button>
            <button
              type="button"
              onClick={() => {
                if (mockQuestions.length === 0) startMockDefense(5);
                else setActiveMode('simulador');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMode === 'simulador'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{t.defense.mockDefenseMode}</span>
            </button>
          </div>

          {activeMode === 'simulador' && (
            <button
              type="button"
              onClick={() => startMockDefense(5)}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{currentLang === 'pt' ? 'Sortear Nova Banca' : 'Draw New Panel'}</span>
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: LIVE MOCK DEFENSE SIMULATOR */}
      {activeMode === 'simulador' && currentMock && (
        <div className="p-5 sm:p-6 bg-indigo-50/30 flex-1 flex flex-col justify-between space-y-5 overflow-y-auto">
          {/* Top Bar: Progress & Official Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-indigo-100 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                {t.defense.mockTitle}
              </span>
              <span className="text-zinc-300">|</span>
              <span className="text-xs font-mono font-bold text-zinc-600">
                {currentLang === 'pt' ? 'Pergunta' : 'Question'} {mockIndex + 1} / {mockQuestions.length}
              </span>
            </div>

            {/* Official Countdown Timer */}
            <div className="flex items-center gap-2.5">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm border shadow-xs ${
                  timerSeconds < 30
                    ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                    : 'bg-zinc-900 text-white border-zinc-800'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                title={isTimerRunning ? 'Pausar Cronómetro' : 'Iniciar Cronómetro'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTimerSeconds(180);
                  setIsTimerRunning(false);
                }}
                className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                title="Reiniciar tempo (3 min)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Examiner's Question Box */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-indigo-200/70 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-900 text-xs font-bold">
                  {questionLang === 'pt' ? currentMock.examinerRole : currentMock.examinerRoleEn}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 text-zinc-700">
                  {currentMock.difficulty}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  onPlayQuickSpeech(
                    questionLang === 'pt' ? currentMock.juryQuestion : currentMock.juryQuestionEn
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 transition-colors cursor-pointer border border-indigo-200"
              >
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span>{t.defense.btnListenQuestion}</span>
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                {t.defense.juryQuestion}
              </p>
              <h4 className="text-base sm:text-lg font-bold text-zinc-900 leading-relaxed">
                "{questionLang === 'pt' ? currentMock.juryQuestion : currentMock.juryQuestionEn}"
              </h4>
            </div>

            {/* Candidate Response Section */}
            <div className="pt-4 border-t border-zinc-100">
              {revealMockAnswer ? (
                <div className="space-y-3 bg-emerald-50/50 p-4 sm:p-5 rounded-xl border border-emerald-200/80 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t.defense.candidateResponse}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRevealMockAnswer(false)}
                      className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{currentLang === 'pt' ? 'Ocultar' : 'Hide'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                    {questionLang === 'pt' ? currentMock.candidateResponse : currentMock.candidateResponseEn}
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onPlayQuickSpeech(
                          questionLang === 'pt' ? currentMock.candidateResponse : currentMock.candidateResponseEn
                        )
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors cursor-pointer"
                    >
                      {t.defense.btnListenResponse}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textToLoad = questionLang === 'en'
                          ? `Question ${currentMock.number} • ${currentMock.examinerRoleEn}\n\nJury Question:\n${currentMock.juryQuestionEn}\n\nCandidate Response (Yolanda Tamele):\n${currentMock.candidateResponseEn}`
                          : currentMock.text;
                        const titleToLoad = questionLang === 'en'
                          ? `Question ${currentMock.number}: ${currentMock.titleEn}`
                          : `Pergunta ${currentMock.number}: ${currentMock.title}`;
                        onSelectQuestionText(textToLoad, titleToLoad);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white transition-colors cursor-pointer"
                    >
                      {t.defense.btnLoadToStudio}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setRevealMockAnswer(true)}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>{currentLang === 'pt' ? 'Revelar Resposta Científica de Yolanda Tamele' : 'Reveal Yolanda Tamele\'s Scientific Answer'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Panel Navigation */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={mockIndex === 0}
              onClick={() => {
                setMockIndex((prev) => Math.max(0, prev - 1));
                setTimerSeconds(180);
                setIsTimerRunning(true);
                setRevealMockAnswer(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-xs"
            >
              {t.defense.prevQuestion}
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('estudo')}
              className="text-xs text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
            >
              {t.defense.finishMock}
            </button>

            <button
              type="button"
              disabled={mockIndex === mockQuestions.length - 1}
              onClick={() => {
                setMockIndex((prev) => Math.min(mockQuestions.length - 1, prev + 1));
                setTimerSeconds(180);
                setIsTimerRunning(true);
                setRevealMockAnswer(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-xs"
            >
              {t.defense.nextQuestion}
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: STUDY / READING MODE (7 SCENARIOS) */}
      {activeMode === 'estudo' && (
        <>
          {/* Scenario Filter Pills */}
          <div className="p-3 bg-zinc-50 border-b border-zinc-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                {currentLang === 'pt' ? '7 Cenários de Arguição:' : '7 Defense Scenarios:'}
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {filteredQuestions.length} {currentLang === 'pt' ? 'perguntas filtradas' : 'filtered'}
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setSelectedScenarioId('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedScenarioId === 'todos'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
                }`}
              >
                {t.defense.allScenarios} ({DISSERTATION_FULL_QUESTIONS.length})
              </button>

              {DEFENSE_SCENARIOS.map((sc) => {
                const count = DISSERTATION_FULL_QUESTIONS.filter((q) => q.scenarioId === sc.id).length;
                const isSelected = selectedScenarioId === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSelectedScenarioId(sc.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
                    }`}
                  >
                    <span>{currentLang === 'pt' ? sc.name : sc.nameEn}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isSelected ? 'bg-indigo-800 text-white' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Difficulty Filter */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.defense.searchPlaceholder}
                  className="w-full pl-8.5 pr-3 py-1.5 rounded-xl text-xs bg-white border border-zinc-200 text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-400"
                />
              </div>

              <div className="flex items-center gap-1">
                {(['todas', 'Fundamental', 'Avançado', 'Fogo Cruzado'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      selectedDifficulty === diff
                        ? diff === 'Fogo Cruzado'
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-zinc-800 text-white'
                        : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {diff === 'todas'
                      ? currentLang === 'pt' ? 'Todos Níveis' : 'All Levels'
                      : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question List Accordion */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedId === q.id;
              const isLoaded = currentLoadedTitle.includes(`Pergunta ${q.number}`);
              const isFire = q.difficulty === 'Fogo Cruzado';

              return (
                <div
                  key={q.id}
                  className={`transition-colors ${
                    isExpanded ? 'bg-zinc-50/70' : 'hover:bg-zinc-50/40'
                  }`}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="p-4 sm:p-4.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-200/80 text-zinc-800">
                          #{q.number}
                        </span>

                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                          {questionLang === 'pt' ? q.examinerRole : q.examinerRoleEn}
                        </span>

                        {isFire && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                            <Flame className="w-3 h-3 text-rose-600" />
                            <span>Fogo Cruzado</span>
                          </span>
                        )}

                        {isLoaded && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Carregado no Estúdio
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-zinc-900 leading-snug">
                        {questionLang === 'pt' ? q.title : q.titleEn}
                      </h4>

                      <p className="text-xs text-zinc-600 line-clamp-1 italic">
                        "{questionLang === 'pt' ? q.juryQuestion : q.juryQuestionEn}"
                      </p>
                    </div>

                    <div className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 space-y-4 border-t border-zinc-100 bg-white">
                      {/* Jury Question Box */}
                      <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                            {t.defense.juryQuestion}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              onPlayQuickSpeech(
                                questionLang === 'pt' ? q.juryQuestion : q.juryQuestionEn
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-200/80 transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-zinc-600" />
                            <span>{t.defense.btnListenQuestion}</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-zinc-900 leading-relaxed italic">
                          "{questionLang === 'pt' ? q.juryQuestion : q.juryQuestionEn}"
                        </p>
                      </div>

                      {/* Candidate Response Box */}
                      <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {t.defense.candidateResponse}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              onPlayQuickSpeech(
                                questionLang === 'pt' ? q.candidateResponse : q.candidateResponseEn
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{t.defense.btnListenResponse}</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
                          {questionLang === 'pt' ? q.candidateResponse : q.candidateResponseEn}
                        </p>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {q.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const textToLoad = questionLang === 'en'
                              ? `Question ${q.number} • ${q.examinerRoleEn}\n\nJury Question:\n${q.juryQuestionEn}\n\nCandidate Response (Yolanda Tamele):\n${q.candidateResponseEn}`
                              : q.text;
                            const titleToLoad = questionLang === 'en'
                              ? `Question ${q.number}: ${q.titleEn}`
                              : `Pergunta ${q.number}: ${q.title}`;
                            onSelectQuestionText(textToLoad, titleToLoad);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white transition-colors cursor-pointer shadow-xs shrink-0"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{t.defense.btnLoadToStudio}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredQuestions.length === 0 && (
              <div className="p-8 text-center text-zinc-500 space-y-2">
                <AlertCircle className="w-8 h-8 text-zinc-300 mx-auto" />
                <p className="text-xs font-medium">
                  {currentLang === 'pt'
                    ? 'Nenhuma pergunta encontrada com os filtros selecionados.'
                    : 'No defense questions found matching selected criteria.'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
