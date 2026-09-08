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

  // Timer: 180 seconds recommended limit
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

  const isOverTime = timerSeconds > 180; // 3 min threshold

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
      aria-label={isPt ? 'Área de Preparação da Resposta' : 'Response Preparation Sheet'}
      className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-5 sm:p-6 space-y-4"
    >
      {/* Header Line: Label & Discrete Academic Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9CDAF]/70">
        <div>
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#1A2417]">
            {isPt ? 'Sua Resposta Oral / Ensaio de Defesa' : 'Your Oral Response / Defense Rehearsal'}
          </h3>
          <p className="text-[11px] text-[#4F5C48]">
            {isPt
              ? 'Rascunhe os argumentos e teste a elocução dentro do limite de arguição.'
              : 'Draft arguments and test verbal delivery within examination time.'}
          </p>
        </div>

        {/* Discrete Editorial Timer */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] font-mono text-xs font-semibold tabular-nums border transition-colors ${
              isOverTime
                ? 'bg-[#A8531E]/10 text-[#A8531E] border-[#A8531E]/40'
                : isTimerRunning
                ? 'bg-[#4A6B3E]/10 text-[#354D2C] border-[#4A6B3E]/40'
                : 'bg-[#EAE2D2]/50 text-[#1A2417] border-[#D9CDAF]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timerSeconds)}</span>
            <span className="text-[10px] font-sans opacity-70 font-normal">
              {isOverTime
                ? isPt ? '(limite excedido)' : '(limit passed)'
                : isPt ? '(máx. 03:00)' : '(max 03:00)'}
            </span>
          </div>

          {/* Controls */}
          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1.5 rounded-[3px] bg-[#FCFAF6] hover:bg-[#EAE2D2] text-[#1A2417] transition-colors cursor-pointer border border-[#D9CDAF] focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
            title={isTimerRunning ? (isPt ? 'Pausar' : 'Pause') : (isPt ? 'Iniciar cronómetro' : 'Start timer')}
            aria-label={isTimerRunning ? 'Pausar cronómetro' : 'Iniciar cronómetro'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setTimerSeconds(0);
              setIsTimerRunning(false);
            }}
            className="p-1.5 rounded-[3px] bg-[#FCFAF6] hover:bg-[#EAE2D2] text-[#1A2417] transition-colors cursor-pointer border border-[#D9CDAF] focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
            title={isPt ? 'Reiniciar tempo' : 'Reset timer'}
            aria-label="Reiniciar tempo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Response Sheet Textarea */}
      <div className="relative">
        <textarea
          value={responseText}
          onChange={(e) => onChangeResponse(e.target.value)}
          placeholder={
            isPt
              ? 'Estruture a sua defesa:\n1. Reconhecimento do ponto formulado pelo examinador;\n2. Mobilização de evidências empíricas (dados de Zavala, série de 31 anos, metodologia);\n3. Conclusão inequívoca...'
              : 'Structure your defense:\n1. Acknowledge the examiner\'s point;\n2. Mobilize empirical evidence (Zavala metrics, 31-year series, methodology);\n3. Decisive synthesis...'
          }
          rows={6}
          className="w-full p-4 rounded-[4px] bg-[#FCFAF6] border border-[#D9CDAF] text-[#1A2417] text-sm sm:text-base leading-relaxed placeholder:text-[#4F5C48]/50 focus:border-[#1A2417] focus-visible:outline-2 focus-visible:outline-[#2A3A24] resize-y font-serif transition-colors"
        />

        {/* Real-time editorial metric footer */}
        <div className="flex items-center justify-between text-xs text-[#4F5C48] pt-1.5">
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
              <span>{isPt ? 'Carregar Resposta da Tese' : 'Load Official Answer'}</span>
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

      {/* Action Bar (One clear primary contextual action + secondary tools) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D9CDAF]/70">
        <div className="flex items-center gap-2">
          {/* Primary Action */}
          <Button
            variant="primary"
            size="md"
            onClick={onEvaluate}
            isLoading={isEvaluating}
            icon={<FileText className="w-4 h-4" />}
          >
            {isPt ? 'Avaliar Resposta & Ver Réplica' : 'Evaluate & View Rejoinder'}
          </Button>

          {/* Secondary Action: Read Aloud */}
          {responseText.trim().length > 0 && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => onPlaySpeech(responseText)}
              icon={<Volume2 className="w-4 h-4" />}
            >
              {isPt ? 'Ouvir Resposta' : 'Listen Response'}
            </Button>
          )}
        </div>

        {/* Bridge to Studio: Send to rehearsal workstation */}
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
          title={isPt ? 'Transferir para a bancada do Estúdio para ensaio de locução neural' : 'Transfer to Studio workstation for vocal rehearsal'}
        >
          {isPt ? 'Ensaiar Locução no Estúdio' : 'Rehearse in Studio'}
        </Button>
      </div>
    </section>
  );
};
