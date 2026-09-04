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
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold">
                <Search className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                {t.search.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl">
              {t.search.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {results.length} {isPt ? 'registos encontrados' : 'records found'}
            </span>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.inputPlaceholder}
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Suggestions Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            {t.search.quickTags}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SEARCH_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(chip)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                  query === chip
                    ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-zinc-100">
          <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0 mr-1" />
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {speechStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>{speechStatus}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setSpeechStatus(null);
            }}
            className="text-xs text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
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
              className="bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 shadow-xs hover:shadow-sm p-4 sm:p-5 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {getCategoryIcon(item.category)}
                      <span>{item.categoryLabel}</span>
                    </span>

                    {item.metadataBadges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-500 font-medium">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePlayDirectSpeech(item)}
                    className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                    title="Ouvir descrição por voz"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendToStudio(item.fullSpeechText)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer border border-zinc-200"
                    title="Enviar este conteúdo para o Estúdio de Síntese de Voz"
                  >
                    {isPt ? 'No Estúdio' : 'To Studio'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab(item.targetTab, item.targetParam)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs"
                    title="Abrir aba correspondente com este registo"
                  >
                    <span>{isPt ? 'Abrir' : 'Open'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Snippet text */}
              <p className="text-xs text-zinc-600 bg-zinc-50/70 p-3 rounded-xl border border-zinc-100 font-sans leading-relaxed">
                {item.snippet}
              </p>
            </div>
          );
        })}

        {results.length === 0 && (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-3">
            <Search className="w-8 h-8 text-zinc-300 mx-auto" />
            <h4 className="text-sm font-bold text-zinc-800">
              {t.search.noResults}
            </h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
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
