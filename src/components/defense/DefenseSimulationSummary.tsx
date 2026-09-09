import React from 'react';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { DissertationQuestion } from '../../data/dissertationText';
import { SupportedLang } from '../../data/translations';
import { Button } from '../common/Button';

export interface QuestionSimulationRecord {
  question: DissertationQuestion;
  status: 'NÃO RESPONDIDA' | 'RASCUNHO' | 'ENTREGUE' | 'VERIFICADA';
  wordCount: number;
  isDelivered: boolean;
  isVerified: boolean;
}

interface DefenseSimulationSummaryProps {
  questions: DissertationQuestion[];
  records?: Record<string, QuestionSimulationRecord>;
  onRestartSimulation: () => void;
  onReturnToQuestionBank: () => void;
  questionLang: SupportedLang;
  currentLang: SupportedLang;
}

export const DefenseSimulationSummary: React.FC<DefenseSimulationSummaryProps> = ({
  questions,
  records = {},
  onRestartSimulation,
  onReturnToQuestionBank,
  questionLang,
  currentLang,
}) => {
  const isPt = currentLang === 'pt';

  const getStatusBadgeStyle = (status: QuestionSimulationRecord['status']) => {
    switch (status) {
      case 'VERIFICADA':
        return 'bg-[#4A6B3E]/10 text-[#354D2C] border-[#4A6B3E]/30';
      case 'ENTREGUE':
        return 'bg-[#1A2417] text-[#FCFAF6] border-[#1A2417]';
      case 'RASCUNHO':
        return 'bg-[#EAE2D2]/70 text-[#1A2417] border-[#D9CDAF]';
      case 'NÃO RESPONDIDA':
      default:
        return 'bg-[#FCFAF6] text-[#4F5C48] border-[#D9CDAF]';
    }
  };

  const getStatusLabel = (status: QuestionSimulationRecord['status']) => {
    if (isPt) return status;
    switch (status) {
      case 'VERIFICADA':
        return 'VERIFIED';
      case 'ENTREGUE':
        return 'SUBMITTED';
      case 'RASCUNHO':
        return 'DRAFT';
      case 'NÃO RESPONDIDA':
      default:
        return 'NOT ANSWERED';
    }
  };

  return (
    <section
      aria-label={isPt ? 'Registo da Sessão de Simulação' : 'Simulation Session Record'}
      className="max-w-2xl mx-auto bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-6 sm:p-8 space-y-6 text-[#1A2417]"
    >
      {/* Header (Factual Academic Session Record, no gamified congratulations) */}
      <div className="space-y-2 border-b border-[#D9CDAF] pb-4">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#4F5C48]">
          {isPt ? 'Simulador de Banca Examinadora' : 'Board Simulation Room'}
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2417]">
          {isPt ? 'Registo da Sessão de Simulação' : 'Simulation Session Record'}
        </h2>
        <p className="text-xs sm:text-sm text-[#4F5C48] leading-relaxed">
          {isPt
            ? `Relatório das ${questions.length} questões sorteadas perante a comissão examinadora. Os dados abaixo reflectem o estado real de resposta, entrega e verificação em cada ponto da arguição.`
            : `Record of the ${questions.length} panel questions drawn for examination. The table below details drafted text, submission status, and criteria checks for each point.`}
        </p>
      </div>

      {/* Questions Reviewed List (Factual, Textual States, No fake checkmarks) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#1A2417]">
          <span>{isPt ? 'Perguntas da Sessão' : 'Session Questions'}</span>
          <span className="font-mono text-[#4F5C48]">
            {questions.length} {isPt ? 'sorteadas' : 'drawn'}
          </span>
        </div>

        <div className="divide-y divide-[#D9CDAF]/60 border border-[#D9CDAF] rounded-[4px] bg-[#FCFAF6] overflow-hidden">
          {questions.map((q) => {
            const formattedNum = q.number < 10 ? `0${q.number}` : `${q.number}`;
            const title = questionLang === 'pt' ? q.title : q.titleEn;
            const examiner = questionLang === 'pt' ? q.examinerRole : q.examinerRoleEn;
            const rec = records[q.id] || {
              question: q,
              status: 'NÃO RESPONDIDA' as const,
              wordCount: 0,
              isDelivered: false,
              isVerified: false,
            };

            const estimatedMin = (rec.wordCount / 130).toFixed(1);

            return (
              <div key={q.id} className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="font-mono font-bold text-[#1A2417] tabular-nums shrink-0 pt-0.5">
                    #{formattedNum}
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10px] text-[#4F5C48] block truncate">
                      {examiner} · {q.category}
                    </span>
                    <p className="font-medium text-[#1A2417] line-clamp-1">
                      {title}
                    </p>
                    {rec.wordCount > 0 && (
                      <span className="text-[10px] font-mono text-[#4F5C48] block">
                        {rec.wordCount} {isPt ? 'palavras' : 'words'} · ~{estimatedMin} {isPt ? 'min fala' : 'min delivery'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Textual Editorial Status Badge */}
                <div className="shrink-0 self-start sm:self-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-[2px] font-mono text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadgeStyle(
                      rec.status
                    )}`}
                  >
                    {getStatusLabel(rec.status)}
                  </span>
                </div>
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
