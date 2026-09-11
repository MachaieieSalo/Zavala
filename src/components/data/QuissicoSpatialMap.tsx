import React, { useState } from 'react';
import {
  QUISSICO_BAIRROS_SPATIAL,
  QuissicoBairroSpatial,
  THESIS_CORE_FACTS,
} from '../../data/thesisScientificData';
import {
  MapPin,
  Layers,
  Mountain,
  Info,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';

interface QuissicoSpatialMapProps {
  onSendToStudio?: (text: string) => void;
}

type SpatialLayer = 'dynamic_world' | 'territorial' | 'srtm_elevation';

export const QuissicoSpatialMap: React.FC<QuissicoSpatialMapProps> = ({
  onSendToStudio,
}) => {
  const [activeLayer, setActiveLayer] = useState<SpatialLayer>('dynamic_world');
  const [selectedBairroId, setSelectedBairroId] = useState<string>('bairro_nzile');

  const selectedBairro =
    QUISSICO_BAIRROS_SPATIAL.find((b) => b.id === selectedBairroId) ||
    QUISSICO_BAIRROS_SPATIAL[0];

  // Helper for color shading based on active layer
  const getBairroFill = (bairro: QuissicoBairroSpatial, isSelected: boolean) => {
    if (activeLayer === 'dynamic_world') {
      // Scale from light green (#C2D6BA) to deep crop green (#354D2C)
      const share = bairro.dynamicWorldCropsSharePercent;
      if (share >= 15) return isSelected ? '#25381E' : '#354D2C';
      if (share >= 12) return isSelected ? '#3B5431' : '#4A6B3E';
      if (share >= 8) return isSelected ? '#5C7E4F' : '#6F9361';
      return isSelected ? '#8EA883' : '#A9BEA1';
    }

    if (activeLayer === 'territorial') {
      // Scale based on territorial share (Modelo A)
      const share = bairro.territorialSharePercent;
      if (share >= 20) return isSelected ? '#1A2417' : '#2A3A24';
      if (share >= 10) return isSelected ? '#3F5837' : '#4F5C48';
      return isSelected ? '#75866D' : '#9AA993';
    }

    // SRTM Elevation: lower altitude (< 9m) gets highlighted in terracotta/clay
    if (bairro.srtmBelow9mPercent >= 50) {
      return isSelected ? '#7D370F' : '#A8531E'; // High depression risk (Nzile, Macomane)
    }
    if (bairro.srtmBelow9mPercent >= 10) {
      return isSelected ? '#9C5E28' : '#C47B3B';
    }
    return isSelected ? '#4A6B3E' : '#738F68'; // High plateau (> 100m)
  };

  return (
    <div className="space-y-4">
      {/* Layer selector bar */}
      <div className="bg-[#FCFAF6] p-3 rounded-[4px] border border-[#D9CDAF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Camada analítica do mapa">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#4F5C48] mr-1">
            Camada:
          </span>
          <button
            type="button"
            onClick={() => setActiveLayer('dynamic_world')}
            className={`px-2.5 py-1 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              activeLayer === 'dynamic_world'
                ? 'bg-[#354D2C] text-[#FCFAF6]'
                : 'bg-[#EAE2D2]/50 text-[#1A2417] hover:bg-[#EAE2D2]'
            }`}
          >
            Modelo B: Dynamic World P75 (Satélite 10m)
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('territorial')}
            className={`px-2.5 py-1 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              activeLayer === 'territorial'
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'bg-[#EAE2D2]/50 text-[#1A2417] hover:bg-[#EAE2D2]'
            }`}
          >
            Modelo A: Área Territorial Administrativa
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('srtm_elevation')}
            className={`px-2.5 py-1 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              activeLayer === 'srtm_elevation'
                ? 'bg-[#A8531E] text-[#FCFAF6]'
                : 'bg-[#EAE2D2]/50 text-[#A8531E] hover:bg-[#EAE2D2]'
            }`}
          >
            Topografia SRTM 30m (Cota &lt; 9m)
          </button>
        </div>

        <div className="text-xs text-[#4F5C48] flex items-center gap-1 font-mono">
          <span>Escopo: {THESIS_CORE_FACTS.spatialBairrosCount} Bairros de Quissico</span>
          <span>•</span>
          <span>{THESIS_CORE_FACTS.spatialAreaQuissicoHa.toLocaleString('pt-MZ')} ha</span>
        </div>
      </div>

      {/* Main Grid: Visual Cartogram/Map on Left, Deep Analysis on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Spatial Map Vector Stage */}
        <div className="lg:col-span-7 bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#354D2C]" />
              <span className="text-xs font-bold text-[#1A2417] uppercase tracking-wider font-mono">
                Esquema Cartográfico dos {THESIS_CORE_FACTS.spatialBairrosCount} Bairros de Quissico
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#4F5C48]">
              {activeLayer === 'dynamic_world'
                ? 'Cor: % Cultivo Sentinel-2'
                : activeLayer === 'territorial'
                ? 'Cor: % Extensão Territorial'
                : 'Cor: Vulnerabilidade Cota < 9m'}
            </span>
          </div>

          {/* SVG Map of the Bairros */}
          <div className="relative w-full aspect-[5/3] bg-[#EAE2D2]/30 rounded-[2px] border border-[#D9CDAF]/60 p-2 flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 500 270"
              className="w-full h-full select-none"
              role="img"
              aria-label={`Mapa esquemático dos ${THESIS_CORE_FACTS.spatialBairrosCount} bairros do Posto Administrativo de Quissico`}
            >
              {/* Coastline indication */}
              <path
                d="M 10 260 C 150 250, 300 255, 490 260"
                fill="none"
                stroke="#354D2C"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                opacity="0.5"
              />
              <text
                x="250"
                y="266"
                textAnchor="middle"
                className="font-mono text-[9px] fill-[#354D2C] uppercase tracking-widest font-semibold"
              >
                Oceano Índico · Costa Sul de Zavala
              </text>

              {/* Bairros Polygons / Blocks */}
              {QUISSICO_BAIRROS_SPATIAL.map((b) => {
                const isSelected = b.id === selectedBairroId;
                const { x, y, width, height } = b.svgPathCoords;
                const fill = getBairroFill(b, isSelected);

                return (
                  <g
                    key={b.id}
                    onClick={() => setSelectedBairroId(b.id)}
                    className="cursor-pointer group"
                    tabIndex={0}
                    role="button"
                    aria-label={`Bairro ${b.name}: ${b.dynamicWorldCropsSharePercent}% colheita Dynamic World`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedBairroId(b.id);
                      }
                    }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx="3"
                      fill={fill}
                      stroke={isSelected ? '#1A2417' : '#FCFAF6'}
                      strokeWidth={isSelected ? 2.5 : 1.2}
                      className="transition-all duration-150 group-hover:opacity-90"
                    />

                    {/* Bairro Name */}
                    <text
                      x={x + width / 2}
                      y={y + height / 2 - 4}
                      textAnchor="middle"
                      className="font-sans text-[10px] font-bold fill-[#FCFAF6] pointer-events-none drop-shadow-sm"
                    >
                      {b.name}
                    </text>

                    {/* Value Badge on Map */}
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 10}
                      textAnchor="middle"
                      className="font-mono text-[9px] fill-[#FCFAF6] pointer-events-none"
                    >
                      {activeLayer === 'dynamic_world'
                        ? `${b.dynamicWorldCropsSharePercent}%`
                        : activeLayer === 'territorial'
                        ? `${b.territorialSharePercent}%`
                        : `${b.srtmAverageElevationM}m`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map bottom note */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#4F5C48]">
            <span>Clique num bairro para analisar a respetiva ficha biofísica.</span>
            <span className="font-mono">Fonte: Tabela 7 da Dissertação (p. 112)</span>
          </div>
        </div>

        {/* Selected Bairro Inspector Panel */}
        <div className="lg:col-span-5 bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#D9CDAF]/80 pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
                  Bairro do Posto de Quissico
                </span>
                <h4 className="font-serif text-lg font-bold text-[#1A2417]">
                  {selectedBairro.name}
                </h4>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-[2px] bg-[#EAE2D2] text-[#1A2417] font-semibold">
                Grupo: {selectedBairro.zoneGroup}
              </span>
            </div>

            {/* Model A vs Model B Comparative Row */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-[#EAE2D2]/30 p-2 rounded-[2px] border border-[#D9CDAF]/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
                  Modelo B (Sentinel-2)
                </span>
                <span className="font-mono text-base font-bold text-[#354D2C] tabular-nums">
                  {selectedBairro.dynamicWorldCropsSharePercent}%
                </span>
                <span className="text-[10px] text-[#4F5C48] block mt-0.5">
                  Peso Agrícola Real P75
                </span>
              </div>

              <div className="bg-[#EAE2D2]/30 p-2 rounded-[2px] border border-[#D9CDAF]/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
                  Modelo A (Territorial)
                </span>
                <span className="font-mono text-base font-bold text-[#1A2417] tabular-nums">
                  {selectedBairro.territorialSharePercent}%
                </span>
                <span className="text-[10px] text-[#4F5C48] block mt-0.5">
                  {selectedBairro.territorialAreaHa.toLocaleString('pt-MZ')} hectares
                </span>
              </div>
            </div>

            {/* Topographic Data (SRTM 30m) */}
            <div className="bg-[#EAE2D2]/30 p-2.5 rounded-[2px] border border-[#D9CDAF]/50 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#4F5C48] flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-[#354D2C]" />
                  Altimetria Média (SRTM 30m)
                </span>
                <span className="font-mono font-bold text-[#1A2417] tabular-nums">
                  {selectedBairro.srtmAverageElevationM.toFixed(1)} metros
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#4F5C48]">
                  Área em Cota Baixa (&lt; 9m)
                </span>
                <span
                  className={`font-mono font-bold tabular-nums ${
                    selectedBairro.srtmBelow9mPercent >= 50
                      ? 'text-[#A8531E]'
                      : 'text-[#1A2417]'
                  }`}
                >
                  {selectedBairro.srtmBelow9mPercent.toFixed(1)}% do bairro
                </span>
              </div>
            </div>

            {/* Ethnographic Profile & Topographic Risk Description */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-[#1A2417] block mb-0.5">
                  Perfil Agrícola e Machambas:
                </span>
                <p className="text-[#1A2417] leading-relaxed text-[11px]">
                  {selectedBairro.agriculturalProfile}
                </p>
              </div>
              <div className="bg-[#FFFDF8] p-2 rounded-[2px] border border-[#D9CDAF]">
                <span className="font-semibold text-[#A8531E] block text-[11px] mb-0.5 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#A8531E]" />
                  Avaliação Topográfica da Tese:
                </span>
                <p className="text-[#4F5C48] leading-relaxed text-[11px] italic">
                  {selectedBairro.topographicRisk}
                </p>
              </div>
            </div>
          </div>

          {/* Action to read text */}
          {onSendToStudio && (
            <button
              type="button"
              onClick={() => {
                const speech = `Ficha do Bairro de ${selectedBairro.name}, Posto Administrativo de Quissico. Grupo geográfico: ${selectedBairro.zoneGroup}. No Modelo B com imagens de satélite Sentinel-2 Dynamic World, este bairro detém ${selectedBairro.dynamicWorldCropsSharePercent}% da área cultivada, contra ${selectedBairro.territorialSharePercent}% da área administrativa no Modelo A. A altitude média apurada pelo modelo SRTM é de ${selectedBairro.srtmAverageElevationM} metros, tendo ${selectedBairro.srtmBelow9mPercent}% do seu terreno situado na cota crítica inferior a 9 metros. ${selectedBairro.agriculturalProfile}`;
                onSendToStudio(speech);
              }}
              className="w-full py-1.5 text-xs font-semibold text-[#354D2C] hover:text-[#1A2417] bg-[#EAE2D2]/50 hover:bg-[#EAE2D2] rounded-[2px] border border-[#D9CDAF] cursor-pointer transition-colors text-center"
            >
              Enviar dados de {selectedBairro.name} para o Estúdio de Voz
            </button>
          )}
        </div>
      </div>

      {/* Structural Finding: Gini Coefficient Comparison Box */}
      <div className="bg-[#FFFDF8] rounded-[4px] border border-[#D9CDAF] p-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9CDAF]/60 pb-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#354D2C]" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#1A2417]">
              Revelação Metodológica da Tabela 7: Redução do Índice de Gini (0,319 → 0,235)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-[#4F5C48]">
            Dynamic World (Sentinel-2 10m) vs Área Administrativa
          </span>
        </div>

        <p className="text-xs text-[#1A2417] leading-relaxed">
          A confrontação dos dois modelos espaciais resolve uma das falhas mais comuns nas análises de planeamento agrário distrital. O <strong>Modelo A (Área Administrativa)</strong> atribuía a Nzile <strong>26,8%</strong> de toda a produção de mandioca de Quissico puramente pela sua grande extensão física. O <strong>Modelo B (Sentinel-2 Dynamic World P75)</strong> comprovou que a área agrícola real de Nzile é de <strong>16,6%</strong>, enquanto bairros menores como Zavalene (13,6%), Dombe (13,4%) e Nhamajal (10,5%) revelam densidades agrícolas muito superiores. Esta transição reduz o coeficiente de Gini de concentração territorial de <strong>0,319 para 0,235</strong>, provando que o cultivo de mandioca está mais democraticamente disperso pelas comunidades do que o mapa político sugeria.
        </p>
      </div>
    </div>
  );
};
