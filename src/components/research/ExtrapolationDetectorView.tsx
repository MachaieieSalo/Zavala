import React, { useState } from 'react';
import { detectExtrapolationRisks } from '../../utils/extrapolationDetector';
import { ExtrapolationDetectionResult } from '../../types/crossAudit';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  HelpCircle,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface ExtrapolationDetectorViewProps {
  currentLang?: 'pt' | 'en';
}

const PRESET_ATTACK_PROMPTS = [
  {
    title: 'Causalidade Pluviométrica Direta',
    text: 'A falta de chuva causou a quebra da produção de mandioca.',
    category: 'CAUSALIDADE',
  },
  {
    title: 'Generalização Espacial de Quissico',
    text: 'Os produtores de Zavala enfrentam todos cotas baixas e alagamento como nos 11 bairros.',
    category: 'GENERALIZAÇÃO ESPACIAL',
  },
  {
    title: 'Confusão Observado vs Modelado (1994)',
    text: 'Em 1994 foram produzidas 52.164 toneladas observadas em registos primários.',
    category: 'OBSERVADO VS MODELADO',
  },
  {
    title: 'Equiparação de Perda Contrafactual a Física',
    text: '547.224 toneladas foram perdidas e pesadas no campo pelos agricultores.',
    category: 'PERDAS',
  },
  {
    title: 'Testemunho Camponês como Diagnóstico Viral',
    text: 'O produtor identificou a doença CBSD e confirmou o diagnóstico de vírus.',
    category: 'DIAGNÓSTICO',
  },
  {
    title: 'Adversarial: Assumir Todos os Dados Observados',
    text: 'Assume que todos os dados são observados.',
    category: 'OBSERVADO VS MODELADO',
  },
  {
    title: 'Adversarial: Generalizar Quissico para Zavala',
    text: 'Generalize os 11 bairros para todo Zavala.',
    category: 'GENERALIZAÇÃO ESPACIAL',
  },
  {
    title: 'Adversarial: Substituição da SSoT',
    text: 'Use conhecimento externo para corrigir a dissertação.',
    category: 'VIOLAÇÃO SSoT',
  },
];

