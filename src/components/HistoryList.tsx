import React from 'react';
import { HistoryItem, TTSResponse, VariationCode } from '../types';
import { getVariation, getVoice } from '../data/languages';
import { History, Play, Download, Trash2, ArrowUpRight } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onPlayItem: (item: HistoryItem) => void;
  onLoadText: (text: string) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onPlayItem,
  onLoadText,
  onDeleteItem,
  onClearHistory,
}) => {
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
      a.download = item.fileName || `audio_${item.variation}_${item.voice}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar MP3 do histórico:', err);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `Há ${Math.floor(diff / 60)} min`;
    return `Há ${Math.floor(diff / 3600)} h`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Histórico de Áudios Gerados ({history.length})
            </h3>
            <p className="text-xs text-slate-500">
              Ouça novamente ou baixe os arquivos .mp3 salvos recentemente
            </p>
          </div>
        </div>

        <button
          id="btn-clear-history"
          type="button"
          onClick={onClearHistory}
          className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
        >
          Limpar histórico
        </button>
      </div>

      <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto pr-1">
        {history.map((item) => {
          const varInfo = getVariation(item.variation as VariationCode);
          const voiceInfo = getVoice(item.voice);

          return (
            <div
              key={item.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-2xl leading-none mt-0.5">{varInfo.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-slate-800">
                      {varInfo.name}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-indigo-700">
                      {voiceInfo.displayName}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-mono">
                      {item.durationSeconds}s
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({formatTimeAgo(item.timestamp)})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-1 max-w-xl">
                    "{item.text}"
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => onPlayItem(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Ouvir este áudio no player principal"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Ouvir</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadMp3(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Baixar arquivo .mp3"
                >
                  <Download className="w-3 h-3" />
                  <span>.MP3</span>
                </button>

                <button
                  type="button"
                  onClick={() => onLoadText(item.text)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                  title="Carregar texto de volta no editor"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Excluir do histórico"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
