import React, { useState } from 'react';
import { DISSERTATION_METADATA } from '../data/dissertationText';
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import { TRANSLATIONS, SupportedLang } from '../data/translations';

interface ThesisOverviewBannerProps {
  onOpenDataModal?: () => void;
  currentLang?: SupportedLang;
}

export const ThesisOverviewBanner: React.FC<ThesisOverviewBannerProps> = ({
  onOpenDataModal,
  currentLang = 'pt',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const meta = DISSERTATION_METADATA;
  const isPt = currentLang === 'pt';

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 sm:p-6 transition-all space-y-4">
      {/* Top Academic Context */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span>{meta.institution}</span>
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500">{meta.school}</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-500 font-mono text-[11px]">
          <span>{meta.author}</span>
          <span>•</span>
          <span>{meta.location} ({meta.date})</span>
        </div>
      </div>

      {/* Main Thesis Title */}
      <div className="space-y-1.5">
        <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight leading-snug">
          {meta.title}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-4xl">
          {isPt
            ? 'Investigação pioneira na reconstituição em três camadas da série de produção de mandioca (1994-2024), teste de tendências estruturais com correcção para dependência serial e mapeamento por deteção remota Sentinel-2 nos 11 bairros de Quissico.'
            : 'Pioneering research reconstructing 31 years of cassava production (1994–2024) via a three-layer model, serial-correlation corrected Mann-Kendall trend tests, and Sentinel-2 remote sensing across 11 villages in Quissico.'}
        </p>
      </div>

      {/* 4 Crisp Key Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <span className="text-[11px] font-medium text-zinc-500 block">
            {isPt ? 'Série Histórica' : 'Historical Series'}
          </span>
          <span className="text-base font-bold font-mono text-zinc-900 block mt-0.5">31 {isPt ? 'Anos' : 'Years'}</span>
          <span className="text-[11px] text-zinc-500 font-mono">1994 a 2024</span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <span className="text-[11px] font-medium text-zinc-500 block">
            {isPt ? 'Média Anual' : 'Annual Average'}
          </span>
          <span className="text-base font-bold font-mono text-zinc-900 block mt-0.5">115.333 t</span>
          <span className="text-[11px] text-emerald-700 font-mono font-medium">
            {isPt ? 'Pico: 273k t (2021)' : 'Peak: 273k t (2021)'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <span className="text-[11px] font-medium text-zinc-500 block">Mann-Kendall</span>
          <span className="text-base font-bold font-mono text-zinc-900 block mt-0.5">Z = 3,100</span>
          <span className="text-[11px] text-zinc-500 font-mono">p = 0,0019 (p &lt; 0,01)</span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <span className="text-[11px] font-medium text-zinc-500 block">
            {isPt ? 'Volatilidade (CV)' : 'Volatility (CV)'}
          </span>
          <span className="text-base font-bold font-mono text-zinc-900 block mt-0.5">56,3%</span>
          <span className="text-[11px] text-amber-700 font-mono font-medium">
            {isPt ? '14 anos de choque' : '14 shock years'}
          </span>
        </div>
      </div>

      {/* Collapsible toggle for synthesis */}
      <div className="pt-2 flex items-center justify-between border-t border-zinc-100 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 font-semibold text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <span>
              {isExpanded
                ? isPt ? 'Ocultar Resumo Executivo' : 'Hide Executive Summary'
                : isPt ? 'Ver Resumo Executivo da Tese' : 'View Thesis Executive Summary'}
            </span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {onOpenDataModal && (
          <button
            type="button"
            onClick={onOpenDataModal}
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{isPt ? 'Consultar Tabelas do Modelo' : 'View Model Tables'}</span>
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 animate-in fade-in duration-150">
          <div className="space-y-1.5 p-3.5 rounded-xl bg-zinc-50/60 border border-zinc-100">
            <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isPt ? 'Paradoxo Crescimento-Vulnerabilidade' : 'Growth-Vulnerability Paradox'}</span>
            </h4>
            <p>
              {isPt
                ? 'A série apresenta tendência monotónica positiva de longo prazo (+3,20% a.a. na regressão log-linear), mas convive com 14 anos de choques severos (547.224 toneladas de perda acumulada). O aumento de produtividade não extinguiu o risco ambiental.'
                : 'The series displays an upward long-term monotonic trend (+3.20% p.a. log-linear), yet suffered 14 severe shock years (547,224 tons cumulative loss). Increased productivity did not eliminate environmental vulnerability.'}
            </p>
          </div>

          <div className="space-y-1.5 p-3.5 rounded-xl bg-zinc-50/60 border border-zinc-100">
            <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
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
    </div>
  );
};
