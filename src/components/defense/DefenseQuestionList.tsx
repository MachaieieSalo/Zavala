import React from 'react';
import { Search, Flame, Check } from 'lucide-react';
import {
  DissertationQuestion,
  DEFENSE_SCENARIOS,
} from '../../data/dissertationText';
import { SupportedLang } from '../../data/translations';

interface DefenseQuestionListProps {
  questions: DissertationQuestion[];
  selectedQuestionId: string;
  onSelectQuestion: (question: DissertationQuestion) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedScenarioId: string;
  onScenarioChange: (scenarioId: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  questionLang: SupportedLang;
  currentLang: SupportedLang;
}

export const DefenseQuestionList: React.FC<DefenseQuestionListProps> = ({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  searchQuery,
  onSearchChange,
  selectedScenarioId,
  onScenarioChange,
  selectedDifficulty,
  onDifficultyChange,
  questionLang,
  currentLang,
}) => {
  const isPt = currentLang === 'pt';

  return (
    <aside
      aria-label={isPt ? 'Índice de Perguntas da Defesa' : 'Defense Questions Index'}
      className="flex flex-col h-full bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] overflow-hidden"
    >
      {/* Search & Filter Header */}
      <div className="p-3.5 border-b border-[#D9CDAF] bg-[#FCFAF6] space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#4F5C48] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isPt
                ? 'Filtrar por conceito, termo ou autor...'
                : 'Filter by concept, term, or author...'
            }
            className="w-full pl-8 pr-2.5 py-1.5 rounded-[4px] text-xs bg-[#FCFAF6] border border-[#D9CDAF] text-[#1A2417] focus-visible:outline-2 focus-visible:outline-[#2A3A24] placeholder:text-[#4F5C48]/60 font-sans"
          />
        </div>

        {/* Scenario Filter (Editorial Dropdown) */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#4F5C48] mb-1">
            {isPt ? 'Cenário da Banca' : 'Examination Scenario'}
          </label>
          <select
            value={selectedScenarioId}
            onChange={(e) => onScenarioChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-[4px] text-xs bg-[#FCFAF6] border border-[#D9CDAF] text-[#1A2417] focus-visible:outline-2 focus-visible:outline-[#2A3A24] font-sans cursor-pointer"
          >
            <option value="todos">
              {isPt ? 'Todos os 7 Cenários (60 Perguntas)' : 'All 7 Scenarios (60 Questions)'}
            </option>
            {DEFENSE_SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {isPt ? sc.name : sc.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter (Editorial Line) */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#4F5C48] mb-1">
            <span>{isPt ? 'Nível de Exigência' : 'Rigor Level'}</span>
            <span className="font-mono text-[#1A2417]">
              {questions.length} {isPt ? 'encontradas' : 'found'}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {(['todas', 'Fundamental', 'Avançado', 'Fogo Cruzado'] as const).map((diff) => {
              const isSelected = selectedDifficulty === diff;
              const label =
                diff === 'todas'
                  ? isPt
                    ? 'Todas'
                    : 'All'
                  : diff === 'Fogo Cruzado' && !isPt
                  ? 'Crossfire'
                  : diff;

              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => onDifficultyChange(diff)}
                  className={`px-1.5 py-1 rounded-[3px] text-[11px] font-medium transition-colors cursor-pointer text-center truncate focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                    isSelected
                      ? diff === 'Fogo Cruzado'
                        ? 'bg-[#A8531E] text-[#FCFAF6] font-semibold'
                        : 'bg-[#1A2417] text-[#FCFAF6] font-semibold'
                      : 'bg-[#FCFAF6] text-[#4F5C48] border border-[#D9CDAF] hover:bg-[#EAE2D2]/50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Questions List (Progressive Disclosure) */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#D9CDAF]/60 max-h-[calc(100vh-280px)] min-h-[300px]">
        {questions.map((q) => {
          const isSelected = q.id === selectedQuestionId;
          const formattedNum = q.number < 10 ? `0${q.number}` : `${q.number}`;
          const isCrossfire = q.difficulty === 'Fogo Cruzado';
          const title = questionLang === 'pt' ? q.title : q.titleEn;
          const examiner = questionLang === 'pt' ? q.examinerRole : q.examinerRoleEn;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(q)}
              className={`w-full text-left p-3 transition-colors cursor-pointer flex items-start gap-2.5 focus-visible:outline-2 focus-visible:outline-[#2A3A24] ${
                isSelected
                  ? 'bg-[#EAE2D2]/40 border-l-3 border-[#1A2417]'
                  : 'hover:bg-[#EAE2D2]/20 border-l-3 border-transparent'
              }`}
            >
              <span
                className={`font-mono text-xs tabular-nums shrink-0 pt-0.5 ${
                  isSelected ? 'font-bold text-[#1A2417]' : 'text-[#4F5C48]'
                }`}
              >
                #{formattedNum}
              </span>

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] text-[#4F5C48] truncate font-sans">
                    {examiner}
                  </span>
                  {isCrossfire && (
                    <span
                      title="Fogo Cruzado"
                      className="inline-flex items-center text-[10px] font-semibold text-[#A8531E] shrink-0"
                    >
                      <Flame className="w-3 h-3 mr-0.5" />
                      {isPt ? 'Armadilha' : 'Trap'}
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs leading-snug line-clamp-2 ${
                    isSelected
                      ? 'font-bold text-[#1A2417]'
                      : 'font-medium text-[#1A2417]/85'
                  }`}
                >
                  {title}
                </p>
              </div>

              {isSelected && (
                <Check className="w-3.5 h-3.5 text-[#354D2C] shrink-0 mt-1" />
              )}
            </button>
          );
        })}

        {questions.length === 0 && (
          <div className="p-8 text-center text-xs text-[#4F5C48] space-y-1">
            <p className="font-semibold text-[#1A2417]">
              {isPt ? 'Nenhuma pergunta encontrada' : 'No questions found'}
            </p>
            <p>
              {isPt
                ? 'Ajuste os filtros de cenário ou limpe a pesquisa.'
                : 'Adjust scenario filters or clear search query.'}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
