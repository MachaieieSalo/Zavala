import React, { useState } from 'react';
import { HistoryItem, VariationCode } from '../types';
import { getVariation, getVoice } from '../data/languages';
import { Play, Download, Trash2, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './common/Button';
import { SupportedLang } from '../data/translations';

interface HistoryListProps {
  history: HistoryItem[];
  onPlayItem: (item: HistoryItem) => void;
  onLoadText: (text: string) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  currentLang?: SupportedLang;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onPlayItem,
  onLoadText,
  onDeleteItem,
  onClearHistory,
  currentLang = 'pt',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPt = currentLang === 'pt';

  if (history.length === 0) {
    return null;
  }

  const handleDownloadMp3 = (item: HistoryItem) => {
    try {
      const binaryString = window.atob(item.audioBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.fileName || `ensaio_${item.variation}_${item.voice}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao descarregar MP3 do histórico:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(isPt ? 'pt-MZ' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Se não estiver expandido, mostra até 3 itens mais recentes; se expandido, mostra todos
  const displayedItems = isExpanded ? history : history.slice(0, 3);

  return (
    <section
      aria-label={isPt ? 'Histórico de ensaios gravados' : 'Recorded rehearsals history'}
      className="pt-4 border-t border-[#D9CDAF] space-y-2 font-sans"
    >
      {/* Header editorial simples */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div className="flex items-baseline gap-2">
          <h3 className="text-xs font-semibold text-[#1A2417] uppercase tracking-wider">
            {isPt ? 'Histórico de Ensaios' : 'Rehearsal History'}
          </h3>
          <span className="text-[11px] font-mono text-[#4F5C48]">
            ({history.length} {history.length === 1 ? (isPt ? 'gravação' : 'recording') : (isPt ? 'gravações' : 'recordings')})
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {history.length > 3 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4F5C48] hover:text-[#1A2417] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
            >
              <span>{isExpanded ? (isPt ? 'Ver menos' : 'Show less') : (isPt ? 'Ver todos' : 'Show all')}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <button
            id="btn-clear-history"
            type="button"
            onClick={onClearHistory}
            className="text-[11px] font-medium text-[#4F5C48] hover:text-[#A8531E] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
          >
            {isPt ? 'Limpar histórico' : 'Clear history'}
          </button>
        </div>
      </div>

      {/* Lista contínua com divisores de 1px ou mensagem de estado vazio */}
      {history.length === 0 ? (
        <div className="py-6 px-4 text-center text-xs text-[#4F5C48] bg-[#FCFAF6] border border-dashed border-[#D9CDAF] rounded-[3px]">
          {isPt
            ? 'Nenhum ensaio vocal gravado ainda. Sintetize um áudio para guardar o registo do seu ensaio.'
            : 'No voice rehearsals recorded yet. Synthesize an audio to save your rehearsal record.'}
        </div>
      ) : (
        <div className="divide-y divide-[#D9CDAF]/80 border-y border-[#D9CDAF]/80">
          {displayedItems.map((item) => {
            const varInfo = getVariation(item.variation as VariationCode);
            const voiceInfo = getVoice(item.voice);

            return (
              <div
                key={item.id}
              className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#FCFAF6] transition-colors text-xs"
            >
              {/* Informações da gravação */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2 text-[11px] text-[#4F5C48]">
                  <span className="font-mono text-[#1A2417]">{formatDate(item.timestamp)}</span>
                  <span className="text-[#D9CDAF]">·</span>
                  <span className="font-semibold text-[#1A2417]">{varInfo.name}</span>
                  <span className="text-[#D9CDAF]">·</span>
                  <span>{voiceInfo.displayName}</span>
                  <span className="text-[#D9CDAF]">·</span>
                  <span className="font-mono">{item.durationSeconds}s</span>
                </div>
                <p className="text-xs text-[#1A2417] line-clamp-1 italic text-[#4F5C48]">
                  "{item.text}"
                </p>
              </div>

              {/* Ações discretas em linha */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onPlayItem(item)}
                  icon={<Play className="w-3 h-3 fill-current" />}
                  title={isPt ? 'Ouvir no reprodutor principal' : 'Listen in main player'}
                >
                  {isPt ? 'Ouvir' : 'Play'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadMp3(item)}
                  icon={<Download className="w-3 h-3" />}
                  title={isPt ? 'Descarregar arquivo MP3' : 'Download MP3 file'}
                >
                  .MP3
                </Button>

                <button
                  type="button"
                  onClick={() => onLoadText(item.text)}
                  className="p-1 text-[#4F5C48] hover:text-[#1A2417] rounded-[2px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
                  title={isPt ? 'Recarregar este texto no manuscrito' : 'Reload text into manuscript'}
                  aria-label={isPt ? 'Recarregar texto no manuscrito' : 'Reload text into manuscript'}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1 text-[#4F5C48] hover:text-[#A8531E] rounded-[2px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
                  title={isPt ? 'Excluir esta gravação' : 'Delete this recording'}
                  aria-label={isPt ? 'Excluir esta gravação' : 'Delete this recording'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
};
