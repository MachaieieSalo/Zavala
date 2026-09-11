import React, { useState } from 'react';
import { DISSERTATION_METADATA } from '../../data/dissertationText';
import { THESIS_CORE_FACTS } from '../../data/thesisScientificData';
import {
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Layers,
  Activity,
  Info,
} from 'lucide-react';
import { SupportedLang } from '../../data/translations';

export type ThesisContextLevel = 'compact' | 'standard' | 'expanded';

interface ThesisContextProps {
  level?: ThesisContextLevel;
  onOpenDataModal?: () => void;
  currentLang?: SupportedLang;
  className?: string;
}

export const ThesisContext: React.FC<ThesisContextProps> = ({
  level = 'compact',
  onOpenDataModal,
  currentLang = 'pt',
  className = '',
}) => {
  const [isLocallyExpanded, setIsLocallyExpanded] = useState(false);
  const meta = DISSERTATION_METADATA;
  const isPt = currentLang === 'pt';

  // If level is expanded, show full view by default; otherwise allow toggling
  const showFullSummary = level === 'expanded' || isLocallyExpanded;

  if (level === 'compact') {
    return (
      <div className={`border-b border-[#D9CDAF] pb-2.5 pt-0.5 text-xs text-[#1A2417] ${className}`}>
        <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-3">
          {/* Breadcrumb Context & Short Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-semibold text-[#1A2417] uppercase tracking-wider text-[10px] shrink-0">
              {isPt ? 'Dissertação · ESUDER · UEM' : 'Dissertation · ESUDER · UEM'}
            </span>
            <span className="text-[#D9CDAF] hidden sm:inline">|</span>
            <span className="text-[#4F5C48] truncate font-medium text-[11px] sm:text-xs">
              {isPt
                ? 'Dinâmica da Produção de Mandioca · Zavala (1994–2024)'
                : 'Dynamics of Cassava Production · Zavala (1994–2024)'}
            </span>
            <span className="text-[#D9CDAF] hidden md:inline">|</span>
            <span className="text-[#4F5C48] font-mono text-[11px] shrink-0 hidden md:inline">
              Yolanda Tamele
            </span>
          </div>

          {/* Actions: View brief details / Tables modal */}
          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <button
              type="button"
              onClick={() => setIsLocallyExpanded(!isLocallyExpanded)}
              className="inline-flex items-center gap-1 font-medium text-[#4F5C48] hover:text-[#1A2417] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
              aria-expanded={isLocallyExpanded}
            >
              <span>{isLocallyExpanded ? (isPt ? 'Recolher' : 'Collapse') : (isPt ? 'Métricas & Resumo' : 'Metrics & Summary')}</span>
              {isLocallyExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {onOpenDataModal && (
              <button
                type="button"
                onClick={onOpenDataModal}
                className="inline-flex items-center gap-1 font-medium text-[#354D2C] hover:text-[#1A2417] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
                title="Consultar tabelas estatísticas do modelo"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isPt ? 'Tabelas' : 'Tables'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable summary from compact mode */}
        {isLocallyExpanded && (
          <div className="mt-3 pt-3 border-t border-[#D9CDAF]/70 space-y-3 animate-in fade-in duration-150">
            <p className="text-xs text-[#4F5C48] leading-relaxed max-w-4xl italic">
              "{meta.title}"
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2 border-y border-[#D9CDAF]/70 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#4F5C48] font-sans block">{isPt ? 'Série' : 'Series'}</span>
                <span className="font-bold text-[#1A2417]">{THESIS_CORE_FACTS.totalYears} {isPt ? 'Anos' : 'Years'}</span>
                <span className="text-[10px] text-[#4F5C48] block">{THESIS_CORE_FACTS.initialYear}–{THESIS_CORE_FACTS.terminalYear}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#4F5C48] font-sans block">{isPt ? 'Média Anual' : 'Annual Average'}</span>
                <span className="font-bold text-[#1A2417]">{THESIS_CORE_FACTS.averageProductionTonnes.toLocaleString('pt-MZ')} t</span>
                <span className="text-[10px] text-[#354D2C] block">{isPt ? `Pico ${Math.round(THESIS_CORE_FACTS.peakProductionTonnes / 1000)}k (${THESIS_CORE_FACTS.peakYear})` : `Peak ${Math.round(THESIS_CORE_FACTS.peakProductionTonnes / 1000)}k (${THESIS_CORE_FACTS.peakYear})`}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#4F5C48] font-sans block">Mann-Kendall</span>
                <span className="font-bold text-[#1A2417]">Z = {THESIS_CORE_FACTS.mannKendallZ.toFixed(3).replace('.', ',')}</span>
                <span className="text-[10px] text-[#4F5C48] block">{THESIS_CORE_FACTS.mannKendallPValue}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#4F5C48] font-sans block">{isPt ? 'Volatilidade' : 'Volatility'}</span>
                <span className="font-bold text-[#1A2417]">CV {THESIS_CORE_FACTS.coefficientOfVariationPercent.toFixed(1).replace('.', ',')}%</span>
                <span className="text-[10px] text-[#A8531E] block">{THESIS_CORE_FACTS.adverseYearsCountModeled} {isPt ? 'choques' : 'shocks'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard and Expanded Layouts
  return (
    <section className={`border-b border-[#D9CDAF] pb-4 space-y-3.5 text-[#1A2417] ${className}`}>
      {/* Top Meta Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-[#D9CDAF]/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1A2417]">{meta.institution}</span>
          <span className="text-[#D9CDAF]">·</span>
          <span className="text-[#4F5C48]">{meta.school}</span>
        </div>

        <div className="flex items-center gap-2 text-[#4F5C48] font-mono text-[11px]">
          <span>{meta.author}</span>
          <span className="text-[#D9CDAF]">·</span>
          <span>{meta.location} ({meta.date})</span>
        </div>
      </div>

      {/* Main Title */}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-[#1A2417] tracking-tight leading-snug font-display">
          {meta.title}
        </h2>
        {level === 'expanded' && (
          <p className="text-xs sm:text-sm text-[#4F5C48] leading-relaxed max-w-4xl">
            {isPt
              ? 'Investigação pioneira na reconstituição em três camadas da série de produção de mandioca (1994-2024), teste de tendências estruturais com correcção para dependência serial e mapeamento por deteção remota Sentinel-2 nos 11 bairros de Quissico.'
              : 'Pioneering research reconstructing 31 years of cassava production (1994–2024) via a three-layer model, serial-correlation corrected Mann-Kendall trend tests, and Sentinel-2 remote sensing across 11 villages in Quissico.'}
          </p>
        )}
      </div>

      {/* Econometric Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D9CDAF] border-y border-[#D9CDAF] py-2.5">
        <div className="py-1.5 sm:py-0 sm:px-3 first:pl-0">
          <span className="text-[10px] font-medium text-[#4F5C48] uppercase tracking-wider block">
            {isPt ? 'Série Histórica' : 'Historical Series'}
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-[#1A2417] block mt-0.5">
            {THESIS_CORE_FACTS.totalYears} {isPt ? 'Anos' : 'Years'}
          </span>
          <span className="text-[10px] text-[#4F5C48] font-mono">{THESIS_CORE_FACTS.initialYear} a {THESIS_CORE_FACTS.terminalYear}</span>
        </div>

        <div className="py-1.5 sm:py-0 sm:px-3">
          <span className="text-[10px] font-medium text-[#4F5C48] uppercase tracking-wider block">
            {isPt ? 'Média Anual' : 'Annual Average'}
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-[#1A2417] block mt-0.5">
            {THESIS_CORE_FACTS.averageProductionTonnes.toLocaleString('pt-MZ')} t
          </span>
          <span className="text-[10px] text-[#354D2C] font-mono font-medium">
            {isPt ? `Pico: ${Math.round(THESIS_CORE_FACTS.peakProductionTonnes / 1000)}k t (${THESIS_CORE_FACTS.peakYear})` : `Peak: ${Math.round(THESIS_CORE_FACTS.peakProductionTonnes / 1000)}k t (${THESIS_CORE_FACTS.peakYear})`}
          </span>
        </div>

        <div className="py-1.5 sm:py-0 sm:px-3">
          <span className="text-[10px] font-medium text-[#4F5C48] uppercase tracking-wider block">
            Mann-Kendall
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-[#1A2417] block mt-0.5">
            Z = {THESIS_CORE_FACTS.mannKendallZ.toFixed(3).replace('.', ',')}
          </span>
          <span className="text-[10px] text-[#4F5C48] font-mono">{THESIS_CORE_FACTS.mannKendallPValue} (p &lt; 0,01)</span>
        </div>

        <div className="py-1.5 sm:py-0 sm:px-3 last:pr-0">
          <span className="text-[10px] font-medium text-[#4F5C48] uppercase tracking-wider block">
            {isPt ? 'Volatilidade (CV)' : 'Volatility (CV)'}
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-[#1A2417] block mt-0.5">
            {THESIS_CORE_FACTS.coefficientOfVariationPercent.toFixed(1).replace('.', ',')}%
          </span>
          <span className="text-[10px] text-[#A8531E] font-mono font-medium">
            {THESIS_CORE_FACTS.adverseYearsCountModeled} {isPt ? 'anos de choque' : 'shock years'}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between text-xs pt-0.5">
        <button
          type="button"
          onClick={() => setIsLocallyExpanded(!isLocallyExpanded)}
          className="inline-flex items-center gap-1 font-medium text-[#1A2417] hover:text-[#354D2C] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
        >
          <span>
            {showFullSummary
              ? (isPt ? 'Ocultar Resumo da Tese' : 'Hide Thesis Summary')
              : (isPt ? 'Ver Resumo Executivo da Tese' : 'View Thesis Executive Summary')}
          </span>
          {showFullSummary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {onOpenDataModal && (
          <button
            type="button"
            onClick={onOpenDataModal}
            className="inline-flex items-center gap-1.5 font-medium text-[#354D2C] hover:text-[#1A2417] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2A3A24]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{isPt ? 'Consultar Tabelas do Modelo' : 'View Model Tables'}</span>
          </button>
        )}
      </div>

      {/* Expanded Executive Summary Section */}
      {showFullSummary && (
        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#4F5C48] leading-relaxed border-t border-[#D9CDAF]/70 animate-in fade-in duration-150">
          <div className="space-y-1">
            <h4 className="font-bold text-[#1A2417] flex items-center gap-1.5 font-display text-sm">
              <Layers className="w-3.5 h-3.5 text-[#354D2C]" />
              <span>{isPt ? 'Paradoxo Crescimento-Vulnerabilidade' : 'Growth-Vulnerability Paradox'}</span>
            </h4>
            <p>
              {isPt
                ? `A série apresenta tendência monotónica positiva de longo prazo (+3,20% a.a. na regressão log-linear), mas convive com ${THESIS_CORE_FACTS.adverseYearsCountModeled} anos de choques severos (${THESIS_CORE_FACTS.accumulatedLossesTonnes.toLocaleString('pt-MZ')} toneladas de perda acumulada no período modelado). O aumento de produtividade não extinguiu o risco ambiental.`
                : `The series displays an upward long-term monotonic trend (+3.20% p.a. log-linear), yet suffered ${THESIS_CORE_FACTS.adverseYearsCountModeled} severe shock years (${THESIS_CORE_FACTS.accumulatedLossesTonnes.toLocaleString('en-US')} tons cumulative loss during modeled period). Increased productivity did not eliminate environmental vulnerability.`}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-[#1A2417] flex items-center gap-1.5 font-display text-sm">
              <Activity className="w-3.5 h-3.5 text-[#A8531E]" />
              <span>{isPt ? 'Multi-Causalidade Climática e Espacial' : 'Climatic and Spatial Multi-Causality'}</span>
            </h4>
            <p>
              {isPt
                ? 'A precipitação CHIRPS isolada não explica a colheita (r = 0,057; p = 0,762). O colapso de 2023 ocorreu com +78,1% de chuva, provando que encharcamento, ciclones e propagação por estacas configuram um risco composto em bairros de baixa altitude como Nzile.'
                : 'Isolated CHIRPS rainfall does not linearly explain yield (r = 0.057; p = 0.762). The 2023 collapse happened under +78.1% rainfall, proving that waterlogging, cyclones, and stem vectoring create composite risks in low-lying villages like Nzile.'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
