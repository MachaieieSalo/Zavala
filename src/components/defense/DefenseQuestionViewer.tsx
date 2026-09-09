import React from 'react';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { DissertationQuestion } from '../../data/dissertationText';
import { SupportedLang } from '../../data/translations';
import { Button } from '../common/Button';
import { EditorialMeta } from '../common/EditorialMeta';

interface DefenseQuestionViewerProps {
  question: DissertationQuestion;
  totalQuestions: number;
  onPlaySpeech: (text: string) => void;
  questionLang: SupportedLang;
  currentLang: SupportedLang;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const DefenseQuestionViewer: React.FC<DefenseQuestionViewerProps> = ({
  question,
  totalQuestions,
  onPlaySpeech,
  questionLang,
  currentLang,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}) => {
  const isPt = currentLang === 'pt';
  const formattedNum = question.number < 10 ? `0${question.number}` : `${question.number}`;
  const isCriticalInquiry = question.difficulty === 'Arguição Crítica';

  const juryQuestionText =
    questionLang === 'pt' ? question.juryQuestion : question.juryQuestionEn;
  const examinerRole =
    questionLang === 'pt' ? question.examinerRole : question.examinerRoleEn;
  const questionTitle =
    questionLang === 'pt' ? question.title : question.titleEn;

  return (
    <section
      aria-label={isPt ? 'Pergunta da Comissão Examinadora' : 'Examination Board Question'}
      className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-5 sm:p-6 space-y-4"
    >
      {/* Classification & Context Meta Line + Compact Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#D9CDAF]/70">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="font-mono font-bold text-[#1A2417] tracking-wider uppercase">
            {isPt ? 'Pergunta' : 'Question'} {formattedNum} / {totalQuestions}
          </span>
          <span className="text-[#D9CDAF]">·</span>
          <EditorialMeta
            items={[
              examinerRole,
              question.category,
              isCriticalInquiry ? (
                <span
                  key="diff-critical"
                  title={
                    isPt
                      ? 'Categoria pedagógica do simulador: objecções metodológicas e conceituais complexas para treino de sustentação oral (não constitui classificação oficial da UEM/ESUDER).'
                      : 'Simulator pedagogical category: complex methodological objections for oral defense practice (not an official UEM/ESUDER classification).'
                  }
                  className="cursor-help underline decoration-dotted decoration-[#4F5C48]/60"
                >
                  {isPt ? 'Arguição Crítica (Simulador)' : 'Critical Inquiry (Simulator)'}
                </span>
              ) : (
                question.difficulty
              ),
            ]}
          />
        </div>

        {/* Action Controls: Audio + Discrete Compact Navigation */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPlaySpeech(juryQuestionText)}
            icon={<Volume2 className="w-3.5 h-3.5" />}
            title={isPt ? 'Ouvir enunciação da pergunta' : 'Listen to question delivery'}
          >
            {isPt ? 'Ouvir Pergunta' : 'Listen Question'}
          </Button>

          {/* Compact Top Navigation (Requirement 11) */}
          {onPrevious && onNext && (
            <div className="flex items-center pl-1 border-l border-[#D9CDAF]/70 gap-0.5">
              <button
                type="button"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="p-1.5 rounded-[3px] text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
                title={isPt ? 'Pergunta anterior' : 'Previous question'}
                aria-label={isPt ? 'Pergunta anterior' : 'Previous question'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="p-1.5 rounded-[3px] text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
                title={isPt ? 'Próxima pergunta' : 'Next question'}
                aria-label={isPt ? 'Próxima pergunta' : 'Next question'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dominant Examination Question Block */}
      <div className="space-y-2">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-[#4F5C48]">
          {isPt ? 'Comissão Examinadora (Arguição Oral)' : 'Examination Board (Oral Inquiry)'}
        </h2>

        {/* Large, Authoritative Academic Typographic Treatment */}
        <blockquote className="text-lg sm:text-xl md:text-2xl font-serif text-[#1A2417] leading-relaxed tracking-tight pl-3 border-l-2 border-[#1A2417]">
          “{juryQuestionText}”
        </blockquote>
      </div>

      {/* Short sub-theme description & Pedagogical Disclaimer Footnote */}
      <div className="pt-2 border-t border-[#D9CDAF]/40 space-y-1.5">
        <div className="flex items-center justify-between gap-3 text-xs text-[#4F5C48]">
          <p className="italic">
            {questionTitle}
          </p>
          <EditorialMeta
            items={question.tags.map((t) => `#${t}`)}
            className="hidden sm:flex"
          />
        </div>

        {/* Clarification footnote */}
        <p className="text-[10px] text-[#4F5C48]/70 italic">
          {isPt
            ? isCriticalInquiry
              ? 'Nota de integridade: "Arguição Crítica" é uma categoria pedagógica deste simulador para treino de objecções metodológicas de maior exigência, não constituindo classificação oficial da UEM / ESUDER.'
              : 'Papéis utilizados exclusivamente para simulação pedagógica, organizados segundo os eixos temáticos da dissertação.'
            : isCriticalInquiry
              ? 'Integrity note: "Critical Inquiry" is a pedagogical category in this simulator for high-rigor methodological pushbacks, not an official UEM / ESUDER classification.'
              : 'Roles assigned exclusively for pedagogical simulation, structured along the dissertation thematic axes.'}
        </p>
      </div>
    </section>
  );
};
