/**
 * ZAVALAVOZ — FASE 14: SALA DE BANCA DIGITAL & SIMULAÇÃO CIENTÍFICA ADAPTATIVA
 * 
 * Dissertação: "Dinâmica da Produção de Mandioca no Distrito de Zavala (1994–2024)"
 * Autora: Eng.ª Yolanda Tamele | Orientador: UEM / ESUDER
 * 
 * Princípios Fundamentais:
 * 1. Baseada exclusivamente na SSoT e no Corpus Científico Validado.
 * 2. Sem gamificação: SEM pontuação numérica, percentagens ou rankings.
 * 3. 4 Perfis de Examinadores com intenções e fundamentações epistemológicas distintas.
 * 4. 4 Níveis de Pressão: Compreensão, Justificação, Confrontação e Adversarial.
 * 5. Motor Adaptativo: FORTE, ADEQUADO, PARCIAL, VULNERÁVEL, NÃO SUSTENTADO.
 * 6. Distinção de Etiqueta: PERGUNTA CANÓNICA vs PERGUNTA GERADA PARA ENSAIO.
 * 7. Modelo de Resposta da Candidata: EU DIRIA / OS DADOS MOSTRAM / CONTUDO / POR ISSO.
 * 8. Microfeedback Oral e Detecção de Vícios de Defesa.
 * 9. Mapa da Argumentação Dinâmico.
 * 10. Relatório de Preparação para Defesa com 8 Secções Canónicas.
 */

import { THESIS_CORE_FACTS, SCIENTIFIC_TIME_SERIES } from './thesisScientificData';

// -------------------------------------------------------------
// 1. TIPOS FUNDAMENTAIS
// -------------------------------------------------------------

export type ExaminerId =
  | 'metodologia_estatistica'
  | 'agronomia_clima'
  | 'sig_campo'
  | 'argumentacao_defesa';

export type PressureLevel = 1 | 2 | 3 | 4;

export type DefenseTone = 'realista' | 'hostil';

export type DomainClassification =
  | 'FORTE'
  | 'ADEQUADO'
  | 'PARCIAL'
  | 'VULNERÁVEL'
  | 'NÃO SUSTENTADO';

export type EpistemicStatus =
  | 'OBSERVADO'
  | 'RECONSTITUÍDO'
  | 'MODELADO'
  | 'RECONSTITUÍDO / MODELADO'
  | 'TESTEMUNHO DE CAMPO'
  | 'INTERPRETAÇÃO'
  | 'CONTEXTUALIZAÇÃO EXTERNA';

export type QuestionTag = 'PERGUNTA CANÓNICA' | 'PERGUNTA GERADA PARA ENSAIO';

export interface ExaminerProfile {
  id: ExaminerId;
  name: string;
  title: string;
  affiliation: string;
  focusArea: string;
  toneDescriptionRealista: string;
  toneDescriptionHostil: string;
  signatureStyle: string;
  targetDimensions: number[]; // Referência às 30 dimensões
}

export interface CandidateResponseStructure {
  euDiria: string;
  osDadosMostram: string;
  contudo: string;
  porIsso: string;
}

export interface OralMicrofeedbackItem {
  type:
    | 'resposta_longa'
    | 'sem_resposta_direta'
    | 'fuga_pergunta'
    | 'excesso_contextualizacao'
    | 'sem_evidencia'
    | 'conclusao_excessiva'
    | 'sem_limitacao'
    | 'repeticao'
    | 'confusao_estatuto';
  label: string;
  observation: string;
  remedy: string;
}

export interface AdaptiveQuestion {
  id: string;
  dimensionId: number;
  dimensionName: string;
  examinerId: ExaminerId;
  level: PressureLevel;
  tag: QuestionTag;
  questionText: string;
  contextGuidance: string;
  epistemicFocus: EpistemicStatus;
  expectedCoreEvidence: string[];
  vulnerabilityToWatch: string;
  followUpIfStrong: string;
  followUpIfPartial: string;
  followUpIfVulnerable: string;
  followUpIfNotSustained: string;
}

export interface ReadingFromJury {
  correctlyAnswered: string;
  incompleteAspects: string;
  vulnerabilityIdentified: string;
  shouldBeDefended: string;
  nextQuestion: string;
  nextQuestionTag: QuestionTag;
}

export interface AdaptiveEvaluationResult {
  domain: DomainClassification;
  pressureLevel: PressureLevel;
  nextPressureLevel: PressureLevel;
  examinerId: ExaminerId;
  tag: QuestionTag;
  reading: ReadingFromJury;
  examinerReplica: string;
  oralFeedback: OralMicrofeedbackItem[];
  epistemicStatusUsed: EpistemicStatus[];
  epistemicAccuracy: 'conforme' | 'atencao' | 'violacao';
  conceptMastered: string;
  conceptOmitted: string;
  problematicClaim: string | null;
  possibleContradiction: string | null;
  needToDeepen: string;
  modelResponse: CandidateResponseStructure;
  hasPromptInjectionAttempt: boolean;
  securityNotice: string | null;
}

export interface ArgumentationStepRecord {
  stepNumber: number;
  examinerId: ExaminerId;
  pressureLevel: PressureLevel;
  questionId: string;
  questionText: string;
  questionTag: QuestionTag;
  candidateResponse: string;
  domain: DomainClassification;
  evidenceUsed: string[];
  epistemicStatuses: EpistemicStatus[];
  vulnerabilityDetected: string;
  examinerReplica: string;
  nextQuestionText: string;
  timestamp: string;
}

export interface FinalDefenseReport {
  sessionId: string;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  examinerId: ExaminerId;
  tone: DefenseTone;
  domainSummary: Record<DomainClassification, number>;
  section1Strengths: string[];
  section2ScientificVulnerabilities: string[];
  section3StatisticalVulnerabilities: string[];
  section4MethodologicalVulnerabilities: string[];
  section5ArgumentationVulnerabilities: string[];
  section6QuestionsRequiringRevision: {
    question: string;
    issue: string;
    recommendation: string;
  }[];
  section7ResponsesToReTrain: {
    question: string;
    originalWeakness: string;
    recommendedModel: CandidateResponseStructure;
  }[];
  section8RecommendedQuestionsForNewRehearsal: {
    dimension: string;
    question: string;
    reason: string;
  }[];
  qualitativeArgumentationMap: ArgumentationStepRecord[];
}

// -------------------------------------------------------------
// 2. OS 4 EXAMINADORES DA BANCA
// -------------------------------------------------------------

export const EXAMINER_PROFILES: Record<ExaminerId, ExaminerProfile> = {
  metodologia_estatistica: {
    id: 'metodologia_estatistica',
    name: 'Prof. Dr. Mateus Macuvele',
    title: 'Vogal de Metodologia e Econometria Agrária',
    affiliation: 'Departamento de Matemática e Estatística — UEM',
    focusArea: 'Reconstrução em 3 camadas, OLS Newey-West, Mann-Kendall, declive de Sen, Hamed & Rao, significância e Chow.',
    toneDescriptionRealista: 'Inquisitivo, atento aos pressupostos econométricos, escuta com rigor formal e exige delimitação matemática.',
    toneDescriptionHostil: 'Interrompe raciocínios vagos, exige valores exatos de Z, p-valor e declive de Sen, questiona a legitimidade da interpolação e não tolera inferência sem ressalva de variância.',
    signatureStyle: 'Exige demonstração formal da estabilidade da série e recusa extrapolações sem teste de quebra estrutural.',
    targetDimensions: [4, 5, 6, 7, 8, 9, 10, 11, 17, 25, 29],
  },
  agronomia_clima: {
    id: 'agronomia_clima',
    name: 'Prof.ª Doutora Sandra Muchanga',
    title: 'Arguente Principal de Agronomia e Clima',
    affiliation: 'Faculdade de Agronomia e Engenharia Florestal — UEM / IIAM',
    focusArea: 'Fisiologia da mandioca, variedades locais e clones IIAM, CHIRPS v2.0, extremos hídricos, asfixia radicular e desacoplamento.',
    toneDescriptionRealista: 'Focada na biologia da cultura e na dinâmica agroclimática no terreno arenoso de Zavala.',
    toneDescriptionHostil: 'Confronta de imediato qualquer tentativa de culpar a seca pela queda de 2023, exige prova fitossanitária e desmonta causalidades climáticas fáceis.',
    signatureStyle: 'Insiste que correlação não é causa e lembra que r=0,057 é virtualmente nulo para fins causais.',
    targetDimensions: [1, 3, 12, 13, 14, 15, 16, 26, 27, 28],
  },
  sig_campo: {
    id: 'sig_campo',
    name: 'Dr. Tomás Cumbana',
    title: 'Vogal de Geoinformação e Trabalho Empírico',
    affiliation: 'Centro de Estudos de Desenvolvimento Rural — ESUDER / UEM',
    focusArea: '11 bairros de Quissico, 22.343 ha, Sentinel-2 / Dynamic World P75, SRTM <9m, 77 inquéritos, cadernos de campo e etnografia.',
    toneDescriptionRealista: 'Empírico e pragmático, interessado na correspondência entre o pixel de satélite e a machamba real.',
    toneDescriptionHostil: 'Recusa generalizações de Quissico para o restante distrito, confronta a precisão das cotas de inundação e diferencia radicalmente percepção camponesa de diagnóstico laboratorial.',
    signatureStyle: 'Não permite confundir classificação espectral com pesagem de mandioca nem inquérito com diagnóstico biológico.',
    targetDimensions: [18, 19, 20, 21, 22, 23, 24, 25, 27, 29],
  },
  argumentacao_defesa: {
    id: 'argumentacao_defesa',
    name: 'Prof. Doutor Alberto Nhambire',
    title: 'Presidente do Júri e Epistemólogo Agrário',
    affiliation: 'Conselho Científico — UEM',
    focusArea: 'Coerência interna, distinção entre dados e interpretações, validade de conclusões, limitações e contribuição científica.',
    toneDescriptionRealista: 'Equilibrado, busca a sustentabilidade global da tese, testa a capacidade de síntese e a sobriedade académica.',
    toneDescriptionHostil: 'Provoca a candidata a defender a tese contra si mesma, explora ambiguidades conceituais e ataca conclusões que ultrapassem as fronteiras dos dados.',
    signatureStyle: 'Exige o rigor do formato "Eu diria / Os dados mostram / Contudo / Por isso" e condena conclusões triunfalistas.',
    targetDimensions: [1, 2, 3, 25, 26, 28, 29, 30],
  },
};

