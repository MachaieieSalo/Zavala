/**
 * Tipos e Interfaces da Estação de Pesquisa Científica com LLM
 * ZAVALAVOZ — UEM / ESUDER
 */

export type ResearchScope =
  | 'todos'
  | 'metodologia'
  | 'dados'
  | 'clima'
  | 'campo'
  | 'sig'
  | 'defesa'
  | 'bibliografia'
  | 'externo'
  | 'entrevistas'
  | 'resultados';

export type EpistemicStatus =
  | 'OBSERVADO'
  | 'RECONSTITUÍDO'
  | 'MODELADO'
  | 'RECONSTITUÍDO / MODELADO'
  | 'TESTEMUNHO DE CAMPO'
  | 'INTERPRETAÇÃO'
  | 'CONTEXTUALIZAÇÃO EXTERNA';

export type ResponseStatusCategory =
  | 'SUPORTADA PELOS DADOS'
  | 'INTERPRETAÇÃO'
  | 'CONTEXTUALIZAÇÃO EXTERNA'
  | 'SUPORTE INSUFICIENTE';

export type EvidenceHierarchyLevel =
  | 'NÍVEL 1: SSoT Científico'
  | 'NÍVEL 2: Texto e Evidências da Dissertação'
  | 'NÍVEL 3: Dados de Campo e Entrevistas'
  | 'NÍVEL 4: Referências Bibliográficas'
  | 'NÍVEL 5: Conhecimento Geral do Modelo';

export interface RetrievedEvidenceItem {
  id: string;
  hierarchyLevel: EvidenceHierarchyLevel;
  section: string;
  variable?: string;
  year?: number | string;
  tableOrFigure?: string;
  component: string;
  source: string;
  internalReference: string;
  snippet: string;
  provenanceTrail?: string; // Ex: "SSoT → Série Histórica → 2021"
  epistemicStatus?: EpistemicStatus;
  contextActionLabel?: string; // Ex: "Ver série histórica", "Ver registo de campo"
  targetTab?: 'dados' | 'campo' | 'estudio' | 'defesa';
  targetParam?: string | number;
}

export interface EpistemicGuardrailAlert {
  code:
    | 'R_CAUSALIDADE_DETERMINISTICA'
    | 'R_DADOS_OBSERVADOS_TOTAIS'
    | 'R_PERDAS_TOTAIS_REAIS'
    | 'R_CORRELACAO_CHIRPS_CAUSAL'
    | 'R_EXTRAPOLACAO_QUISSICO'
    | 'R_DIAGNOSTICO_FITOPATOLOGICO_CAMPONES'
    | 'R_CONFUSAO_OBSERVADO_RECONSTITUIDO'
    | 'R_INFERENCIA_SEM_EVIDENCIA';
  riskLabel: string;
  detectedTextSnippet?: string;
  guardrailMessage: string;
  remedyApplied: string;
}

export interface OralDefenseStructure {
  euDiria: string;
  osDadosMostram: string;
  contudo: string;
  porIsso: string;
}

export interface RehearsalJuryQuestion {
  id: string;
  scenario: string; // ex: "Examinador Crítico de Metodologia e Modelação"
  examinerQuestion: string; // Pergunta plausível de examinador
  vulnerabilityCode?: string; // ex: "V_01_TEMPORAL", "V_04_CAUSAL"
  vulnerabilityTitle?: string;
  supportingEvidence: string;
  defenseAngle: string;
  classification: 'PERGUNTA GERADA PARA ENSAIO';
}

export interface StructuredAcademicResponse {
  answerText: string; // RESPOSTA: Explicação principal em texto contínuo e académico
  evidenceSummary?: string; // EVIDÊNCIA: Fontes e dados utilizados
  interpretationBreakdown?: string; // INTERPRETAÇÃO: Separação de dado documentado vs interpretação vs inferência
  methodologicalLimitation?: string; // LIMITAÇÃO: Limitação metodológica relevante
  oralDefense?: OralDefenseStructure; // Estrutura oral para modo "Preparar para defesa"
  externalContextNotice?: string; // Aviso obrigatório quando há conhecimento externo
  dataGapNotice?: string; // Aviso obrigatório quando há lacuna documental
}

export interface ResearchMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  scope?: ResearchScope;
  epistemicStatus?: EpistemicStatus;
  statusCategory?: ResponseStatusCategory;
  evidences?: RetrievedEvidenceItem[];
  epistemicAlerts?: EpistemicGuardrailAlert[];
  structuredResponse?: StructuredAcademicResponse;
  modelUsed?: string;
  isExternalKnowledgeUsed?: boolean;
  isFallback?: boolean;
  fallbackNotice?: string;
  defensePreparationMode?: boolean;
  rehearsalQuestion?: RehearsalJuryQuestion;
}

export interface ResearchConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  scope: ResearchScope;
  messages: ResearchMessage[];
  defensePreparationMode?: boolean;
}

export interface ResearchQueryRequest {
  query: string;
  scope?: ResearchScope;
  history?: { role: 'user' | 'assistant'; content: string }[];
  defensePreparationMode?: boolean; // Modo "Preparar para defesa"
  generateJuryQuestion?: boolean; // Modo "Transformar em pergunta da banca"
}

export interface ResearchQueryResponse {
  answer: string;
  epistemicStatus: EpistemicStatus;
  retrievedEvidence: RetrievedEvidenceItem[];
  statusCategory: ResponseStatusCategory;
  epistemicAlerts: EpistemicGuardrailAlert[];
  structuredResponse: StructuredAcademicResponse;
  scope: ResearchScope;
  modelUsed: string;
  disclaimer: string;
  hasApiKey: boolean;
  isExternalKnowledgeUsed: boolean;
  isFallback: boolean;
  fallbackNotice?: string;
  defensePreparationMode?: boolean;
  rehearsalQuestion?: RehearsalJuryQuestion;
}
