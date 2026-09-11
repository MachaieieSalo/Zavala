import React, { useState } from 'react';
import {
  Volume2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { DissertationQuestion } from '../../data/dissertationText';
import { SupportedLang } from '../../data/translations';
import { EvaluationFeedback } from './defenseKnowledge';
import { Button } from '../common/Button';

interface DefenseFeedbackViewProps {
  question: DissertationQuestion;
  feedback: EvaluationFeedback;
  candidateResponse: string;
  onPlaySpeech: (text: string) => void;
  questionLang: SupportedLang;
  currentLang: SupportedLang;
}

export const DefenseFeedbackView: React.FC<DefenseFeedbackViewProps> = ({
  question,
  feedback,
  candidateResponse,
  onPlaySpeech,
  questionLang,
  currentLang,
}) => {
  const isPt = currentLang === 'pt';
  const [showOfficialAnswer, setShowOfficialAnswer] = useState<boolean>(false);
  const [rebuttalText, setRebuttalText] = useState<string>('');

  const officialAnswer =
    questionLang === 'pt' ? question.candidateResponse : question.candidateResponseEn;

  return (
    <section
      aria-label={isPt ? 'Grelha de Auto-Verificação e Réplica da Banca' : 'Self-Verification Grid and Board Rejoinder'}
      aria-live="polite"
      className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-5 sm:p-6 space-y-6"
    >
      {/* 1. GRELHA DE AUTO-VERIFICAÇÃO (Editorial, Rigorosa, Não Punitiva) */}
      <div className="space-y-4">
        <div className="border-b border-[#D9CDAF] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#1A2417]">
              {isPt ? 'Arguição Crítica · Auto-Verificação Editorial' : 'Critical Examination · Editorial Self-Verification'}
            </h3>
            <p className="text-xs text-[#4F5C48]">
              {isPt
                ? 'Critérios que a sua resposta oral deve conseguir sustentar perante a banca examinadora.'
                : 'Criteria that your oral answer must substantiate before the examination board.'}
            </p>
          </div>
          <span className="text-[10px] text-[#4F5C48] italic self-start sm:self-auto max-w-xs sm:text-right">
            {isPt
              ? 'Construção pedagógica da plataforma (não constitui classificação oficial da UEM/ESUDER)'
              : 'Platform pedagogical construct (not an official UEM/ESUDER classification)'}
          </span>
        </div>

        {/* Critérios Editoriais */}
        <div className="space-y-3.5 text-xs sm:text-sm text-[#1A2417] leading-relaxed">
          {/* ADEQUAÇÃO */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1A2417] uppercase tracking-wider text-[11px]">
                {isPt ? 'Adequação' : 'Alignment'}
              </span>
              <span className="text-[10px] text-[#4F5C48] italic">
                {isPt ? 'A resposta enfrenta directamente a questão?' : 'Does the response directly address the question?'}
              </span>
            </div>
            <p className="text-[#4F5C48]">
              {feedback.adequacy}
            </p>
          </div>

          {/* RIGOR EMPÍRICO */}
          <div className="space-y-1 pt-3 border-t border-[#D9CDAF]/50">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1A2417] uppercase tracking-wider text-[11px]">
                {isPt ? 'Rigor Empírico' : 'Empirical Rigor'}
              </span>
              <span className="text-[10px] text-[#4F5C48] italic">
                {isPt ? 'Mobiliza evidência, dados ou metodologia da tese?' : 'Does it mobilize data or thesis methodology?'}
              </span>
            </div>
            <p className="text-[#4F5C48]">
              {feedback.academicRigor}
            </p>
          </div>

          {/* CLAREZA */}
          <div className="space-y-1 pt-3 border-t border-[#D9CDAF]/50">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1A2417] uppercase tracking-wider text-[11px]">
                {isPt ? 'Clareza' : 'Clarity'}
              </span>
              <span className="text-[10px] text-[#4F5C48] italic">
                {isPt ? 'Linha argumentativa compreensível e defensável oralmente?' : 'Cohesive and orally defensible argument?'}
              </span>
            </div>
            <p className="text-[#4F5C48]">
              {feedback.clarity}
            </p>
          </div>

          {/* Pontos observados e a reforçar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#D9CDAF]/50">
            {/* Pontos de Sustentação */}
            <div className="space-y-1.5">
              <span className="font-semibold text-[#354D2C] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#354D2C]" />
                <span>{isPt ? 'Pontos de Sustentação Observados' : 'Observed Defense Anchors'}</span>
              </span>
              <ul className="space-y-1 text-xs text-[#4F5C48] list-disc list-inside">
                {feedback.strengths.map((st, i) => (
                  <li key={i} className="leading-snug">
                    {st}
                  </li>
                ))}
              </ul>
            </div>

            {/* Aspetos a Reforçar */}
            <div className="space-y-1.5">
              <span className="font-semibold text-[#A8531E] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#A8531E]" />
                <span>{isPt ? 'Aspetos a Reforçar perante a Banca' : 'Points to Reinforce Before the Board'}</span>
              </span>
              <ul className="space-y-1 text-xs text-[#4F5C48] list-disc list-inside">
                {feedback.toDeepen.map((item, i) => (
                  <li key={i} className="leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Checklist de Evidências da Pergunta (Fase 5.3) */}
          {feedback.evidenceChecklist && feedback.evidenceChecklist.length > 0 && (
            <div className="pt-3 border-t border-[#D9CDAF]/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A2417] uppercase tracking-wider text-[11px]">
                  {isPt ? 'Critérios de Evidência da Pergunta' : 'Question Evidence Criteria'}
                </span>
                <span className="text-[10px] text-[#4F5C48] italic">
                  {isPt
                    ? 'Verificação orientadora com base nos dados da dissertação'
                    : 'Guidance verification based on dissertation evidence'}
                </span>
              </div>

              <div className="space-y-1.5 pt-0.5">
                {feedback.evidenceChecklist.map((crit) => (
                  <div
                    key={crit.id}
                    className={`p-2.5 rounded-[3px] border text-xs leading-relaxed ${
                      crit.isSatisfied
                        ? 'bg-[#FCFAF6] border-[#D9CDAF] text-[#1A2417]'
                        : 'bg-[#FCFAF6]/60 border-[#D9CDAF]/70 text-[#4F5C48]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {crit.isSatisfied ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#354D2C] shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-[#A8531E] shrink-0" />
                        )}
                        <span className="font-semibold text-[#1A2417]">
                          {isPt ? crit.labelPt : crit.labelEn}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-[2px] shrink-0 ${
                          crit.isSatisfied
                            ? 'bg-[#354D2C]/10 text-[#354D2C] font-semibold'
                            : 'bg-[#EAE2D2]/60 text-[#4F5C48]'
                        }`}
                      >
                        {crit.isSatisfied
                          ? isPt ? 'Verificado' : 'Verified'
                          : isPt ? 'A reforçar' : 'To reinforce'}
                      </span>
                    </div>

                    {!crit.isSatisfied && (
                      <p className="mt-1 text-[11px] text-[#A8531E] pl-5.5 italic">
                        {isPt ? crit.guidancePt : crit.guidanceEn}
                      </p>
                    )}

                    {crit.isSatisfied && crit.matchedClues.length > 0 && (
                      <p className="mt-1 text-[10px] text-[#4F5C48] pl-5.5 font-mono">
                        {isPt ? 'Evidências identificadas: ' : 'Identified evidence: '}
                        <span className="text-[#1A2417] font-sans font-medium">
                          {crit.matchedClues.join(', ')}
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. RÉPLICA DA BANCA (PERGUNTA DE SEGUIMENTO) */}
      <div className="p-4 sm:p-5 border-l-3 border-[#1A2417] bg-[#EAE2D2]/25 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#1A2417]" />
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A2417]">
              {isPt ? 'Réplica da Banca Examinadora' : 'Examination Board Rejoinder'}
            </h4>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPlaySpeech(feedback.followUpQuestion)}
            icon={<Volume2 className="w-3.5 h-3.5" />}
            title={isPt ? 'Ouvir enunciação da réplica' : 'Listen to rejoinder delivery'}
          >
            {isPt ? 'Ouvir Réplica' : 'Listen Rejoinder'}
          </Button>
        </div>

        <blockquote className="text-sm sm:text-base font-serif italic text-[#1A2417] leading-relaxed">
          “{feedback.followUpQuestion}”
        </blockquote>

        {/* Tréplica simplificada / bloco de notas discreto */}
        <div className="pt-2 space-y-1">
          <label className="block text-[11px] text-[#4F5C48]">
            {isPt
              ? 'Registe aqui, se necessário, como responderia à objecção.'
              : 'Note here, if needed, how you would address this objection.'}
          </label>
          <textarea
            value={rebuttalText}
            onChange={(e) => setRebuttalText(e.target.value)}
            placeholder={
              isPt
                ? 'Nota de tréplica (opcional)...'
                : 'Rebuttal note (optional)...'
            }
            rows={2}
            className="w-full p-2.5 rounded-[3px] bg-[#FCFAF6] border border-[#D9CDAF] text-xs sm:text-sm text-[#1A2417] placeholder:text-[#4F5C48]/40 focus-visible:outline-2 focus-visible:outline-[#2A3A24] font-serif"
          />
        </div>
      </div>

      {/* 3. RESPOSTA CIENTÍFICA DE REFERÊNCIA (Colapsável por defeito) */}
      <div className="pt-2 border-t border-[#D9CDAF]">
        <button
          type="button"
          onClick={() => setShowOfficialAnswer(!showOfficialAnswer)}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#1A2417] py-2 hover:text-[#354D2C] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#354D2C]" />
            <span>
              {isPt
                ? 'Ver Resposta Científica de Referência (Dissertação de Yolanda Tamele)'
                : 'View Reference Scientific Answer (Yolanda Tamele\'s Dissertation)'}
            </span>
          </div>
          {showOfficialAnswer ? (
            <ChevronUp className="w-4 h-4 text-[#4F5C48]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#4F5C48]" />
          )}
        </button>

        {showOfficialAnswer && (
          <div className="mt-2 p-4 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] space-y-2 text-xs sm:text-sm leading-relaxed font-serif text-[#1A2417]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1.5 border-b border-[#D9CDAF]/50">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#354D2C]">
                  {isPt ? 'Texto de Apoio da Dissertação (UEM / ESUDER)' : 'Supporting Dissertation Text (UEM / ESUDER)'}
                </span>
                <span className="text-[10px] text-[#4F5C48] italic">
                  {isPt
                    ? 'Registo empírico de referência da autora Yolanda Tamele'
                    : 'Reference empirical record by author Yolanda Tamele'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onPlaySpeech(officialAnswer)}
                className="text-xs text-[#4F5C48] hover:text-[#1A2417] inline-flex items-center gap-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
                title={isPt ? 'Ouvir resposta oficial' : 'Listen to official answer'}
              >
                <Volume2 className="w-3 h-3" />
                <span>{isPt ? 'Ouvir' : 'Listen'}</span>
              </button>
            </div>
            <p className="text-[#1A2417]">
              {officialAnswer}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
