import React from 'react';
import { Volume2, Flame } from 'lucide-react';
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
}

export const DefenseQuestionViewer: React.FC<DefenseQuestionViewerProps> = ({
  question,
  totalQuestions,
  onPlaySpeech,
  questionLang,
  currentLang,
}) => {
  const isPt = currentLang === 'pt';
  const formattedNum = question.number < 10 ? `0${question.number}` : `${question.number}`;
  const isCrossfire = question.difficulty === 'Fogo Cruzado';

  const juryQuestionText =
    questionLang === 'pt' ? question.juryQuestion : question.juryQuestionEn;
  const examinerRole =
    questionLang === 'pt' ? question.examinerRole : question.examinerRoleEn;
  const questionTitle =
    questionLang === 'pt' ? question.title : question.titleEn;

  return (
    <section
      aria-label={isPt ? 'Pergunta da Banca Examinadora' : 'Examination Board Question'}
      className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-5 sm:p-6 space-y-4"
    >
      {/* Classification & Context Meta Line */}
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
              question.difficulty !== 'Fogo Cruzado' ? question.difficulty : null,
            ]}
          />
          {isCrossfire && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A8531E] bg-[#A8531E]/10 px-2 py-0.5 rounded-[2px]">
              <Flame className="w-3 h-3" />
              <span>{isPt ? 'Fogo Cruzado' : 'High-Stakes Trap'}</span>
            </span>
          )}
        </div>

        {/* Audio pronunciation tool */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPlaySpeech(juryQuestionText)}
          icon={<Volume2 className="w-3.5 h-3.5" />}
          title={isPt ? 'Ouvir enunciação da pergunta pelo júri' : 'Listen to jury question pronunciation'}
          className="self-start sm:self-auto shrink-0"
        >
          {isPt ? 'Ouvir Pergunta' : 'Listen Question'}
        </Button>
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

      {/* Short sub-theme description */}
      <div className="pt-1 flex items-center justify-between gap-3 text-xs text-[#4F5C48]">
        <p className="italic">
          {questionTitle}
        </p>
        <EditorialMeta
          items={question.tags.map((t) => `#${t}`)}
          className="hidden sm:flex"
        />
      </div>
    </section>
  );
};