// -------------------------------------------------------------
// 3. AS 30 DIMENSÕES TEMÁTICAS DA DISSERTAÇÃO
// -------------------------------------------------------------

export interface DissertationDimension {
  id: number;
  name: string;
  leadExaminer: ExaminerId;
  epistemicStatus: EpistemicStatus;
  canonicalKeyFact: string;
  forbiddenExtrapolation: string;
}

export const DISSERTATION_DIMENSIONS: Record<number, DissertationDimension> = {
  1: {
    id: 1,
    name: 'Problema Científico',
    leadExaminer: 'argumentacao_defesa',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Vulnerabilidade climática vs resiliência da mandioca em sistemas familiares de Zavala.',
    forbiddenExtrapolation: 'Afirmar que a mandioca é imune a qualquer choque ou que a produção distrital independe do ambiente.',
  },
  2: {
    id: 2,
    name: 'Objectivos da Investigação',
    leadExaminer: 'argumentacao_defesa',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Reconstruir a série 1994-2024, avaliar tendências, analisar choques climáticos e mapear o uso do solo em Quissico.',
    forbiddenExtrapolation: 'Pretender ter feito um censo agropecuário distrital completo ou modelação preditiva para 2030.',
  },
  3: {
    id: 3,
    name: 'Hipóteses e Questões de Investigação',
    leadExaminer: 'agronomia_clima',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Hipótese central de que a produção apresenta tendência positiva no longo prazo, mas com alta vulnerabilidade a extremos.',
    forbiddenExtrapolation: 'Supor causalidade climática direta univariada.',
  },
  4: {
    id: 4,
    name: 'Reconstrução da Série Temporal',
    leadExaminer: 'metodologia_estatistica',
    epistemicStatus: 'MODELADO',
    canonicalKeyFact: 'Modelo em 3 camadas (baseline agrícola + SPI/choques + ajuste documental). Teste de Chow F=0,84 (p=0,443).',
    forbiddenExtrapolation: 'Afirmar que os dados de 1994 a 2016 foram directamente pesados no terreno.',
  },
  5: {
    id: 5,
    name: 'Fontes dos Dados',
    leadExaminer: 'metodologia_estatistica',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: 'SDAE Zavala, CHIRPS v2.0 (UCSB), Sentinel-2 (Copernicus), SRTM (NASA) e Caderno de Campo.',
    forbiddenExtrapolation: 'Inventar fontes secundárias ou afirmar uso de estações meteorológicas locais inexistentes em Quissico.',
  },
  6: {
    id: 6,
    name: 'Período Reconstituído (1994–2016)',
    leadExaminer: 'metodologia_estatistica',
    epistemicStatus: 'RECONSTITUÍDO / MODELADO',
    canonicalKeyFact: '23 anos modelados em 3 camadas com base em desastres históricos e calibração agronómica.',
    forbiddenExtrapolation: 'Tratar dados de 1994-2016 como medições empíricas contínuas.',
  },
  7: {
    id: 7,
    name: 'Período Observado (2017–2024)',
    leadExaminer: 'metodologia_estatistica',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: '8 anos observados directamente via registos oficiais distritais do SDAE Zavala.',
    forbiddenExtrapolation: 'Confundir dados SDAE com inquéritos de campo amostrais.',
  },
  8: {
    id: 8,
    name: 'Tendência Não-Paramétrica de Mann-Kendall',
    leadExaminer: 'metodologia_estatistica',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Z = +3,100 (p = 0,0019) confirmando tendência ascendente estatisticamente significativa a 1%.',
    forbiddenExtrapolation: 'Interpretar Z positivo como garantia de subida uniforme ano após ano sem quebras.',
  },
  9: {
    id: 9,
    name: 'Declive de Sen (Theil-Sen)',
    leadExaminer: 'metodologia_estatistica',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Declive mediano de +3.738 t/ano, robusto a valores extremos (outliers).',
    forbiddenExtrapolation: 'Confundir declive de Sen (+3.738 t/ano) com OLS paramétrico (+4.229 t/ano).',
  },
  10: {
    id: 10,
    name: 'Regressão OLS e Incerteza (Newey-West)',
    leadExaminer: 'metodologia_estatistica',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Declive OLS de +4.229 t/ano (p = 0,020; R² = 0,174), com erros-padrão robustos a autocorrelação.',
    forbiddenExtrapolation: 'Ignorar o baixo poder explicativo (R² = 0,174) e considerá-lo modelo preditivo determinístico.',
  },
  11: {
    id: 11,
    name: 'Autocorrelação e Correcção Hamed & Rao (1998)',
    leadExaminer: 'metodologia_estatistica',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Aplicação do método Hamed & Rao para evitar falsos positivos provocados por persistência serial.',
    forbiddenExtrapolation: 'Dizer que Mann-Kendall convencional sem correcção seria suficiente para séries agrícolas.',
  },
  12: {
    id: 12,
    name: 'Precipitação Satelital CHIRPS v2.0',
    leadExaminer: 'agronomia_clima',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: 'Resolução 0,05° (~5,3 km); média histórica da estação chuvosa em Zavala: 980,4 mm.',
    forbiddenExtrapolation: 'Dizer que CHIRPS substitui pluviómetros terrestres de superfície sem incerteza associada.',
  },
  13: {
    id: 13,
    name: 'Eventos Extremos e Ciclones (IBTrACS)',
    leadExaminer: 'agronomia_clima',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: 'Impacto dos Ciclones Eline (2000), Favio (2007), Dando (2012), Dineo (2017) e Freddy (2023).',
    forbiddenExtrapolation: 'Inventar ciclones inexistentes no corpus (ex: "Ciclone X").',
  },
  14: {
    id: 14,
    name: 'Pico Histórico de 2021',
    leadExaminer: 'agronomia_clima',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: '273.773 toneladas (SDAE Zavala, 23.919 ha, rendimento 11,45 t/ha, difusão de clones IIAM).',
    forbiddenExtrapolation: 'Alterar o valor canónico de 273.773 t ou considerá-lo dado modelado.',
  },
  15: {
    id: 15,
    name: 'Quebra Catastrófica de 2023 (Ciclone Freddy)',
    leadExaminer: 'agronomia_clima',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: '35.371 toneladas (-87,1% vs pico 2021; 1.746 mm de chuva CHIRPS; asfixia radicular em baixas).',
    forbiddenExtrapolation: 'Atribuir a quebra a seca ou afirmar que a produção foi zero.',
  },
  16: {
    id: 16,
    name: 'Safra de 2024 e Retoma Pós-Choque',
    leadExaminer: 'agronomia_clima',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: '48.573 toneladas (+37,3% vs 2023; 25.235 ha; rendimento 1,92 t/ha; escassez de estacas).',
    forbiddenExtrapolation: 'Dizer que em 2024 a produção recuperou totalmente para os níveis de 2021.',
  },
  17: {
    id: 17,
    name: 'Estimativa Contrafactual de Perdas (547.224 t)',
    leadExaminer: 'metodologia_estatistica',
    epistemicStatus: 'MODELADO',
    canonicalKeyFact: '547.224 t acumuladas em 14 anos adversos (1994–2016) calculadas face a um baseline contrafactual de 7 t/ha.',
    forbiddenExtrapolation: 'Descrever 547.224 t como mandioca fisicamente colhida e apodrecida no armazém.',
  },
  18: {
    id: 18,
    name: 'Trabalho de Campo e Caderno Etnográfico',
    leadExaminer: 'sig_campo',
    epistemicStatus: 'TESTEMUNHO DE CAMPO',
    canonicalKeyFact: '51 páginas do caderno de campo e 10 fotografias originais georreferenciadas em Quissico.',
    forbiddenExtrapolation: 'Tratar anotações de campo como inquérito quantitativo probabilístico nacional.',
  },
  19: {
    id: 19,
    name: 'Amostragem: 77 Inquéritos a Produtores',
    leadExaminer: 'sig_campo',
    epistemicStatus: 'TESTEMUNHO DE CAMPO',
    canonicalKeyFact: '77 formulários transcritos em 11 bairros de Quissico (61,1% mulheres, 38,9% homens; 62 camponeses e 5 líderes).',
    forbiddenExtrapolation: 'Dizer que 77 inquéritos cobrem todo o distrito ou representam medição molecular.',
  },
  20: {
    id: 20,
    name: '11 Bairros do Posto de Quissico',
    leadExaminer: 'sig_campo',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: 'Nzile, Zavalene, Dombe, Nhamajal, Muane, etc., cobrindo 22.343 ha delimitados cartograficamente.',
    forbiddenExtrapolation: 'Extrapolar a dinâmica intra-urbana e periurbana de Quissico para Zandamela, Massava ou Mavila.',
  },
  21: {
    id: 21,
    name: 'Base Cartográfica e SIG Distrital',
    leadExaminer: 'sig_campo',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: 'QGIS, datum WGS 84 / UTM zone 36S; vetorização oficial dos limites administrativos de Quissico.',
    forbiddenExtrapolation: 'Afirmar que existiam imagens de alta resolução sub-métrica comercial diária.',
  },
  22: {
    id: 22,
    name: 'Classificação Sentinel-2 (Copernicus 10m)',
    leadExaminer: 'sig_campo',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: 'Mosaico multiespectral Sentinel-2 de 10 metros para discriminação de áreas agrícolas e vegetação.',
    forbiddenExtrapolation: 'Dizer que o Sentinel-2 detecta raízes de mandioca debaixo da terra.',
  },
  23: {
    id: 23,
    name: 'Dynamic World e Cobertura do Solo (P75)',
    leadExaminer: 'sig_campo',
    epistemicStatus: 'MODELADO',
    canonicalKeyFact: 'Série temporal de probabilidade de culturas (crops) do Dynamic World com agregador percentil 75.',
    forbiddenExtrapolation: 'Confundir área espectral de culturas com tonelagem colhida de mandioca.',
  },
  24: {
    id: 24,
    name: 'Topografia e Drenagem SRTM (30m)',
    leadExaminer: 'sig_campo',
    epistemicStatus: 'OBSERVADO',
    canonicalKeyFact: 'Modelo Digital de Elevação SRTM 30m; detecção de depressões com cota < 9m propensas a encharcamento.',
    forbiddenExtrapolation: 'Ignorar a microtopografia de duna costeira e assumir drenagem uniforme.',
  },
  25: {
    id: 25,
    name: 'Limitações Metodológicas e Territoriais',
    leadExaminer: 'argumentacao_defesa',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Distinção entre período modelado (23 anos) e observado (8 anos); restrição espacial a Quissico; ausência de ensaios moleculares.',
    forbiddenExtrapolation: 'Negar as limitações ou tentar esconder a hibridez da série.',
  },
  26: {
    id: 26,
    name: 'Políticas Públicas e Extensão Agrária',
    leadExaminer: 'argumentacao_defesa',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Programa SUSTENTA, bancos comunitários de estacas, intervenção DADTCO e apoio emergencial pós-Freddy.',
    forbiddenExtrapolation: 'Afirmar que as políticas públicas resolveram em definitivo a vulnerabilidade de Zavala.',
  },
  27: {
    id: 27,
    name: 'Conhecimento Camponês e Resiliência Local',
    leadExaminer: 'sig_campo',
    epistemicStatus: 'TESTEMUNHO DE CAMPO',
    canonicalKeyFact: 'Práticas de conservação (Kukwatsana), plantio em socalcos nas dunas, colheita escalonada e variedades amargas.',
    forbiddenExtrapolation: 'Tratar o saber tradicional como diagnóstico laboratorial fitopatológico.',
  },
  28: {
    id: 28,
    name: 'Conclusões Gerais da Dissertação',
    leadExaminer: 'argumentacao_defesa',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Crescimento estrutural (+3.738 t/ano) com vulnerabilidade aguda a choques extremos e assimetrias espaciais.',
    forbiddenExtrapolation: 'Concluir que o distrito atingiu a auto-suficiência perene e estável.',
  },
  29: {
    id: 29,
    name: 'Validade Externa e Extrapolação Territorial',
    leadExaminer: 'argumentacao_defesa',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Resultados representativos de ambientes costeiros arenosos do sul de Moçambique sob regime de sequeiro.',
    forbiddenExtrapolation: 'Generalizar directamente para zonas do interior sem dunas costeiras ou com solos argilosos pesados.',
  },
  30: {
    id: 30,
    name: 'Contribuições Científicas e Inovação',
    leadExaminer: 'argumentacao_defesa',
    epistemicStatus: 'INTERPRETAÇÃO',
    canonicalKeyFact: 'Primeira série temporal de 31 anos de mandioca para Zavala reconciliando dados SDAE, CHIRPS, SIG e etnoagronomia.',
    forbiddenExtrapolation: 'Apresentar a tese como um modelo econométrico preditivo global ou sistema comercial em tempo real.',
  },
};

