import React, { useState, useEffect } from 'react';
import {
  SCIENTIFIC_TIME_SERIES,
  SCIENTIFIC_TREND_STATISTICS,
  CHIRPS_CORRELATION_ANALYSIS,
  DATA_SOURCES_REGISTRY,
  SCIENTIFIC_LIMITATIONS,
  ScientificTimeSeriesPoint,
  THESIS_CORE_FACTS,
} from '../data/thesisScientificData';
import { ScientificChart } from './data/ScientificChart';
import { ScientificTable } from './data/ScientificTable';
import { QuissicoSpatialMap } from './data/QuissicoSpatialMap';
import {
  BookOpen,
  Calendar,
  Layers,
  LineChart,
  Table as TableIcon,
  AlertTriangle,
  CloudRain,
  Compass,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SupportedLang } from '../data/translations';

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
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [selectedYear, setSelectedYear] = useState<number>(highlightYear || 2023);
  const [activeSection, setActiveSection] = useState<string>('serie');
  const [isLimitationsExpanded, setIsLimitationsExpanded] = useState<boolean>(true);

  useEffect(() => {
    if (highlightYear) {
      setSelectedYear(highlightYear);
    }
  }, [highlightYear]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const shockYearsList = SCIENTIFIC_TIME_SERIES.filter((p) => p.isAdverseYear);

  return (
    <div className="space-y-6">
      {/* 1. Internal Sticky Section Navigator */}
      <nav
        aria-label={isPt ? 'Navegação interna da estação de dados' : 'Data station internal navigation'}
        className="sticky top-2 z-20 bg-[#FCFAF6]/95 backdrop-blur-sm p-1.5 rounded-[4px] border border-[#D9CDAF] shadow-xs flex items-center justify-between gap-1 overflow-x-auto text-xs"
      >
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => scrollToSection('sec_contexto')}
            className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'contexto'
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50'
            }`}
          >
            {isPt ? '1. Como Ler' : '1. How to Read'}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('sec_serie')}
            className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'serie'
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50'
            }`}
          >
            {isPt ? '2. Série (1994–2024)' : '2. Series (1994–2024)'}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('sec_tendencia')}
            className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'tendencia'
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50'
            }`}
          >
            {isPt ? '3. Tendência' : '3. Trend'}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('sec_choques')}
            className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'choques'
                ? 'bg-[#A8531E] text-[#FCFAF6]'
                : 'text-[#A8531E] hover:bg-[#EAE2D2]/50'
            }`}
          >
            {isPt ? '4. Choques' : '4. Shocks'}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('sec_chirps')}
            className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'chirps'
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50'
            }`}
          >
            {isPt ? '5. Clima (CHIRPS)' : '5. Climate (CHIRPS)'}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('sec_espacial')}
            className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'espacial'
                ? 'bg-[#354D2C] text-[#FCFAF6]'
                : 'text-[#354D2C] hover:bg-[#EAE2D2]/50'
            }`}
          >
            {isPt ? '6. Espacial (Quissico)' : '6. Spatial (Quissico)'}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('sec_limitacoes')}
            className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'limitacoes'
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50'
            }`}
          >
            {isPt ? '7. Incerteza' : '7. Uncertainty'}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('sec_fontes')}
            className={`px-2.5 py-1 rounded-[2px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'fontes'
                ? 'bg-[#1A2417] text-[#FCFAF6]'
                : 'text-[#4F5C48] hover:text-[#1A2417] hover:bg-[#EAE2D2]/50'
            }`}
          >
            {isPt ? '8. Fontes' : '8. Sources'}
          </button>
        </div>

        <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-[#D9CDAF]/60">
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`p-1.5 rounded-[2px] cursor-pointer flex items-center gap-1 ${
              viewMode === 'chart'
                ? 'bg-[#354D2C] text-[#FCFAF6]'
                : 'text-[#4F5C48] hover:text-[#1A2417]'
            }`}
            title={isPt ? 'Visualização em Gráfico Temporal' : 'Time Series Chart View'}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isPt ? 'Gráfico' : 'Chart'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-[2px] cursor-pointer flex items-center gap-1 ${
              viewMode === 'table'
                ? 'bg-[#354D2C] text-[#FCFAF6]'
                : 'text-[#4F5C48] hover:text-[#1A2417]'
            }`}
            title={isPt ? 'Visualização em Tabela Científica' : 'Scientific Table View'}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isPt ? 'Tabela' : 'Table'}</span>
          </button>
        </div>
      </nav>

      {/* 2. SECTION: COMO LER ESTES DADOS (Contexto Metodológico) */}
      <section id="sec_contexto" className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-[#D9CDAF]/80 pb-2">
          <BookOpen className="w-4 h-4 text-[#354D2C]" />
          <h3 className="font-serif text-base font-bold text-[#1A2417]">
            Como ler estes dados científicos da dissertação
          </h3>
          <span className="text-[11px] font-mono text-[#4F5C48] ml-auto">
            Quadro Epistemológico · Zavala 1994–2024
          </span>
        </div>

        <p className="text-xs text-[#1A2417] leading-relaxed">
          Esta estação apresenta o corpo analítico e quantitativo da dissertação sobre a produção de mandioca no Distrito de Zavala, Província de Inhambane. Para garantir rigor científico e prevenir inferências indevidas, os dados devem ser interpretados segundo quatro princípios fundamentais de rastreabilidade:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-3 bg-[#EAE2D2]/30 rounded-[2px] border border-[#D9CDAF]/60 space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#354D2C] block">
              1. Observado (2017–2024)
            </span>
            <p className="text-[#1A2417] leading-relaxed text-[11px]">
              Oito safras recentes recolhidas diretamente nos arquivos primários dos Serviços Distritais de Actividades Económicas (SDAE) de Zavala. Dados documentais inalterados.
            </p>
          </div>

          <div className="p-3 bg-[#EAE2D2]/30 rounded-[2px] border border-[#D9CDAF]/60 space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#1A2417] block">
              2. Modelado (1994–2016)
            </span>
            <p className="text-[#1A2417] leading-relaxed text-[11px]">
              Reconstituição híbrida em três camadas analíticas (tendência linear contrafactual, calibração por choques biofísicos do IBTrACS/CHIRPS e ancoragem suave em 2017).
            </p>
          </div>

          <div className="p-3 bg-[#EAE2D2]/30 rounded-[2px] border border-[#D9CDAF]/60 space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#4F5C48] block">
              3. Chuva CHIRPS (0,05°)
            </span>
            <p className="text-[#1A2417] leading-relaxed text-[11px]">
              Precipitação acumulada na estação chuvosa crítica (Out-Dez ano anterior + Jan-Mar ano produtivo). A correlação linear não é causal (r = 0,057; p = 0,762).
            </p>
          </div>

          <div className="p-3 bg-[#EAE2D2]/30 rounded-[2px] border border-[#D9CDAF]/60 space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#354D2C] block">
              4. {THESIS_CORE_FACTS.spatialBairrosCount} Bairros de Quissico
            </span>
            <p className="text-[#1A2417] leading-relaxed text-[11px]">
              A análise espacial de alta resolução ({THESIS_CORE_FACTS.spatialAreaQuissicoHa.toLocaleString('pt-MZ')} ha) circunscreve-se ao Posto de Quissico, confrontando a área territorial com o sinal agrícola Sentinel-2 Dynamic World.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION: SÉRIE HISTÓRICA (1994–2024: 31 ANOS) */}
      <section id="sec_serie" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9CDAF] pb-2">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#354D2C]" />
              <h3 className="font-serif text-lg font-bold text-[#1A2417]">
                Série Histórica da Produção de Mandioca ({THESIS_CORE_FACTS.initialYear}–{THESIS_CORE_FACTS.terminalYear})
              </h3>
            </div>
            <p className="text-xs text-[#4F5C48] mt-0.5">
              {THESIS_CORE_FACTS.totalYears} anos de trajetória agrária distrital em toneladas de raiz fresca (t).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#4F5C48]">
              Ano selecionado: <strong className="text-[#1A2417]">{selectedYear}</strong>
            </span>
          </div>
        </div>

        {viewMode === 'chart' ? (
          <ScientificChart
            series={SCIENTIFIC_TIME_SERIES}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            onSendToStudio={onSendToStudio}
          />
        ) : (
          <ScientificTable
            series={SCIENTIFIC_TIME_SERIES}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            onSendToStudio={onSendToStudio}
          />
        )}
      </section>

      {/* 4. SECTION: TENDÊNCIA DE LONGO PRAZO E CONFRONTO ECONOMÉTRICO */}
      <section id="sec_tendencia" className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9CDAF]/80 pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#354D2C]" />
            <h3 className="font-serif text-base font-bold text-[#1A2417]">
              Tendência de Longo Prazo e Modelos Estatísticos
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#4F5C48]">
            Hamed-Rao Mann-Kendall · OLS-HAC Newey-West · Log-Linear · CAGR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {SCIENTIFIC_TREND_STATISTICS.map((stat) => (
            <div
              key={stat.id}
              className="bg-[#FFFDF8] p-3 rounded-[2px] border border-[#D9CDAF] space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-[#D9CDAF]/50 pb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] truncate">
                    {stat.metric}
                  </span>
                  {stat.pValue && (
                    <span className="text-[10px] font-mono font-bold text-[#354D2C] shrink-0">
                      {stat.pValue}
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <span className="font-mono text-xl font-bold text-[#1A2417] block tabular-nums">
                    {stat.value}
                  </span>
                  <span className="font-semibold text-xs text-[#1A2417] block mt-0.5">
                    {stat.name}
                  </span>
                </div>

                <p className="text-[#4F5C48] text-[11px] leading-relaxed mt-2 italic">
                  {stat.interpretation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#D9CDAF]/40 text-[10px] text-[#4F5C48] font-mono">
                {stat.dissertationRef}
              </div>
            </div>
          ))}
        </div>

        {/* Methodological Box: Resolving the apparent paradox between CAGR and Mann-Kendall */}
        <div className="bg-[#EAE2D2]/40 rounded-[2px] border border-[#D9CDAF] p-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#354D2C] shrink-0" />
            <h4 className="font-bold font-mono text-xs uppercase tracking-wider text-[#1A2417]">
              Clarificação Metodológica: O Aparente Paradoxo entre CAGR (-0,24%) e Mann-Kendall (Z = 3,100)
            </h4>
          </div>
          <p className="text-[#1A2417] leading-relaxed text-[11px]">
            Um leitor desatento poderia apontar uma contradição entre a taxa de crescimento anual composta negativa (<strong>CAGR de −0,24% ao ano</strong>) e a tendência estrutural altamente significativa apurada pelo teste não-paramétrico de Mann-Kendall (<strong>Z = 3,100; p = 0,0019</strong>). Esta divergência ilustra com precisão a fragilidade intrínseca da métrica CAGR face a choques terminais: o CAGR compara estritamente os dois pontos extremos da série (1994 com 52.164 t e 2024 com 48.573 t), sendo completamente distorcido pelo colapso de 2023. Em contraste, o estimador de Mann-Kendall e o declive mediano de Sen examinam a totalidade dos <strong>465 pares temporais</strong> da série de 31 anos, confirmando que a dinâmica subjacente do sistema agrário de Zavala foi inequivocamente ascendente (+4.229 t/ano), acumulando ganhos sustentados que foram interrompidos apenas por um evento de precipitação anómalo no ano terminal.
          </p>
        </div>
      </section>

      {/* 5. SECTION: CHOQUES E RECUPERAÇÃO */}
      <section id="sec_choques" className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9CDAF]/80 pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#A8531E]" />
            <h3 className="font-serif text-base font-bold text-[#1A2417]">
              Choques Climáticos, Perdas Acumuladas e Padrões de Recuperação
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#A8531E] font-bold">
            {THESIS_CORE_FACTS.adverseYearsCountModeled} Anos Adversos · {THESIS_CORE_FACTS.accumulatedLossesTonnes.toLocaleString('pt-MZ')} t Perdidas (1994–2016)
          </span>
        </div>

        <p className="text-xs text-[#1A2417] leading-relaxed">
          O modelo econométrico da tese identificou {THESIS_CORE_FACTS.adverseYearsCountModeled} safras afetadas por anomalias biofísicas no período modelado ({THESIS_CORE_FACTS.accumulatedLossesPeriod}). As perdas foram calculadas como o diferencial anual entre a Trajetória de Tendência Contrafactual (produção que teria ocorrido em condições agroclimáticas normais) e o volume efetivamente colhido.
        </p>

        {/* 3 Critical Shock Deep-Dives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Favio 2007 */}
          <div className="bg-[#FFFDF8] p-3.5 rounded-[2px] border-l-4 border-[#A8531E] border-y border-r border-[#D9CDAF] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-[#A8531E]">
                Ciclone Favio · 2007
              </span>
              <span className="font-mono text-xs font-bold text-[#A8531E]">
                -64,3% quebra
              </span>
            </div>
            <h4 className="font-serif text-sm font-bold text-[#1A2417]">
              Perda de 74.902 toneladas
            </h4>
            <p className="text-[#4F5C48] text-[11px] leading-relaxed">
              Ventos de Categoria 4 (&gt; 200 km/h) a 219,8 km de Zavala provocaram desfolhamento total e quebra mecânica das hastes condutoras. A produção caiu de 110.986 t em 2006 para 41.677 t em 2007. A recuperação levou 3 safras completas pela destruição do parque de estacas.
            </p>
          </div>

          {/* Seca El Niño 2016 */}
          <div className="bg-[#FFFDF8] p-3.5 rounded-[2px] border-l-4 border-[#A8531E] border-y border-r border-[#D9CDAF] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-[#A8531E]">
                El Niño Extremo · 2016
              </span>
              <span className="font-mono text-xs font-bold text-[#A8531E]">
                -59,4% quebra
              </span>
            </div>
            <h4 className="font-serif text-sm font-bold text-[#1A2417]">
              Perda de 131.627 toneladas
            </h4>
            <p className="text-[#4F5C48] text-[11px] leading-relaxed">
              Maior perda individual da série modelada. A precipitação CHIRPS acumulou apenas 534,3 mm (−45,5% de anomalia negativa), com atraso de chuvas superior a 45 dias no início da campanha, matando brotações e reduzindo o peso radicular.
            </p>
          </div>

          {/* Colapso 2023 */}
          <div className="bg-[#FFFDF8] p-3.5 rounded-[2px] border-l-4 border-[#A8531E] border-y border-r border-[#D9CDAF] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-[#A8531E]">
                Colapso Produtivo · 2023
              </span>
              <span className="font-mono text-xs font-bold text-[#A8531E]">
                -87,1% vs pico 2021
              </span>
            </div>
            <h4 className="font-serif text-sm font-bold text-[#1A2417]">
              Safra desaba para 35.371 t
            </h4>
            <p className="text-[#4F5C48] text-[11px] leading-relaxed">
              Pior colapso dos {THESIS_CORE_FACTS.totalYears} anos. Não foi causado por seca, mas por precipitação torrencial contínua de tempestades e Ciclone Freddy (+78,1% de anomalia), provocando asfixia radicular (anoxia anaeróbia) e podridão interna nos tubérculos submersos em baixas de Quissico.
            </p>
          </div>
        </div>

        {/* Shock years mini-strip */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#4F5C48] block">
            Lista Completa dos {THESIS_CORE_FACTS.adverseYearsCountModeled} Anos Adversos Identificados:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {shockYearsList.map((pt) => (
              <button
                key={`shock-tag-${pt.year}`}
                type="button"
                onClick={() => {
                  setSelectedYear(pt.year);
                  scrollToSection('sec_serie');
                }}
                className={`px-2 py-1 text-xs font-mono rounded-[2px] border transition-colors cursor-pointer ${
                  selectedYear === pt.year
                    ? 'bg-[#A8531E] text-[#FCFAF6] border-[#A8531E]'
                    : 'bg-[#EAE2D2]/50 text-[#A8531E] border-[#D9CDAF] hover:bg-[#EAE2D2]'
                }`}
                title={`${pt.year}: ${pt.eventOrShock}`}
              >
                {pt.year} ({pt.shockLossPercent ? `-${pt.shockLossPercent.toFixed(0)}%` : 'Quebra'})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION: PRECIPITAÇÃO E PRODUÇÃO (CHIRPS v2.0) */}
      <section id="sec_chirps" className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9CDAF]/80 pb-2">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-[#354D2C]" />
            <h3 className="font-serif text-base font-bold text-[#1A2417]">
              Precipitação Pluviométrica e Produção (CHIRPS v2.0)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#354D2C]">
            Janela Agronómica: Out–Dez (ano t-1) + Jan–Mar (ano t)
          </span>
        </div>

        {/* Crucial Scientific Warning Banner */}
        <div className="p-3.5 bg-[#FCFAF6] border-l-4 border-[#354D2C] border-y border-r border-[#D9CDAF] rounded-[2px] space-y-1.5">
          <span className="font-mono text-[10px] uppercase font-bold text-[#354D2C] tracking-wider block">
            Princípio Metodológico de Inferência Causal
          </span>
          <p className="text-xs text-[#1A2417] leading-relaxed font-semibold">
            Associação temporal não implica causalidade: Relação estatística entre precipitação e quebras não estabelece nexo causal direto sem controlo de fatores edáficos e pragas.
          </p>
          <p className="text-xs text-[#4F5C48] leading-relaxed">
            {CHIRPS_CORRELATION_ANALYSIS.scientificCaveat}
          </p>
        </div>

        {/* Statistical Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#FFFDF8] p-3 rounded-[2px] border border-[#D9CDAF]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
              Correlação de Pearson (r)
            </span>
            <span className="font-mono text-xl font-bold text-[#1A2417] tabular-nums">
              r = {CHIRPS_CORRELATION_ANALYSIS.pearsonR.toFixed(3)}
            </span>
            <span className="text-[10px] text-[#4F5C48] block mt-0.5">
              Associação linear nula
            </span>
          </div>

          <div className="bg-[#FFFDF8] p-3 rounded-[2px] border border-[#D9CDAF]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
              Significância Estatística (p)
            </span>
            <span className="font-mono text-xl font-bold text-[#1A2417] tabular-nums">
              p = {CHIRPS_CORRELATION_ANALYSIS.pValue.toFixed(3)}
            </span>
            <span className="text-[10px] text-[#A8531E] block mt-0.5 font-semibold">
              Não significativo (p &gt; 0,05)
            </span>
          </div>

          <div className="bg-[#FFFDF8] p-3 rounded-[2px] border border-[#D9CDAF]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
              Média Histórica Sazonal
            </span>
            <span className="font-mono text-xl font-bold text-[#1A2417] tabular-nums">
              {CHIRPS_CORRELATION_ANALYSIS.meanHistoricalRainfallMm.toFixed(1)} mm
            </span>
            <span className="text-[10px] text-[#4F5C48] block mt-0.5">
              Zavala (1994–2024)
            </span>
          </div>

          <div className="bg-[#FFFDF8] p-3 rounded-[2px] border border-[#D9CDAF]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4F5C48] block">
              Amplitude Extrema CHIRPS
            </span>
            <span className="font-mono text-sm font-bold text-[#1A2417] tabular-nums">
              534 mm (2016) a 1.746 mm (2023)
            </span>
            <span className="text-[10px] text-[#4F5C48] block mt-0.5">
              Variação de 3,26 vezes
            </span>
          </div>
        </div>

        {/* Explanation of Why Cassava Buffers Rainfall */}
        <div className="space-y-2 text-xs text-[#1A2417]">
          <h4 className="font-bold text-xs uppercase tracking-wider font-mono text-[#1A2417]">
            Mecanismo Agronómico de Resiliência e Vulnerabilidade à Anoxia
          </h4>
          <p className="leading-relaxed">
            Ao contrário do milho ou do feijão, cujos ciclos fenológicos exigem água em momentos estritos de florescimento, a mandioca (<em>Manihot esculenta</em>) acumula carboidratos contínuos em tubérculos subterrâneos. A planta fecha estômatos preventivamente, descarta folhas e entra em dormência durante estiagens moderadas, rebrotando vigorosamente quando a chuva regressa.
          </p>
          <p className="leading-relaxed text-[#4F5C48] italic">
            Contudo, este mecanismo biológico tem um ponto cego crítico: o encharcamento estagnado. Quando as chuvas superam 1.500 mm em solos litorâneos arenosos com bacias de baixa declividade (como em Nzile), a água não drena, expulsando o oxigénio da rizosfera. A consequente anoxia radicular e proliferação bacteriana decompõem o tubérculo no próprio solo em menos de 15 dias, explicando por que 2023 teve o maior volume de chuva da série e simultaneamente o pior colapso de colheita documentado.
          </p>
        </div>
      </section>

      {/* 7. SECTION: HETEROGENEIDADE ESPACIAL EM QUISSICO (11 Bairros, 22.343 ha) */}
      <section id="sec_espacial" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9CDAF] pb-2">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#354D2C]" />
              <h3 className="font-serif text-lg font-bold text-[#1A2417]">
                Heterogeneidade Espacial no Posto Administrativo de Quissico
              </h3>
            </div>
            <p className="text-xs text-[#4F5C48] mt-0.5">
              {THESIS_CORE_FACTS.spatialBairrosCount} bairros cartografados · {THESIS_CORE_FACTS.spatialAreaQuissicoHa.toLocaleString('pt-MZ')} hectares · Sentinel-2 Dynamic World P75 vs Modelo Territorial.
            </p>
          </div>
        </div>

        <QuissicoSpatialMap onSendToStudio={onSendToStudio} />
      </section>

      {/* 8. SECTION: LIMITAÇÕES CIENTÍFICAS E INCERTEZA METODOLÓGICA */}
      <section id="sec_limitacoes" className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#D9CDAF]/80 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#354D2C]" />
            <h3 className="font-serif text-base font-bold text-[#1A2417]">
              Limitações Científicas e Incerteza Metodológica
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsLimitationsExpanded(!isLimitationsExpanded)}
            className="p-1 text-xs text-[#4F5C48] hover:text-[#1A2417] cursor-pointer flex items-center gap-1 font-mono"
          >
            <span>{isLimitationsExpanded ? 'Recolher' : 'Expandir'}</span>
            {isLimitationsExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {isLimitationsExpanded && (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-[#1A2417] leading-relaxed">
              Em consonância com as normas de rigor académico da UEM, a dissertação assume e documenta abertamente as fronteiras metodológicas das suas estimativas:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {SCIENTIFIC_LIMITATIONS.map((lim) => (
                <div
                  key={lim.id}
                  className="bg-[#FFFDF8] p-3 rounded-[2px] border border-[#D9CDAF] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#D9CDAF]/50 pb-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#A8531E]">
                      {lim.domain}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-[#1A2417]">
                    {lim.title}
                  </h4>
                  <p className="text-[#1A2417] text-[11px] leading-relaxed">
                    {lim.description}
                  </p>
                  <div className="bg-[#EAE2D2]/30 p-2 rounded-[2px] border border-[#D9CDAF]/40 text-[10px] text-[#4F5C48] italic">
                    <strong>Mitigação na Tese:</strong> {lim.mitigationOrCaution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 9. SECTION: ORIGEM E RASTREABILIDADE DOS DADOS (9 Fontes Oficiais) */}
      <section id="sec_fontes" className="bg-[#FCFAF6] rounded-[4px] border border-[#D9CDAF] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#D9CDAF]/80 pb-2">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#354D2C]" />
            <h3 className="font-serif text-base font-bold text-[#1A2417]">
              Origem e Rastreabilidade dos Dados Oficiais
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#4F5C48]">
            Catálogo Completo das 9 Fontes Primárias e Derivadas
          </span>
        </div>

        <p className="text-xs text-[#1A2417] leading-relaxed">
          Cada variável da investigação está vinculada a uma instituição reguladora ou protocolo global de monitoramento por satélite:
        </p>

        <div className="overflow-x-auto rounded-[4px] border border-[#D9CDAF]">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-[#EAE2D2]/60 border-b border-[#D9CDAF] text-[#4F5C48] text-[10px] font-mono uppercase tracking-wider">
                <th scope="col" className="py-2 px-3 font-semibold">Fonte / Instituição</th>
                <th scope="col" className="py-2 px-3 font-semibold">Estatuto</th>
                <th scope="col" className="py-2 px-3 font-semibold">Período</th>
                <th scope="col" className="py-2 px-3 font-semibold">Resolução Espacial</th>
                <th scope="col" className="py-2 px-3 font-semibold">Aplicação na Dissertação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9CDAF]/60 bg-[#FCFAF6]">
              {DATA_SOURCES_REGISTRY.map((src) => (
                <tr key={src.id} className="hover:bg-[#EAE2D2]/20">
                  <td className="py-2 px-3 font-semibold text-[#1A2417]">
                    <div>{src.name}</div>
                    <div className="text-[10px] text-[#4F5C48] font-normal">{src.agency}</div>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] uppercase font-semibold ${
                        src.dataStatus === 'OBSERVADO'
                          ? 'bg-[#354D2C]/10 text-[#354D2C] border border-[#354D2C]/30'
                          : src.dataStatus === 'MODELADO'
                          ? 'bg-[#1A2417]/10 text-[#1A2417] border border-[#1A2417]/30'
                          : 'bg-[#4F5C48]/10 text-[#4F5C48] border border-[#4F5C48]/30'
                      }`}
                    >
                      {src.dataStatus}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px] text-[#4F5C48] whitespace-nowrap">
                    {src.period}
                  </td>
                  <td className="py-2 px-3 text-[11px] text-[#4F5C48]">
                    {src.spatialResolution}
                  </td>
                  <td className="py-2 px-3 text-[11px] text-[#1A2417]">
                    <div>{src.purposeInThesis}</div>
                    <div className="text-[10px] text-[#4F5C48] italic mt-0.5">{src.primaryReference}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
