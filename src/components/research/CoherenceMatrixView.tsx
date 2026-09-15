import React, { useState } from 'react';
import { CoherenceMatrixItem } from '../../types/crossAudit';
import { COHERENCE_MATRIX_ITEMS } from '../../data/crossAuditData';
import { ADVERSARIAL_VULNERABILITIES } from '../../data/adversarialVulnerabilities';
import { EvidenceMap } from './EvidenceMap';
import {
  HelpCircle,
  Database,
  Sliders,
  FileCheck,
  Compass,
  AlertTriangle,
  Flame,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';

interface CoherenceMatrixViewProps {
  onNavigateToAdversarialVulnerability?: (code: string) => void;
  currentLang?: 'pt' | 'en';
}

export const CoherenceMatrixView: React.FC<CoherenceMatrixViewProps> = ({
  onNavigateToAdversarialVulnerability,
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';
  const [selectedItemId, setSelectedItemId] = useState<string>(
    COHERENCE_MATRIX_ITEMS[0]?.id || ''
  );
  const [copiedSpeech, setCopiedSpeech] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('TODAS');

  const selectedItem =
    COHERENCE_MATRIX_ITEMS.find((item) => item.id === selectedItemId) ||
    COHERENCE_MATRIX_ITEMS[0];

  const domains = Array.from(
    new Set(COHERENCE_MATRIX_ITEMS.map((item) => item.domain))
  );

  const filteredItems =
    selectedFilter === 'TODAS'
      ? COHERENCE_MATRIX_ITEMS
      : COHERENCE_MATRIX_ITEMS.filter((item) => item.domain === selectedFilter);

  const associatedVuln = selectedItem.associatedVulnerabilityCode
    ? ADVERSARIAL_VULNERABILITIES.find(
        (v) =>
          v.id === selectedItem.associatedVulnerabilityCode ||
          v.code === selectedItem.associatedVulnerabilityCode
      )
    : null;

  const handleCopySpeech = () => {
    if (selectedItem) {
      navigator.clipboard.writeText(
        selectedItem.defenseConfrontation.safeDefenseResponse.fullOralText
      );
      setCopiedSpeech(true);
      setTimeout(() => setCopiedSpeech(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtro por Domínio da Dissertação */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#EAE2D2] pb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#7A6B58] mr-1">
          {isPt ? 'Domínio Temático:' : 'Domain:'}
        </span>
        <button
          onClick={() => setSelectedFilter('TODAS')}
          className={`px-2.5 py-1 text-xs font-serif rounded-[3px] border transition-colors ${
            selectedFilter === 'TODAS'
              ? 'bg-[#1A2417] text-[#FAF7F0] border-[#1A2417]'
              : 'bg-[#FCFAF6] text-[#4A5A43] border-[#D9CDAF] hover:bg-[#F2EFE8]'
          }`}
        >
          {isPt ? 'Todas as Afirmações' : 'All Statements'} ({COHERENCE_MATRIX_ITEMS.length})
        </button>
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedFilter(dom)}
            className={`px-2.5 py-1 text-xs font-serif rounded-[3px] border transition-colors ${
              selectedFilter === dom
                ? 'bg-[#1A2417] text-[#FAF7F0] border-[#1A2417]'
                : 'bg-[#FCFAF6] text-[#4A5A43] border-[#D9CDAF] hover:bg-[#F2EFE8]'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Grid: Lista de Afirmações à esquerda + Detalhe à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Seletor de Afirmações */}
        <div className="lg:col-span-4 space-y-2 max-h-[850px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-1">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1A2417]">
              {isPt ? 'Afirmações em Auditoria' : 'Audited Statements'}
            </h4>
            <span className="text-[10px] font-mono text-[#7A6B58]">
              {filteredItems.length} {isPt ? 'itens' : 'items'}
            </span>
          </div>

          <div className="space-y-2">
            {filteredItems.map((item) => {
              const isSelected = item.id === selectedItem.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`w-full text-left p-3 rounded-[3px] border transition-all text-xs ${
                    isSelected
                      ? 'bg-[#FAF7F0] border-[#1A2417] shadow-sm ring-1 ring-[#1A2417]/20'
                      : 'bg-[#FCFAF6] border-[#D9CDAF] hover:bg-[#F8F5EE]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-mono uppercase text-[#7A6B58] font-bold">
                      {item.domain}
                    </span>
                    {item.associatedVulnerabilityCode && (
                      <span className="text-[9px] font-mono bg-[#FDF0E9] text-[#A84218] px-1 py-0.2 rounded-[2px] border border-[#F0CEBD]">
                        Banca {item.associatedVulnerabilityCode}
                      </span>
                    )}
                  </div>
                  <p className="font-serif font-bold text-[13px] text-[#1A2417] leading-tight line-clamp-2">
                    {item.title}
                  </p>
                  <p className="font-sans text-[11px] text-[#5A6852] mt-1 line-clamp-2 italic">
                    "{item.statement}"
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Painel Direito: O Confronto Epistemológico Completo */}
        <div className="lg:col-span-8 space-y-6">
          {/* Cabeçalho do Item Selecionado */}
          <div className="bg-[#FAF7F0] border border-[#D9CDAF] rounded-[4px] p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-[#1A2417] text-[#FAF7F0] px-2 py-0.5 rounded-[2px]">
                  {selectedItem.domain}
                </span>
                <span className="text-[10px] font-mono text-[#7A6B58] bg-[#F2EFE8] px-2 py-0.5 rounded-[2px] border border-[#D9CDAF]">
                  Estatuto: {selectedItem.dataBasis.status}
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#7A6B58]">
                {selectedItem.provenanceTrail}
              </div>
            </div>

            <h3 className="font-serif font-bold text-lg text-[#1A2417] leading-snug">
              {selectedItem.title}
            </h3>

            <div className="p-3 bg-[#FCFAF6] border-l-2 border-[#1A2417] text-xs font-serif text-[#1A2417] leading-relaxed">
              <span className="font-mono text-[9px] uppercase font-bold text-[#7A6B58] block mb-0.5">
                {isPt ? 'Afirmação Textual da Dissertação:' : 'Thesis Textual Statement:'}
              </span>
              "{selectedItem.statement}"
            </div>
          </div>

          {/* Matriz de Coerência: Cadeia em 6 Fases (Pergunta → Dado → Método → Resultado → Interpretação → Limitação) */}
          <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#EAE2D2] pb-2">
              <Sliders className="w-4 h-4 text-[#1A2417]" />
              <h4 className="font-serif font-bold text-sm text-[#1A2417]">
                {isPt
                  ? 'Matriz de Coerência: A Cadeia de Validação Científica'
                  : 'Coherence Matrix: Scientific Validation Chain'}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 1. PERGUNTA */}
              <div className="p-3 bg-[#FBF9F4] border border-[#E2D8C3] rounded-[3px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#1A2417]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#4A6B3E]" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#4A6B3E]">
                    1. Pergunta Científica
                  </span>
                </div>
                <p className="text-xs text-[#2A3A24] leading-relaxed font-sans">
                  {selectedItem.question}
                </p>
              </div>

              {/* 2. DADO */}
              <div className="p-3 bg-[#FBF9F4] border border-[#E2D8C3] rounded-[3px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#1A2417]">
                  <Database className="w-3.5 h-3.5 text-[#3D5A30]" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#3D5A30]">
                    2. Dado Empírico / Base
                  </span>
                </div>
                <p className="text-xs text-[#2A3A24] leading-relaxed font-sans">
                  <strong className="text-[#1A2417]">{selectedItem.dataBasis.period}:</strong>{' '}
                  {selectedItem.dataBasis.values}
                </p>
                <span className="text-[10px] font-mono text-[#7A6B58] block pt-1">
                  Fonte: {selectedItem.dataBasis.source}
                </span>
              </div>

              {/* 3. MÉTODO */}
              <div className="p-3 bg-[#FBF9F4] border border-[#E2D8C3] rounded-[3px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#1A2417]">
                  <Sliders className="w-3.5 h-3.5 text-[#5A6852]" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#5A6852]">
                    3. Método Analítico
                  </span>
                </div>
                <p className="text-xs text-[#2A3A24] leading-relaxed font-sans">
                  {selectedItem.methodBasis}
                </p>
              </div>

              {/* 4. RESULTADO */}
              <div className="p-3 bg-[#FBF9F4] border border-[#E2D8C3] rounded-[3px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#1A2417]">
                  <FileCheck className="w-3.5 h-3.5 text-[#2A3A24]" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#2A3A24]">
                    4. Resultado Concreto
                  </span>
                </div>
                <p className="text-xs text-[#2A3A24] leading-relaxed font-sans font-mono text-[11px]">
                  {selectedItem.resultBasis}
                </p>
              </div>

              {/* 5. INTERPRETAÇÃO */}
              <div className="p-3 bg-[#FBF9F4] border border-[#E2D8C3] rounded-[3px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#1A2417]">
                  <Compass className="w-3.5 h-3.5 text-[#2E4A62]" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#2E4A62]">
                    5. Interpretação Sustentada
                  </span>
                </div>
                <p className="text-xs text-[#2A3A24] leading-relaxed font-sans">
                  {selectedItem.interpretationBasis}
                </p>
              </div>

              {/* 6. LIMITAÇÃO */}
              <div className="p-3 bg-[#FDF6ED] border border-[#E8CBA3] rounded-[3px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#8A4A1C]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#A8531E]" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#A8531E]">
                    6. Limitação Metodológica
                  </span>
                </div>
                <p className="text-xs text-[#6A3D18] leading-relaxed font-sans italic">
                  {selectedItem.limitationBasis}
                </p>
              </div>
            </div>
          </div>

          {/* Mapa de Evidências */}
          <EvidenceMap
            statement={selectedItem.statement}
            methodBasis={selectedItem.methodBasis}
            limitationBasis={selectedItem.limitationBasis}
            nodes={selectedItem.evidenceNodes}
            provenanceTrail={selectedItem.provenanceTrail}
            currentLang={currentLang}
          />

          {/* Confronto da Banca (3 Níveis) + Resposta Segura Oral */}
          <div className="bg-[#FAF7F0] border border-[#D9CDAF] rounded-[4px] p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE2D2] pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#A84218]" />
                <h4 className="font-serif font-bold text-sm text-[#1A2417]">
                  {isPt ? 'Confronto com a Banca de Defesa' : 'Defense Board Confrontation'}
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#FDF0E9] text-[#A84218] px-2 py-0.5 rounded-[2px] border border-[#F0CEBD]">
                {isPt ? '3 Níveis de Arguição' : '3 Questioning Levels'}
              </span>
            </div>

            {/* As Três Perguntas de Pressão */}
            <div className="space-y-3">
              {/* Nível 1: Directa */}
              <div className="p-3 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[3px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-mono uppercase font-bold text-[#7A6B58] bg-[#F2EFE8] px-1.5 py-0.2 rounded-[2px]">
                    1. Pergunta Directa
                  </span>
                </div>
                <p className="font-serif text-xs text-[#1A2417] leading-relaxed italic">
                  "{selectedItem.defenseConfrontation.directQuestion}"
                </p>
              </div>

              {/* Nível 2: Contra-argumento */}
              <div className="p-3 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[3px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-mono uppercase font-bold text-[#8A5A1A] bg-[#FDF4E7] px-1.5 py-0.2 rounded-[2px]">
                    2. Contra-argumento
                  </span>
                </div>
                <p className="font-serif text-xs text-[#1A2417] leading-relaxed italic">
                  "{selectedItem.defenseConfrontation.counterArgument}"
                </p>
              </div>

              {/* Nível 3: Pressão */}
              <div className="p-3 bg-[#FCFAF6] border border-[#E8CBA3] rounded-[3px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-mono uppercase font-bold text-[#A84218] bg-[#FDF0E9] px-1.5 py-0.2 rounded-[2px]">
                    3. Pergunta de Pressão Epistemológica
                  </span>
                </div>
                <p className="font-serif text-xs text-[#1A2417] leading-relaxed italic">
                  "{selectedItem.defenseConfrontation.pressureQuestion}"
                </p>
              </div>
            </div>

            {/* Resposta Epistemologicamente Segura (Formato Oral) */}
            <div className="p-4 bg-[#F5F2EA] border-2 border-[#1A2417] rounded-[3px] space-y-3">
              <div className="flex items-center justify-between border-b border-[#D9CDAF] pb-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
                  <span className="font-serif font-bold text-xs uppercase text-[#1A2417]">
                    {isPt
                      ? 'Resposta de Defesa Epistemologicamente Segura'
                      : 'Epistemically Safe Defense Response'}
                  </span>
                </div>
                <button
                  onClick={handleCopySpeech}
                  className="flex items-center gap-1 text-[11px] font-serif text-[#1A2417] bg-[#FCFAF6] border border-[#D9CDAF] px-2 py-0.5 rounded-[2px] hover:bg-[#FAF7F0]"
                >
                  {copiedSpeech ? (
                    <>
                      <Check className="w-3 h-3 text-[#2D5A27]" />
                      <span>{isPt ? 'Copiado!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#7A6B58]" />
                      <span>{isPt ? 'Copiar fala oral' : 'Copy oral script'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2 text-xs leading-relaxed font-serif text-[#1A2417]">
                <p>
                  <strong className="text-[#2D5A27] font-mono uppercase text-[10px] bg-[#EBF2E6] px-1 py-0.2 rounded-[2px] mr-1">
                    Posicionamento:
                  </strong>
                  "{selectedItem.defenseConfrontation.safeDefenseResponse.introduction}"
                </p>
                <p>
                  <strong className="text-[#3D5A30] font-mono uppercase text-[10px] bg-[#F2EFE8] px-1 py-0.2 rounded-[2px] mr-1">
                    Ancoragem nos Dados:
                  </strong>
                  "{selectedItem.defenseConfrontation.safeDefenseResponse.dataProof}"
                </p>
                <p>
                  <strong className="text-[#A84218] font-mono uppercase text-[10px] bg-[#FDF0E9] px-1 py-0.2 rounded-[2px] mr-1">
                    Salvaguarda / Limitação:
                  </strong>
                  "{selectedItem.defenseConfrontation.safeDefenseResponse.limitationCaveat}"
                </p>
                <p>
                  <strong className="text-[#1A2417] font-mono uppercase text-[10px] bg-[#EAE2D2] px-1 py-0.2 rounded-[2px] mr-1">
                    Conclusão Legítima:
                  </strong>
                  "{selectedItem.defenseConfrontation.safeDefenseResponse.conclusion}"
                </p>
              </div>

              <div className="pt-2 border-t border-[#D9CDAF]/60 text-[11px] font-sans text-[#7A6B58]">
                <strong>Texto contínuo para ensaio oral:</strong>
                <p className="mt-1 italic text-[#2A3A24]">
                  "{selectedItem.defenseConfrontation.safeDefenseResponse.fullOralText}"
                </p>
              </div>
            </div>

            {/* Ligação à Banca Adversarial Existente */}
            {associatedVuln && (
              <div className="p-3 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[3px] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#1A2417]" />
                    <span className="text-[10px] font-mono uppercase font-bold text-[#1A2417]">
                      {isPt
                        ? 'Vulnerabilidade Registada na Banca Adversarial'
                        : 'Vulnerability in Adversarial Defense'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-[#1A2417] text-[#FAF7F0] px-1.5 py-0.2 rounded-[2px]">
                    {associatedVuln.code}
                  </span>
                </div>

                <p className="font-serif font-bold text-xs text-[#1A2417]">
                  {associatedVuln.title} ({associatedVuln.category})
                </p>

                <p className="text-[11px] text-[#5A6852] leading-normal font-sans">
                  <strong>Objecção de Ataque:</strong> {associatedVuln.primaryPressure}
                </p>

                {onNavigateToAdversarialVulnerability && (
                  <button
                    onClick={() =>
                      onNavigateToAdversarialVulnerability(
                        selectedItem.associatedVulnerabilityCode!
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs font-serif text-[#1A2417] underline hover:text-[#3D5A30] pt-1"
                  >
                    <span>{isPt ? 'Abrir na Banca Adversarial' : 'Open in Adversarial Board'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