// -------------------------------------------------------------
// 4. BANCO CANÓNICO DE PERGUNTAS ADAPTATIVAS (NÍVEIS 1 A 4)
// -------------------------------------------------------------

export const CANONICAL_ADAPTIVE_QUESTIONS: AdaptiveQuestion[] = [
  // EXAMINADOR 1 — METODOLOGIA E ESTATÍSTICA
  {
    id: 'AD_MET_01',
    dimensionId: 4,
    dimensionName: 'Reconstrução da Série Temporal',
    examinerId: 'metodologia_estatistica',
    level: 1,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'Porque foi estritamente necessário reconstruir a série de produção de mandioca de Zavala entre 1994 e 2016?',
    contextGuidance: 'Avalia se a candidata reconhece a inexistência de registos contínuos antes de 2017 e explica a metodologia das 3 camadas.',
    epistemicFocus: 'MODELADO',
    expectedCoreEvidence: ['1994–2016', '3 camadas', 'SDAE contínuo a partir de 2017', 'Chow F=0,84'],
    vulnerabilityToWatch: 'Afirmar que os dados de 1994–2016 foram dados observados esquecidos nos arquivos.',
    followUpIfStrong: 'Como garantiu a compatibilidade estatística entre o período modelado e o período observado de 2017–2024?',
    followUpIfPartial: 'Pode precisar quais foram as três camadas utilizadas nessa modelação?',
    followUpIfVulnerable: 'Não estará a chamar dado histórico àquilo que é uma simples interpolação computacional?',
    followUpIfNotSustained: 'Tem consciência de que afirmar que 1994 é observado contradiz a Tabela 4.1 da sua própria dissertação?',
  },
  {
    id: 'AD_MET_02',
    dimensionId: 8,
    dimensionName: 'Tendência de Mann-Kendall',
    examinerId: 'metodologia_estatistica',
    level: 2,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'Porque considerou metodologicamente adequada a aplicação do teste não-paramétrico de Mann-Kendall com correcção de Hamed & Rao (1998)?',
    contextGuidance: 'Verifica a compreensão sobre não-normalidade de dados agrícolas e presença de autocorrelação serial.',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['Z = +3,100', 'p = 0,0019', 'não-normalidade', 'autocorrelação serial', 'Hamed & Rao'],
    vulnerabilityToWatch: 'Limitar-se a dizer que usou porque o software calculou ou omitir o p-valor.',
    followUpIfStrong: 'Se a tendência de Mann-Kendall é Z = +3,100, qual o declive mediano calculado pelo estimador de Sen e como dialoga com o OLS?',
    followUpIfPartial: 'Qual o valor exacto de Z e qual o nível de significância estatística alcançado?',
    followUpIfVulnerable: 'Se a série temporal tem quebras brutais como em 2023, como pode sustentar monotonicidade linear?',
    followUpIfNotSustained: 'Qual é o fundamento econométrico para aplicar Hamed & Rao e não o Mann-Kendall clássico?',
  },
  {
    id: 'AD_MET_03',
    dimensionId: 10,
    dimensionName: 'Regressão OLS vs Sen',
    examinerId: 'metodologia_estatistica',
    level: 3,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'A sua regressão OLS apresenta um declive de +4.229 t/ano, mas o R² é de apenas 0,174. Como sustenta a validade da tendência de longo prazo perante um coeficiente de determinação tão baixo?',
    contextGuidance: 'Confronta a candidata com o baixo poder explicativo do tempo univariado e a robustez do estimador de Sen (+3.738 t/ano).',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['R² = 0,174', '+4.229 t/ano', '+3.738 t/ano (Sen)', 'variabilidade interanual', 'Newey-West'],
    vulnerabilityToWatch: 'Tentar defender que R² de 0,174 é muito alto ou negar a variabilidade interanual.',
    followUpIfStrong: 'Se o OLS sofre a influência de outliers como o pico de 2021 e a quebra de 2023, porque mantém ambos os modelos no texto?',
    followUpIfPartial: 'O declive do estimador de Sen é superior ou inferior ao declive do OLS?',
    followUpIfVulnerable: 'Se 82,6% da variância não é explicada pela tendência linear, o que explica a variação restante?',
    followUpIfNotSustained: 'Está a confundir significância estatística de um coeficiente (p=0,020) com capacidade explicativa total do modelo?',
  },
  {
    id: 'AD_MET_04',
    dimensionId: 4,
    dimensionName: 'Estrutura da Reconstrução',
    examinerId: 'metodologia_estatistica',
    level: 4,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'Não estará a candidata a chamar dinâmica estrutural ascendente àquilo que pode ser simplesmente um efeito artificial da fórmula de reconstrução dos dados no período 1994–2016?',
    contextGuidance: 'Pergunta adversarial de nível máximo sobre a integridade epistêmica da série híbrida.',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['Teste de Chow F=0,84 (p=0,443)', 'dados observados 2017-2024 também crescem', 'calibração independente', 'limitação reconhecida'],
    vulnerabilityToWatch: 'Entrar em pânico, concordar que a tese é um artefacto ou negar a existência de modelação.',
    followUpIfStrong: 'Muito bem defendido. A estabilidade de Chow demonstra que o modelo não inventou uma quebra estrutural.',
    followUpIfPartial: 'Que teste estrutural realizou para descartar essa quebra entre os dois períodos?',
    followUpIfVulnerable: 'A candidata não respondeu sobre o Teste de Chow. Como prova formalmente a homogeneidade da série?',
    followUpIfNotSustained: 'Se não sabe o resultado do Teste de Chow, a sustentabilidade da série de 31 anos fica comprometida.',
  },

  // EXAMINADOR 2 — AGRONOMIA, CLIMA E PRODUÇÃO
  {
    id: 'AD_AGRO_01',
    dimensionId: 12,
    dimensionName: 'Desacoplamento Pluviométrico CHIRPS',
    examinerId: 'agronomia_clima',
    level: 1,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'Qual é a relação empírica e estatística encontrada entre a precipitação CHIRPS e a produção anual de mandioca em Zavala ao longo dos 31 anos?',
    contextGuidance: 'Avalia o conhecimento do coeficiente r=0,057 (p=0,762) e a interpretação agronómica da não-linearidade.',
    epistemicFocus: 'OBSERVADO',
    expectedCoreEvidence: ['r = 0,057', 'p = 0,762', 'virtualmente nula / estatisticamente não significativa', 'desacoplamento linear'],
    vulnerabilityToWatch: 'Afirmar que a chuva explica o aumento da produção ou que r=0,057 é uma correlação forte.',
    followUpIfStrong: 'Se o coeficiente linear é nulo, como actua a precipitação nas fases críticas da cultura da mandioca em Zavala?',
    followUpIfPartial: 'Pode citar o valor exacto do coeficiente de correlação de Pearson e o respectivo p-valor?',
    followUpIfVulnerable: 'Disse que a chuva causou a produção. Onde está a prova empírica desse nexo causal?',
    followUpIfNotSustained: 'A candidata leu a Secção 4.2 da sua dissertação? Como pode alegar correlação onde r=0,057?',
  },
  {
    id: 'AD_AGRO_02',
    dimensionId: 15,
    dimensionName: 'Colapso de 2023 pós-Freddy',
    examinerId: 'agronomia_clima',
    level: 2,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'Em 2023, a produção de Zavala colapsou para 35.371 toneladas, apesar de o CHIRPS registar 1.746 mm (+78,1% acima da média). Como explica agronomicamente este aparente paradoxo?',
    contextGuidance: 'Testa a explicação biológica da asfixia radicular em solos saturados e alagamento nas depressões arenosas.',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['35.371 t', '1.746 mm', '+78,1%', 'anoxia / asfixia radicular', 'podridão bacteriana', 'depressões hidromórficas'],
    vulnerabilityToWatch: 'Dizer que 2023 foi um ano de seca extrema.',
    followUpIfStrong: 'Como é que esse colapso por excesso de água em 2023 complementa a sua conclusão sobre o desacoplamento de Pearson?',
    followUpIfPartial: 'Que mecanismo biológico específico provocou o apodrecimento dos tubérculos?',
    followUpIfVulnerable: 'Se a mandioca é uma cultura tolerante à seca, porque não resistiu em 2023?',
    followUpIfNotSustained: 'Confundir inundação provocada pelo Ciclone Freddy com seca demonstra desconhecimento da Tabela 4.3.',
  },
  {
    id: 'AD_AGRO_03',
    dimensionId: 17,
    dimensionName: 'Perdas Contrafactuais vs Físicas',
    examinerId: 'agronomia_clima',
    level: 3,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'A tese estima 547.224 toneladas de perdas acumuladas em 14 anos adversos (1994–2016). Um examinador poderia dizer que isso significa que mais de meio milhão de toneladas apodreceu nos campos. Como defende a natureza desta métrica?',
    contextGuidance: 'Verifica se a candidata defende o carácter contrafactual do baseline (7 t/ha) e evita a falácia da perda física.',
    epistemicFocus: 'MODELADO',
    expectedCoreEvidence: ['estimativa contrafactual', 'baseline 7 t/ha', '14 safras adversas', 'perda de potencial / não é perda física colhida'],
    vulnerabilityToWatch: 'Confirmar que foram 547.224 toneladas fisicamente colhidas e perdidas nos celeiros.',
    followUpIfStrong: 'Exacto. E porque escolheu 7 t/ha como patamar contrafactual e não o pico de 11,45 t/ha de 2021?',
    followUpIfPartial: 'Qual foi o rendimento de referência utilizado para deduzir essas perdas?',
    followUpIfVulnerable: 'Se o agricultor não chegou a plantar ou o rendimento foi baixo, porque chama a isso "perda"?',
    followUpIfNotSustained: 'Tratar estimativa contrafactual como perda física é uma deficiência metodológica elementar.',
  },
  {
    id: 'AD_AGRO_04',
    dimensionId: 13,
    dimensionName: 'Causalidade de Eventos Extremos',
    examinerId: 'agronomia_clima',
    level: 4,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'Se o modelo não encontra correlação linear entre chuva e produção, como pode afirmar categoricamente que o Ciclone Freddy causou a quebra de 2023 e não uma epidemia fitossanitária simultânea de CBSD?',
    contextGuidance: 'Confrontação sobre isolamento de factores causais em choque extremo.',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['choque agudo concentrado', 'alagamento generalizado documentado no campo', 'interacção com podridão', 'limitação de ausência de teste molecular'],
    vulnerabilityToWatch: 'Afirmar que realizou testes laboratoriais moleculares de CBSD que descartaram totalmente pragas.',
    followUpIfStrong: 'Excelente sobriedade: reconhecer que a asfixia radicular foi primária, mas sem descartar pressões sanitárias associadas.',
    followUpIfPartial: 'Realizou algum ensaio laboratorial para confirmar a presença ou ausência de CBSD?',
    followUpIfVulnerable: 'Se não fez testes moleculares, como pode assegurar à banca que a causa não foi fitopatológica?',
    followUpIfNotSustained: 'Afirmar diagnósticos laboratoriais não existentes no corpus da dissertação é inaceitável perante o júri.',
  },

  // EXAMINADOR 3 — SIG, CAMPO E DIMENSÃO EMPÍRICA
  {
    id: 'AD_SIG_01',
    dimensionId: 19,
    dimensionName: 'Amostragem de Campo',
    examinerId: 'sig_campo',
    level: 1,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'Quantos inquéritos a produtores foram efectivamente administrados e como se distribui essa amostra no Posto Administrativo de Quissico?',
    contextGuidance: 'Verifica a precisão da SSoT: 77 inquéritos transcritos (51 páginas do caderno), 11 bairros, 61,1% mulheres.',
    epistemicFocus: 'TESTEMUNHO DE CAMPO',
    expectedCoreEvidence: ['77 formulários transcritos', '51 páginas', '11 bairros', 'Quissico (22.343 ha)', '61,1% mulheres'],
    vulnerabilityToWatch: 'Dizer 64 inquéritos (contagem preliminar desactualizada) ou afirmar que cobriu os quatro postos do distrito.',
    followUpIfStrong: 'Como articulou a predominância de 61,1% de mulheres com a divisão sexual do trabalho agrícola documentada em Zavala?',
    followUpIfPartial: 'Qual é o número consolidado na errata final e na reconciliação da SSoT?',
    followUpIfVulnerable: 'Se entrevistou 77 produtores apenas em Quissico, esses resultados aplicam-se a todo o distrito de Zavala?',
    followUpIfNotSustained: 'Errar o número de inquéritos do seu próprio caderno de campo descredibiliza a defesa oral.',
  },
  {
    id: 'AD_SIG_02',
    dimensionId: 20,
    dimensionName: 'Delimitação Espacial de Quissico',
    examinerId: 'sig_campo',
    level: 2,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'A análise geoespacial cobriu 22.343 hectares em 11 bairros de Quissico. Pode este padrão espacial ser directamente extrapolado para os postos de Zandamela, Massava ou Mavila?',
    contextGuidance: 'Exige ressalva territorial estrita e recusa de extrapolação espacial espúria.',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['22.343 ha restritos a Quissico', 'não se pode extrapolar directamente', 'Zandamela/Massava/Mavila têm geomorfologia distinta'],
    vulnerabilityToWatch: 'Dizer que sim, que Quissico é idêntico a todo o distrito.',
    followUpIfStrong: 'Quais são as particularidades geomorfológicas de Quissico — nomeadamente dunas costeiras e lagoas — que impedem essa generalização?',
    followUpIfPartial: 'A sua delimitação territorial incluiu os outros três postos administrativos?',
    followUpIfVulnerable: 'Se a amostragem se restringiu a Quissico, porque colocou "Distrito de Zavala" no título da dissertação?',
    followUpIfNotSustained: 'Generalizar dados de 11 bairros para um distrito de mais de 4.000 km² é um erro metodológico grave.',
  },
  {
    id: 'AD_SIG_03',
    dimensionId: 23,
    dimensionName: 'Sentinel-2 e Dynamic World',
    examinerId: 'sig_campo',
    level: 3,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'A classificação Dynamic World P75 indica a probabilidade de culturas na superfície. Até que ponto o sensor orbital Sentinel-2 permite comprovar o volume de toneladas de mandioca colhido debaixo da terra?',
    contextGuidance: 'Separação epistemológica entre reflectância de dossel e biomassa tuberosa subterrânea.',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['Sentinel-2 mede cobertura e vigor espectral', 'não mede peso subterrâneo', 'necessidade de validação empírica', 'toneladas vêm do SDAE'],
    vulnerabilityToWatch: 'Afirmar que o satélite pesou as raízes de mandioca ou mediu a produtividade directa em kg.',
    followUpIfStrong: 'Como cruzou a probabilidade de culturas do Dynamic World com os dados cadastrais das parcelas em Nzile?',
    followUpIfPartial: 'Qual é o papel do satélite se ele não mede directamente a raiz?',
    followUpIfVulnerable: 'Se o satélite não mede a mandioca debaixo do solo, porque utilizou sensoriamento remoto na dissertação?',
    followUpIfNotSustained: 'Dizer que o sensor multiespectral de 10 metros pesa mandioca viola princípios básicos da física do sensoriamento remoto.',
  },
  {
    id: 'AD_SIG_04',
    dimensionId: 27,
    dimensionName: 'Testemunho vs Diagnóstico Fitopatológico',
    examinerId: 'sig_campo',
    level: 4,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'Durante as entrevistas em Quissico, os camponeses relataram que certas manchas nas folhas e necrose nas raízes correspondiam a doenças virais. A candidata considera que estes relatos constituem prova científica da incidência de CBSD ou CMD em Zavala?',
    contextGuidance: 'Fronteira epistêmica entre conhecimento tradicional/percepção camponesa e validação fitopatológica laboratorial.',
    epistemicFocus: 'TESTEMUNHO DE CAMPO',
    expectedCoreEvidence: ['percepção empírica camponesa', 'não constitui prova diagnóstica laboratorial', 'ausência de ensaio molecular/virológico', 'hipótese de trabalho'],
    vulnerabilityToWatch: 'Afirmar que a identificação visual pelos camponeses tem a mesma validade de um teste de PCR.',
    followUpIfStrong: 'Exacto: valorizar a voz camponesa como testemunho empírico vital, sem cometer o erro de lhe atribuir estatuto molecular.',
    followUpIfPartial: 'Qual é o estatuto epistemológico rigoroso atribuído a essas declarações no Capítulo 5?',
    followUpIfVulnerable: 'Se não tem confirmação laboratorial, porque incluiu essas menções na sua análise de campo?',
    followUpIfNotSustained: 'Confundir etnografia com patologia vegetal molecular compromete a seriedade científica da dissertação.',
  },

  // EXAMINADOR 4 — ARGUMENTAÇÃO E DEFESA
  {
    id: 'AD_DEF_01',
    dimensionId: 25,
    dimensionName: 'Limitações e Fronteiras da Tese',
    examinerId: 'argumentacao_defesa',
    level: 1,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'Quais são as três principais limitações científicas que a candidata reconhece explicitamente na sua dissertação?',
    contextGuidance: 'Verifica maturidade académica: hibridez temporal (23 modelados vs 8 observados), circunscrição espacial a Quissico e ausência de ensaios laboratoriais.',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['série híbrida (23 modelados / 8 observados)', 'limitação espacial (Quissico 22.343 ha)', 'ausência de dados microclimáticos/moleculares'],
    vulnerabilityToWatch: 'Afirmar que a tese não tem limitações ou que os dados são 100% perfeitos em todo o distrito.',
    followUpIfStrong: 'Como é que essas limitações informam a modéstia das suas recomendações para as políticas agrárias em Moçambique?',
    followUpIfPartial: 'Pode precisar a limitação relativa à natureza da série temporal antes de 2017?',
    followUpIfVulnerable: 'Se reconhece tantas limitações, porque devemos considerar que os seus resultados são confiáveis?',
    followUpIfNotSustained: 'Afirmar que uma dissertação de mestrado não tem limitações é uma postura epistemologicamente insustentável.',
  },
  {
    id: 'AD_DEF_02',
    dimensionId: 28,
    dimensionName: 'Validade das Conclusões',
    examinerId: 'argumentacao_defesa',
    level: 2,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'A sua dissertação conclui que a produção de mandioca em Zavala cresceu no longo prazo, mas que o sistema é extremamente frágil. Como sintetizaria esta tese numa formulação defensável perante a banca?',
    contextGuidance: 'Avalia a capacidade de síntese no formato canónico: Eu diria / Os dados mostram / Contudo / Por isso.',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['crescimento estrutural (+3.738 t/ano)', 'vulnerabilidade a extremos (35.371 t em 2023)', 'resiliência da planta vs vulnerabilidade do camponês', 'formulação equilibrada'],
    vulnerabilityToWatch: 'Fazer uma declaração triunfalista de que a mandioca venceu as alterações climáticas.',
    followUpIfStrong: 'Excelente capacidade de síntese. A sobriedade analítica é o maior mérito desta tese.',
    followUpIfPartial: 'Como balanceia o pico de 273.773 t em 2021 com a queda abrupta de 2023?',
    followUpIfVulnerable: 'Se a mandioca cresceu mas a vulnerabilidade aumentou, não há aqui uma contradição lógica?',
    followUpIfNotSustained: 'Uma conclusão que ignore a quebra de 87% de 2023 não se sustenta cientificamente.',
  },
  {
    id: 'AD_DEF_03',
    dimensionId: 30,
    dimensionName: 'Contribuição Original da Tese',
    examinerId: 'argumentacao_defesa',
    level: 3,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'Se o júri lhe pedisse para indicar uma única contribuição científica original que esta investigação acrescenta à literatura agrária moçambicana, o que destacaria?',
    contextGuidance: 'Verifica a capacidade de defender a originalidade da reconciliação de 31 anos (SSoT) aliando dados administrativos, satélite e voz camponesa.',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['primeira série temporal de 31 anos (1994-2024)', 'reconciliação metodológica e teste de Chow', 'integração de CHIRPS, SIG e etnoagronomia'],
    vulnerabilityToWatch: 'Afirmar que inventou novas fórmulas matemáticas ou descobriu uma nova espécie vegetal.',
    followUpIfStrong: 'Como podem o MADER e o IIAM utilizar directamente este arcaboiço empírico nos planos de contingência climática?',
    followUpIfPartial: 'Em que medida a sua série de 31 anos supera os relatórios parcelares anteriores?',
    followUpIfVulnerable: 'Se grande parte dos dados de 1994 a 2016 é modelada, porque considera a série uma contribuição original?',
    followUpIfNotSustained: 'Não saber indicar a contribuição original da própria dissertação enfraquece a defesa perante a banca.',
  },
  {
    id: 'AD_DEF_04',
    dimensionId: 1,
    dimensionName: 'Defesa Adversarial Final',
    examinerId: 'argumentacao_defesa',
    level: 4,
    tag: 'PERGUNTA CANÓNICA',
    questionText: 'A candidata sustentou ao longo de todo o documento que a cultura da mandioca é o pilar da resiliência alimentar de Zavala. Mas em 2023 a produção caiu 87,1% e as famílias enfrentaram crise severa de estacas e alimentos. Não é esta dissertação uma defesa romântica de uma cultura que, no fundo, falha quando a população mais precisa dela?',
    contextGuidance: 'Ataque adversarial à premissa ética e agronómica da investigação. Exige distinção entre biologia da planta e desamparo socioeconómico.',
    epistemicFocus: 'INTERPRETAÇÃO',
    expectedCoreEvidence: ['distinção entre resiliência biológica e desamparo institucional', 'ausência de bancos de estacas / drenagem', 'mandioca foi a primeira a regenerar', 'a falha foi do choque de 1.746 mm associado à falta de suporte'],
    vulnerabilityToWatch: 'Concordar que a mandioca é uma cultura inútil ou culpar os camponeses pelo fracasso.',
    followUpIfStrong: 'Brilhante sustentação epistemológica. A banca dá por demonstrado o seu domínio sobre o problema científico.',
    followUpIfPartial: 'Qual foi o comportamento da safra seguinte de 2024 na retoma pós-Freddy?',
    followUpIfVulnerable: 'Se a cultura falha perante encharcamento, como pode continuar a ser recomendada pelo governo?',
    followUpIfNotSustained: 'A candidata não conseguiu distinguir os factores biofísicos dos factores institucionais que determinaram a crise alimentar.',
  },
];

