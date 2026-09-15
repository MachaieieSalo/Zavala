import React, { useState } from 'react';
import { CoherenceMatrixView } from './CoherenceMatrixView';
import { ExtrapolationDetectorView } from './ExtrapolationDetectorView';
import { AuditAxesView } from './AuditAxesView';
import {
  Scale,
  Sliders,
  AlertTriangle,
  Layers,
  Database,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { THESIS_CORE_FACTS } from '../../data/thesisScientificData';

export type CrossAuditSubTab = 'matriz' | 'detector' | 'eixos';

interface CrossAuditViewProps {
  onNavigateToAdversarialVulnerability?: (code: string) => void;
  currentLang?: 'pt' | 'en';
}

export const CrossAuditView: React.FC<CrossAuditViewProps> = ({
  onNavigateToAdversarialVulnerability,
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';
  const [activeSubTab, setActiveSubTab] = useState<CrossAuditSubTab>('matriz');

  return (
    <div className="space-y-6">
      {/* Cabeçalho Principal: Identidade "O Manuscrito Vivo" */}
      <div className="bg-[#FAF7F0] border border-[#D9CDAF] rounded-[4px] p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EAE2D2] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest bg-[#1A2417] text-[#FAF7F0] px-2 py-0.5 rounded-[2px]">
                FASE 12 • AUDITORIA CIENTÍFICA CRUZADA
              </span>
              <span className="text-[10px] font-mono text-[#7A6B58] bg-[#F2EFE8] px-2 py-0.5 rounded-[2px] border border-[#D9CDAF]">
                SSoT Canónica Garantida
              </span>
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#1A2417] tracking-tight">
              {isPt ? 'Auditoria Cruzada' : 'Cross-Scientific Audit'}
            </h2>
            <p className="text-xs font-serif text-[#5A6852] italic mt-0.5">
              {isPt
                ? 'Confronto rigoroso entre dados, método, resultados e interpretação para preparação de defesa.'
                : 'Rigorous confrontation between data, method, results and interpretation for defense preparation.'}
            </p>
          </div>

          {/* Âncora de Integridade SSoT */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#3D4738] bg-[#FCFAF6] border border-[#D9CDAF] p-2 rounded-[3px]">
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3 text-[#3D5A30]" />
              <span>31 Anos (1994–2024)</span>
            </div>
            <span className="text-[#D9CDAF]">|</span>
            <span>8 Obs. / 23 Model.</span>
            <span className="text-[#D9CDAF]">|</span>
            <span>1994: 52.164 t (Mod.)</span>
            <span className="text-[#D9CDAF]">|</span>
            <span>2021: 273.773 t (Obs.)</span>
            <span className="text-[#D9CDAF]">|</span>
            <span>Perdas: 547.224 t (Contraf.)</span>
          </div>
        </div>

        {/* Navegação entre as 3 Secções da Auditoria Cruzada */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('matriz')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-serif rounded-[3px] border transition-all ${
              activeSubTab === 'matriz'
                ? 'bg-[#1A2417] text-[#FAF7F0] border-[#1A2417] shadow-sm'
                : 'bg-[#FCFAF6] text-[#2A3A24] border-[#D9CDAF] hover:bg-[#F2EFE8]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="font-bold">
              {isPt ? 'Matriz de Coerência e Evidências' : 'Coherence Matrix & Evidence'}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('detector')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-serif rounded-[3px] border transition-all ${
              activeSubTab === 'detector'
                ? 'bg-[#1A2417] text-[#FAF7F0] border-[#1A2417] shadow-sm'
                : 'bg-[#FCFAF6] text-[#2A3A24] border-[#D9CDAF] hover:bg-[#F2EFE8]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#A8531E]" />
            <span className="font-bold">
              {isPt ? 'Detector de Extrapolação' : 'Extrapolation Detector'}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('eixos')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-serif rounded-[3px] border transition-all ${
              activeSubTab === 'eixos'
                ? 'bg-[#1A2417] text-[#FAF7F0] border-[#1A2417] shadow-sm'
                : 'bg-[#FCFAF6] text-[#2A3A24] border-[#D9CDAF] hover:bg-[#F2EFE8]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="font-bold">
              {isPt ? 'Quatro Eixos Editoriais (A–D)' : 'Four Editorial Axes (A–D)'}
            </span>
          </button>
        </div>
      </div>

      {/* Conteúdo Dinâmico da Sub-Aba */}
      <div>
        {activeSubTab === 'matriz' && (
          <CoherenceMatrixView
            onNavigateToAdversarialVulnerability={onNavigateToAdversarialVulnerability}
            currentLang={currentLang}
          />
        )}

        {activeSubTab === 'detector' && (
          <ExtrapolationDetectorView currentLang={currentLang} />
        )}

        {activeSubTab === 'eixos' && (
          <AuditAxesView currentLang={currentLang} />
        )}
      </div>
    </div>
  );
};
