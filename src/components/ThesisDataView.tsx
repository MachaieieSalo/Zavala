import React, { useState } from 'react';
import {
  Table,
  CloudLightning,
  MapPin,
  BarChart3,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Info,
  SlidersHorizontal,
  Volume2,
  Download,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  THESIS_COMPLETE_TIME_SERIES,
  THESIS_CLIMATE_IMPACT_LOSSES,
  THESIS_MODEL_ASSUMPTIONS,
  THESIS_METHODOLOGY_LAYERS,
  TOTAL_ESTIMATED_LOSSES_1994_2016,
  TimeSeriesRow,
} from '../data/thesisModelData';

import { TRANSLATIONS, SupportedLang } from '../data/translations';

interface ThesisDataViewProps {
  onSendToStudio?: (text: string) => void;
  highlightYear?: number;
  currentLang?: SupportedLang;
}

export const ThesisDataView: React.FC<ThesisDataViewProps> = ({
  onSendToStudio,
  highlightYear,
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';
  const [activeTab, setActiveTab] = useState<
    'serie_31' | 'choques_perdas' | 'pressupostos' | 'metodologia' | 'bairros'
  >('serie_31');
  const [filterQuery, setFilterQuery] = useState('');
  const [showAdvancedColumns, setShowAdvancedColumns] = useState(false);

  // Filtered series
  const filteredSeries = THESIS_COMPLETE_TIME_SERIES.filter((row) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      row.year.toString().includes(q) ||
      row.status.toLowerCase().includes(q) ||
      row.eventOrShock.toLowerCase().includes(q)
    );
  });

  const handleSpeakRow = (row: TimeSeriesRow) => {
    const text = `Ano ${row.year}: Produção final de ${row.finalProdTonnes.toLocaleString('pt-MZ')} toneladas (${row.status}). Área efectiva: ${row.effectiveAreaHa.toLocaleString('pt-MZ')} hectares. Rendimento médio: ${row.effectiveYieldTonnesHa.toFixed(2)} toneladas por hectare. Evento: ${row.eventOrShock}.`;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'pt-PT';
      window.speechSynthesis.speak(u);
    } else if (onSendToStudio) {
      onSendToStudio(text);
    }
  };

  return (
    <div className="bg-[#FFFDF8] border border-[#DDD0B4] rounded-md overflow-hidden text-[#1F2A1A]">
      {/* Tab Header */}
      <div className="p-4 sm:p-5 border-b border-[#DDD0B4] bg-[#F2E9D8]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-[#5B7B4F]/15 text-[#3F5837]">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-[#1F2A1A] font-display">
              {isPt ? 'Dados do Modelo Zavala Mandioca (1994–2024)' : 'Zavala Cassava Model Data (1994–2024)'}
            </h3>
          </div>
          <p className="text-xs text-[#5C6B52] mt-1">
            {isPt
              ? 'Reconstituição de 31 anos baseada em dados primários SDAE Zavala, World Bank (Jobs WP 31), PROSUL e Choques Climáticos (Lobell & Burke, FEWS NET).'
              : '31-year reconstruction grounded in primary records from SDAE Zavala, World Bank (Jobs WP 31), PROSUL, and climate shock modeling (Lobell & Burke, FEWS NET).'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto bg-[#FFFDF8] p-1 rounded-md text-xs font-medium border border-[#DDD0B4] self-start lg:self-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('serie_31')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'serie_31'
                ? 'bg-[#1F2A1A] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A]'
            }`}
          >
            {isPt ? 'Série 31 Anos (B)' : '31-Year Series (B)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('choques_perdas')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'choques_perdas'
                ? 'bg-[#1F2A1A] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A]'
            }`}
          >
            {isPt ? 'Choques & Perdas (D)' : 'Shocks & Losses (D)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pressupostos')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pressupostos'
                ? 'bg-[#1F2A1A] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A]'
            }`}
          >
            {isPt ? 'Pressupostos (A)' : 'Assumptions (A)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('metodologia')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'metodologia'
                ? 'bg-[#1F2A1A] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A]'
            }`}
          >
            {isPt ? 'Metodologia (E)' : 'Methodology (E)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bairros')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'bairros'
                ? 'bg-[#1F2A1A] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A]'
            }`}
          >
            {isPt ? '11 Bairros' : '11 Villages'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* TAB 1: SÉRIE 31 ANOS */}
        {activeTab === 'serie_31' && (
          <div className="space-y-4">
            {/* Top Stats Strip - Flat divider grid without card boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#DDD0B4] bg-[#FFFDF8] divide-y sm:divide-y-0 sm:divide-x divide-[#DDD0B4] rounded-md">
              <div className="p-3.5 space-y-0.5">
                <span className="text-xs font-semibold text-[#5C6B52]">
                  {isPt ? 'Média da Série (31 Anos)' : 'Series Average (31 Yrs)'}
                </span>
                <p className="text-lg font-bold text-[#1F2A1A] font-mono">115.333 t</p>
                <span className="text-[10px] text-[#5C6B52]/70">{isPt ? '1994 a 2024' : '1994 to 2024'}</span>
              </div>
              <div className="p-3.5 space-y-0.5">
                <span className="text-xs font-semibold text-[#5C6B52]">
                  {isPt ? 'Pico Histórico (2021)' : 'Historical Peak (2021)'}
                </span>
                <p className="text-lg font-bold text-[#3F5837] font-mono">273.773 t</p>
                <span className="text-[10px] text-[#5B7B4F] font-medium">{isPt ? 'Variedades IIAM + SUSTENTA' : 'IIAM + SUSTENTA Var.'}</span>
              </div>
              <div className="p-3.5 space-y-0.5">
                <span className="text-xs font-semibold text-[#5C6B52]">
                  {isPt ? 'Menor Safra (Seca 2023)' : 'Lowest Yield (Drought 2023)'}
                </span>
                <p className="text-lg font-bold text-[#B5651D] font-mono">35.371 t</p>
                <span className="text-[10px] text-[#B5651D] font-medium">{isPt ? 'Colapso El Niño (-87%)' : 'El Niño Collapse (-87%)'}</span>
              </div>
              <div className="p-3.5 space-y-0.5">
                <span className="text-xs font-semibold text-[#5C6B52]">
                  {isPt ? 'Âncoras Primárias' : 'Primary Anchors'}
                </span>
                <p className="text-lg font-bold text-[#1F2A1A] font-mono">8 {isPt ? 'Anos' : 'Years'}</p>
                <span className="text-[10px] text-[#5C6B52]">2017-2024 SDAE Zavala</span>
              </div>
            </div>

            {/* Filter & Column Toggle Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6B52]" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder={isPt ? 'Filtrar por ano, status ou evento...' : 'Filter by year, status or shock...'}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#FFFDF8] border border-[#DDD0B4] rounded-md text-xs text-[#1F2A1A] placeholder-[#5C6B52]/70 focus:outline-none focus:border-[#5B7B4F]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAdvancedColumns(!showAdvancedColumns)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
                    showAdvancedColumns
                      ? 'bg-[#1F2A1A] text-white border-[#1F2A1A]'
                      : 'bg-[#FFFDF8] text-[#1F2A1A] border-[#DDD0B4] hover:bg-[#F2E9D8]'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#5B7B4F]" />
                  <span>
                    {showAdvancedColumns
                      ? isPt ? 'Ocultar Parâmetros' : 'Hide Parameters'
                      : isPt ? 'Ver Parâmetros Completos (F_Área, F_Rend)' : 'Full Parameters (F_Area, F_Yield)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-md border border-[#DDD0B4]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F2E9D8]/40 text-[#5C6B52] font-mono text-[11px] border-b border-[#DDD0B4]">
                    <th className="p-3">Ano</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Área (ha)</th>
                    {showAdvancedColumns && (
                      <>
                        <th className="p-3 text-right">F_Área</th>
                        <th className="p-3 text-right">Rend. Tend (t/ha)</th>
                        <th className="p-3 text-right">F_Rend</th>
                      </>
                    )}
                    <th className="p-3 text-right">Rend. Efectivo</th>
                    <th className="p-3 text-right font-bold text-[#1F2A1A]">Produção Final (t)</th>
                    <th className="p-3 text-right">Var. Anual</th>
                    <th className="p-3">Choque / Evento Documentado</th>
                    <th className="p-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD0B4]/60">
                  {filteredSeries.map((row) => {
                    const isObserved = row.status === 'OBSERVADO (SDAE)';
                    const isHighlighted = highlightYear === row.year;
                    const hasLoss = row.annualVarPercent !== null && row.annualVarPercent < -15;

                    return (
                      <tr
                        key={row.year}
                        className={`hover:bg-zinc-50/80 transition-colors ${
                          isHighlighted ? 'bg-amber-50/80 font-medium' : ''
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-zinc-900">{row.year}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                              isObserved
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {isObserved ? 'SDAE Observado' : 'Estimativa'}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-zinc-700">
                          {row.effectiveAreaHa.toLocaleString('pt-MZ')}
                        </td>
                        {showAdvancedColumns && (
                          <>
                            <td className="p-3 text-right font-mono text-zinc-500">{row.fArea.toFixed(2)}</td>
                            <td className="p-3 text-right font-mono text-zinc-500">{row.trendYieldTonnesHa.toFixed(2)}</td>
                            <td className="p-3 text-right font-mono text-zinc-500">{row.fYield.toFixed(2)}</td>
                          </>
                        )}
                        <td className="p-3 text-right font-mono text-zinc-700">
                          {row.effectiveYieldTonnesHa.toFixed(2)} t/ha
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-zinc-900">
                          {row.finalProdTonnes.toLocaleString('pt-MZ')}
                        </td>
                        <td className="p-3 text-right font-mono">
                          {row.annualVarPercent !== null ? (
                            <span
                              className={`inline-flex items-center gap-0.5 ${
                                row.annualVarPercent > 0
                                  ? 'text-emerald-700 font-semibold'
                                  : row.annualVarPercent < 0
                                  ? 'text-rose-700 font-semibold'
                                  : 'text-zinc-500'
                              }`}
                            >
                              {row.annualVarPercent > 0 ? `+${row.annualVarPercent}%` : `${row.annualVarPercent}%`}
                            </span>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-zinc-600 max-w-xs truncate" title={row.eventOrShock}>
                          {row.eventOrShock}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSpeakRow(row)}
                              className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer"
                              title="Ouvir dados deste ano"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            {onSendToStudio && (
                              <button
                                type="button"
                                onClick={() => {
                                  const speech = `No ano de ${row.year}, em Zavala, a produção foi de ${row.finalProdTonnes.toLocaleString('pt-MZ')} toneladas com área de ${row.effectiveAreaHa.toLocaleString('pt-MZ')} hectares. Evento: ${row.eventOrShock}.`;
                                  onSendToStudio(speech);
                                }}
                                className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors cursor-pointer"
                                title="Enviar para o Estúdio"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CHOQUES & PERDAS (FOLHA D) */}
        {activeTab === 'choques_perdas' && (
          <div className="space-y-4">
            {/* Massive Shock Losses Banner */}
            <div className="p-4 border-l-2 border-[#B5651D] border-y border-r border-[#DDD0B4] bg-[#F2E9D8]/30 text-[#1F2A1A] space-y-1.5 rounded-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#B5651D]" />
                <h4 className="text-sm sm:text-base font-bold text-[#1F2A1A]">
                  Perdas Totais Cumulativas Estimadas (1994–2016): 547.224 Toneladas
                </h4>
              </div>
              <p className="text-xs text-[#5C6B52] leading-relaxed">
                As perdas acumuladas provocadas por ciclones tropicais, secas de El Niño e inundações catastróficas totalizam mais de meio milhão de toneladas em 23 anos. O Ciclone Favio (2007) e a Seca Extrema de 2016 responderam sozinhos por mais de 206 mil toneladas de quebra física.
              </p>
            </div>

            {/* Shock Table */}
            <div className="overflow-x-auto rounded-md border border-[#DDD0B4]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F2E9D8]/40 text-[#5C6B52] font-mono text-[11px] border-b border-[#DDD0B4]">
                    <th className="p-3">Ano</th>
                    <th className="p-3">Evento Climático Extremo</th>
                    <th className="p-3 text-right">Tendência (t)</th>
                    <th className="p-3 text-right">Realizado (t)</th>
                    <th className="p-3 text-right font-bold text-[#B5651D]">Perda Líquida (t)</th>
                    <th className="p-3 text-right">Quebra (%)</th>
                    <th className="p-3">Fonte de Validação Externa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD0B4]/60">
                  {THESIS_CLIMATE_IMPACT_LOSSES.map((shock) => (
                    <tr key={shock.year} className="hover:bg-[#F2E9D8]/20 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#1F2A1A]">{shock.year}</td>
                      <td className="p-3 font-medium text-[#1F2A1A]">{shock.event}</td>
                      <td className="p-3 text-right font-mono text-[#5C6B52]">
                        {shock.trendProdTonnes.toLocaleString('pt-MZ')}
                      </td>
                      <td className="p-3 text-right font-mono text-[#1F2A1A] font-semibold">
                        {shock.actualProdTonnes.toLocaleString('pt-MZ')}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#B5651D]">
                        {shock.lossTonnes > 0 ? `-${shock.lossTonnes.toLocaleString('pt-MZ')}` : `+${Math.abs(shock.lossTonnes).toLocaleString('pt-MZ')}`}
                      </td>
                      <td className="p-3 text-right font-mono font-bold">
                        <span className={shock.lossPercent > 0 ? 'text-[#B5651D]' : 'text-[#3F5837]'}>
                          {shock.lossPercent > 0 ? `-${shock.lossPercent.toFixed(1)}%` : `+${Math.abs(shock.lossPercent).toFixed(1)}%`}
                        </span>
                      </td>
                      <td className="p-3 text-[#5C6B52] text-[11px]">{shock.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRESSUPOSTOS (FOLHA A) */}
        {activeTab === 'pressupostos' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#F2E9D8]/30 border-l-2 border-[#5B7B4F] border-y border-r border-[#DDD0B4] text-xs text-[#5C6B52] rounded-sm">
              Estes parâmetros definem os valores de partida e as trajetórias do modelo determinístico calibrado na tese, ancorados na proporção de Zavala (~15% da província de Inhambane).
            </div>

            <div className="overflow-x-auto rounded-md border border-[#DDD0B4]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F2E9D8]/40 text-[#5C6B52] font-mono text-[11px] border-b border-[#DDD0B4]">
                    <th className="p-3">Categoria</th>
                    <th className="p-3">Parâmetro</th>
                    <th className="p-3">Valor Adotado</th>
                    <th className="p-3">Intervalo de Incerteza</th>
                    <th className="p-3">Fonte de Referência</th>
                    <th className="p-3">Justificativa Científica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD0B4]/60">
                  {THESIS_MODEL_ASSUMPTIONS.map((a) => (
                    <tr key={a.id} className="hover:bg-[#F2E9D8]/20 transition-colors">
                      <td className="p-3 font-semibold text-[#1F2A1A]">{a.category}</td>
                      <td className="p-3 font-mono text-[#5C6B52]">{a.parameter}</td>
                      <td className="p-3 font-mono font-bold text-[#3F5837]">
                        {a.value} {a.unit}
                      </td>
                      <td className="p-3 font-mono text-[#5C6B52]">{a.interval}</td>
                      <td className="p-3 text-[#5C6B52] text-[11px]">{a.source}</td>
                      <td className="p-3 text-[#5C6B52]/80 text-[11px]">{a.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: METODOLOGIA (FOLHA E) */}
        {activeTab === 'metodologia' && (
          <div className="space-y-4">
            <div className="space-y-4">
              {THESIS_METHODOLOGY_LAYERS.map((layer) => (
                <div
                  key={layer.layerNumber}
                  className="p-4 border-l-2 border-[#5B7B4F] border-y border-r border-[#DDD0B4] bg-[#FFFDF8] rounded-sm space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#1F2A1A] text-white font-mono font-bold flex items-center justify-center text-xs">
                      {layer.layerNumber}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#1F2A1A]">
                      {layer.title}
                    </h4>
                  </div>

                  <p className="text-xs font-semibold text-[#3F5837]">
                    {layer.shortDesc}
                  </p>

                  <ul className="space-y-1.5 text-xs text-[#5C6B52]">
                    {layer.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5B7B4F] shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-[#DDD0B4]/60">
                    <span className="text-xs font-semibold text-[#1F2A1A]">
                      Referências Principais:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {layer.keyReferences.map((ref, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-[#F2E9D8]/50 text-[#1F2A1A] text-[11px] font-medium border border-[#DDD0B4]"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 11 BAIRROS DE ZAVALA */}
        {activeTab === 'bairros' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-[#F2E9D8]/30 border-l-2 border-[#5B7B4F] border-y border-r border-[#DDD0B4] text-xs text-[#5C6B52] rounded-sm">
              Validação territorial com 11 bairros rurais de Zavala, abrangendo relevo costeiro, altitudes de 85m a 140m e solos predominantemente franco-arenosos.
            </div>

            <div className="overflow-x-auto rounded-md border border-[#DDD0B4]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F2E9D8]/40 text-[#5C6B52] font-mono text-[11px] border-b border-[#DDD0B4]">
                    <th className="p-3">Bairro / Comunidade</th>
                    <th className="p-3">Posto Administrativo</th>
                    <th className="p-3 text-right">Altitude (SRTM)</th>
                    <th className="p-3">Tipo de Solo Predominante</th>
                    <th className="p-3">Variedades Predominantes</th>
                    <th className="p-3">Risco Principal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD0B4]/60">
                  <tr className="hover:bg-[#F2E9D8]/20">
                    <td className="p-3 font-semibold text-[#1F2A1A]">Quissico Sede</td>
                    <td className="p-3 text-[#5C6B52]">Quissico</td>
                    <td className="p-3 text-right font-mono text-[#1F2A1A]">118 m</td>
                    <td className="p-3 text-[#5C6B52]">Arenoso avermelhado profundo</td>
                    <td className="p-3 text-[#5C6B52]">Chigoma Mafia, Local doce</td>
                    <td className="p-3 text-[#B5651D] font-medium">Seca severa e ventos marinhos</td>
                  </tr>
                  <tr className="hover:bg-[#F2E9D8]/20">
                    <td className="p-3 font-semibold text-[#1F2A1A]">Mahumane</td>
                    <td className="p-3 text-[#5C6B52]">Quissico</td>
                    <td className="p-3 text-right font-mono text-[#1F2A1A]">125 m</td>
                    <td className="p-3 text-[#5C6B52]">Franco-arenoso litorâneo</td>
                    <td className="p-3 text-[#5C6B52]">Mulaleia, Chinhembwe</td>
                    <td className="p-3 text-[#B5651D] font-medium">Estiagem precoce e CBSD</td>
                  </tr>
                  <tr className="hover:bg-[#F2E9D8]/20">
                    <td className="p-3 font-semibold text-[#1F2A1A]">Zavalene</td>
                    <td className="p-3 text-[#5C6B52]">Quissico</td>
                    <td className="p-3 text-right font-mono text-[#1F2A1A]">122 m</td>
                    <td className="p-3 text-[#5C6B52]">Arenoso vermelho</td>
                    <td className="p-3 text-[#5C6B52]">Variedades IIAM melhoradas</td>
                    <td className="p-3 text-[#B5651D] font-medium">Queda drástica no El Niño</td>
                  </tr>
                  <tr className="hover:bg-[#F2E9D8]/20">
                    <td className="p-3 font-semibold text-[#1F2A1A]">Mucoho</td>
                    <td className="p-3 text-[#5C6B52]">Quissico</td>
                    <td className="p-3 text-right font-mono text-[#1F2A1A]">114 m</td>
                    <td className="p-3 text-[#5C6B52]">Arenoso com boa matéria orgânica</td>
                    <td className="p-3 text-[#5C6B52]">Consociação amendoim/mandioca</td>
                    <td className="p-3 text-[#B5651D] font-medium">Erosão por ventos ciclónicos</td>
                  </tr>
                  <tr className="hover:bg-[#F2E9D8]/20">
                    <td className="p-3 font-semibold text-[#1F2A1A]">Zandamela</td>
                    <td className="p-3 text-[#5C6B52]">Zandamela</td>
                    <td className="p-3 text-right font-mono text-[#1F2A1A]">92 m</td>
                    <td className="p-3 text-[#5C6B52]">Aluvial nas baixas, arenoso nos altos</td>
                    <td className="p-3 text-[#5C6B52]">Tradicionais de ciclo curto</td>
                    <td className="p-3 text-[#B5651D] font-medium">Cheias rápidas nas bacias</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