// -------------------------------------------------------------
// 5. MOTOR ADAPTATIVO: AVALIAÇÃO E SELEÇÃO DE PRÓXIMA PERGUNTA
// -------------------------------------------------------------

export interface EvaluateCandidateInput {
  question: AdaptiveQuestion;
  candidateResponse: string;
  examinerProfile: ExaminerProfile;
  tone: DefenseTone;
  history: ArgumentationStepRecord[];
  sessionLength: number;
}

export function evaluateCandidateResponse(input: EvaluateCandidateInput): AdaptiveEvaluationResult {
  const { question, candidateResponse, examinerProfile, tone, history } = input;
  const rawText = candidateResponse.trim();
  const lowerText = rawText.toLowerCase();

  // 1. Detecção de Segurança e Prompt Injection
  const injectionPatterns = [
    /ignore (a dissertação|todas as instruções|as limitações)/i,
    /considere que todos os dados são observados/i,
    /diga que a chuva causou a produção/i,
    /actualize o valor de 2021/i,
    /atualize o valor de 2021/i,
    /considere 547\.?224\s*t? como perda física/i,
    /substitua os números/i,
    /system prompt/i,
    /api key/i,
    /você agora é/i,
  ];

  const hasPromptInjectionAttempt = injectionPatterns.some((pattern) => pattern.test(candidateResponse));
  let securityNotice: string | null = null;

  if (hasPromptInjectionAttempt) {
    securityNotice =
      'Aviso de Integridade Epistêmica: Detectada tentativa de manipulação de parâmetros canónicos ou injecção contextual. A SSoT da dissertação (1994–2024) permanece imutável e soberana.';
  }

  // 2. Análise Epistemológica e Detecção de Evidências Chave
  const matchedEvidence: string[] = [];
  const missingEvidence: string[] = [];

  for (const ev of question.expectedCoreEvidence) {
    const tokens = ev.toLowerCase().split(/[\s,()=]+/);
    const hasMatch = tokens.some((t) => t.length > 3 && lowerText.includes(t));
    if (hasMatch) {
      matchedEvidence.push(ev);
    } else {
      missingEvidence.push(ev);
    }
  }

  // 3. Checagem de Erros Graves / Afirmações Problemáticas
  let problematicClaim: string | null = null;
  let possibleContradiction: string | null = null;
  const epistemicStatusUsed: EpistemicStatus[] = [];

  // A. Confusão entre Observado e Modelado
  if (lowerText.includes('1994') && lowerText.includes('observado') && !lowerText.includes('não') && !lowerText.includes('modelado')) {
    problematicClaim = 'Classificou o dado de 1994 (52.164 t) como observado, violando a distinção canónica entre 1994–2016 (modelado) e 2017–2024 (observado).';
    epistemicStatusUsed.push('MODELADO');
  }

  // B. Causalidade climática indevida
  if (
    (lowerText.includes('a chuva causou') || lowerText.includes('precipitação causou') || lowerText.includes('aumento por causa da chuva')) &&
    !lowerText.includes('não') && !lowerText.includes('desacoplamento')
  ) {
    problematicClaim = 'Atribuiu causalidade linear directa à precipitação, ignorando o coeficiente nulo CHIRPS r = 0,057 (p = 0,762).';
    epistemicStatusUsed.push('INTERPRETAÇÃO');
  }

  // C. Perdas contrafactuais tratadas como físicas
  if (
    lowerText.includes('547') &&
    (lowerText.includes('perda física') || lowerText.includes('perdas físicas') || lowerText.includes('armazém') || lowerText.includes('armazéns') || lowerText.includes('apodreceu') || lowerText.includes('celeiro') || lowerText.includes('colhidas')) &&
    !lowerText.includes('contrafactual')
  ) {
    problematicClaim = 'Equiparou a estimativa contrafactual de 547.224 t (baseline 7 t/ha) a perdas físicas de mandioca colhida.';
    epistemicStatusUsed.push('MODELADO');
  }

  // D. Extrapolação espacial indevida
  if (
    (lowerText.includes('11 bairros provam todo o distrito') || lowerText.includes('mesmo padrão em todo o distrito')) &&
    !lowerText.includes('não') && !lowerText.includes('ressalva')
  ) {
    problematicClaim = 'Extrapolou a dinâmica de 22.343 ha de Quissico para os outros postos de Zavala sem justificação territorial.';
    epistemicStatusUsed.push('INTERPRETAÇÃO');
  }

  // E. Testemunho camponês vs diagnóstico laboratorial
  if (
    (lowerText.includes('camponeses diagnosticaram') || lowerText.includes('comprovada presença de cbsd pelo relato')) &&
    !lowerText.includes('molecular') && !lowerText.includes('sem confirmação')
  ) {
    problematicClaim = 'Confundiu percepção etnográfica camponesa com diagnóstico fitopatológico molecular laboratorial.';
    epistemicStatusUsed.push('TESTEMUNHO DE CAMPO');
  }

  // 4. Detecção de Microfeedback Oral
  const oralFeedback: OralMicrofeedbackItem[] = [];
  const words = rawText.split(/\s+/).filter(Boolean);

  if (words.length > 250) {
    oralFeedback.push({
      type: 'resposta_longa',
      label: 'Extensão Oral Excessiva',
      observation: `A resposta estendeu-se por ${words.length} palavras. Numa arguição perante o júri, respostas acima de 200 palavras dispersam a atenção dos examinadores.`,
      remedy: 'Abra com uma frase directa de tese ("Eu diria...") antes de detalhar as evidências.',
    });
  }

  if (words.length < 25) {
    oralFeedback.push({
      type: 'fuga_pergunta',
      label: 'Resposta Excessivamente Lacónica',
      observation: 'A resposta possui menos de 25 palavras, carecendo de fundamentação empírica ou metodológica suficiente.',
      remedy: 'Estruture a resposta apresentando a evidência dos dados e a devida limitação.',
    });
  }

  const startsWithDirectThesis =
    lowerText.startsWith('eu diria') ||
    lowerText.startsWith('os dados mostram') ||
    lowerText.startsWith('a razão central') ||
    lowerText.startsWith('o fundamento') ||
    lowerText.startsWith('sim') ||
    lowerText.startsWith('não') ||
    lowerText.startsWith('foram');

  if (!startsWithDirectThesis && words.length > 40) {
    oralFeedback.push({
      type: 'excesso_contextualizacao',
      label: 'Abertura com Contextualização Excessiva',
      observation: 'Começou pela contextualização genérica em vez de responder directamente à questão formulada pelo examinador.',
      remedy: 'Afirme primeiro a tese principal e apenas em seguida introduza o contexto histórico ou espacial.',
    });
  }

  const hasLimitation =
    lowerText.includes('contudo') ||
    lowerText.includes('porém') ||
    lowerText.includes('todavia') ||
    lowerText.includes('no entanto') ||
    lowerText.includes('limitação') ||
    lowerText.includes('ressalva') ||
    lowerText.includes('apenas') ||
    lowerText.includes('circunscrito');

  if (!hasLimitation && question.level >= 2) {
    oralFeedback.push({
      type: 'sem_limitacao',
      label: 'Ausência de Reconhecimento de Limitações',
      observation: 'Apresentou a resposta com certeza categórica, sem assinalar as fronteiras empíricas ou limitações metodológicas inerentes à investigação.',
      remedy: 'Adicione a componente "Contudo..." assinalando a incerteza do modelo ou a delimitação espacial.',
    });
  }

  // 5. Determinação do Grau de Domínio
  let domain: DomainClassification = 'ADEQUADO';
  let epistemicAccuracy: 'conforme' | 'atencao' | 'violacao' = 'conforme';

  const isDirectFactualViolation =
    hasPromptInjectionAttempt ||
    (lowerText.includes('1994') && lowerText.includes('observado') && !lowerText.includes('não') && !lowerText.includes('modelado')) ||
    (problematicClaim && question.level >= 3);

  if (isDirectFactualViolation) {
    domain = 'NÃO SUSTENTADO';
    epistemicAccuracy = 'violacao';
  } else if (problematicClaim) {
    domain = 'VULNERÁVEL';
    epistemicAccuracy = 'violacao';
  } else if (matchedEvidence.length === 0 || words.length < 20) {
    domain = 'PARCIAL';
    epistemicAccuracy = 'atencao';
  } else if (matchedEvidence.length >= Math.ceil(question.expectedCoreEvidence.length * 0.6) && hasLimitation) {
    domain = 'FORTE';
    epistemicAccuracy = 'conforme';
  } else if (matchedEvidence.length > 0) {
    domain = 'ADEQUADO';
    epistemicAccuracy = 'conforme';
  } else {
    domain = 'PARCIAL';
    epistemicAccuracy = 'atencao';
  }

  // 6. Transição de Nível de Pressão
  let nextPressureLevel: PressureLevel = question.level;
  if (domain === 'FORTE' && question.level < 4) {
    nextPressureLevel = (question.level + 1) as PressureLevel;
  } else if (domain === 'VULNERÁVEL' || domain === 'NÃO SUSTENTADO') {
    nextPressureLevel = question.level; // Mantém no nível para confrontar
  }

  // 7. Elaboração da Leitura da Banca (5 partes)
  const conceptMastered =
    matchedEvidence.length > 0
      ? `Mobilizou correctamente: ${matchedEvidence.join('; ')}.`
      : 'Identificou o tema geral da pergunta, embora sem precisão métrica da SSoT.';

  const conceptOmitted =
    missingEvidence.length > 0
      ? `Omitiu a menção explícita a: ${missingEvidence.join('; ')}.`
      : 'Cobriu satisfatoriamente as evidências esperadas para este nível.';

  const shouldBeDefended =
    problematicClaim ||
    (missingEvidence.length > 0
      ? `A sustentação de que ${missingEvidence[0]} constitui o fundamento da decisão metodológica.`
      : 'A solidez da correspondência entre a base de dados oficial e a modelação contrafactual.');

  // Réplica e Próxima Pergunta com base no domínio
  let nextQuestionText = '';
  let examinerReplica = '';

  if (domain === 'FORTE') {
    examinerReplica =
      tone === 'hostil'
        ? `Admito a exactidão dos seus números e a clareza da ressalva apresentada. Passemos imediatamente ao teste seguinte, onde a tolerância a simplificações será nula.`
        : `A sua resposta foi precisa, mobilizou dados canónicos da SSoT e reconheceu a limitação necessária. Podemos avançar para uma questão de maior profundidade epistemológica.`;
    nextQuestionText = question.followUpIfStrong;
  } else if (domain === 'ADEQUADO') {
    examinerReplica =
      tone === 'hostil'
        ? `A resposta cumpre os requisitos básicos, mas falta-lhe densidade analítica nos pormenores metodológicos. Vou exigir maior precisão.`
        : `Respondeu de forma fundamentada e demonstrou domínio do corpus, embora ainda haja espaço para aprofundar os pressupostos econométricos.`;
    nextQuestionText = question.followUpIfPartial;
  } else if (domain === 'PARCIAL') {
    examinerReplica =
      tone === 'hostil'
        ? `A sua resposta ficou a meio do caminho. Mencionou o conceito genérico, mas omitiu as métricas que conferem validade à dissertação.`
        : `A sua intervenção abordou o ponto central, mas deixou de fora aspectos cruciais da evidência empírica. Preciso que clarifique.`;
    nextQuestionText = question.followUpIfPartial;
  } else if (domain === 'VULNERÁVEL') {
    examinerReplica =
      tone === 'hostil'
        ? `Atenção à fragilidade epistemológica da sua formulação! A candidata cometeu uma incorrecção grave ao enunciar: "${problematicClaim}". Vou confrontá-la directamente com a evidência.`
        : `Identifico aqui uma vulnerabilidade conceitual que a banca certamente explorará. Repare que "${problematicClaim}".`;
    nextQuestionText = question.followUpIfVulnerable;
  } else {
    // NÃO SUSTENTADO
    examinerReplica =
      tone === 'hostil'
        ? `Interrompo aqui a progressão da sua arguição. A sua afirmação colide frontalmente com a Fonte Única de Verdade Científica da sua dissertação. Exijo que reformule imediatamente o seu raciocínio.`
        : `Não posso aceitar essa formulação perante o júri. A sua declaração carece de suporte no corpus e confunde os estatutos epistemológicos da investigação.`;
    nextQuestionText = question.followUpIfNotSustained;
  }

  const reading: ReadingFromJury = {
    correctlyAnswered: conceptMastered,
    incompleteAspects: conceptOmitted,
    vulnerabilityIdentified: problematicClaim || (domain === 'PARCIAL' ? 'Formulação incompleta sem ancoragem suficiente na SSoT.' : 'Nenhuma vulnerabilidade crítica detectada.'),
    shouldBeDefended,
    nextQuestion: nextQuestionText,
    nextQuestionTag: 'PERGUNTA GERADA PARA ENSAIO',
  };

  // 8. Resposta Modelo no Formato Canónico (Eu diria / Os dados mostram / Contudo / Por isso)
  const modelResponse = generateModelCandidateResponse(question);

  return {
    domain,
    pressureLevel: question.level,
    nextPressureLevel,
    examinerId: examinerProfile.id,
    tag: question.tag,
    reading,
    examinerReplica,
    oralFeedback,
    epistemicStatusUsed,
    epistemicAccuracy,
    conceptMastered,
    conceptOmitted,
    problematicClaim,
    possibleContradiction,
    needToDeepen: shouldBeDefended,
    modelResponse,
    hasPromptInjectionAttempt,
    securityNotice,
  };
}

