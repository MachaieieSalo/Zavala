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

  // Perguntas específicas de chuva / causalidade
  const isRainfallCausalityQuestion =
    (norm.includes('chuva') || norm.includes('precipitacao')) &&
    (norm.includes('caus') || norm.includes('explica') || norm.includes('provoc') || norm.includes('queda') || norm.includes('quebra') || norm.includes('colapso'));

  // Perguntas sobre 11 bairros / Quissico / generalização distrital
  const is11BairrosQuestion =
    norm.includes('11 bairros') ||
    (norm.includes('quissico') && (norm.includes('representam') || norm.includes('todo zavala') || norm.includes('todo o distrito') || norm.includes('generaliz')));

  // Perguntas sobre 547k perdas
  const is547kLossesQuestion =
    norm.includes('547') ||
    (norm.includes('perdas') && (norm.includes('pesadas') || norm.includes('contrafactual') || norm.includes('armazem') || norm.includes('acumulad')));

  // Perguntas sobre dados observados vs modelados
  const isAllObservedQuestion =
    norm.includes('todos observados') ||
    norm.includes('sao todos observados') ||
    norm.includes('integralmente observad') ||
    (norm.includes('1994') && norm.includes('2024') && norm.includes('observad')) ||
    (norm.includes('dados') && norm.includes('observad') && norm.includes('1994'));

  // Perguntas sobre relatos de camponeses vs diagnóstico
  const isFarmerTestimonyQuestion =
    (norm.includes('campones') || norm.includes('produtor')) &&
    (norm.includes('diagnostico') || norm.includes('molecular') || norm.includes('laboratorial') || norm.includes('provou'));

  // Fora de escopo / lacuna documental evidente
  const isDataGapTopic =
    /\b(trigo|soja|milho\s+hibrido|trator|john\s+deere|adubo\s+npk\s+importado|capital\s+de|presidente\s+de|espectroscopia|teor\s+de\s+amido|laboratorio\s+molecular)\b/i.test(
      norm
    );

  // Conhecimento externo (FAO / mundial / conceitual desvinculado)
  const isExternalTopic =
    /\b(fao\s+mundial|fao\s+internacional|definicao\s+geral|seguranca\s+alimentar\s+a\s+nivel\s+global|literatura\s+externa|conceito\s+global|teoria\s+geral)\b/i.test(
      norm
    ) || (norm.includes('fao') && norm.includes('seguranca alimentar')) || norm.includes('fisiologia da mandioca');

  // Detectar perguntas de verificação / hipótese binária ("Os 11 bairros representam...?", "A chuva explica...?", etc.)
  const isHypothesisOrBinaryQuestion =
    /^(os|as|o|a|e|zavala)\s+/i.test(query.trim()) ||
    norm.startsWith('a chuva explica') ||
    norm.startsWith('a chuva causa') ||
    norm.startsWith('a mandioca resiste') ||
    norm.startsWith('os dados de 1994') ||
    norm.startsWith('os 11 bairros') ||
    norm.startsWith('as 547') ||
    norm.startsWith('os camponeses') ||
    norm.startsWith('zavala produziu') ||
    norm.includes(' representam todo ') ||
    norm.includes(' foram pesadas') ||
    norm.includes(' sao todos observados') ||
    norm.includes('causou a queda');

  // Detectar se pergunta pede definição ("o que são", "o que significa", "qual o significado")
  const isDefinitionExpected =
    norm.startsWith('o que sao') ||
    norm.startsWith('o que e') ||
    norm.startsWith('o que significa') ||
    norm.includes('o que significa') ||
    norm.includes('qual o significado') ||
    norm.includes('o que sao as');

  // Determinar se uma resposta negativa ou esclarecedora de mito é esperada
  const isNegativeExpected =
    (isRainfallCausalityQuestion && (norm.includes('caus') || norm.includes('explica'))) ||
    is11BairrosQuestion ||
    (is547kLossesQuestion && (norm.includes('pesadas') || norm.includes('terreno') || norm.includes('armazem'))) ||
    isAllObservedQuestion ||
    (isProportion15Percent && (norm.includes('zavala produziu') || norm.includes('produziu 15%') || norm.includes('era 15% da producao'))) ||
    isFarmerTestimonyQuestion;

  // Determinar o answerType
  let answerType: 'YES_NO' | 'VALUE' | 'DEFINITION' | 'EXPLANATION' | 'METHODOLOGY' | 'OUT_OF_CORPUS' | 'EXTERNAL' = 'EXPLANATION';

  if (isDataGapTopic) {
    answerType = 'OUT_OF_CORPUS';
  } else if (isExternalTopic) {
    answerType = 'EXTERNAL';
  } else if (isDefinitionExpected) {
    answerType = 'DEFINITION';
  } else if (
    (norm.startsWith('quanto produziu') || norm.startsWith('qual foi a producao') || norm.startsWith('qual e a producao')) &&
    detectedYears.length > 0
  ) {
    answerType = 'VALUE';
  } else if (
    norm.includes('qual e a media') ||
    norm.includes('qual e a taxa') ||
    norm.includes('quantos inqueritos') ||
    norm.includes('quantos hectares')
  ) {
    answerType = 'VALUE';
  } else if (isHypothesisOrBinaryQuestion) {
    answerType = 'YES_NO';
  } else if (norm.includes('metodologia') || norm.includes('camada') || norm.includes('como foi calculado')) {
    answerType = 'METHODOLOGY';
  } else {
    answerType = 'EXPLANATION';
  }

  // Determinar targetClaim
  let targetClaim = 'Visão geral da produção de mandioca em Zavala (1994–2024)';
  if (isProportion15Percent) {
    targetClaim = 'Calibração metodológica da proporção de ~15% de Zavala na produção provincial de Inhambane';
  } else if (isRainfallCausalityQuestion) {
    targetClaim = 'Relação estatística entre precipitação CHIRPS e produção (r = 0,057) e impacto do Freddy (2023)';
  } else if (is11BairrosQuestion) {
    targetClaim = 'Circunscrição espacial dos 11 bairros (22.343 ha) a Quissico e recusa de extrapolação distrital';
  } else if (is547kLossesQuestion) {
    targetClaim = 'Estimativa biofísica contrafactual acumulada de 547.224 t de perdas em 14 anos adversos';
  } else if (isAllObservedQuestion) {
    targetClaim = 'Hibridez estrutural da série histórica de 31 anos (23 modelados vs 8 observados)';
  } else if (detectedYears.includes(2021) && (norm.includes('producao') || norm.includes('quanto') || norm.includes('pico'))) {
    targetClaim = 'Pico histórico observado de 273.773 toneladas em 2021 (SDAE Zavala)';
  } else if (detectedYears.includes(1994) && (norm.includes('producao') || norm.includes('quanto') || norm.includes('inicial'))) {
    targetClaim = 'Produção estimada modelada de 52.164 toneladas em 1994 (ano base da série)';
  } else if (detectedYears.includes(2023) && (norm.includes('producao') || norm.includes('quanto') || norm.includes('queda'))) {
    targetClaim = 'Quebra observada de 35.371 toneladas em 2023 pós-Ciclone Freddy (SDAE Zavala)';
  } else if (detectedYears.includes(2024) && (norm.includes('producao') || norm.includes('quanto'))) {
    targetClaim = 'Produção observada de 48.573 toneladas em 2024 sob El Niño (SDAE Zavala)';
  } else if (norm.includes('mann-kendall') || norm.includes('mann kendall')) {
    targetClaim = 'Tendência secular crescente de Mann-Kendall (Z = 3,100; p = 0,0019)';
  } else if (norm.includes('ols') || norm.includes('newey-west')) {
    targetClaim = 'Taxa de crescimento linear OLS Newey-West (+4.229 t/ano; p = 0,020)';
  } else if (norm.includes('chow')) {
    targetClaim = 'Estabilidade estrutural sem quebra pelo teste de Chow (F = 0,84; p = 0,443)';
  } else if (norm.includes('media anual') || norm.includes('producao media')) {
    targetClaim = 'Produção média anual de 115.333 toneladas ao longo de 31 anos';
  } else if (norm.includes('inqueritos') || norm.includes('caderno de campo')) {
    targetClaim = 'Corpus etnográfico de 77 inquéritos de campo e 51 páginas de caderno';
  } else if (isDataGapTopic) {
    targetClaim = 'Lacuna documental / tema fora do corpus científico da dissertação';
  } else if (isExternalTopic) {
    targetClaim = 'Conhecimento externo geral não pertencente aos dados empíricos de Zavala';
  }

  // Determinar intenção geral
  let intent: QuestionIntentType = 'OPEN_RESEARCH';
  if (isDefenseMode) {
    intent = 'DEFENSE_ORAL';
  } else if (isDataGapTopic) {
    intent = 'OUT_OF_CORPUS';
  } else if (isExternalTopic) {
    intent = 'EXTERNAL_KNOWLEDGE';
  } else if (isHypothesisOrBinaryQuestion) {
    intent = 'HYPOTHESIS_VERIFICATION';
  } else if (answerType === 'VALUE') {
    intent = 'FACTUAL_METRIC';
  } else if (isProportion15Percent || answerType === 'DEFINITION' || answerType === 'EXPLANATION') {
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
    targetClaim,
    answerType,
    isNegativeExpected,
    isDefinitionExpected,
    isRainfallCausalityQuestion,
    is11BairrosQuestion,
    is547kLossesQuestion,
    isAllObservedQuestion,
    isFarmerTestimonyQuestion,
  };
}
