import React, { useState } from 'react';
import {
  X,
  BarChart3,
  MapPin,
  CloudLightning,
  FileSpreadsheet,
} from 'lucide-react';
import {
  QUISSICO_BAIRROS_SPATIAL,
  THESIS_CORE_FACTS,
  SCIENTIFIC_TREND_STATISTICS,
} from '../data/thesisScientificData';
import {
  THESIS_CLIMATE_IMPACT_LOSSES,
  TOTAL_ESTIMATED_LOSSES_1994_2016,
} from '../data/thesisModelData';

interface ThesisDataTablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThesisDataTablesModal: React.FC<ThesisDataTablesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'choques' | 'bairros' | 'estatisticas'>('choques');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1F2A1A]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFFDF8] border border-[#DDD0B4] rounded-md shadow-lg flex flex-col overflow-hidden text-[#1F2A1A]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#DDD0B4] bg-[#F2E9D8]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#5B7B4F]/15 text-[#3F5837] flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4 text-[#5B7B4F]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1F2A1A] font-display">
                Tabelas e Indicadores Oficiais da Dissertação
              </h3>
              <p className="text-xs text-[#5C6B52]">
                Dados auditados do SDAE Zavala, CHIRPS v2.0, Sentinel-2 (Dynamic World) e SRTM
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-[#F2E9D8] hover:bg-[#DDD0B4] text-[#5C6B52] hover:text-[#1F2A1A] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-2.5 px-5 bg-[#F2E9D8]/30 border-b border-[#DDD0B4] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('choques')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'choques'
                ? 'bg-[#5B7B4F] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A] hover:bg-[#F2E9D8]'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5" />
            <span>Tabela 5: Choques Críticos (14 Anos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bairros')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bairros'
                ? 'bg-[#5B7B4F] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A] hover:bg-[#F2E9D8]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Tabela 7: {THESIS_CORE_FACTS.spatialBairrosCount} Bairros de Quissico ({THESIS_CORE_FACTS.spatialAreaQuissicoHa.toLocaleString('pt-MZ')} ha)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('estatisticas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'estatisticas'
                ? 'bg-[#5B7B4F] text-white font-bold'
                : 'text-[#5C6B52] hover:text-[#1F2A1A] hover:bg-[#F2E9D8]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tabela 1: Parâmetros Descritivos</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {activeTab === 'choques' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-[#F2E9D8]/40 border border-[#DDD0B4] text-xs text-[#1F2A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  <strong>Perda Acumulada no Período Modelado (1994–2016):</strong> {TOTAL_ESTIMATED_LOSSES_1994_2016.toLocaleString('pt-MZ')} toneladas em {THESIS_CORE_FACTS.adverseYearsCountModeled} anos de choques climáticos documentados.
                </span>
                <span className="font-mono text-[#5B7B4F] font-bold">14 anos adversos (60,9% dos 23 anos modelados)</span>
              </div>

              <div className="overflow-x-auto border border-[#DDD0B4] rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F2E9D8]/60 text-[#5C6B52] text-[11px] font-mono border-b border-[#DDD0B4]">
                      <th className="p-3">Ano</th>
                      <th className="p-3">Evento Climático / Contexto</th>
                      <th className="p-3 text-right">Prod. Real (t)</th>
                      <th className="p-3 text-right">Perda (t)</th>
                      <th className="p-3 text-right">Perda (%)</th>
                      <th className="p-3 text-center">Classificação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD0B4]/60 font-mono text-xs text-[#1F2A1A]">
                    {THESIS_CLIMATE_IMPACT_LOSSES.map((row) => {
                      const isCritical = row.lossPercent >= 50;
                      const isSevere = row.lossPercent >= 25 && row.lossPercent < 50;
                      const isObserved = row.year >= 2017;
                      const isNegative = row.lossTonnes < 0;

                      return (
                        <tr
                          key={row.year}
                          className={`hover:bg-[#F2E9D8]/20 ${
                            isCritical ? 'bg-[#B5651D]/5' : ''
                          } ${row.year === 2023 ? 'border-t-2 border-[#B5651D]/30' : ''}`}
                        >
                          <td className="p-3 font-bold text-[#1F2A1A]">{row.year}</td>
                          <td className="p-3 font-sans">
                            {row.event}
                            {isObserved && (
                              <span className="ml-1.5 text-[10px] font-mono px-1 py-0.5 rounded bg-[#5B7B4F]/15 text-[#3F5837]">
                                OBSERVADO
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right font-bold">
                            {Math.round(row.actualProdTonnes).toLocaleString('pt-MZ')}
                          </td>
                          <td
                            className={`p-3 text-right font-bold ${
                              isNegative
                                ? 'text-[#5B7B4F]'
                                : isCritical
                                ? 'text-[#B5651D]'
                                : 'text-[#7D6B42]'
                            }`}
                          >
                            {isNegative
                              ? `+${Math.abs(Math.round(row.lossTonnes)).toLocaleString('pt-MZ')}`
                              : Math.round(row.lossTonnes).toLocaleString('pt-MZ')}
                          </td>
                          <td
                            className={`p-3 text-right font-bold ${
                              isNegative
                                ? 'text-[#5B7B4F]'
                                : isCritical
                                ? 'text-[#B5651D]'
                                : 'text-[#7D6B42]'
                            }`}
                          >
                            {isNegative
                              ? `+${Math.abs(row.lossPercent).toFixed(1).replace('.', ',')}%`
                              : `${row.lossPercent.toFixed(1).replace('.', ',')}%`}
                          </td>
                          <td className="p-3 text-center">
                            {isNegative ? (
                              <span className="text-[#5B7B4F] font-semibold text-[11px]">RECUP. PARCIAL</span>
                            ) : isCritical ? (
                              <span className="text-[#B5651D] font-bold text-[11px]">CRÍTICO</span>
                            ) : isSevere ? (
                              <span className="text-[#B5651D] font-semibold text-[11px]">SEVERO</span>
                            ) : (
                              <span className="text-[#5C6B52] font-semibold text-[11px]">MODERADO</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Methodological Caveat Banner */}
              <div className="p-3 bg-[#FFFDF8] border-l-3 border-[#5B7B4F] border-y border-r border-[#DDD0B4] rounded-[2px] text-[11px] text-[#5C6B52] leading-relaxed">
                <strong className="text-[#1F2A1A] block font-semibold">Princípio Epistemológico:</strong>
                Associação temporal não implica causalidade. Os 14 anos adversos documentam a coocorrência histórica entre choques climáticos (CHIRPS, INGD) e quebras de colheita, devendo a sua causalidade agroeconómica ser compreendida na interação com a vulnerabilidade edáfica dos solos arenosos de Zavala.
              </div>
            </div>
          )}

          {activeTab === 'bairros' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-[#F2E9D8]/40 border border-[#DDD0B4] text-xs text-[#1F2A1A]">
                <p>
                  <strong>Posto Administrativo de Quissico:</strong> {THESIS_CORE_FACTS.spatialBairrosCount} bairros cartografados totalizando {THESIS_CORE_FACTS.spatialAreaQuissicoHa.toLocaleString('pt-MZ')} hectares ({THESIS_CORE_FACTS.spatialTotalMappedPolygonsHa.toLocaleString('pt-MZ')} ha de polígonos mapeados). O Modelo B utiliza o sinal agrícola da classe <em>crops</em> do Dynamic World (Sentinel-2 a 10 m, percentil P75) entre 2016 e 2024.
                </p>
              </div>

              <div className="overflow-x-auto border border-[#DDD0B4] rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F2E9D8]/60 text-[#5C6B52] text-[11px] font-mono border-b border-[#DDD0B4]">
                      <th className="p-3">Bairro</th>
                      <th className="p-3">Grupo Zonal</th>
                      <th className="p-3 text-right">Área (ha)</th>
                      <th className="p-3 text-right">Territorial (%)</th>
                      <th className="p-3 text-right">ESA CCI 1994-15 (%)</th>
                      <th className="p-3 text-right">Dynamic World 2016-24 (%)</th>
                      <th className="p-3">Vulnerabilidade SRTM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD0B4]/60 font-mono text-xs text-[#1F2A1A]">
                    {QUISSICO_BAIRROS_SPATIAL.map((bairro) => {
                      const isCosteiro = bairro.zoneGroup === 'Costeiro';
                      const isInterior = bairro.zoneGroup === 'Interior';

                      return (
                        <tr
                          key={bairro.id}
                          className={`hover:bg-[#F2E9D8]/20 ${
                            bairro.name === 'Nzile' ? 'bg-[#5B7B4F]/5 font-semibold' : ''
                          }`}
                        >
                          <td className="p-3 font-bold text-[#1F2A1A] font-sans">{bairro.name}</td>
                          <td
                            className={`p-3 font-sans font-semibold ${
                              isCosteiro
                                ? 'text-[#5B7B4F]'
                                : isInterior
                                ? 'text-[#3F5837]'
                                : 'text-[#B5651D]'
                            }`}
                          >
                            {bairro.zoneGroup}
                          </td>
                          <td className="p-3 text-right">{bairro.territorialAreaHa.toLocaleString('pt-MZ')}</td>
                          <td className="p-3 text-right">{bairro.territorialSharePercent.toFixed(1).replace('.', ',')}%</td>
                          <td className="p-3 text-right">{bairro.esaCciSharePercent.toFixed(1).replace('.', ',')}%</td>
                          <td className="p-3 text-right font-bold text-[#5B7B4F]">
                            {bairro.dynamicWorldCropsSharePercent.toFixed(1).replace('.', ',')}%
                          </td>
                          <td className="p-3 font-sans text-xs">
                            {bairro.srtmBelow9mPercent > 40 ? (
                              <span className="text-[#B5651D] font-semibold">
                                {bairro.srtmBelow9mPercent}% &lt; 9m alt. (média {bairro.srtmAverageElevationM}m)
                              </span>
                            ) : (
                              <span className="text-[#5C6B52]">
                                Média {bairro.srtmAverageElevationM}m ({bairro.topographicRisk})
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'estatisticas' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-[#F2E9D8]/30 border border-[#DDD0B4]">
                  <p className="text-[#5C6B52] text-xs">Média Aritmética (1994–2024)</p>
                  <p className="text-xl font-bold font-mono text-[#5B7B4F]">
                    {THESIS_CORE_FACTS.averageProductionTonnes.toLocaleString('pt-MZ')} t
                  </p>
                  <p className="text-[10px] text-[#5C6B52]">31 anos da série distrital</p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F2E9D8]/30 border border-[#DDD0B4]">
                  <p className="text-[#5C6B52] text-xs">Mediana da Série</p>
                  <p className="text-xl font-bold font-mono text-[#1F2A1A]">
                    {THESIS_CORE_FACTS.medianProductionTonnes.toLocaleString('pt-MZ')} t
                  </p>
                  <p className="text-[10px] text-[#5C6B52]">Robusta a assimetrias extremas</p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F2E9D8]/30 border border-[#DDD0B4]">
                  <p className="text-[#5C6B52] text-xs">Desvio Padrão (s)</p>
                  <p className="text-xl font-bold font-mono text-[#B5651D]">
                    {THESIS_CORE_FACTS.standardDeviationTonnes.toLocaleString('pt-MZ')} t
                  </p>
                  <p className="text-[10px] text-[#5C6B52]">Dispersão elevada face à média</p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F2E9D8]/30 border border-[#DDD0B4]">
                  <p className="text-[#5C6B52] text-xs">Coeficiente de Variação (CV)</p>
                  <p className="text-xl font-bold font-mono text-[#B5651D]">
                    {THESIS_CORE_FACTS.coefficientOfVariationPercent.toFixed(1).replace('.', ',')}%
                  </p>
                  <p className="text-[10px] text-[#5C6B52]">Alta volatilidade interanual</p>
                </div>
              </div>

              {/* Econometric Models Table */}
              <div className="border border-[#DDD0B4] rounded-lg overflow-hidden">
                <div className="p-3 bg-[#F2E9D8]/60 border-b border-[#DDD0B4] font-semibold text-xs text-[#1F2A1A]">
                  Modelos de Tendência e Inferência Estatística
                </div>
                <div className="divide-y divide-[#DDD0B4]/60">
                  {SCIENTIFIC_TREND_STATISTICS.map((stat) => (
                    <div key={stat.id} className="p-3.5 space-y-1 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-bold text-[#1F2A1A]">{stat.name}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="px-2 py-0.5 rounded bg-[#5B7B4F]/15 text-[#3F5837] font-bold">
                            {stat.value}
                          </span>
                          {stat.pValue && (
                            <span className="text-[11px] text-[#5C6B52]">
                              ({stat.pValue})
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[#5C6B52] text-[11px]">{stat.methodology}</p>
                      <p className="text-[#1F2A1A] italic text-[11px] pt-0.5">
                        &ldquo;{stat.interpretation}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-[#DDD0B4] bg-[#F2E9D8]/40 flex items-center justify-between text-xs text-[#5C6B52]">
          <span>Fonte: Dissertação de Mestrado de Yolanda Tamele (UEM | ESUDER, 2026)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#5B7B4F] hover:bg-[#3F5837] text-white font-semibold cursor-pointer transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
