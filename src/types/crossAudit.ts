/**
 * Tipos Oficiais para a Auditoria Científica Cruzada e Preparação de Defesa
 * FASE 12 — ZAVALAVOZ (UEM / ESUDER • Yolanda Tamele)
 * 
 * Regra Absoluta: SSoT em src/data/thesisScientificData.ts é intocável.
 */

import { EpistemicStatus } from './research';

export type AuditAxisId = 'dados' | 'metodo' | 'resultados' | 'interpretacao';

export interface AuditAxisItem {
  id: string;
  axis: AuditAxisId;
  title: string;
  canonicalFact: string;
  epistemicStatus: EpistemicStatus;
  ssotReference: string;
  thesisSection: string;
  verificationCheck: string;
  potentialTensionOrCaveat: string;
  safeDefenseFormulation: string;
}

export interface EvidenceNode {
  id: string;
  title: string;
  epistemicType: EpistemicStatus;
  description: string;
  sourceSsot: string;
  provenance: string;
}

export interface CoherenceMatrixItem {
  id: string;
  title: string;
  statement: string; // Afirmação canónica da dissertação
  domain:
    | 'Tendência Temporal'
    | 'Série Híbrida'
    | 'Clima e CHIRPS'
    | 'Perdas Contrafactuais'
    | 'Espacial Quissico'
    | 'Trabalho de Campo'
    | 'Choque Freddy 2023'
    | 'Quebra Estrutural'
    | 'Dinâmica de Área';
  question: string; // Pergunta científica original
  dataBasis: {
    period: string;
    values: string;
    source: string;
    status: EpistemicStatus;
  };
  methodBasis: string; // Método canónico
  resultBasis: string; // Resultado quantitativo / empírico exacto
  interpretationBasis: string; // Interpretação legítima sustentada
  limitationBasis: string; // Limitação metodológica e salvaguarda
  evidenceNodes: EvidenceNode[]; // Mapa de suporte
  defenseConfrontation: {
    directQuestion: string; // 1. Pergunta directa da banca
    counterArgument: string; // 2. Contra-argumento
    pressureQuestion: string; // 3. Pergunta de pressão
    safeDefenseResponse: {
      introduction: string; // "Eu diria que..."
      dataProof: string; // "Os dados mostram..."
      limitationCaveat: string; // "Contudo, há uma limitação..."
      conclusion: string; // "Por isso, interpreto este resultado como..."
      fullOralText: string;
    };
  };
  associatedVulnerabilityCode?: string; // Código V1 a V20 na Banca Adversarial
  provenanceTrail: string;
}

export type ExtrapolationCategory =
  | 'CAUSALIDADE'
  | 'GENERALIZAÇÃO ESPACIAL'
  | 'OBSERVADO VS MODELADO'
  | 'PERDAS'
  | 'DIAGNÓSTICO'
  | 'VIOLAÇÃO SSoT';

export interface ExtrapolationDetectionResult {
  detected: boolean;
  category: ExtrapolationCategory | null;
  riskPhrase: string;
  alert: string;
  suggestion: string;
  safeReformulation: string;
  severity: 'ALTO' | 'MÉDIO' | 'CRÍTICO';
}
