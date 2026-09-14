import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Table,
  Camera,
  BookOpen,
  FileText,
  Volume2,
  ArrowRight,
  Filter,
  Layers,
  MapPin,
  AlertTriangle,
  User,
  ShieldAlert,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import {
  searchAppDatabase,
  SearchResultCategory,
  SearchResultItem,
  SuggestedCrossing,
} from '../utils/searchEngine';
import { AppViewTab } from './Header';
import { TRANSLATIONS, SupportedLang } from '../data/translations';
import { THESIS_CORE_FACTS } from '../data/thesisScientificData';

interface GlobalSearchEngineViewProps {
  onNavigateToTab: (tab: AppViewTab, param?: string | number) => void;
  onSendToStudio: (text: string, title?: string, questionId?: string) => void;
  currentLang?: SupportedLang;
}

const QUICK_SEARCH_CHIPS = [
  'Ciclone Favio 2007',
  `${THESIS_CORE_FACTS.accumulatedLossesTonnes.toLocaleString('pt-MZ')} t perdidas`,
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
  'Hamed-Rao Mann-Kendall',
  'CHIRPS v2.0',
];

export const GlobalSearchEngineView: React.FC<GlobalSearchEngineViewProps> = ({
  onNavigateToTab,
  onSendToStudio,
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';
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
      onSendToStudio(item.fullSpeechText, item.title);
    }
  };

  const handleSendToStudioClick = (item: SearchResultItem) => {
    const qId =
      item.category === 'defesa_banca' && typeof item.targetParam === 'string'
        ? item.targetParam
        : undefined;
    onSendToStudio(item.fullSpeechText, item.title, qId);
  };

  const handleCrossingClick = (crossing: SuggestedCrossing) => {
    onNavigateToTab(crossing.targetTab, crossing.targetParam);
  };

  const categoriesConfig: Array<{ id: SearchResultCategory; label: string; countLabel?: string }> = [
    { id: 'todos', label: isPt ? 'Todos os Registos' : 'All Records' },
    { id: 'series_anos', label: isPt ? 'Séries e Anos (1994–2024)' : 'Series & Years (1994–2024)' },
    { id: 'choques', label: isPt ? 'Choques Climáticos e Perdas' : 'Climate Shocks & Losses' },
    { id: 'fotos_campo', label: isPt ? 'Registos Fotográficos' : 'Field Photos' },
    { id: 'inqueritos', label: isPt ? 'Inquéritos e Produtores' : 'Surveys & Farmers' },
    { id: 'defesa_banca', label: isPt ? 'Arguição Oral e Banca' : 'Oral Defense & Jury' },
    { id: 'metodologia', label: isPt ? 'Metodologia e Triangulação' : 'Methodology & Triangulation' },
  ];

  return (
    <div className="space-y-6 text-[#1A2417] font-sans">
      {/* 1. DOMINANT EDITORIAL SEARCH BOX & FILTER CONSOLE */}
      <div className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#D9CDAF] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F5C48] font-semibold block">
              {isPt ? 'Índice Analítico e Remissivo da Dissertação' : 'Dissertation Analytical & Cross-Index'}
            </span>
            <h2 className="text-base sm:text-lg font-bold font-display text-[#1A2417] mt-0.5">
              {isPt ? 'Pesquisa e Cruzamento Sistemático de Evidência' : 'Systematic Search & Cross-Evidence Index'}
            </h2>
          </div>

          <div className="text-xs font-mono text-[#4F5C48]">
            <span className="font-bold text-[#1A2417]">{results.length}</span>{' '}
            <span>{isPt ? 'ocorrências indexadas' : 'indexed occurrences'}</span>
          </div>
        </div>

        {/* Search Input Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#4F5C48] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isPt
                ? 'Pesquisar anos (ex: 2007, 2016), termos (ex: Favio, CHIRPS, tubérculo, enxada), produtores ou perguntas de banca...'
                : 'Search years (e.g., 2007, 2016), concepts (e.g., Favio, CHIRPS, tuber, hoe), farmers or jury questions...'
            }
            className="w-full pl-10 pr-10 py-2.5 rounded-[2px] bg-[#FCFAF6] border border-[#D9CDAF] text-[#1A2417] placeholder:text-[#4F5C48]/60 text-xs sm:text-sm focus:outline-hidden focus:border-[#354D2C] transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4F5C48] hover:text-[#1A2417] rounded cursor-pointer"
              aria-label={isPt ? 'Limpar pesquisa' : 'Clear search'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold block">
            {isPt ? 'Termos e Nós Relevantes para Cruzamento:' : 'Relevant Terms and Nodes for Cross-Referencing:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SEARCH_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(chip)}
                className={`px-2.5 py-1 rounded-[2px] text-xs transition-colors cursor-pointer border ${
                  query === chip
                    ? 'bg-[#1A2417] text-[#FCFAF6] border-[#1A2417] font-semibold'
                    : 'bg-[#F4EFE6]/70 hover:bg-[#EAE2D2] text-[#1A2417] border-[#D9CDAF]/80'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters Bar (Editorial Tabs) */}
        <div className="pt-3 border-t border-[#D9CDAF]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold block mb-2">
            {isPt ? 'Categorias de Evidência Científica:' : 'Scientific Evidence Categories:'}
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categoriesConfig.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-[2px] text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-[#1A2417] text-[#FCFAF6] border-[#1A2417]'
                    : 'bg-[#FCFAF6] text-[#4F5C48] hover:text-[#1A2417] border-[#D9CDAF] hover:bg-[#EAE2D2]/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Speech Playback Feedback Banner if active */}
      {speechStatus && (
        <div className="p-3 bg-[#EAE2D2]/40 border-l-4 border-[#354D2C] border-y border-r border-[#D9CDAF] rounded-[2px] text-xs text-[#1A2417] flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#354D2C] animate-pulse" />
            <span className="font-medium">{speechStatus}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setSpeechStatus(null);
            }}
            className="text-xs text-[#4F5C48] hover:text-[#1A2417] underline cursor-pointer"
          >
            {isPt ? 'Interromper' : 'Stop'}
          </button>
        </div>
      )}

      {/* 2. DIFFERENTIATED SEARCH RESULTS */}
      <div className="space-y-4">
        {results.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] overflow-hidden text-[#1A2417] hover:border-[#4F5C48] transition-colors"
            >
              {/* Common Header: Location in Dissertation & Evidence Type */}
              <div className="px-4 py-2.5 bg-[#F4EFE6] border-b border-[#D9CDAF] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#EAE2D2] text-[#1A2417] font-mono text-[10px] uppercase font-semibold border border-[#D9CDAF]/60">
                    {item.evidenceTypeLabel}
                  </span>
                  <span className="font-mono text-[11px] text-[#4F5C48] font-medium">
                    {item.dissertationLocation}
                  </span>
                </div>

                {item.matchReason && (
                  <span className="text-[10px] text-[#4F5C48] font-mono italic">
                    {item.matchReason}
                  </span>
                )}
              </div>

              {/* Differentiated Body by Evidence Type */}
              <div className="p-4 sm:p-5 space-y-3.5">
                {/* A. TABULAR / TIME SERIES EVIDENCE */}
                {item.tabularData && (
                  <div className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold font-display text-[#1A2417]">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#4F5C48]">
                          {item.occurrenceContext}
                        </p>
                      </div>
                      <span className={`self-start sm:self-auto px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-semibold border ${
                        item.tabularData.status === 'OBSERVADO (SDAE)'
                          ? 'bg-[#354D2C]/10 text-[#354D2C] border-[#354D2C]/30'
                          : 'bg-[#A8531E]/10 text-[#A8531E] border-[#A8531E]/30'
                      }`}>
                        {item.tabularData.status}
                      </span>
                    </div>

                    {/* Tabular Metric Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#F4EFE6]/70 p-3 rounded-[2px] border border-[#D9CDAF]/70 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-[#4F5C48] block uppercase">
                          {isPt ? 'Produção Anual' : 'Annual Production'}
                        </span>
                        <span className="font-mono font-bold text-sm text-[#1A2417]">
                          {item.tabularData.productionTonnes.toLocaleString('pt-MZ')} t
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#4F5C48] block uppercase">
                          {isPt ? 'Área Efectiva' : 'Effective Area'}
                        </span>
                        <span className="font-mono font-semibold text-sm text-[#1A2417]">
                          {item.tabularData.areaHa.toLocaleString('pt-MZ')} ha
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#4F5C48] block uppercase">
                          {isPt ? 'Rendimento' : 'Yield'}
                        </span>
                        <span className="font-mono font-semibold text-sm text-[#354D2C]">
                          {item.tabularData.yieldTonnesHa.toFixed(2)} t/ha
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#4F5C48] block uppercase">
                          {isPt ? 'Variação Relativa' : 'Annual Var'}
                        </span>
                        <span className="font-mono font-semibold text-sm text-[#1A2417]">
                          {item.tabularData.annualVar !== null && item.tabularData.annualVar !== undefined
                            ? item.tabularData.annualVar > 0
                              ? `+${item.tabularData.annualVar}%`
                              : `${item.tabularData.annualVar}%`
                            : 'Ano Base'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* B. CLIMATE SHOCK EVIDENCE */}
                {item.shockData && (
                  <div className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold font-display text-[#1A2417]">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#4F5C48]">
                          {item.occurrenceContext}
                        </p>
                      </div>
                      <span className="self-start sm:self-auto px-2 py-0.5 rounded-[2px] bg-[#A8531E]/10 text-[#A8531E] font-mono text-[10px] font-semibold border border-[#A8531E]/30">
                        -{item.shockData.lossPercent.toFixed(1)}% {isPt ? 'QUEBRA' : 'LOSS'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#F4EFE6]/70 p-3 rounded-[2px] border border-[#D9CDAF]/70 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-[#4F5C48] block uppercase">
                          {isPt ? 'Perda Absoluta' : 'Absolute Loss'}
                        </span>
                        <span className="font-mono font-bold text-sm text-[#A8531E]">
                          -{item.shockData.lossTonnes.toLocaleString('pt-MZ')} t
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#4F5C48] block uppercase">
                          {isPt ? 'Produção Tendencial' : 'Trend Potential'}
                        </span>
                        <span className="font-mono font-semibold text-sm text-[#1A2417]">
                          {item.shockData.trendTonnes.toLocaleString('pt-MZ')} t
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#4F5C48] block uppercase">
                          {isPt ? 'Realizado' : 'Actual Harvest'}
                        </span>
                        <span className="font-mono font-semibold text-sm text-[#354D2C]">
                          {item.shockData.actualTonnes.toLocaleString('pt-MZ')} t
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#4F5C48] block uppercase">
                          {isPt ? 'Fonte de Validação' : 'Source'}
                        </span>
                        <span className="font-mono text-xs text-[#4F5C48] truncate block" title={item.shockData.source}>
                          {item.shockData.source}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* C. FIELD PHOTO EVIDENCE */}
                {item.photoReference && (
                  <div className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold font-display text-[#1A2417]">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#4F5C48] mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#A8531E]" />
                            <span>{item.photoReference.location}</span>
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">{item.photoReference.coords}</span>
                        </div>
                      </div>
                      <span className="self-start sm:self-auto px-2 py-0.5 rounded-[2px] bg-[#EAE2D2] text-[#1A2417] font-mono text-[10px] border border-[#D9CDAF]">
                        {item.photoReference.category}
                      </span>
                    </div>

                    <div className="p-3 bg-[#EAE2D2]/30 border-l-2 border-[#354D2C] rounded-[2px] text-xs space-y-1">
                      <span className="text-[10px] font-mono text-[#4F5C48] uppercase tracking-wider block">
                        {isPt ? 'Arquivo Original Documentado:' : 'Documented Original File:'} <span className="font-semibold text-[#1A2417]">{item.photoReference.originalFileName}</span>
                      </span>
                      <p className="text-xs text-[#1A2417] leading-relaxed">
                        {item.snippet}
                      </p>
                    </div>
                  </div>
                )}

                {/* D. FIELD INTERVIEW / FARMER EVIDENCE */}
                {item.interviewRecord && (
                  <div className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold font-display text-[#1A2417]">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#4F5C48] mt-0.5">
                          <span className="font-semibold text-[#354D2C]">{item.interviewRecord.role}</span>
                          <span>•</span>
                          <span>{item.interviewRecord.locality}, Quissico</span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">{isPt ? `Cultiva há ${item.interviewRecord.farmingYears}` : `Farming for ${item.interviewRecord.farmingYears}`}</span>
                        </div>
                      </div>
                      <span className="self-start sm:self-auto px-2 py-0.5 rounded-[2px] bg-[#F4EFE6] text-[#4F5C48] font-mono text-[10px] border border-[#D9CDAF]">
                        Folha #{item.interviewRecord.pageNumber}
                      </span>
                    </div>

                    <div className="p-3 bg-[#F4EFE6]/70 border border-[#D9CDAF]/70 rounded-[2px] text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
                        {isPt ? 'Variedades Declaradas pelo Informante:' : 'Reported Cassava Varieties:'} <span className="font-semibold text-[#1A2417]">{item.interviewRecord.varieties}</span>
                      </span>
                      <p className="text-xs text-[#1A2417] leading-relaxed">
                        <span className="font-medium text-[#4F5C48]">{isPt ? 'Dinâmica da Colheita:' : 'Harvest Dynamic:'}</span> {item.interviewRecord.trend} ({item.interviewRecord.causes})
                      </p>
                    </div>
                  </div>
                )}

                {/* E. DEFENSE QUESTION & JURY EVIDENCE */}
                {item.defenseQuestion && (
                  <div className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold font-display text-[#1A2417]">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#4F5C48]">
                          {item.subtitle}
                        </p>
                      </div>
                      <span className="self-start sm:self-auto px-2 py-0.5 rounded-[2px] bg-[#EAE2D2] text-[#1A2417] font-mono text-[10px] border border-[#D9CDAF]">
                        {isPt ? 'Comissão Examinadora' : 'Defense Committee'}
                      </span>
                    </div>

                    <blockquote className="pl-3.5 py-1.5 border-l-2 border-[#1A2417] bg-[#F4EFE6]/50 text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold block">
                        {isPt ? 'Formulação do Examinador:' : 'Examiner Inquiry:'}
                      </span>
                      <p className="text-sm font-serif italic text-[#1A2417] leading-relaxed">
                        “{item.defenseQuestion.examinerQuestion}”
                      </p>
                    </blockquote>

                    <p className="text-xs text-[#4F5C48] line-clamp-2 leading-relaxed">
                      <span className="font-medium text-[#1A2417]">{isPt ? 'Excerto da resposta:' : 'Response excerpt:'}</span> {item.defenseQuestion.candidateExcerpt}
                    </p>
                  </div>
                )}

                {/* F. GENERAL / METHODOLOGICAL EVIDENCE */}
                {!item.tabularData && !item.shockData && !item.photoReference && !item.interviewRecord && !item.defenseQuestion && (
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold font-display text-[#1A2417]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#4F5C48]">
                      {item.subtitle}
                    </p>
                    <div className="p-3 bg-[#F4EFE6]/60 border-l-2 border-[#354D2C] rounded-[2px] text-xs text-[#1A2417] leading-relaxed">
                      {item.snippet}
                    </div>
                  </div>
                )}

                {/* Badges strip */}
                {item.metadataBadges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.metadataBadges.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-2 py-0.5 rounded-[2px] bg-[#EAE2D2]/50 text-[#4F5C48] font-mono text-[10px] border border-[#D9CDAF]/50"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                {/* 3. SUGGESTED CROSS-REFERENCES ("Cruzar com...") */}
                {item.suggestedCrossings && item.suggestedCrossings.length > 0 && (
                  <div className="pt-2 border-t border-[#D9CDAF]/60 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] font-semibold flex items-center gap-1 shrink-0">
                      <Layers className="w-3 h-3 text-[#354D2C]" />
                      <span>{isPt ? 'Cruzar com:' : 'Cross with:'}</span>
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                      {item.suggestedCrossings.map((cross, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleCrossingClick(cross)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] bg-[#F4EFE6] hover:bg-[#EAE2D2] text-[#1A2417] border border-[#D9CDAF] text-xs font-medium cursor-pointer transition-colors"
                          title={cross.relationNote}
                        >
                          <span>{cross.label}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-[#354D2C]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. IMMEDIATE ACTIONS BAR */}
                <div className="pt-3 border-t border-[#D9CDAF] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePlayDirectSpeech(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-[#D9CDAF] bg-[#FCFAF6] text-[#1A2417] hover:bg-[#EAE2D2] text-xs font-medium cursor-pointer transition-colors"
                      title={isPt ? 'Ouvir síntese por voz' : 'Listen to speech'}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#354D2C]" />
                      <span>{isPt ? 'Ouvir' : 'Listen'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendToStudioClick(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] border border-[#D9CDAF] bg-[#FCFAF6] text-[#1A2417] hover:bg-[#EAE2D2] text-xs font-medium cursor-pointer transition-colors"
                      title={isPt ? 'Carregar este conteúdo para ensaio no Estúdio' : 'Load into Studio for oral rehearsal'}
                    >
                      <FileText className="w-3.5 h-3.5 text-[#A8531E]" />
                      <span>{isPt ? 'Carregar no Estúdio' : 'To Studio'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab(item.targetTab, item.targetParam)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] bg-[#1A2417] text-[#FCFAF6] hover:bg-[#354D2C] text-xs font-medium cursor-pointer transition-colors shadow-xs"
                    title={isPt ? `Abrir registo na aba ${item.targetTab.toUpperCase()}` : `Open in tab ${item.targetTab.toUpperCase()}`}
                  >
                    <span>{isPt ? 'Ver no Contexto' : 'View in Context'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D9CDAF]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty Search Feedback */}
        {results.length === 0 && (
          <div className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-12 text-center space-y-3">
            <Search className="w-8 h-8 text-[#D9CDAF] mx-auto" />
            <h4 className="text-sm font-bold text-[#1A2417] font-display">
              {isPt ? 'Nenhuma ocorrência localizada para o critério indicado' : 'No occurrences matched the given criteria'}
            </h4>
            <p className="text-xs text-[#4F5C48] max-w-md mx-auto leading-relaxed">
              {isPt
                ? 'Tente termos da série (ex: "Favio", "2016", "Mann-Kendall"), povoados (ex: "Quissico", "Canetane"), ou clique num dos termos recomendados acima.'
                : 'Try terms like "Favio", "2016", "Mann-Kendall", villages like "Quissico", "Canetane", or click on the suggested chips above.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
