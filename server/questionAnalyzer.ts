/**
 * Analisador Semântico e Epistemológico de Perguntas de Pesquisa
 * ZAVALAVOZ — UEM / ESUDER • Arquitectura Híbrida Real (Fase 15.2)
 *
 * Responsável por:
 * 1. Identificar a intenção central da pergunta.
 * 2. Identificar entidades, anos, métricas e proporções.
 * 3. Classificar o tipo de consulta (factual, explicativa, hipótese/binária, etc.).
 */

import {
  AnalyzedResearchQuestion,
  QuestionIntentType,
} from '../src/types/research';

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function analyzeResearchQuestion(
  query: string,
  isDefenseMode: boolean = false
): AnalyzedResearchQuestion {
  const norm = normalizeText(query);

  // Extrair anos (1994 a 2030)
  const yearMatches = query.match(/\b(199\d|20[0-2]\d)\b/g);
  const detectedYears: number[] = yearMatches
    ? Array.from(new Set(yearMatches.map((y) => parseInt(y, 10))))
    : [];

  // Detectar entidades principais
  const detectedEntities: string[] = [];
  if (norm.includes('zavala')) detectedEntities.push('Distrito de Zavala');
  if (norm.includes('quissico')) detectedEntities.push('Posto Administrativo de Quissico');
  if (norm.includes('sdae')) detectedEntities.push('SDAE Zavala');
  if (norm.includes('chirps')) detectedEntities.push('Satélite CHIRPS v2.0');
  if (norm.includes('freddy')) detectedEntities.push('Ciclone Freddy (2023)');
  if (norm.includes('chow')) detectedEntities.push('Teste de Chow');
  if (norm.includes('mann-kendall') || norm.includes('mann kendall')) detectedEntities.push('Mann-Kendall');
  if (norm.includes('ols') || norm.includes('newey-west')) detectedEntities.push('Regressão OLS Newey-West');
  if (norm.includes('fao')) detectedEntities.push('FAO');
  if (norm.includes('campones') || norm.includes('produtor') || norm.includes('inquerito')) {
    detectedEntities.push('Inquéritos Etnográficos de Campo');
  }

  // Detectar métricas
  const detectedMetrics: string[] = [];
  if (norm.includes('producao')) detectedMetrics.push('produção');
  if (norm.includes('area') || norm.includes('hectare')) detectedMetrics.push('área');
  if (norm.includes('rendimento') || norm.includes('produtividade')) detectedMetrics.push('rendimento');
  if (norm.includes('perda') || norm.includes('547')) detectedMetrics.push('perdas');
  if (norm.includes('precipitacao') || norm.includes('chuva')) detectedMetrics.push('precipitação');

  // Detectar proporção de 15% / calibração distrital
  const isProportion15Percent =
    norm.includes('15%') ||
    norm.includes('15 por cento') ||
    (norm.includes('15') && (norm.includes('proporcao') || norm.includes('percent') || norm.includes('inhambane')));

  // Detectar perguntas de verificação / hipótese binária ("Os 11 bairros representam...?", "A chuva explica...?", etc.)
  const isHypothesisOrBinaryQuestion =
    /^(os|as|o|a)\s+/i.test(query.trim()) ||
    norm.startsWith('a chuva explica') ||
    norm.startsWith('a chuva causa') ||
    norm.startsWith('a mandioca resiste') ||
    norm.startsWith('os dados de 1994') ||
    norm.startsWith('os 11 bairros') ||
    norm.startsWith('as 547') ||
    norm.startsWith('os camponeses') ||
    norm.includes(' representam todo ') ||
    norm.includes(' foram pesadas') ||
    norm.includes(' sao todos observados');

  // Fora de escopo / lacuna documental evidente
  const isDataGapTopic =
    /\b(trigo|soja|milho\s+hibrido|trator|john\s+deere|adubo\s+npk\s+importado|capital\s+de|presidente\s+de|espectroscopia|teor\s+de\s+amido|laboratorio\s+molecular)\b/i.test(
      norm
    );

  // Conhecimento externo (FAO / mundial / conceitual desvinculado)
  const isExternalTopic =
    /\b(fao\s+mundial|fao\s+internacional|definicao\s+geral|seguranca\s+alimentar\s+a\s+nivel\s+global|literatura\s+externa|conceito\s+global|teoria\s+geral)\b/i.test(
      norm
    ) || (norm.includes('fao') && norm.includes('seguranca alimentar'));

  // Determinar intenção da pergunta
  let intent: QuestionIntentType = 'OPEN_RESEARCH';

  if (isDefenseMode) {
    intent = 'DEFENSE_ORAL';
  } else if (isDataGapTopic) {
    intent = 'OUT_OF_CORPUS';
  } else if (isExternalTopic) {
    intent = 'EXTERNAL_KNOWLEDGE';
  } else if (isProportion15Percent) {
    intent = 'CONCEPTUAL_EXPLANATION';
  } else if (isHypothesisOrBinaryQuestion) {
    intent = 'HYPOTHESIS_VERIFICATION';
  } else if (detectedYears.length > 0 && (norm.includes('quanto') || norm.includes('qual') || norm.includes('producao'))) {
    intent = 'FACTUAL_METRIC';
  } else if (
    norm.includes('qual e a tendencia') ||
    norm.includes('qual e a media') ||
    norm.includes('qual e a taxa') ||
    norm.includes('quantos inqueritos') ||
    norm.includes('quantos hectares') ||
    norm.includes('qual e a precipitacao')
  ) {
    intent = 'FACTUAL_METRIC';
  } else if (
    norm.includes('explica') ||
    norm.includes('o que e') ||
    norm.includes('como funciona') ||
    norm.includes('o que significa')
  ) {
    intent = 'CONCEPTUAL_EXPLANATION';
  }

  return {
    originalQuery: query,
    normalizedQuery: norm,
    intent,
    detectedYears,
    detectedMetrics,
    detectedEntities,
    isProportion15Percent,
    isHypothesisOrBinaryQuestion,
    isExternalTopic,
    isDataGapTopic,
    isDefenseMode,
  };
}
