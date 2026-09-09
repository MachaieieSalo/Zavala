import React, { useState } from 'react';
import {
  ScientificTimeSeriesPoint,
} from '../../data/thesisScientificData';
import {
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface ScientificChartProps {
  series: ScientificTimeSeriesPoint[];
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
  onSendToStudio?: (text: string) => void;
}

type FilterRange = 'all' | 'modeled' | 'observed' | 'shocks';

export const ScientificChart: React.FC<ScientificChartProps> = ({
  series,
  selectedYear,
  onSelectYear,
  onSendToStudio,
}) => {
  const [filter, setFilter] = useState<FilterRange>('all');

  const filteredSeries = series.filter((pt) => {
    if (filter === 'modeled') return pt.status === 'MODELADO';
    if (filter === 'observed') return pt.status === 'OBSERVADO';
    if (filter === 'shocks') return pt.isAdverseYear;
    return true;
  });

  const activePoint = series.find((p) => p.year === selectedYear) || series[series.length - 2]; // default to 2023 or selected

  // Chart coordinate geometry (SVG viewBox: 920 x 320)
  const svgWidth = 920;
  const svgHeight = 320;
  const padding = { top: 30, right: 35, bottom: 45, left: 65 };
  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  const minYear = 1994;
  const maxYear = 2024;
  const maxProd = 300000; // t

  const getX = (year: number) =>
    padding.left + ((year - minYear) / (maxYear - minYear)) * innerWidth;
  const getY = (val: number) =>
    padding.top + innerHeight - (Math.min(val, maxProd) / maxProd) * innerHeight;

  // Confidence area path for modeled period (1994-2016)
  const modeledPoints = series.filter((p) => p.status === 'MODELADO');
  const upperPath = modeledPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.upperConfidenceTonnes)}`)
    .join(' ');
  const lowerPath = [...modeledPoints]
    .reverse()
    .map((p) => `L ${getX(p.year)} ${getY(p.lowerConfidenceTonnes)}`)
    .join(' ');
  const confidenceArea = `${upperPath} ${lowerPath} Z`;

  // Production polyline
  const productionPath = series
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.productionTonnes)}`)
    .join(' ');

  // Structural OLS trend line (from 1994: ~48.000 t to 2024: ~175.000 t)
  const trendPath = `M ${getX(1994)} ${getY(48000)} L ${getX(2024)} ${getY(175000)}`;

  // Transition vertical line between 2016 and 2017
  const transitionX = (getX(2016) + getX(2017)) / 2;

  // Y-axis grid ticks
  const yTicks = [0, 50000, 100000, 150000, 200000, 250000, 300000];

  return (
    <div className="space-y-4">
      {/* Control bar: Range filter & chart legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFAF6] p-3 rounded-[4px] border border-[#D9CDAF]">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtro de período temporal">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#4F5C48] mr-1">
            Intervalo:
          </span>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'bg-[#EAE2D2]/50 text-[#1A2417] hover:bg-[#EAE2D2]'
            }`}
          >
            Série Total (1994–2024)
          </button>
          <button
            type="button"
            onClick={() => setFilter('modeled')}
            className={`px-2.5 py-1 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              filter === 'modeled'
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'bg-[#EAE2D2]/50 text-[#1A2417] hover:bg-[#EAE2D2]'
            }`}
          >
            Modelado (1994–2016)
          </button>
          <button
            type="button"
            onClick={() => setFilter('observed')}
            className={`px-2.5 py-1 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              filter === 'observed'
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'bg-[#EAE2D2]/50 text-[#1A2417] hover:bg-[#EAE2D2]'
            }`}
          >
            Observado SDAE (2017–2024)
          </button>
          <button
            type="button"
            onClick={() => setFilter('shocks')}
            className={`px-2.5 py-1 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              filter === 'shocks'
                ? 'bg-[#A8531E] text-[#FCFAF6]'
                : 'bg-[#EAE2D2]/50 text-[#A8531E] hover:bg-[#EAE2D2]'
            }`}
          >
            Anos de Choque (14 Anos)
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#4F5C48]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#4A6B3E] inline-block" />
            <span>Produção Anual (t)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-[#1A2417] inline-block" />
            <span>Tendência OLS (+4.229 t/a)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A8531E] inline-block" />
            <span>Choque Climático</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-[#EAE2D2]/60 border border-[#D9CDAF] inline-block" />
            <span>IC ±15–20%</span>
          </div>
        </div>
      </div>

      {/* Primary SVG Time Series Chart */}
      <div className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-3 sm:p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[420px] select-none"
          role="img"
          aria-label="Gráfico científico da produção de mandioca em Zavala de 1994 a 2024"
        >
          {/* Background gridlines */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={`ytick-${tick}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#D9CDAF"
                  strokeWidth="0.75"
                  strokeDasharray={tick === 0 ? undefined : '2,3'}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="font-mono text-[10px] fill-[#4F5C48]"
                >
                  {(tick / 1000).toFixed(0)}k t
                </text>
              </g>
            );
          })}

          {/* X-axis year ticks */}
          {series
            .filter((_, idx) => idx % 2 === 0 || idx === series.length - 1)
            .map((p) => {
              const x = getX(p.year);
              return (
                <g key={`xtick-${p.year}`}>
                  <line
                    x1={x}
                    y1={svgHeight - padding.bottom}
                    x2={x}
                    y2={svgHeight - padding.bottom + 5}
                    stroke="#D9CDAF"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={svgHeight - padding.bottom + 16}
                    textAnchor="middle"
                    className="font-mono text-[10px] fill-[#4F5C48]"
                  >
                    {p.year}
                  </text>
                </g>
              );
            })}

          {/* Confidence interval band for modeled segment (1994-2016) */}
          <path
            d={confidenceArea}
            fill="#EAE2D2"
            fillOpacity="0.55"
            stroke="none"
          />

          {/* Transition boundary divider line at 2016/2017 */}
          <line
            x1={transitionX}
            y1={padding.top}
            x2={transitionX}
            y2={svgHeight - padding.bottom}
            stroke="#1A2417"
            strokeWidth="1.2"
            strokeDasharray="3,3"
          />
          <text
            x={transitionX - 6}
            y={padding.top + 14}
            textAnchor="end"
            className="font-mono text-[9px] fill-[#4F5C48] uppercase tracking-wider font-semibold"
          >
            ← Modelado (3 Camadas)
          </text>
          <text
            x={transitionX + 6}
            y={padding.top + 14}
            textAnchor="start"
            className="font-mono text-[9px] fill-[#354D2C] uppercase tracking-wider font-semibold"
          >
            Observado SDAE (Primário) →
          </text>

          {/* OLS Structural Trend Line */}
          <path
            d={trendPath}
            stroke="#1A2417"
            strokeWidth="1.2"
            strokeDasharray="4,4"
            fill="none"
            opacity="0.65"
          />

          {/* Production solid trend line */}
          <path
            d={productionPath}
            fill="none"
            stroke="#4A6B3E"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Historical key shock vertical markers */}
          {[2000, 2007, 2016, 2021, 2023].map((yr) => {
            const pt = series.find((p) => p.year === yr);
            if (!pt) return null;
            const x = getX(yr);
            const y = getY(pt.productionTonnes);
            const isPeak = yr === 2021;
            const isCollapse = yr === 2023;

            return (
              <g key={`shock-flag-${yr}`}>
                <line
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={isPeak ? y - 22 : y + (isCollapse ? 20 : 25)}
                  stroke={isPeak ? '#354D2C' : '#A8531E'}
                  strokeWidth="0.8"
                />
                <text
                  x={x}
                  y={isPeak ? y - 26 : y + (isCollapse ? 32 : 36)}
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-bold ${
                    isPeak ? 'fill-[#354D2C]' : 'fill-[#A8531E]'
                  }`}
                >
                  {yr === 2000
                    ? '2000: Cheias'
                    : yr === 2007
                    ? '2007: Favio'
                    : yr === 2016
                    ? '2016: Seca El Niño'
                    : yr === 2021
                    ? '2021: Pico 273k t'
                    : '2023: -87% Freddy'}
                </text>
              </g>
            );
          })}

          {/* Interactive points */}
          {series.map((pt) => {
            const x = getX(pt.year);
            const y = getY(pt.productionTonnes);
            const isSelected = pt.year === selectedYear;
            const isHighlightedByFilter =
              filter === 'all' ||
              (filter === 'modeled' && pt.status === 'MODELADO') ||
              (filter === 'observed' && pt.status === 'OBSERVADO') ||
              (filter === 'shocks' && pt.isAdverseYear);

            return (
              <g
                key={`point-${pt.year}`}
                onClick={() => onSelectYear(pt.year)}
                className="cursor-pointer group"
                tabIndex={0}
                role="button"
                aria-label={`Ano ${pt.year}: ${pt.productionTonnes.toLocaleString('pt-MZ')} toneladas, ${pt.status}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectYear(pt.year);
                  }
                }}
              >
                {/* Invisible larger hit target */}
                <circle cx={x} cy={y} r="10" fill="transparent" />

                {/* Selected outer aura */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="none"
                    stroke="#1A2417"
                    strokeWidth="2"
                    strokeDasharray="2,2"
                  />
                )}

                {/* Data point circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 5.5 : pt.isAdverseYear ? 4.5 : 3.5}
                  fill={
                    pt.isAdverseYear
                      ? '#A8531E'
                      : pt.status === 'OBSERVADO'
                      ? '#354D2C'
                      : '#FCFAF6'
                  }
                  stroke={pt.isAdverseYear ? '#A8531E' : '#354D2C'}
                  strokeWidth={pt.status === 'MODELADO' ? 2 : 1.5}
                  opacity={isHighlightedByFilter ? 1 : 0.25}
                  className="transition-all duration-150 group-hover:scale-125"
                />
              </g>
            );
          })}
        </svg>

        {/* Micro-legend below chart */}
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#4F5C48] border-t border-[#D9CDAF]/60 pt-2">
          <span>
            Unidade: toneladas de raízes frescas de mandioca (t). Eixo X: anos agrícolas (1994–2024).
          </span>
          <span className="font-mono">
            Linha de corte metodológico: 2016 / 2017 (Teste de Chow p &gt; 0,10)
          </span>
        </div>
      </div>

      {/* Active point inspector card */}
      {activePoint && (
        <div className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9CDAF]/80 pb-2.5">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#354D2C]" />
              <span className="font-mono text-base font-bold text-[#1A2417]">
                Ano Agrícola {activePoint.year}
              </span>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] font-semibold ${
                  activePoint.status === 'OBSERVADO'
                    ? 'bg-[#354D2C]/10 text-[#354D2C] border border-[#354D2C]/30'
                    : 'bg-[#4F5C48]/10 text-[#4F5C48] border border-[#4F5C48]/30'
                }`}
              >
                {activePoint.statusLabel}
              </span>
              {activePoint.isAdverseYear && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#A8531E]/10 text-[#A8531E] border border-[#A8531E]/30 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Ano Adverso / Choque
                </span>
              )}
            </div>

            {onSendToStudio && (
              <button
                type="button"
                onClick={() => {
                  const speech = `No ano agrícola de ${activePoint.year}, a produção de mandioca no Distrito de Zavala registou ${activePoint.productionTonnes.toLocaleString('pt-MZ')} toneladas, sob o estatuto de dado ${activePoint.status}. A área colhida foi de ${activePoint.areaHa.toLocaleString('pt-MZ')} hectares, com rendimento de ${activePoint.effectiveYieldTonnesHa.toFixed(2)} toneladas por hectare. Evento registrado: ${activePoint.eventOrShock}. Nota da dissertação: ${activePoint.methodologicalNote}`;
                  onSendToStudio(speech);
                }}
                className="text-xs font-semibold text-[#354D2C] hover:text-[#1A2417] cursor-pointer inline-flex items-center gap-1"
              >
                <span>Enviar leitura para o Estúdio</span>
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>

          {/* Quantitative metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
            <div className="bg-[#EAE2D2]/30 p-2.5 rounded-[2px] border border-[#D9CDAF]/50">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
                Produção Real / Estimada
              </span>
              <span className="font-mono text-base font-bold text-[#1A2417] tabular-nums">
                {activePoint.productionTonnes.toLocaleString('pt-MZ')} t
              </span>
              <span className="text-[10px] text-[#4F5C48] block mt-0.5">
                {activePoint.annualVarPercent !== null
                  ? `${activePoint.annualVarPercent > 0 ? '+' : ''}${activePoint.annualVarPercent}% vs ano ant.`
                  : 'Ano Base'}
              </span>
            </div>

            <div className="bg-[#EAE2D2]/30 p-2.5 rounded-[2px] border border-[#D9CDAF]/50">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
                Rendimento Efetivo
              </span>
              <span className="font-mono text-base font-bold text-[#1A2417] tabular-nums">
                {activePoint.effectiveYieldTonnesHa.toFixed(2)} t/ha
              </span>
              <span className="text-[10px] text-[#4F5C48] block mt-0.5">
                Área: {activePoint.areaHa.toLocaleString('pt-MZ')} ha
              </span>
            </div>

            <div className="bg-[#EAE2D2]/30 p-2.5 rounded-[2px] border border-[#D9CDAF]/50">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
                Precipitação CHIRPS v2.0
              </span>
              <span className="font-mono text-base font-bold text-[#1A2417] tabular-nums">
                {activePoint.chirpsRainfallMm.toFixed(1)} mm
              </span>
              <span
                className={`text-[10px] font-mono block mt-0.5 ${
                  activePoint.chirpsAnomalyPercent < -15
                    ? 'text-[#A8531E] font-semibold'
                    : activePoint.chirpsAnomalyPercent > 20
                    ? 'text-[#354D2C] font-semibold'
                    : 'text-[#4F5C48]'
                }`}
              >
                Anomalia: {activePoint.chirpsAnomalyPercent > 0 ? '+' : ''}
                {activePoint.chirpsAnomalyPercent.toFixed(1)}%
              </span>
            </div>

            <div className="bg-[#EAE2D2]/30 p-2.5 rounded-[2px] border border-[#D9CDAF]/50">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
                {activePoint.shockLossTonnes ? 'Perda Estimada' : 'Potencial de Tendência'}
              </span>
              <span
                className={`font-mono text-base font-bold tabular-nums ${
                  activePoint.shockLossTonnes ? 'text-[#A8531E]' : 'text-[#1A2417]'
                }`}
              >
                {activePoint.shockLossTonnes
                  ? `-${activePoint.shockLossTonnes.toLocaleString('pt-MZ')} t`
                  : `${activePoint.trendProductionTonnes.toLocaleString('pt-MZ')} t`}
              </span>
              <span className="text-[10px] text-[#4F5C48] block mt-0.5">
                {activePoint.shockLossPercent
                  ? `Quebra: -${activePoint.shockLossPercent.toFixed(1)}%`
                  : 'Condição normal'}
              </span>
            </div>
          </div>

          {/* Contextual event and methodological note */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-[#1A2417] shrink-0">Evento Agronómico / Choque:</span>
              <span className="text-[#1A2417] leading-relaxed">{activePoint.eventOrShock}</span>
            </div>
            <div className="flex items-start gap-2 text-[#4F5C48] pt-1">
              <Info className="w-3.5 h-3.5 text-[#4F5C48] shrink-0 mt-0.5" />
              <span className="leading-relaxed italic">
                {activePoint.methodologicalNote}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
