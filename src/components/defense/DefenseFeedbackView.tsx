import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Volume2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BookOpen,
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
      aria-label={isPt ? 'Parecer de Avaliação e Réplica da Banca' : 'Evaluation Memo and Board Rejoinder'}
      className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-5 sm:p-6 space-y-6"
    >
      {/* Editorial Title / Memo Header */}
      <div className="border-b border-[#D9CDAF] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#1A2417]">
            {isPt ? 'Parecer Académico de Arguição' : 'Academic Examination Assessment'}
          </h3>
          <p className="text-[11px] text-[#4F5C48]">
            {feedback.examinerTone}
          </p>
        </div>
        <span className="text-[10px] font-mono text-[#4F5C48] bg-[#EAE2D2]/50 px-2 py-0.5 rounded-[2px]">
          {isPt ? 'Critérios de Defesa de Mestrado' : 'Master\'s Defense Criteria'}
        </span>
      </div>

      {/* Structured Editorial Memo (No SaaS cards, strictly typography & dividers) */}
      <div className="space-y-4 text-xs sm:text-sm text-[#1A2417] leading-relaxed">
        {/* Adequação */}
        <div className="space-y-1">
          <span className="font-bold text-[#1A2417] uppercase tracking-wider text-[11px] block">
            {isPt ? '1. Adequação ao Problema Formulado' : '1. Alignment with Formulated Problem'}
          </span>
          <p className="text-[#4F5C48]">
            {feedback.adequacy}
          </p>
        </div>

        {/* Rigor Académico & Fundamentação */}
        <div className="space-y-1 pt-2 border-t border-[#D9CDAF]/50">
          <span className="font-bold text-[#1A2417] uppercase tracking-wider text-[11px] block">
            {isPt ? '2. Rigor Académico & Evidência Empírica' : '2. Academic Rigor & Empirical Evidence'}
          </span>
          <p className="text-[#4F5C48]">
            {feedback.academicRigor}
          </p>
        </div>

        {/* Clareza & Oratória */}
        <div className="space-y-1 pt-2 border-t border-[#D9CDAF]/50">
          <span className="font-bold text-[#1A2417] uppercase tracking-wider text-[11px] block">
            {isPt ? '3. Clareza de Elocução e Postura Oratória' : '3. Elocution Clarity & Speaking Cadence'}
          </span>
          <p className="text-[#4F5C48]">
            {feedback.clarity}
          </p>
        </div>

        {/* Pontos Fortes e A Aprofundar (Duas colunas estruturadas ou lista vertical) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#D9CDAF]/50">
          {/* Pontos Fortes */}
          <div className="space-y-2">
            <span className="font-bold text-[#354D2C] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B3E]" />
              <span>{isPt ? 'Pontos Fortes da Resposta' : 'Strengths of the Response'}</span>
            </span>
            <ul className="space-y-1 text-xs text-[#4F5C48] list-disc list-inside">
              {feedback.strengths.map((st, i) => (
                <li key={i} className="leading-snug">
                  {st}
                </li>
              ))}
            </ul>
          </div>

          {/* A Aprofundar */}
          <div className="space-y-2">
            <span className="font-bold text-[#A8531E] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#A8531E]" />
              <span>{isPt ? 'Aspetos a Aprofundar' : 'Areas to Deepen'}</span>
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
      </div>

      {/* RÉPLICA DA BANCA (PERGUNTA DE SEGUIMENTO) - Composição Editorial Vertical */}
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
          >
            {isPt ? 'Ouvir Réplica' : 'Listen Rejoinder'}
          </Button>
        </div>

        <blockquote className="text-sm sm:text-base font-serif italic text-[#1A2417] leading-relaxed">
          “{feedback.followUpQuestion}”
        </blockquote>

        {/* Resposta à Réplica (Continuação da conversa académica sem chat bubble) */}
        <div className="pt-2 space-y-1.5">
          <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#4F5C48]">
            {isPt ? 'Sua Tréplica / Esclarecimento Adicional' : 'Your Counter-Rebuttal / Additional Clarification'}
          </label>
          <textarea
            value={rebuttalText}
            onChange={(e) => setRebuttalText(e.target.value)}
            placeholder={
              isPt
                ? 'Responda à réplica formulada pelo júri mantendo a solidez dos dados de Zavala...'
                : 'Address the board\'s rejoinder maintaining factual grounding from Zavala data...'
            }
            rows={3}
            className="w-full p-2.5 rounded-[3px] bg-[#FCFAF6] border border-[#D9CDAF] text-xs sm:text-sm text-[#1A2417] placeholder:text-[#4F5C48]/50 focus-visible:outline-2 focus-visible:outline-[#2A3A24] font-serif"
          />
        </div>
      </div>

      {/* RESPOSTA CIENTÍFICA OFICIAL DE YOLANDA TAMELE (Comparação / Referência) */}
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
            <div className="flex items-center justify-between pb-1 border-b border-[#D9CDAF]/50">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#354D2C]">
                {isPt ? 'Texto Oficial da Dissertação (UEM / ESUDER)' : 'Official Dissertation Defense Script (UEM / ESUDER)'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPlaySpeech(officialAnswer)}
                icon={<Volume2 className="w-3.5 h-3.5" />}
              >
                {isPt ? 'Ouvir' : 'Listen'}
              </Button>
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
