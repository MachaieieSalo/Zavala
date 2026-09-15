import React, { useState } from 'react';
import { AUDIT_AXES_ITEMS } from '../../data/crossAuditData';
import { AuditAxisId } from '../../types/crossAudit';
import {
  Database,
  Sliders,
  FileCheck,
  Compass,
  CheckCircle2,
  AlertCircle,
  Shield,
  BookOpen,
} from 'lucide-react';

interface AuditAxesViewProps {
  currentLang?: 'pt' | 'en';
}

const AXIS_CONFIG: Record<
  AuditAxisId,
  {
    titlePt: string;
    titleEn: string;
    subtitlePt: string;
    subtitleEn: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  dados: {
    titlePt: 'Eixo A: Dados',
    titleEn: 'Axis A: Data',
    subtitlePt: 'Observado vs Reconstituído/Modelado, Fontes e Rastreabilidade',
    subtitleEn: 'Observed vs Reconstructed/Modeled, Sources & Traceability',
    icon: Database,
  },
  metodo: {
    titlePt: 'Eixo B: Método',
    titleEn: 'Axis B: Method',
    subtitlePt: 'Correspondência Pergunta ↔ Método, Limites de Reconstituição e Teste de Chow',
    subtitleEn: 'Question ↔ Method Alignment, Reconstitution Limits & Chow Test',
    icon: Sliders,
  },
  resultados: {
    titlePt: 'Eixo C: Resultados',
    titleEn: 'Axis C: Results',
    subtitlePt: 'Respeito aos Números, Perdas Contrafactuais e Restrição a Quissico',
    subtitleEn: 'Respect for Numbers, Counterfactual Losses & Quissico Scope',
    icon: FileCheck,
  },
  interpretacao: {
    titlePt: 'Eixo D: Interpretação',
    titleEn: 'Axis D: Interpretation',
    subtitlePt: 'Associação vs Causalidade, Testemunho Camponês vs Diagnóstico Fitopatológico',
    subtitleEn: 'Association vs Causality, Farmer Testimony vs Clinical Diagnosis',
    icon: Compass,
  },
};