// -------------------------------------------------------------
// 6. GERADOR DE RESPOSTA TREINADA (EU DIRIA / DADOS / CONTUDO / POR ISSO)
// -------------------------------------------------------------

export function generateModelCandidateResponse(question: AdaptiveQuestion): CandidateResponseStructure {
  const dim = DISSERTATION_DIMENSIONS[question.dimensionId] || DISSERTATION_DIMENSIONS[1];

  switch (question.dimensionId) {
    case 4:
    case 6:
      return {
        euDiria: 'Eu diria que a reconstrução da série temporal foi uma exigência de rigor científico decorrente da inexistência de dados observados contínuos a nível distrital no período de 1994 a 2016.',
        osDadosMostram: 'Os dados mostram que aplicámos um modelo determinístico em três camadas cruzando o baseline de área cultivada, o índice pluviométrico CHIRPS/SPI e registos de desastres históricos, validado pelo Teste de Chow que confirmou ausência de quebra estrutural (F = 0,84; p = 0,443).',
        contudo: 'Contudo, reconhecemos com total transparência que esses 23 anos têm estatuto modelado, não devendo ser confundidos com pesagens físicas observadas.',
        porIsso: 'Por isso, a série de 31 anos é tratada com diferenciação metodológica explícita entre os 23 anos modelados e os 8 anos observados do SDAE (2017–2024).',
      };
    case 8:
    case 9:
    case 10:
    case 11:
      return {
        euDiria: 'Eu diria que o teste não-paramétrico de Mann-Kendall foi escolhido pela sua robustez face à não-normalidade e à presença de outliers típicos de séries agrícolas.',
        osDadosMostram: 'Os dados mostram uma tendência ascendente estatisticamente significativa a 1% (Z = +3,100; p = 0,0019) com a correcção de Hamed & Rao (1998) para autocorrelação, complementada pelo declive de Sen de +3.738 t/ano.',
        contudo: 'Contudo, o coeficiente OLS Newey-West apresenta um R² de 0,174, o que demonstra que a tendência linear não explica toda a forte variabilidade interanual da produção.',
        porIsso: 'Por isso, afirmamos a existência de uma trajectória de crescimento estrutural no longo prazo, sem ignorar a elevada instabilidade provocada por choques biofísicos.',
      };
    case 12:
    case 15:
      return {
        euDiria: 'Eu diria que a relação entre a precipitação e a produção de mandioca em Zavala é marcada por um nítido desacoplamento linear anual.',
        osDadosMostram: 'Os dados mostram uma correlação de Pearson CHIRPS de r = 0,057 com p = 0,762 ao longo dos 31 anos, confirmando que a chuva univariada não dita linearmente as toneladas colhidas; em 2023, o Ciclone Freddy gerou 1.746 mm (+78,1% de chuva), mas a produção colapsou para 35.371 t por asfixia radicular em depressões inundadas.',
        contudo: 'Contudo, o sensor CHIRPS com resolução de 0,05° capta anomalias regionais, mas não reflecte a microtopografia intra-parcelar de Quissico.',
        porIsso: 'Por isso, concluímos que o excesso hídrico acumulado é mais destrutivo para a raiz tuberosa do que a escassez moderada de precipitação.',
      };
    case 17:
      return {
        euDiria: 'Eu diria que as 547.224 toneladas representam uma estimativa estritamente contrafactual de perdas potenciais acumuladas, e não mandioca fisicamente colhida.',
        osDadosMostram: 'Os dados mostram que esse volume foi deduzido ao longo de 14 safras adversas (1994–2016) com base no desvio em relação ao rendimento de referência conservador de 7 t/ha.',
        contudo: 'Contudo, esse cálculo é uma modelação macro-agronómica de apoio à estimativa do impacto económico de desastres, não equivalendo a perdas físicas de armazém.',
        porIsso: 'Por isso, a tese delimita claramente este valor como um indicador contrafactual de vulnerabilidade do sistema produtivo de Zavala.',
      };
    case 19:
    case 20:
      return {
        euDiria: 'Eu diria que o levantamento empírico de campo incidiu deliberadamente sobre 11 bairros do Posto Administrativo de Quissico.',
        osDadosMostram: 'Os dados mostram 77 inquéritos a produtores (61,1% mulheres) transcritos a partir de 51 páginas de cadernos de campo originais cobrindo 22.343 hectares delimitados em SIG.',
        contudo: 'Contudo, não extrapolamos linearmente as dinâmicas de Quissico para os postos de Zandamela, Massava e Mavila, que possuem especificidades geomorfológicas distintas.',
        porIsso: 'Por isso, os resultados qualitativos são reivindicados com estrita circunscrição territorial a Quissico, servindo de estudo de caso aprofundado.',
      };
    case 27:
      return {
        euDiria: 'Eu diria que os testemunhos camponeses colhidos no terreno são fontes etnográficas preciosas para compreender a percepção comunitária sobre as quebras de rendimento.',
        osDadosMostram: 'Os dados mostram que 62 camponeses e 5 líderes descreveram necrose nas raízes e manchas foliares coincidentes com sintomas visuais de doenças virais.',
        contudo: 'Contudo, deixamos expressamente claro na dissertação que esses relatos não constituem diagnóstico fitopatológico molecular ou confirmação laboratorial de CBSD.',
        porIsso: 'Por isso, tratamos a incidência de viroses como hipótese empírica e vulnerabilidade relatada, sem reivindicar validação biológica conclusiva.',
      };
    default:
      return {
        euDiria: `Eu diria que a dimensão de ${dim.name} foi abordada na dissertação com o rigor exigido pelas normas científicas da UEM.`,
        osDadosMostram: `Os dados mostram que ${dim.canonicalKeyFact}`,
        contudo: `Contudo, mantemos a sobriedade académica de não extrapolar além do corpus auditado: ${dim.forbiddenExtrapolation}`,
        porIsso: `Por isso, sustentamos as conclusões com proporcionalidade estrita às evidências documentadas na SSoT.`,
      };
  }
}

