import React from 'react';
import { EvidenceNode } from '../../types/crossAudit';
import { EpistemicStatus } from '../../types/research';
import { Shield, BookOpen, Layers, ArrowDown, CheckCircle2 } from 'lucide-react';

interface EvidenceMapProps {
  statement: string;
  methodBasis: string;
  limitationBasis: string;
  nodes: EvidenceNode[];
  provenanceTrail: string;
  currentLang?: 'pt' | 'en';
}

function getStatusBadgeStyle(status: EpistemicStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case 'OBSERVADO':
      return { bg: 'bg-[#EBF2E6]', text: 'text-[#2D5A27]', border: 'border-[#BDD6B3]' };
    case 'MODELADO':
    case 'RECONSTITUÍDO':
    case 'RECONSTITUÍDO / MODELADO':
      return { bg: 'bg-[#F2EFE8]', text: 'text-[#6A5A38]', border: 'border-[#D9CDAF]' };
    case 'TESTEMUNHO DE CAMPO':
      return { bg: 'bg-[#FDF4E7]', text: 'text-[#8A5A1A]', border: 'border-[#E8CBA3]' };
    case 'INTERPRETAÇÃO':
      return { bg: 'bg-[#F4F1EA]', text: 'text-[#4A5A43]', border: 'border-[#CFD6C8]' };
    case 'CONTEXTUALIZAÇÃO EXTERNA':
      return { bg: 'bg-[#EAEFF5]', text: 'text-[#2E4A62]', border: 'border-[#BFD1E5]' };
    default:
      return { bg: 'bg-[#F4EFE6]', text: 'text-[#5A6852]', border: 'border-[#D9CDAF]' };
  }
}

export const EvidenceMap: React.FC<EvidenceMapProps> = ({
  statement,
  methodBasis,
  limitationBasis,
  nodes,
  provenanceTrail,
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';

  return (
    <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-[#EAE2D2] pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2A3A24]" />
          <h4 className="font-serif font-bold text-sm text-[#1A2417] tracking-tight">
            {isPt ? 'Mapa de Evidências Editorial' : 'Editorial Evidence Map'}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-[#7A6B58] bg-[#F4EFE6] px-2 py-0.5 rounded-[2px] border border-[#D9CDAF]">
          {provenanceTrail}
        </span>
      </div>

      {/* Sequência Vertical Editorial: Afirmação ↓ Evidências ↓ Método ↓ Limitação */}
      <div className="space-y-3">
        {/* Nível 1: Afirmação */}
        <div className="p-3 bg-[#FAF7F0] border border-[#D9CDAF] rounded-[3px]">
          <div className="flex items-center gap-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#2A3A24]" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#5A6852]">
              {isPt ? 'Afirmação Canónica da Dissertação' : 'Canonical Thesis Statement'}
            </span>
          </div>
          <p className="font-serif text-[13px] text-[#1A2417] leading-relaxed">
            "{statement}"
          </p>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-3.5 h-3.5 text-[#8C7D6B]" />
        </div>

        {/* Nível 2: Evidências Documentadas */}
        <div className="p-3 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[3px] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5A30]" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#5A6852]">
                {isPt ? 'Evidências Documentais de Suporte' : 'Documentary Supporting Evidence'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#8C7D6B]">
              {nodes.length} {isPt ? 'fontes canónicas' : 'canonical sources'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {nodes.map((node) => {
              const badge = getStatusBadgeStyle(node.epistemicType);
              return (
                <div
                  key={node.id}
                  className="bg-[#F8F5EE] border border-[#E2D8C3] rounded-[3px] p-2.5 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-serif font-bold text-xs text-[#1A2417] truncate">
                      {node.title}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] border font-semibold shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {node.epistemicType}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3D4738] leading-normal">
                    {node.description}
                  </p>
                  <div className="text-[10px] font-mono text-[#7A6B58] pt-1 border-t border-[#EAE2D2]/60 flex items-center justify-between">
                    <span>{node.sourceSsot}</span>
                    <span className="text-[9px] text-[#8C7D6B]">{node.provenance}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-3.5 h-3.5 text-[#8C7D6B]" />
        </div>

        {/* Nível 3: Método de Análise */}
        <div className="p-3 bg-[#FAF7F0] border border-[#D9CDAF] rounded-[3px]">
          <div className="flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-[#4A6B3E]" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#5A6852]">
              {isPt ? 'Procedimento Metodológico' : 'Methodological Procedure'}
            </span>
          </div>
          <p className="text-[12px] text-[#2A3A24] leading-relaxed font-sans">
            {methodBasis}
          </p>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-3.5 h-3.5 text-[#8C7D6B]" />
        </div>

        {/* Nível 4: Limitação Metodológica Obrigatória */}
        <div className="p-3 bg-[#FBF6EE] border border-[#E2C9A6] rounded-[3px]">
          <div className="flex items-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5 text-[#A8531E]" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8A4A1C]">
              {isPt ? 'Limitação Epistemológica e Salvaguarda' : 'Epistemic Limitation & Safeguard'}
            </span>
          </div>
          <p className="text-[12px] text-[#5A3317] leading-relaxed italic">
            {limitationBasis}
          </p>
        </div>
      </div>
    </div>
  );
};