export const AuditAxesView: React.FC<AuditAxesViewProps> = ({ currentLang = 'pt' }) => {
  const isPt = currentLang === 'pt';
  const [activeAxis, setActiveAxis] = useState<AuditAxisId>('dados');

  const filteredItems = AUDIT_AXES_ITEMS.filter((item) => item.axis === activeAxis);
  const currentAxisMeta = AXIS_CONFIG[activeAxis];
  const Icon = currentAxisMeta.icon;

  return (
    <div className="space-y-6">
      {/* Seletor dos Quatro Eixos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {(Object.keys(AXIS_CONFIG) as AuditAxisId[]).map((axisKey) => {
          const meta = AXIS_CONFIG[axisKey];
          const AxisIcon = meta.icon;
          const isSelected = activeAxis === axisKey;
          const count = AUDIT_AXES_ITEMS.filter((i) => i.axis === axisKey).length;

          return (
            <button
              key={axisKey}
              onClick={() => setActiveAxis(axisKey)}
              className={`p-3 text-left rounded-[3px] border transition-all ${
                isSelected
                  ? 'bg-[#1A2417] text-[#FAF7F0] border-[#1A2417] shadow-sm'
                  : 'bg-[#FCFAF6] text-[#2A3A24] border-[#D9CDAF] hover:bg-[#F2EFE8]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <AxisIcon
                  className={`w-4 h-4 ${isSelected ? 'text-[#FAF7F0]' : 'text-[#5A6852]'}`}
                />
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] ${
                    isSelected ? 'bg-[#2A3A24] text-[#FAF7F0]' : 'bg-[#EAE2D2] text-[#5A6852]'
                  }`}
                >
                  {count} {isPt ? 'pontos' : 'items'}
                </span>
              </div>
              <h4 className="font-serif font-bold text-xs">
                {isPt ? meta.titlePt : meta.titleEn}
              </h4>
              <p
                className={`text-[10px] mt-0.5 line-clamp-1 ${
                  isSelected ? 'text-[#D9CDAF]' : 'text-[#7A6B58]'
                }`}
              >
                {isPt ? meta.subtitlePt : meta.subtitleEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Cabeçalho do Eixo Selecionado */}
      <div className="bg-[#FAF7F0] border border-[#D9CDAF] rounded-[4px] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#1A2417] text-[#FAF7F0] rounded-[3px]">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#1A2417]">
              {isPt ? currentAxisMeta.titlePt : currentAxisMeta.titleEn}
            </h3>
            <p className="text-xs text-[#5A6852] font-serif">
              {isPt ? currentAxisMeta.subtitlePt : currentAxisMeta.subtitleEn}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#7A6B58] bg-[#F2EFE8] px-2 py-1 rounded-[2px] border border-[#D9CDAF]">
          Auditoria Sistemática SSoT
        </span>
      </div>

      {/* Lista de Verificações do Eixo */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-5 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE2D2] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#1A2417]">
                  {item.title}
                </span>
                <span className="text-[9px] font-mono bg-[#EBF2E6] text-[#2D5A27] px-2 py-0.5 rounded-[2px] border border-[#BDD6B3] font-bold">
                  {item.epistemicStatus}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#7A6B58]">
                {item.thesisSection}
              </span>
            </div>

            {/* Facto Canónico */}
            <div className="p-3 bg-[#FAF7F0] border-l-2 border-[#1A2417] rounded-[2px]">
              <span className="text-[9px] font-mono uppercase font-bold text-[#7A6B58] block mb-0.5">
                {isPt ? 'Facto Canónico Auditado (SSoT):' : 'Canonical Fact (SSoT):'}
              </span>
              <p className="font-serif text-xs text-[#1A2417] leading-relaxed">
                {item.canonicalFact}
              </p>
              <span className="text-[9px] font-mono text-[#7A6B58] block pt-1">
                Ref. SSoT: {item.ssotReference}
              </span>
            </div>

            {/* Verificação e Tensão Potencial */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#FBF9F4] border border-[#E2D8C3] rounded-[3px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#2A3A24]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5A30]" />
                  <span className="text-[10px] font-mono uppercase font-bold text-[#3D5A30]">
                    {isPt ? 'Verificação de Conformidade' : 'Compliance Check'}
                  </span>
                </div>
                <p className="text-xs text-[#2A3A24] font-sans leading-relaxed">
                  {item.verificationCheck}
                </p>
              </div>

              <div className="p-3 bg-[#FDF4E7] border border-[#E8CBA3] rounded-[3px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#8A5A1A]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#A8531E]" />
                  <span className="text-[10px] font-mono uppercase font-bold text-[#A8531E]">
                    {isPt ? 'Ponto a Verificar no Corpus' : 'Point to Check in Corpus'}
                  </span>
                </div>
                <p className="text-xs text-[#6A3D18] font-sans leading-relaxed italic">
                  {item.potentialTensionOrCaveat}
                </p>
              </div>
            </div>

            {/* Resposta de Defesa Segura */}
            <div className="p-3 bg-[#F5F2EA] border border-[#D9CDAF] rounded-[3px] space-y-1">
              <div className="flex items-center gap-1.5 text-[#1A2417]">
                <Shield className="w-3.5 h-3.5 text-[#2D5A27]" />
                <span className="text-[10px] font-mono uppercase font-bold text-[#1A2417]">
                  {isPt
                    ? 'Formulação de Defesa Epistemologicamente Segura'
                    : 'Safe Defense Formulation'}
                </span>
              </div>
              <p className="font-serif text-xs text-[#1A2417] leading-relaxed italic">
                "{item.safeDefenseFormulation}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
