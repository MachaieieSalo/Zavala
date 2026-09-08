import React from 'react';
import {
  Clipboard,
  Trash2,
  BookOpen,
  Volume2,
  Square,
} from 'lucide-react';
import { getAllDissertationText } from '../data/dissertationText';
import { TRANSLATIONS, SupportedLang } from '../data/translations';
import { Button } from './common/Button';

interface TextInputAreaProps {
  text: string;
  onChangeText: (newText: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  loadingStep: string;
  maxChars?: number;
  onBrowserSpeechPlay?: () => void;
  onBrowserSpeechStop?: () => void;
  isBrowserSpeaking?: boolean;
  currentLang?: SupportedLang;
}

export const TextInputArea: React.FC<TextInputAreaProps> = ({
  text,
  onChangeText,
  onGenerate,
  isLoading,
  loadingStep,
  maxChars = 30000,
  onBrowserSpeechPlay,
  onBrowserSpeechStop,
  isBrowserSpeaking = false,
  currentLang = 'pt',
}) => {
  const t = TRANSLATIONS[currentLang];
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Leitura estimada em voz alta para defesa: ~130-140 palavras por minuto
  const estimatedSeconds = Math.max(1, Math.round((wordCount / 135) * 60));
  const estimatedMinutes = Math.floor(estimatedSeconds / 60);
  const remainingSeconds = estimatedSeconds % 60;

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          onChangeText(clipText.slice(0, maxChars));
        }
      }
    } catch {
      // Fallback silencioso se permissão clipboard for negada
    }
  };

  const handleClear = () => {
    onChangeText('');
  };

  const handleLoadDissertation = () => {
    onChangeText(getAllDissertationText());
  };

  const isDissertationLoaded =
    text.trim().includes('Zavala') && text.length > 2000;

  const readingTimeText =
    wordCount > 0
      ? estimatedMinutes > 0
        ? `~${estimatedMinutes} min ${remainingSeconds > 0 ? `${remainingSeconds}s` : ''} de leitura`
        : `~${estimatedSeconds}s de leitura`
      : null;

  return (
    <section aria-label="Manuscrito para ensaio" className="space-y-3 font-sans">
      {/* Top Bar: Rótulo editorial do manuscrito e ações de suporte */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-1 border-b border-[#D9CDAF]/80">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xs font-semibold text-[#1A2417] uppercase tracking-wider font-sans">
            {currentLang === 'pt' ? 'Manuscrito de Ensaio' : 'Rehearsal Manuscript'}
          </h2>
          <span className="text-[11px] text-[#4F5C48] font-mono">
            {currentLang === 'pt' ? 'Edição e leitura em voz alta' : 'Speech draft and read-aloud'}
          </span>
        </div>

        {/* Ações secundárias do editor */}
        <div className="flex items-center gap-1">
          <Button
            id="btn-load-dissertation"
            variant="ghost"
            size="sm"
            onClick={handleLoadDissertation}
            icon={<BookOpen className="w-3.5 h-3.5 text-[#354D2C]" />}
            title="Carregar texto integral da dissertação de Zavala"
          >
            {isDissertationLoaded
              ? currentLang === 'pt'
                ? 'Tese Carregada'
                : 'Thesis Loaded'
              : currentLang === 'pt'
                ? 'Inserir Tese Integral'
                : 'Insert Full Thesis'}
          </Button>

          <Button
            id="btn-paste-clipboard"
            variant="ghost"
            size="sm"
            onClick={handlePaste}
            icon={<Clipboard className="w-3.5 h-3.5 text-[#4F5C48]" />}
            title="Colar texto da área de transferência"
          >
            {currentLang === 'pt' ? 'Colar' : 'Paste'}
          </Button>

          {text.length > 0 && (
            <Button
              id="btn-clear-text"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              icon={<Trash2 className="w-3.5 h-3.5 text-[#A8531E]" />}
              title="Limpar manuscrito"
              className="hover:text-[#A8531E] hover:bg-[#A8531E]/10"
            >
              {t.studio.btnClear}
            </Button>
          )}
        </div>
      </div>

      {/* Área Central do Manuscrito — Fundo papel, tipografia confortável de 16px */}
      <div className="relative rounded-[4px] border border-[#D9CDAF] bg-[#FCFAF6] focus-within:border-[#1A2417] transition-colors">
        <textarea
          id="tts-textarea-input"
          value={text}
          onChange={(e) => onChangeText(e.target.value.slice(0, maxChars))}
          placeholder={
            currentLang === 'pt'
              ? 'Escreva ou cole o trecho da dissertação que pretende ensaiar...'
              : 'Write or paste the dissertation excerpt you want to rehearse...'
          }
          rows={11}
          disabled={isLoading}
          aria-label={currentLang === 'pt' ? 'Texto do manuscrito da dissertação' : 'Dissertation manuscript text'}
          className="w-full p-4 sm:p-5 bg-transparent text-[#1A2417] placeholder:text-[#4F5C48]/50 text-base leading-relaxed resize-y min-h-[220px] font-sans focus:outline-none disabled:opacity-70"
        />

        {/* Linha discreta de aviso caso documento seja muito extenso */}
        {charCount > 20000 && (
          <div className="px-4 py-1.5 border-t border-[#D9CDAF]/60 text-[11px] font-mono text-[#A8531E] bg-[#EAE2D2]/20">
            {currentLang === 'pt'
              ? `Documento extenso (${charCount.toLocaleString('pt-BR')} / ${maxChars.toLocaleString('pt-BR')} caracteres). A síntese poderá levar alguns segundos adicionais.`
              : `Long document (${charCount.toLocaleString()} / ${maxChars.toLocaleString()} characters). Synthesis may take a few additional seconds.`}
          </div>
        )}
      </div>

      {/* Rodapé: Metadados editoriais discretos e Acção Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Metadados Editoriais Discretos (sem badges ou cápsulas) */}
        <div className="text-xs text-[#4F5C48] font-sans">
          <span className="font-mono tabular-nums font-semibold text-[#1A2417]">
            {charCount.toLocaleString('pt-BR')}
          </span>
          <span className="text-[#4F5C48]"> {currentLang === 'pt' ? 'caracteres' : 'characters'}</span>
          <span className="mx-2 text-[#D9CDAF]">·</span>
          <span className="font-mono tabular-nums font-semibold text-[#1A2417]">
            {wordCount.toLocaleString('pt-BR')}
          </span>
          <span className="text-[#4F5C48]"> {currentLang === 'pt' ? 'palavras' : 'words'}</span>
          {readingTimeText && (
            <>
              <span className="mx-2 text-[#D9CDAF]">·</span>
              <span className="font-mono tabular-nums text-[#354D2C]">
                {readingTimeText}
              </span>
            </>
          )}
        </div>

        {/* Ações: Prova de leitura rápida e Acção Principal "Gerar Áudio" */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          {/* Leitura instantânea local pelo navegador (ferramenta de apoio secundária) */}
          {onBrowserSpeechPlay && (
            <Button
              id="btn-play-browser-speech"
              variant="secondary"
              size="md"
              disabled={charCount === 0 || isLoading}
              onClick={isBrowserSpeaking ? onBrowserSpeechStop : onBrowserSpeechPlay}
              icon={
                isBrowserSpeaking ? (
                  <Square className="w-3.5 h-3.5 fill-current text-[#A8531E]" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#4F5C48]" />
                )
              }
              title="Ouvir leitura preliminar no navegador sem gerar arquivo"
            >
              {isBrowserSpeaking
                ? currentLang === 'pt'
                  ? 'Interromper'
                  : 'Stop Speech'
                : currentLang === 'pt'
                  ? 'Ouvir no Navegador'
                  : 'Browser Speech'}
            </Button>
          )}

          {/* Acção Principal: Sintetizar Áudio Neural com maior peso visual */}
          <Button
            id="btn-generate-tts"
            variant="primary"
            size="md"
            disabled={charCount === 0 || isLoading}
            isLoading={isLoading}
            onClick={onGenerate}
            icon={!isLoading ? <Volume2 className="w-4 h-4" /> : undefined}
          >
            {isLoading
              ? loadingStep || (currentLang === 'pt' ? 'A gerar áudio...' : 'Generating audio...')
              : currentLang === 'pt'
                ? 'Gerar Áudio'
                : 'Generate Audio'}
          </Button>
        </div>
      </div>
    </section>
  );
};
