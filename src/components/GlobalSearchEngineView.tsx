import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  Table,
  Camera,
  BookOpen,
  FileText,
  Volume2,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import {
  searchAppDatabase,
  SearchResultCategory,
  SearchResultItem,
} from '../utils/searchEngine';
import { AppViewTab } from './Header';
import { TRANSLATIONS, SupportedLang } from '../data/translations';

interface GlobalSearchEngineViewProps {
  onNavigateToTab: (tab: AppViewTab, param?: string | number) => void;
  onSendToStudio: (text: string) => void;
  currentLang?: SupportedLang;
}

const QUICK_SEARCH_CHIPS = [
  'Ciclone Favio 2007',
  '547.224 t perdidas',
  'Seca 2016',
  'Tubérculo na cova',
  'Yolanda Tamele',
  'Adebayo 2023',
  'SDAE Zavala',
  'Enxada tradicional',
  'Cheias 2000',
  'SUSTENTA Fase 2',
  'Mahumane',
  'Quissico',
];

export const GlobalSearchEngineView: React.FC<GlobalSearchEngineViewProps> = ({
  onNavigateToTab,
  onSendToStudio,
  currentLang = 'pt',
}) => {
  const t = TRANSLATIONS[currentLang];
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchResultCategory>('todos');
  const [speechStatus, setSpeechStatus] = useState<string | null>(null);

  const results = useMemo(() => {
    return searchAppDatabase(query, selectedCategory);
  }, [query, selectedCategory]);

  const handlePlayDirectSpeech = (item: SearchResultItem) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(item.fullSpeechText);
      utterance.lang = currentLang === 'en' ? 'en-US' : 'pt-PT';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setSpeechStatus(`A reproduzir: ${item.title}`);
      utterance.onend = () => setSpeechStatus(null);
      utterance.onerror = () => setSpeechStatus(null);
      window.speechSynthesis.speak(utterance);
    } else {
      onSendToStudio(item.fullSpeechText);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'dados':
        return <Table className="w-4 h-4 text-emerald-600" />;
      case 'campo':
        return <Camera className="w-4 h-4 text-amber-600" />;
      case 'defesa':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'metodologia':
        return <FileText className="w-4 h-4 text-sky-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-zinc-600" />;
    }
  };

  const isPt = currentLang === 'pt';

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-[#FFFDF8] rounded-md border border-[#DDD0B4] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#1F2A1A] text-[#F2E9D8] flex items-center justify-center font-bold">
                <Search className="w-4 h-4 text-[#F2E9D8]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#1F2A1A] font-display">
                {t.search.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5C6B52] mt-1 max-w-3xl">
              {t.search.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#5B7B4F]/15 text-[#3F5837] border border-[#5B7B4F]/30">
              {results.length} {isPt ? 'registos encontrados' : 'records found'}
            </span>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5C6B52] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.inputPlaceholder}
            className="w-full pl-10 pr-10 py-2.5 rounded-md bg-[#FFFDF8] border border-[#DDD0B4] text-[#1F2A1A] placeholder:text-[#5C6B52]/70 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#5B7B4F] focus:border-[#5B7B4F] transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5C6B52] hover:text-[#1F2A1A] rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Suggestions Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold text-[#1F2A1A]">
            {t.search.quickTags}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SEARCH_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(chip)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer border ${
                  query === chip
                    ? 'bg-[#1F2A1A] text-white border-[#1F2A1A] font-semibold'
                    : 'bg-[#FFFDF8] hover:bg-[#F2E9D8] text-[#1F2A1A] border-[#DDD0B4]'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-[#DDD0B4]">
          <Filter className="w-3.5 h-3.5 text-[#5C6B52] shrink-0 mr-1" />
          {[
            { id: 'todos', label: t.search.allResults },
            { id: 'dados', label: t.search.dataResults },
            { id: 'campo', label: t.search.fieldResults },
            { id: 'defesa', label: t.search.defenseResults },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as SearchResultCategory)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#1F2A1A] text-white border-[#1F2A1A]'
                  : 'bg-[#FFFDF8] text-[#5C6B52] hover:text-[#1F2A1A] border-[#DDD0B4] hover:bg-[#F2E9D8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {speechStatus && (
        <div className="p-3 bg-[#5B7B4F]/10 border border-[#5B7B4F]/30 rounded-md text-xs font-semibold text-[#3F5837] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#5B7B4F] animate-pulse" />
            <span>{speechStatus}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setSpeechStatus(null);
            }}
            className="text-xs text-[#3F5837] hover:text-[#1F2A1A] underline cursor-pointer"
          >
            {isPt ? 'Parar' : 'Stop'}
          </button>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-3">
        {results.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-[#FFFDF8] rounded-md border border-[#DDD0B4] p-4 sm:p-5 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-[#F2E9D8] text-[#1F2A1A] border border-[#DDD0B4]">
                      {getCategoryIcon(item.category)}
                      <span>{item.categoryLabel}</span>
                    </span>

                    {item.metadataBadges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#F2E9D8]/40 text-[#5C6B52] border border-[#DDD0B4]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#1F2A1A] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#5C6B52] font-medium">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePlayDirectSpeech(item)}
                    className="p-2 text-[#5C6B52] hover:text-[#1F2A1A] hover:bg-[#F2E9D8] rounded-md transition-colors cursor-pointer"
                    title="Ouvir descrição por voz"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendToStudio(item.fullSpeechText)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-[#1F2A1A] hover:text-[#1F2A1A] bg-[#FFFDF8] hover:bg-[#F2E9D8] rounded-md transition-colors cursor-pointer border border-[#DDD0B4]"
                    title="Enviar este conteúdo para o Estúdio de Síntese de Voz"
                  >
                    {isPt ? 'No Estúdio' : 'To Studio'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab(item.targetTab, item.targetParam)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold text-white bg-[#1F2A1A] hover:bg-[#3F5837] transition-colors cursor-pointer"
                    title="Abrir aba correspondente com este registo"
                  >
                    <span>{isPt ? 'Abrir' : 'Open'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Snippet text */}
              <p className="text-xs text-[#1F2A1A] bg-[#F2E9D8]/20 p-3 rounded-sm border-l-2 border-[#5B7B4F] border-y border-r border-[#DDD0B4] font-sans leading-relaxed">
                {item.snippet}
              </p>
            </div>
          );
        })}

        {results.length === 0 && (
          <div className="bg-[#FFFDF8] rounded-md border border-[#DDD0B4] p-12 text-center space-y-3">
            <Search className="w-8 h-8 text-[#DDD0B4] mx-auto" />
            <h4 className="text-sm font-bold text-[#1F2A1A]">
              {t.search.noResults}
            </h4>
            <p className="text-xs text-[#5C6B52] max-w-sm mx-auto">
              {isPt
                ? 'Tente termos como "Favio", "2016", "Mann-Kendall", "estacas", "tubérculo" ou use as palavras-chave sugeridas acima.'
                : 'Try terms like "Favio", "2016", "Mann-Kendall", "cuttings", "tuber", or use suggested quick search chips.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