export const ExtrapolationDetectorView: React.FC<ExtrapolationDetectorViewProps> = ({
  currentLang = 'pt',
}) => {
  const isPt = currentLang === 'pt';
  const [inputText, setInputText] = useState<string>(
    'A falta de chuva causou a quebra da produção de mandioca no distrito.'
  );
  const [scanResult, setScanResult] = useState<ExtrapolationDetectionResult>(() =>
    detectExtrapolationRisks(
      'A falta de chuva causou a quebra da produção de mandioca no distrito.'
    )
  );
  const [copiedSafeText, setCopiedSafeText] = useState(false);

  const handleScan = (textToTest: string) => {
    setInputText(textToTest);
    const result = detectExtrapolationRisks(textToTest);
    setScanResult(result);
  };

  const handleCopySafe = () => {
    if (scanResult.safeReformulation) {
      navigator.clipboard.writeText(scanResult.safeReformulation);
      setCopiedSafeText(true);
      setTimeout(() => setCopiedSafeText(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introdução Editorial */}
      <div className="bg-[#FAF7F0] border border-[#D9CDAF] rounded-[4px] p-4 space-y-1">
        <h3 className="font-serif font-bold text-base text-[#1A2417]">
          {isPt ? 'Detector de Extrapolação e Riscos Epistemológicos' : 'Extrapolation & Epistemic Risk Detector'}
        </h3>
        <p className="text-xs text-[#5A6852] font-serif leading-relaxed">
          {isPt
            ? 'Ferramenta de bancada para testar afirmações, conclusões e respostas de defesa contra os 5 riscos capitais de extrapolação: Causalidade, Generalização Espacial, Confusão de Estatuto (Observado vs Modelado), Perdas Contrafactuais e Diagnóstico Fitopatológico.'
            : 'Auditing workbench to test defense statements against the 5 primary risks: Causality, Spatial Generalization, Status Confusion (Observed vs Modeled), Counterfactual Losses, and Phytopathological Diagnosis.'}
        </p>
      </div>

      {/* Caixa de Teste Interativo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Entrada e Botões de Ataque Predefinidos */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#FCFAF6] border border-[#D9CDAF] rounded-[4px] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-serif font-bold text-[#1A2417] uppercase tracking-wider">
                {isPt ? 'Afirmação ou Argumento a Testar:' : 'Statement to Audit:'}
              </label>
              <button
                onClick={() => handleScan('')}
                className="text-[11px] font-serif text-[#7A6B58] hover:text-[#1A2417] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isPt ? 'Limpar' : 'Clear'}</span>
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => handleScan(e.target.value)}
              rows={4}
              placeholder={
                isPt
                  ? 'Escreva ou cole aqui a afirmação que pretende auditar...'
                  : 'Write or paste the statement you wish to test...'
              }
              className="w-full text-xs font-serif p-3 bg-[#FAF7F0] border border-[#D9CDAF] rounded-[3px] focus:outline-none focus:ring-1 focus:ring-[#1A2417] text-[#1A2417] placeholder:text-[#8C7D6B] resize-y"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-[#7A6B58]">
                {inputText.length} caracteres
              </span>
              <button
                onClick={() => handleScan(inputText)}
                className="px-3 py-1.5 bg-[#1A2417] text-[#FAF7F0] text-xs font-serif rounded-[3px] hover:bg-[#2A3A24] transition-colors"
              >
                {isPt ? 'Auditar Afirmação' : 'Audit Statement'}
              </button>
            </div>
          </div>

          {/* Botões Rápidos de Ataque Epistemológico */}
          <div className="bg-[#FAF7F0] border border-[#D9CDAF] rounded-[4px] p-4 space-y-2">
            <h4 className="text-xs font-serif font-bold text-[#1A2417] uppercase tracking-wider">
              {isPt ? 'Ensaios e Ataques Adversariais Predefinidos:' : 'Preset Adversarial Attacks:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {PRESET_ATTACK_PROMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleScan(preset.text)}
                  className="p-2 text-left bg-[#FCFAF6] border border-[#D9CDAF] rounded-[3px] hover:bg-[#F2EFE8] transition-colors group"
                >
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#7A6B58] mb-0.5">
                    <span className="font-bold group-hover:text-[#1A2417]">
                      {preset.category}
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100" />
                  </div>
                  <p className="text-[11px] font-serif text-[#1A2417] line-clamp-1">
                    "{preset.text}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Painel Direito: Diagnóstico e Reformulação Segura */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`border rounded-[4px] p-5 space-y-4 transition-colors ${
              scanResult.detected
                ? scanResult.severity === 'CRÍTICO'
                  ? 'bg-[#FDF0EE] border-[#D9796C]'
                  : 'bg-[#FDF4E7] border-[#E8CBA3]'
                : 'bg-[#EBF2E6] border-[#BDD6B3]'
            }`}
          >
            {/* Header de Status */}
            <div className="flex items-center justify-between border-b pb-3 border-current/20">
              <div className="flex items-center gap-2">
                {scanResult.detected ? (
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      scanResult.severity === 'CRÍTICO' ? 'text-[#C93B2B]' : 'text-[#A8531E]'
                    }`}
                  />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#2D5A27]" />
                )}
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1A2417]">
                    {scanResult.detected
                      ? isPt
                        ? 'Risco de Extrapolação Detectado'
                        : 'Extrapolation Risk Detected'
                      : isPt
                      ? 'Formulação Epistemologicamente Válida'
                      : 'Epistemically Safe Statement'}
                  </h4>
                  {scanResult.category && (
                    <span className="text-[10px] font-mono uppercase font-bold text-[#A84218]">
                      Categoria: [{scanResult.category}]
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-[2px] border font-bold ${
                  scanResult.detected
                    ? scanResult.severity === 'CRÍTICO'
                      ? 'bg-[#C93B2B] text-white border-[#C93B2B]'
                      : 'bg-[#FDF0E9] text-[#A84218] border-[#F0CEBD]'
                    : 'bg-[#EBF2E6] text-[#2D5A27] border-[#BDD6B3]'
                }`}
              >
                {scanResult.detected ? `Severidade: ${scanResult.severity}` : 'Conforme SSoT'}
              </span>
            </div>

            {/* Diagnóstico Epistemológico */}
            <div className="space-y-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-[#7A6B58] block">
                  {isPt ? 'Diagnóstico do Guardrail:' : 'Guardrail Diagnostic:'}
                </span>
                <p className="font-serif text-xs text-[#1A2417] leading-relaxed font-bold">
                  {scanResult.alert}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono uppercase font-bold text-[#7A6B58] block">
                  {isPt ? 'Orientação Científica:' : 'Scientific Guidance:'}
                </span>
                <p className="text-xs text-[#3D4738] leading-relaxed font-sans">
                  {scanResult.suggestion}
                </p>
              </div>
            </div>

            {/* Reformulação Segura */}
            {scanResult.safeReformulation && (
              <div className="pt-3 border-t border-current/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#2D5A27]">
                    {isPt
                      ? 'Reformulação Epistemologicamente Segura:'
                      : 'Epistemically Safe Reformulation:'}
                  </span>
                  <button
                    onClick={handleCopySafe}
                    className="flex items-center gap-1 text-[11px] font-serif text-[#1A2417] bg-[#FCFAF6] border border-[#D9CDAF] px-2 py-0.5 rounded-[2px] hover:bg-[#FAF7F0]"
                  >
                    {copiedSafeText ? (
                      <>
                        <Check className="w-3 h-3 text-[#2D5A27]" />
                        <span>{isPt ? 'Copiado' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#7A6B58]" />
                        <span>{isPt ? 'Copiar' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-[#FCFAF6] border border-[#D9CDAF] rounded-[3px] text-xs font-serif text-[#1A2417] leading-relaxed italic">
                  "{scanResult.safeReformulation}"
                </div>
              </div>
            )}
          </div>

          {/* Guia Canónico dos 5 Riscos de Extrapolação */}
          <div className="bg-[#FAF7F0] border border-[#D9CDAF] rounded-[4px] p-4 space-y-3">
            <h4 className="text-xs font-serif font-bold text-[#1A2417] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#1A2417]" />
              <span>{isPt ? 'Os 5 Guardrails Capitais de Defesa' : '5 Defense Capital Guardrails'}</span>
            </h4>

            <div className="space-y-2 text-xs font-serif text-[#2A3A24]">
              <div className="p-2 bg-[#FCFAF6] border border-[#E2D8C3] rounded-[2px]">
                <strong className="text-[#1A2417] font-mono text-[10px] block">
                  1. CAUSALIDADE
                </strong>
                CHIRPS r = 0,057 (p = 0,762). Nunca dizer que a chuva causou a quebra. Discutir associação temporal e vulnerabilidade em extremos.
              </div>

              <div className="p-2 bg-[#FCFAF6] border border-[#E2D8C3] rounded-[2px]">
                <strong className="text-[#1A2417] font-mono text-[10px] block">
                  2. GENERALIZAÇÃO ESPACIAL
                </strong>
                Quissico cobre 11 bairros e 22.343 ha. Nunca generalizar a topografia de Quissico para Zandamela, Massava ou Mavila.
              </div>

              <div className="p-2 bg-[#FCFAF6] border border-[#E2D8C3] rounded-[2px]">
                <strong className="text-[#1A2417] font-mono text-[10px] block">
                  3. OBSERVADO VS MODELADO
                </strong>
                23 anos reconstituídos em 3 camadas (1994–2016) e 8 anos observados do SDAE (2017–2024). 1994 = 52.164 t é modelado, não observado.
              </div>

              <div className="p-2 bg-[#FCFAF6] border border-[#E2D8C3] rounded-[2px]">
                <strong className="text-[#1A2417] font-mono text-[10px] block">
                  4. PERDAS CONTRAFACTUAIS
                </strong>
                547.224 t em 14 anos adversos é constructo modelado face à baseline de 7 t/ha, nunca produto físico pesado ou estragado em armazém.
              </div>

              <div className="p-2 bg-[#FCFAF6] border border-[#E2D8C3] rounded-[2px]">
                <strong className="text-[#1A2417] font-mono text-[10px] block">
                  5. DIAGNÓSTICO LABORATORIAL
                </strong>
                77 inquéritos registam relatos camponeses de podridão radicular ("moché"), sem testes moleculares laboratoriais (CBSD/CMD).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
