import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  FileText,
  Trash2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { DissertationQuestion } from '../../data/dissertationText';
import { SupportedLang } from '../../data/translations';
import { Button } from '../common/Button';

interface DefenseResponseAreaProps {
  question: DissertationQuestion;
  responseText: string;
  onChangeResponse: (text: string) => void;
  onEvaluate: () => void;
  isEvaluating: boolean;
  onPlaySpeech: (text: string) => void;
  onSendToStudio: (text: string, title: string) => void;
  questionLang: SupportedLang;
  currentLang: SupportedLang;
}

export const DefenseResponseArea: React.FC<DefenseResponseAreaProps> = ({
  question,
  responseText,
  onChangeResponse,
  onEvaluate,
  isEvaluating,
  onPlaySpeech,
  onSendToStudio,
  questionLang,
  currentLang,
}) => {
  const isPt = currentLang === 'pt';

  // Timer: 180 seconds reference benchmark
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Reset timer when question changes
  useEffect(() => {
    setTimerSeconds(0);
    setIsTimerRunning(false);
  }, [question.id]);

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const wordCount = responseText.trim() ? responseText.trim().split(/\s+/).length : 0;
  // Oral speaking speed ~130 words/minute
  const estimatedSpeakMinutes = (wordCount / 130).toFixed(1);

  const isOverTime = timerSeconds > 180; // 3 min benchmark

  const officialAnswer =
    questionLang === 'pt' ? question.candidateResponse : question.candidateResponseEn;

  const handleLoadOfficial = () => {
    onChangeResponse(officialAnswer);
  };

  const handleClear = () => {
    onChangeResponse('');
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  return (
    <section
      aria-label={isPt ? 'Folha de Sustentação Oral' : 'Oral Defense Rehearsal Sheet'}
      className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 sm:p-6 space-y-4"
    >
      {/* Header Line: Label & Discrete Academic Benchmark Timer */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#D9CDAF]/70">
        <div>
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#1A2417]">
            {isPt ? 'Sustentação Oral' : 'Oral Defense'}
          </h3>
          <p className="text-[11px] text-[#4F5C48] hidden sm:block">
            {isPt
              ? 'Prepare os tópicos da resposta oral dentro do tempo de referência.'
              : 'Prepare oral defense arguments within the benchmark speaking window.'}
          </p>
        </div>

        {/* Discrete Editorial Timer */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] font-mono text-xs font-semibold tabular-nums border transition-colors ${
              isOverTime
                ? 'bg-[#8B4513]/10 text-[#8B4513] border-[#8B4513]/40'
                : isTimerRunning
                ? 'bg-[#4A6B3E]/10 text-[#354D2C] border-[#4A6B3E]/40'
                : 'bg-[#EAE2D2]/50 text-[#1A2417] border-[#D9CDAF]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timerSeconds)}</span>
            <span className="text-[10px] font-sans opacity-75 font-normal">
              {isOverTime
                ? isPt ? 'excedido' : 'exceeded'
                : isPt ? 'máx. 03:00' : 'max 03:00'}
            </span>
          </div>

          {/* Controls */}
          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1.5 rounded-[3px] bg-[#FCFAF6] hover:bg-[#EAE2D2] text-[#1A2417] transition-colors cursor-pointer border border-[#D9CDAF] focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
            title={isTimerRunning ? (isPt ? 'Pausar cronómetro' : 'Pause timer') : (isPt ? 'Iniciar cronómetro' : 'Start timer')}
            aria-label={isTimerRunning ? 'Pausar cronómetro' : 'Iniciar cronómetro'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="sr-only">
              {isTimerRunning ? 'Pausar cronómetro' : 'Iniciar cronómetro'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTimerSeconds(0);
              setIsTimerRunning(false);
            }}
            className="p-1.5 rounded-[3px] bg-[#FCFAF6] hover:bg-[#EAE2D2] text-[#1A2417] transition-colors cursor-pointer border border-[#D9CDAF] focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
            title={isPt ? 'Reiniciar cronómetro' : 'Reset timer'}
            aria-label={isPt ? 'Reiniciar cronómetro' : 'Reset timer'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="sr-only">Reiniciar cronómetro</span>
          </button>
        </div>
      </div>

      {/* Benchmark Over-Time Microcopy Notice */}
      {isOverTime && (
        <div className="text-[11px] text-[#8B4513] bg-[#8B4513]/10 border border-[#8B4513]/30 px-3 py-1.5 rounded-[3px] flex items-center justify-between">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            {isPt ? 'Limite de Referência Ultrapassado' : 'Reference Limit Passed'}
          </span>
          <span>
            {isPt
              ? 'A intervenção ultrapassou os 3 minutos de referência da arguição.'
              : 'Delivery exceeded the 3-minute oral benchmark.'}
          </span>
        </div>
      )}

      {/* Response Sheet Textarea */}
      <div className="space-y-1.5">
        <textarea
          value={responseText}
          onChange={(e) => onChangeResponse(e.target.value)}
          placeholder={
            isPt
              ? 'Rascunhe aqui os tópicos da sua sustentação oral…'
              : 'Draft your oral defense arguments here…'
          }
          rows={6}
          className="w-full p-4 rounded-[4px] bg-[#FCFAF6] border border-[#D9CDAF] text-[#1A2417] text-sm sm:text-base leading-relaxed placeholder:text-[#4F5C48]/50 focus:border-[#1A2417] focus-visible:outline-2 focus-visible:outline-[#2A3A24] resize-y font-serif transition-colors"
        />

        {/* Real-time editorial metrics & quick actions */}
        <div className="flex items-center justify-between text-xs text-[#4F5C48] pt-0.5">
          <span className="font-mono">
            {wordCount} {isPt ? 'palavras' : 'words'} · ~{estimatedSpeakMinutes} {isPt ? 'min de fala' : 'min speech'}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLoadOfficial}
              className="text-xs font-medium text-[#354D2C] hover:text-[#1A2417] underline cursor-pointer inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isPt ? 'Carregar Resposta da Tese' : 'Load Thesis Answer'}</span>
            </button>

            {responseText.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-[#4F5C48] hover:text-[#A8531E] cursor-pointer inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isPt ? 'Limpar' : 'Clear'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar (Entregar Sustentação with explicit microcopy) */}
      <div className="pt-3 border-t border-[#D9CDAF]/70 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Primary Action: Entregar Sustentação */}
            <Button
              variant="primary"
              size="md"
              onClick={onEvaluate}
              isLoading={isEvaluating}
              icon={<FileText className="w-4 h-4" />}
            >
              {isPt ? 'Entregar Sustentação' : 'Submit Oral Defense'}
            </Button>

            {/* Discrete Secondary Action: Hear candidate's drafted speech */}
            {responseText.trim().length > 0 && (
              <button
                type="button"
                onClick={() => onPlaySpeech(responseText)}
                className="px-2.5 py-1.5 text-xs text-[#4F5C48] hover:text-[#1A2417] border border-[#D9CDAF] rounded-[3px] inline-flex items-center gap-1.5 cursor-pointer bg-[#FCFAF6] hover:bg-[#EAE2D2]/50 transition-colors focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
                title={isPt ? 'Ouvir locução do rascunho' : 'Listen to draft speech'}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPt ? 'Ouvir Rascunho' : 'Listen Draft'}</span>
              </button>
            )}
          </div>

          {/* Contextual Bridge to Studio */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const title =
                questionLang === 'pt'
                  ? `Pergunta ${question.number}: ${question.title}`
                  : `Question ${question.number}: ${question.titleEn}`;
              const textToLoad = responseText.trim()
                ? `Pergunta ${question.number} • ${question.examinerRole}\n\nJúri:\n${question.juryQuestion}\n\nResposta do Candidato:\n${responseText}`
                : question.text;
              onSendToStudio(textToLoad, title);
            }}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            title={isPt ? 'Transferir esta sustentação para a bancada do Estúdio' : 'Transfer this response to Studio for vocal rehearsal'}
          >
            {isPt ? 'Ensaiar Locução no Estúdio' : 'Rehearse in Studio'}
          </Button>
        </div>

        {/* Editorial Microcopy explaining verification */}
        <p className="text-[11px] text-[#4F5C48]">
          {isPt
            ? 'A resposta será confrontada com os critérios de verificação desta questão.'
            : 'The response will be checked against the verification criteria for this question.'}
        </p>
      </div>
    </section>
  );
};
