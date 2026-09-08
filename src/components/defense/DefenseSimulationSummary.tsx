import React from 'react';
import { RotateCcw, ArrowRight, CheckCircle2, Award } from 'lucide-react';
import { DissertationQuestion } from '../../data/dissertationText';
import { SupportedLang } from '../../data/translations';
import { Button } from '../common/Button';

interface DefenseSimulationSummaryProps {
  questions: DissertationQuestion[];
  onRestartSimulation: () => void;
  onReturnToQuestionBank: () => void;
  questionLang: SupportedLang;
  currentLang: SupportedLang;
}

export const DefenseSimulationSummary: React.FC<DefenseSimulationSummaryProps> = ({
  questions,
  onRestartSimulation,
  onReturnToQuestionBank,
  questionLang,
  currentLang,
}) => {
  const isPt = currentLang === 'pt';

  return (
    <section
      aria-label={isPt ? 'Conclusão da Sessão de Arguição' : 'Examination Session Conclusion'}
      className="max-w-2xl mx-auto bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-6 sm:p-8 space-y-6 text-[#1A2417]"
    >
      {/* Header */}
      <div className="space-y-2 border-b border-[#D9CDAF] pb-4">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#4F5C48]">
          {isPt ? 'Acta de Sessão Simulada' : 'Simulated Session Record'}
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2417]">
          {isPt ? 'Arguição Concluída com Sucesso' : 'Examination Successfully Completed'}
        </h2>
        <p className="text-xs sm:text-sm text-[#4F5C48] leading-relaxed">
          {isPt
            ? `Completou a bateria de ${questions.length} perguntas sorteadas perante a banca examinadora da tese de Zavala. O ensaio oral sistemático consolida a segurança epistemológica e o domínio dos dados de campo.`
            : `You completed the set of ${questions.length} panel questions drawn for the Zavala dissertation defense. Systematic oral rehearsal reinforces epistemological confidence and field mastery.`}
        </p>
      </div>

      {/* Questions Reviewed List (Academic Record) */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A2417]">
          {isPt ? 'Perguntas Abordadas nesta Sessão' : 'Questions Addressed in this Session'}
        </h3>
        <div className="divide-y divide-[#D9CDAF]/60 border border-[#D9CDAF] rounded-[4px] bg-[#FCFAF6]">
          {questions.map((q, idx) => {
            const formattedNum = q.number < 10 ? `0${q.number}` : `${q.number}`;
            const title = questionLang === 'pt' ? q.title : q.titleEn;
            const examiner = questionLang === 'pt' ? q.examinerRole : q.examinerRoleEn;

            return (
              <div key={q.id} className="p-3 text-xs flex items-start gap-3">
                <span className="font-mono font-bold text-[#1A2417] tabular-nums shrink-0 pt-0.5">
                  #{formattedNum}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#4F5C48] block">
                    {examiner} · {q.category}
                  </span>
                  <p className="font-medium text-[#1A2417] line-clamp-1">
                    {title}
                  </p>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#354D2C] shrink-0 mt-1" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#D9CDAF]">
        <Button
          variant="secondary"
          size="md"
          onClick={onRestartSimulation}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          className="w-full sm:w-auto"
        >
          {isPt ? 'Sortear Nova Banca (5 Perguntas)' : 'Draw New Panel (5 Questions)'}
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onReturnToQuestionBank}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
          className="w-full sm:w-auto"
        >
          {isPt ? 'Explorar Todas as 60 Perguntas' : 'Explore All 60 Questions'}
        </Button>
      </div>
    </section>
  );
};
