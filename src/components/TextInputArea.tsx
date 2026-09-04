import React from 'react';
import {
  Type,
  Clipboard,
  Trash2,
  Sparkles,
  Loader2,
  Clock,
  BookOpen,
  Volume2,
  Square,
  FileText,
} from 'lucide-react';
import { getAllDissertationText } from '../data/dissertationText';
import { TRANSLATIONS, SupportedLang } from '../data/translations';

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
  // Estimated reading duration: ~140 words per minute
  const estimatedSeconds = Math.max(1, Math.round((wordCount / 140) * 60));
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
      // Fallback
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

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-4 sm:p-5 transition-all space-y-3">
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center font-bold">
            <Type className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight flex items-center gap-2">
              <span>{t.studio.title}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                {currentLang === 'pt' ? 'Até' : 'Up to'} {maxChars.toLocaleString('pt-BR')} chars
              </span>
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="btn-load-dissertation"
            type="button"
            onClick={handleLoadDissertation}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
              isDissertationLoaded
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 border-zinc-200'
            }`}
            title="Carregar texto integral da dissertação de Zavala"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
            <span>{currentLang === 'pt' ? 'Tese Integral (~60 Perguntas)' : 'Full Thesis (~60 Questions)'}</span>
          </button>

          <button
            id="btn-paste-clipboard"
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors border border-zinc-200 cursor-pointer"
            title="Colar texto da área de transferência"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentLang === 'pt' ? 'Colar' : 'Paste'}</span>
          </button>

          {text.length > 0 && (
            <button
              id="btn-clear-text"
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-lg transition-colors border border-rose-200 cursor-pointer"
              title="Limpar campo de texto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.studio.btnClear}</span>
            </button>
          )}
        </div>
      </div>

      {/* Info banner for long text */}
      {charCount > 1500 && (
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>{currentLang === 'pt' ? 'Documento Extenso Detectado:' : 'Extended Document Detected:'}</strong> {charCount.toLocaleString('pt-BR')} {t.studio.charCounter} ({wordCount} {currentLang === 'pt' ? 'palavras' : 'words'}).
            </span>
          </div>
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="tts-textarea-input"
          value={text}
          onChange={(e) => onChangeText(e.target.value.slice(0, maxChars))}
          placeholder={t.studio.inputPlaceholder}
          rows={8}
          disabled={isLoading}
          className="w-full p-4 rounded-xl border border-zinc-200 focus:border-zinc-400 focus:outline-hidden transition-all text-zinc-900 placeholder-zinc-400 text-sm leading-relaxed resize-y min-h-[180px] font-normal"
        />
      </div>

      {/* Footer stats & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-100">
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <span className="font-mono">
            <strong className={`font-bold ${charCount > maxChars * 0.9 ? 'text-amber-600' : 'text-zinc-800'}`}>
              {charCount.toLocaleString('pt-BR')}
            </strong>{' '}
            / {maxChars.toLocaleString('pt-BR')} {t.studio.charCounter}
          </span>
          <span className="text-zinc-300">•</span>
          <span className="font-mono">
            <strong className="text-zinc-800">{wordCount.toLocaleString('pt-BR')}</strong> {currentLang === 'pt' ? 'palavras' : 'words'}
          </span>
          {wordCount > 0 && (
            <>
              <span className="text-zinc-300">•</span>
              <span className="flex items-center gap-1 text-zinc-500">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span>
                  ~{estimatedMinutes > 0 ? `${estimatedMinutes}m ${remainingSeconds}s` : `${estimatedSeconds}s`}
                </span>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Quick browser audio preview */}
          {onBrowserSpeechPlay && (
            <button
              type="button"
              disabled={charCount === 0}
              onClick={isBrowserSpeaking ? onBrowserSpeechStop : onBrowserSpeechPlay}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs border transition-all cursor-pointer ${
                isBrowserSpeaking
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 border-zinc-200'
              }`}
              title="Ouvir áudio instantâneo pelo navegador"
            >
              {isBrowserSpeaking ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{currentLang === 'pt' ? 'Parar Voz' : 'Stop Audio'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{t.studio.btnPlayBrowser}</span>
                </>
              )}
            </button>
          )}

          {/* Studio MP3 Generation */}
          <button
            id="btn-generate-tts"
            type="button"
            disabled={isLoading || charCount === 0}
            onClick={onGenerate}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-xs cursor-pointer ${
              isLoading || charCount === 0
                ? 'bg-zinc-300 cursor-not-allowed text-zinc-500'
                : 'bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{loadingStep || t.studio.btnSynthesizing}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{t.studio.btnSynthesize}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
