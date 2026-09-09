import React, { useState, useMemo } from 'react';
import { FIELD_INTERVIEWS, FieldInterview } from '../../data/fieldInterviews';
import { FieldInterviewDetailModal } from './FieldInterviewDetailModal';
import {
  Search,
  Filter,
  Users,
  MapPin,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  AlertCircle,
  FileText,
  Volume2,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { SupportedLang } from '../../data/translations';

interface FieldInterviewsViewProps {
  onSendToStudio: (text: string, title: string) => void;
  onPlayQuickSpeech: (text: string) => void;
  onSelectCrossEvidenceTheme?: (crossId: string) => void;
  currentLang?: SupportedLang;
}

export const FieldInterviewsView: React.FC<FieldInterviewsViewProps> = ({
  onSendToStudio,
  onPlayQuickSpeech,
  onSelectCrossEvidenceTheme,
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedTrend, setSelectedTrend] = useState('ALL');
  const [selectedInterview, setSelectedInterview] = useState<FieldInterview | null>(null);

  // Extract unique localities
  const localities = useMemo(() => {
    const locs = Array.from(new Set(FIELD_INTERVIEWS.map((i) => i.locality))).filter(Boolean);
    return locs.sort();
  }, []);

  // Filtered dataset
  const filteredInterviews = useMemo(() => {
    return FIELD_INTERVIEWS.filter((item) => {
      // Locality filter
      if (selectedLocality !== 'ALL' && item.locality !== selectedLocality) {
        return false;
      }

      // Role filter
      if (selectedRole !== 'ALL') {
        if (selectedRole === 'LEADER' && !item.isLeaderQuestionnaire) return false;
        if (selectedRole === 'FEMALE') {
          const r = item.role.toLowerCase();
          if (!r.includes('produtora') && !r.includes('agricultora') && !r.includes('camponesa')) return false;
        }
        if (selectedRole === 'MALE') {
          const r = item.role.toLowerCase();
          if (!r.includes('produtor') && !r.includes('agricultor') && !r.includes('camponês')) return false;
        }
      }

      // Trend filter
      if (selectedTrend !== 'ALL') {
        const trendLower = item.productionTrend.toLowerCase();
        if (selectedTrend === 'DECREASED' && !trendLower.includes('diminuiu')) return false;
        if (selectedTrend === 'INCREASED' && !trendLower.includes('aumentou')) return false;
        if (selectedTrend === 'STABLE' && !trendLower.includes('igual') && !trendLower.includes('estável')) return false;
      }

      // Search text filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesLoc = item.locality.toLowerCase().includes(q);
        const matchesVar = item.rawVarietiesText.toLowerCase().includes(q) || item.cassavaVarieties.some((v) => v.toLowerCase().includes(q));
        const matchesPests = item.pestsAndDiseases.toLowerCase().includes(q);
        const matchesCauses = item.trendCauses.toLowerCase().includes(q);
        const matchesSupport = item.institutionalSupport.toLowerCase().includes(q);
        const matchesNotes = item.notesOrAnomalies?.toLowerCase().includes(q);
        return matchesName || matchesLoc || matchesVar || matchesPests || matchesCauses || matchesSupport || matchesNotes;
      }

      return true;
    });
  }, [searchQuery, selectedLocality, selectedRole, selectedTrend]);

  // High-level statistics
  const stats = useMemo(() => {
    const total = FIELD_INTERVIEWS.length;
    const femaleCount = FIELD_INTERVIEWS.filter((i) => {
      const r = i.role.toLowerCase();
      return r.includes('produtora') || r.includes('agricultora') || r.includes('camponesa');
    }).length;
    const maleCount = FIELD_INTERVIEWS.filter((i) => {
      const r = i.role.toLowerCase();
      return r.includes('produtor') || r.includes('agricultor') || r.includes('camponês');
    }).length;
    const leadersCount = FIELD_INTERVIEWS.filter((i) => i.isLeaderQuestionnaire).length;
    const decreasedCount = FIELD_INTERVIEWS.filter((i) => i.productionTrend.toLowerCase().includes('diminuiu')).length;

    return { total, femaleCount, maleCount, leadersCount, decreasedCount };
  }, []);

  const hasActiveFilters = searchQuery !== '' || selectedLocality !== 'ALL' || selectedRole !== 'ALL' || selectedTrend !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocality('ALL');
    setSelectedRole('ALL');
    setSelectedTrend('ALL');
  };

  return (
    <div className="space-y-6">
      {/* 1. ACADEMIC METRICS BAR */}
      <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 sm:p-5 text-[#1A2417]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9CDAF]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#4F5C48] font-semibold block">
              {isPt ? 'Metodologia Empírica de Investigação' : 'Empirical Research Methodology'}
            </span>
            <h3 className="text-base sm:text-lg font-bold font-display text-[#1A2417]">
              {isPt ? 'Inquéritos e Entrevistas de Campo (Zavala)' : 'Field Surveys and Interviews (Zavala)'}
            </h3>
          </div>
          <div className="text-xs text-[#4F5C48] sm:text-right font-mono">
            <span>{isPt ? 'Amostra Fiel das 51 Páginas do Caderno Original' : 'Faithful Sample of 51 Pages of Original Notebook'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 text-xs">
          <div className="p-2.5 bg-[#F4EFE6]/70 rounded-[2px] border border-[#D9CDAF]/60">
            <span className="text-[10px] font-mono text-[#4F5C48] block">{isPt ? 'Formulários Transcritos' : 'Transcribed Forms'}</span>
            <span className="text-lg font-bold font-mono text-[#1A2417]">{stats.total}</span>
            <span className="text-[10px] text-[#4F5C48] block">{isPt ? '64 com inquérito integral' : '64 with full survey'}</span>
          </div>

          <div className="p-2.5 bg-[#F4EFE6]/70 rounded-[2px] border border-[#D9CDAF]/60">
            <span className="text-[10px] font-mono text-[#4F5C48] block">{isPt ? 'Povoados Rurais' : 'Rural Villages'}</span>
            <span className="text-lg font-bold font-mono text-[#1A2417]">{localities.length}</span>
            <span className="text-[10px] text-[#4F5C48] block">Quissico, Canetane, Massava</span>
          </div>

          <div className="p-2.5 bg-[#F4EFE6]/70 rounded-[2px] border border-[#D9CDAF]/60">
            <span className="text-[10px] font-mono text-[#4F5C48] block">{isPt ? 'Produtoras (Mulheres)' : 'Female Farmers'}</span>
            <span className="text-lg font-bold font-mono text-[#354D2C]">{stats.femaleCount}</span>
            <span className="text-[10px] text-[#4F5C48] block">{isPt ? '60,3% da amostra' : '60.3% of sample'}</span>
          </div>

          <div className="p-2.5 bg-[#F4EFE6]/70 rounded-[2px] border border-[#D9CDAF]/60">
            <span className="text-[10px] font-mono text-[#4F5C48] block">{isPt ? 'Produtores (Homens)' : 'Male Farmers'}</span>
            <span className="text-lg font-bold font-mono text-[#1A2417]">{stats.maleCount}</span>
            <span className="text-[10px] text-[#4F5C48] block">{isPt ? '39,7% da amostra' : '39.7% of sample'}</span>
          </div>

          <div className="p-2.5 bg-[#F4EFE6]/70 rounded-[2px] border border-[#D9CDAF]/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-[#4F5C48] block">{isPt ? 'Líderes Comunitários' : 'Community Leaders'}</span>
            <span className="text-lg font-bold font-mono text-[#A8531E]">{stats.leadersCount}</span>
            <span className="text-[10px] text-[#4F5C48] block">{isPt ? 'Inquérito institucional' : 'Institutional survey'}</span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-3.5 space-y-3 text-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#4F5C48] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isPt ? 'Pesquisar por produtor, variedade (Chigoma, Umbeluzi...), praga, apoio...' : 'Search by farmer, variety, pest, support...'}
              className="w-full pl-9 pr-3 py-2 bg-[#F4EFE6] border border-[#D9CDAF] rounded-[2px] text-[#1A2417] placeholder:text-[#4F5C48]/70 focus:outline-hidden focus:border-[#354D2C] text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4F5C48] hover:text-[#1A2417] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Locality select */}
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="px-2.5 py-2 bg-[#F4EFE6] border border-[#D9CDAF] rounded-[2px] text-[#1A2417] text-xs focus:outline-hidden focus:border-[#354D2C] cursor-pointer"
            >
              <option value="ALL">{isPt ? 'Todos os Povoados' : 'All Villages'}</option>
              {localities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Role select */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-2.5 py-2 bg-[#F4EFE6] border border-[#D9CDAF] rounded-[2px] text-[#1A2417] text-xs focus:outline-hidden focus:border-[#354D2C] cursor-pointer"
            >
              <option value="ALL">{isPt ? 'Todas as Funções' : 'All Roles'}</option>
              <option value="FEMALE">{isPt ? 'Mulheres Agricultoras' : 'Female Farmers'}</option>
              <option value="MALE">{isPt ? 'Homens Agricultores' : 'Male Farmers'}</option>
              <option value="LEADER">{isPt ? 'Líderes Comunitários' : 'Community Leaders'}</option>
            </select>

            {/* Trend select */}
            <select
              value={selectedTrend}
              onChange={(e) => setSelectedTrend(e.target.value)}
              className="px-2.5 py-2 bg-[#F4EFE6] border border-[#D9CDAF] rounded-[2px] text-[#1A2417] text-xs focus:outline-hidden focus:border-[#354D2C] cursor-pointer"
            >
              <option value="ALL">{isPt ? 'Qualquer Tendência' : 'Any Trend'}</option>
              <option value="DECREASED">{isPt ? 'Diminuiu (Quebra)' : 'Decreased'}</option>
              <option value="INCREASED">{isPt ? 'Aumentou' : 'Increased'}</option>
              <option value="STABLE">{isPt ? 'Igual / Estável' : 'Stable'}</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-2.5 py-2 rounded-[2px] border border-[#D9CDAF] text-[#A8531E] hover:bg-[#EAE2D2]/50 text-xs font-medium cursor-pointer transition-colors"
              >
                {isPt ? 'Limpar Filtros' : 'Reset'}
              </button>
            )}
          </div>
        </div>

        {/* Counter of matching results */}
        <div className="flex items-center justify-between text-[11px] text-[#4F5C48] pt-1">
          <span>
            {isPt
              ? `A apresentar ${filteredInterviews.length} de ${FIELD_INTERVIEWS.length} registos catalogados`
              : `Showing ${filteredInterviews.length} of ${FIELD_INTERVIEWS.length} catalogued records`}
          </span>
          {hasActiveFilters && (
            <span className="font-mono text-[10px] uppercase text-[#A8531E]">
              {isPt ? 'Filtros Ativos' : 'Filters Active'}
            </span>
          )}
        </div>
      </div>

      {/* 3. INTERVIEWS CATALOGUE TABLE / LIST */}
      <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] overflow-hidden">
        {filteredInterviews.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-[#A8531E] mx-auto" />
            <p className="font-semibold text-sm text-[#1A2417]">
              {isPt ? 'Nenhum formulário corresponde aos critérios selecionados' : 'No forms match the selected filters'}
            </p>
            <p className="text-xs text-[#4F5C48]">
              {isPt ? 'Tente limpar a pesquisa ou selecionar outro povoado.' : 'Try clearing the search or choosing another village.'}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 inline-flex items-center px-3 py-1.5 rounded-[2px] bg-[#1A2417] text-[#FCFAF6] text-xs font-medium cursor-pointer"
            >
              {isPt ? 'Repor Filtros' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D9CDAF] bg-[#F4EFE6] text-[10px] font-mono uppercase tracking-wider text-[#4F5C48]">
                  <th className="py-2.5 px-3 font-semibold w-16">{isPt ? 'Ficha' : 'Sheet'}</th>
                  <th className="py-2.5 px-3 font-semibold min-w-[160px]">{isPt ? 'Produtor / Informante' : 'Farmer / Informant'}</th>
                  <th className="py-2.5 px-3 font-semibold min-w-[130px]">{isPt ? 'Povoado' : 'Village'}</th>
                  <th className="py-2.5 px-3 font-semibold min-w-[140px]">{isPt ? 'Variedades Declaradas' : 'Varieties'}</th>
                  <th className="py-2.5 px-3 font-semibold min-w-[130px]">{isPt ? 'Tendência e Causa' : 'Trend & Cause'}</th>
                  <th className="py-2.5 px-3 font-semibold min-w-[140px]">{isPt ? 'Pragas / Apoio' : 'Pests / Support'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right w-20">{isPt ? 'Ação' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9CDAF]/60 font-sans">
                {filteredInterviews.map((item) => {
                  const isFemale = item.role.toLowerCase().includes('produtora') || item.role.toLowerCase().includes('agricultora');
                  const isLeader = item.isLeaderQuestionnaire;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedInterview(item)}
                      className="hover:bg-[#F4EFE6]/60 transition-colors cursor-pointer group"
                    >
                      {/* Ficha & Pág */}
                      <td className="py-3 px-3 align-top font-mono text-[11px] text-[#4F5C48]">
                        <span className="font-semibold text-[#1A2417] block">#{item.recordIndex}</span>
                        <span className="text-[10px] text-[#4F5C48]">Pág. {item.pageNumber}</span>
                      </td>

                      {/* Nome e Função */}
                      <td className="py-3 px-3 align-top">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-[#1A2417] group-hover:text-[#354D2C] transition-colors">
                            {item.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-1 text-[11px]">
                            <span
                              className={`px-1.5 py-0.2 rounded-[2px] font-mono text-[10px] ${
                                isLeader
                                  ? 'bg-[#A8531E]/15 text-[#A8531E] font-semibold'
                                  : isFemale
                                  ? 'bg-[#354D2C]/10 text-[#354D2C]'
                                  : 'bg-[#EAE2D2] text-[#4F5C48]'
                              }`}
                            >
                              {item.role}
                            </span>
                            <span className="text-[#4F5C48] text-[10px]">· {item.farmingYears}</span>
                          </div>
                        </div>
                      </td>

                      {/* Povoado */}
                      <td className="py-3 px-3 align-top text-[#4F5C48]">
                        <span className="font-medium text-[#1A2417] block">{item.locality}</span>
                        <span className="text-[10px] text-[#4F5C48]">Posto de {item.administrativePost}</span>
                      </td>

                      {/* Variedades */}
                      <td className="py-3 px-3 align-top">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {item.cassavaVarieties.map((v, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.2 rounded-[2px] bg-[#EAE2D2]/80 text-[#1A2417] text-[10px] font-medium"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-[#4F5C48] truncate block mt-1 italic max-w-[180px]">
                          {item.rawAssociatedCropsText}
                        </span>
                      </td>

                      {/* Tendência e Causa */}
                      <td className="py-3 px-3 align-top">
                        <div className="space-y-0.5">
                          <span
                            className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                              item.productionTrend.toLowerCase().includes('diminuiu')
                                ? 'text-[#A8531E]'
                                : item.productionTrend.toLowerCase().includes('aumentou')
                                ? 'text-[#354D2C]'
                                : 'text-[#4F5C48]'
                            }`}
                          >
                            {item.productionTrend.toLowerCase().includes('diminuiu') ? (
                              <TrendingDown className="w-3 h-3" />
                            ) : item.productionTrend.toLowerCase().includes('aumentou') ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <Minus className="w-3 h-3" />
                            )}
                            <span>{item.productionTrend}</span>
                          </span>
                          <p className="text-[10px] text-[#4F5C48] truncate max-w-[150px]">
                            {item.trendCauses}
                          </p>
                        </div>
                      </td>

                      {/* Pragas / Apoio */}
                      <td className="py-3 px-3 align-top">
                        <div className="space-y-0.5">
                          <p className="text-[#A8531E] font-medium text-[11px] truncate max-w-[160px]">
                            {item.pestsAndDiseases}
                          </p>
                          <p className="text-[#4F5C48] text-[10px] truncate max-w-[160px]">
                            <span className="font-semibold text-[#354D2C]">{item.institutionalSupport}</span>
                          </p>
                        </div>
                      </td>

                      {/* Ação */}
                      <td className="py-3 px-3 align-top text-right">
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#354D2C] group-hover:text-[#1A2417]">
                          <span>{isPt ? 'Ler' : 'View'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. DETAIL READING MODAL */}
      <FieldInterviewDetailModal
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
        onSendToStudio={onSendToStudio}
        onPlayQuickSpeech={onPlayQuickSpeech}
        onSelectCrossEvidenceTheme={onSelectCrossEvidenceTheme}
        currentLang={currentLang}
      />
    </div>
  );
};