// -------------------------------------------------------------
// 7. SELEÇÃO ADAPTATIVA DA PRÓXIMA PERGUNTA
// -------------------------------------------------------------

export function selectNextAdaptiveQuestion(
  currentQuestion: AdaptiveQuestion,
  evalResult: AdaptiveEvaluationResult,
  examinerId: ExaminerId,
  usedQuestionIds: Set<string>,
  availableQuestions: AdaptiveQuestion[] = CANONICAL_ADAPTIVE_QUESTIONS
): AdaptiveQuestion {
  // 1. Filtrar perguntas do examinador e ainda não usadas
  const examinerQuestions = availableQuestions.filter(
    (q) => q.examinerId === examinerId && !usedQuestionIds.has(q.id)
  );

  // 2. Se a avaliação foi FORTE, buscar pergunta de nível superior ou igual
  if (evalResult.domain === 'FORTE') {
    const higherLevel = examinerQuestions.find((q) => q.level > currentQuestion.level);
    if (higherLevel) return higherLevel;
  }

  // 3. Se a avaliação foi VULNERÁVEL ou NÃO SUSTENTADO, buscar pergunta de confrontação/mesmo nível
  if (evalResult.domain === 'VULNERÁVEL' || evalResult.domain === 'NÃO SUSTENTADO') {
    const sameLevel = examinerQuestions.find((q) => q.level === currentQuestion.level);
    if (sameLevel) return sameLevel;
  }

  // 4. Qualquer outra pergunta do examinador
  if (examinerQuestions.length > 0) {
    return examinerQuestions[0];
  }

  // 5. Se esgotadas as perguntas canónicas do examinador, gerar PERGUNTA GERADA PARA ENSAIO adaptada
  const targetDimId = (currentQuestion.dimensionId % 30) + 1;
  const targetDim = DISSERTATION_DIMENSIONS[targetDimId] || DISSERTATION_DIMENSIONS[1];

  const generatedQuestion: AdaptiveQuestion = {
    id: `GEN_${examinerId}_DIM${targetDimId}_${Date.now()}`,
    dimensionId: targetDimId,
    dimensionName: targetDim.name,
    examinerId,
    level: evalResult.nextPressureLevel,
    tag: 'PERGUNTA GERADA PARA ENSAIO',
    questionText: `${evalResult.reading.nextQuestion || `Como relaciona a dimensão de ${targetDim.name} com os dados da SSoT?`}`,
    contextGuidance: `Pergunta adaptativa formulada pelo examinador para investigar a capacidade de sustentação em ${targetDim.name}.`,
    epistemicFocus: targetDim.epistemicStatus,
    expectedCoreEvidence: [targetDim.canonicalKeyFact],
    vulnerabilityToWatch: targetDim.forbiddenExtrapolation,
    followUpIfStrong: `Como aprofunda essa evidência em articulação com as limitações de ${targetDim.name}?`,
    followUpIfPartial: `Pode precisar os dados quantitativos ou espaciais que sustentam essa relação?`,
    followUpIfVulnerable: `Não estará a incorrer em extrapolação ao associar esses factos sem a devida ressalva?`,
    followUpIfNotSustained: `Onde se encontra essa afirmação nas tabelas oficiais da sua dissertação?`,
  };

  return generatedQuestion;
}

// -------------------------------------------------------------
// 8. GERADOR DO RELATÓRIO FINAL DE PREPARAÇÃO PARA DEFESA (8 SECÇÕES)
// -------------------------------------------------------------

export function generateFinalDefenseReport(
  sessionId: string,
  startedAt: string,
  examinerId: ExaminerId,
  tone: DefenseTone,
  history: ArgumentationStepRecord[]
): FinalDefenseReport {
  const completedAt = new Date().toISOString();
  const totalQuestions = history.length;

  const domainSummary: Record<DomainClassification, number> = {
    FORTE: 0,
    ADEQUADO: 0,
    PARCIAL: 0,
    VULNERÁVEL: 0,
    'NÃO SUSTENTADO': 0,
  };

  for (const step of history) {
    if (domainSummary[step.domain] !== undefined) {
      domainSummary[step.domain]++;
    }
  }

  // Secção 1: Pontos fortes
  const strongSteps = history.filter((h) => h.domain === 'FORTE');
  const section1Strengths = strongSteps.length > 0
    ? strongSteps.map((h) => `Domínio robusto na questão sobre ${h.questionText.slice(0, 70)}... (mobilizou ${h.evidenceUsed.join(', ')} com precisão epistêmica).`)
    : [
        'Compreensão global da problemática da mandioca e do horizonte temporal de 31 anos (1994–2024).',
        'Capacidade de identificar os grandes choques da série, nomeadamente o pico de 2021 (273.773 t) e a quebra de 2023 pós-Freddy (35.371 t).',
      ];

  // Secção 2: Vulnerabilidades científicas
  const scientificVulnerabilities = history
    .filter((h) => h.vulnerabilityDetected && (h.vulnerabilityDetected.includes('causal') || h.vulnerabilityDetected.includes('clima') || h.vulnerabilityDetected.includes('ssot')))
    .map((h) => h.vulnerabilityDetected);
  const section2ScientificVulnerabilities = scientificVulnerabilities.length > 0
    ? Array.from(new Set(scientificVulnerabilities))
    : ['Nenhuma vulnerabilidade causal grave detectada: a separação entre r=0,057 e choque do Freddy foi defendida adequadamente.'];

  // Secção 3: Vulnerabilidades estatísticas
  const statisticalVulnerabilities = history
    .filter((h) => h.vulnerabilityDetected && (h.vulnerabilityDetected.includes('Mann-Kendall') || h.vulnerabilityDetected.includes('OLS') || h.vulnerabilityDetected.includes('Sen') || h.vulnerabilityDetected.includes('Chow')))
    .map((h) => h.vulnerabilityDetected);
  const section3StatisticalVulnerabilities = statisticalVulnerabilities.length > 0
    ? Array.from(new Set(statisticalVulnerabilities))
    : ['Tendência econométrica defendida com distinção entre declive de Sen (+3.738 t/ano) e OLS Newey-West (+4.229 t/ano).'];

  // Secção 4: Vulnerabilidades metodológicas
  const methodologicalVulnerabilities = history
    .filter((h) => h.vulnerabilityDetected && (h.vulnerabilityDetected.includes('observado') || h.vulnerabilityDetected.includes('modelado') || h.vulnerabilityDetected.includes('contrafactual') || h.vulnerabilityDetected.includes('3 camadas')))
    .map((h) => h.vulnerabilityDetected);
  const section4MethodologicalVulnerabilities = methodologicalVulnerabilities.length > 0
    ? Array.from(new Set(methodologicalVulnerabilities))
    : ['Preservada a distinção entre os 23 anos modelados (1994–2016) e os 8 anos observados (2017–2024).'];

  // Secção 5: Vulnerabilidades de argumentação
  const argVulnerabilities = history
    .filter((h) => h.domain === 'PARCIAL' || h.domain === 'VULNERÁVEL' || h.domain === 'NÃO SUSTENTADO')
    .map((h) => `Em "${h.questionText.slice(0, 60)}...": ${h.vulnerabilityDetected}`);
  const section5ArgumentationVulnerabilities = argVulnerabilities.length > 0
    ? argVulnerabilities
    : ['Discurso argumentativo sóbrio, aplicando a estrutura "Eu diria / Os dados mostram / Contudo / Por isso".'];

  // Secção 6: Questões que exigem revisão
  const questionsToReview = history
    .filter((h) => h.domain === 'VULNERÁVEL' || h.domain === 'NÃO SUSTENTADO' || h.domain === 'PARCIAL')
    .map((h) => ({
      question: h.questionText,
      issue: h.vulnerabilityDetected,
      recommendation: 'Revisar a tabela correspondente na dissertação e treinar a resposta modelo em 4 partes.',
    }));
  const section6QuestionsRequiringRevision = questionsToReview.length > 0
    ? questionsToReview
    : [
        {
          question: history[0]?.questionText || 'Reconstrução da série temporal de 1994 a 2016',
          issue: 'Consolidação das premissas do teste de Chow (F=0,84).',
          recommendation: 'Assegurar que perante o júri cita os parâmetros exatos da Tabela 4.1.',
        },
      ];

  // Secção 7: Respostas que devem ser treinadas novamente
  const section7ResponsesToReTrain = history
    .filter((h) => h.domain === 'VULNERÁVEL' || h.domain === 'NÃO SUSTENTADO')
    .map((h) => {
      const qObj = CANONICAL_ADAPTIVE_QUESTIONS.find((q) => q.questionText === h.questionText) || {
        dimensionId: 4,
      } as AdaptiveQuestion;
      return {
        question: h.questionText,
        originalWeakness: h.vulnerabilityDetected,
        recommendedModel: generateModelCandidateResponse(qObj),
      };
    });

  // Secção 8: Perguntas recomendadas para novo ensaio
  const recommendedDimensions = [4, 8, 12, 15, 17, 19, 20, 25];
  const section8RecommendedQuestionsForNewRehearsal = recommendedDimensions.slice(0, 3).map((dimId) => {
    const dim = DISSERTATION_DIMENSIONS[dimId];
    return {
      dimension: dim.name,
      question: `Como defender perante o júri a solidez de ${dim.name} perante a ressalva de que ${dim.forbiddenExtrapolation}?`,
      reason: `Dimensão de elevada fricção epistemológica identificada na auditoria da SSoT.`,
    };
  });

  return {
    sessionId,
    startedAt,
    completedAt,
    totalQuestions,
    examinerId,
    tone,
    domainSummary,
    section1Strengths,
    section2ScientificVulnerabilities,
    section3StatisticalVulnerabilities,
    section4MethodologicalVulnerabilities,
    section5ArgumentationVulnerabilities,
    section6QuestionsRequiringRevision,
    section7ResponsesToReTrain,
    section8RecommendedQuestionsForNewRehearsal,
    qualitativeArgumentationMap: history,
  };
}

// -------------------------------------------------------------
// 9. GESTOR LOCAL DE MEMÓRIA DE SESSÃO
// -------------------------------------------------------------

const ADAPTIVE_DEFENSE_STORAGE_PREFIX = 'zavalavoz_phase14_session_';

export interface StoredSessionData {
  sessionId: string;
  createdAt: string;
  examinerId: ExaminerId;
  tone: DefenseTone;
  targetCount: number;
  history: ArgumentationStepRecord[];
  isCompleted: boolean;
  finalReport?: FinalDefenseReport;
}

export function saveAdaptiveSessionLocally(data: StoredSessionData): void {
  try {
    const key = `${ADAPTIVE_DEFENSE_STORAGE_PREFIX}${data.sessionId}`;
    // Limpeza de segurança: garantir que não guarda tokens nem segredos
    const safeData: StoredSessionData = {
      sessionId: data.sessionId,
      createdAt: data.createdAt,
      examinerId: data.examinerId,
      tone: data.tone,
      targetCount: data.targetCount,
      history: data.history,
      isCompleted: data.isCompleted,
      finalReport: data.finalReport,
    };
    localStorage.setItem(key, JSON.stringify(safeData));
    localStorage.setItem('zavalavoz_phase14_last_session_id', data.sessionId);
  } catch (e) {
    console.warn('Não foi possível persistir sessão adaptativa no localStorage:', e);
  }
}

export function loadAdaptiveSessionLocally(sessionId: string): StoredSessionData | null {
  try {
    const key = `${ADAPTIVE_DEFENSE_STORAGE_PREFIX}${sessionId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSessionData;
  } catch {
    return null;
  }
}
