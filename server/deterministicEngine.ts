/**
 * Motor Científico Determinístico — Autoridade Factual Canónica
 * ZAVALAVOZ — UEM / ESUDER • Arquitectura Híbrida Real (Fase 15.2)
 *
 * Responsável por:
 * 1. Fornecer os factos canónicos imutáveis da SSoT.
 * 2. Determinar o estatuto epistemológico preciso (OBSERVADO, RECONSTITUÍDO/MODELADO, etc.).
 * 3. Validar qualquer afirmação do LLM ou do sintetizador contra a SSoT.
 * 4. Fazer prevalecer a verdade determinística (DETERMINISTIC ENGINE WINS) sem destruir a síntese linguística.
 */

import {
  CanonicalFact,
  DeterministicEvaluation,
  EpistemicStatus,
  ResponseStatusCategory,
  AnalyzedResearchQuestion,
  RetrievedEvidenceItem,
} from '../src/types/research';
import {
  THESIS_CORE_FACTS,
  SCIENTIFIC_TIME_SERIES,
  SCIENTIFIC_TREND_STATISTICS,
  CHIRPS_CORRELATION_ANALYSIS,
  QUISSICO_BAIRROS_SPATIAL,
  THESIS_FIELD_DATA_SUMMARY,
} from '../src/data/thesisScientificData';
import {
  auditTextForEpistemicRisks,
  applyEpistemicGuardrailsToAnswer,
} from '../src/utils/researchEpistemicGuardrails';

export function extractCanonicalFacts(
  analysis: AnalyzedResearchQuestion,
  evidence: RetrievedEvidenceItem[]
): CanonicalFact[] {
  const facts: CanonicalFact[] = [];
  const { normalizedQuery, detectedYears } = analysis;

  // 1. Factos de anos específicos detectados
  for (const year of detectedYears) {
    const point = SCIENTIFIC_TIME_SERIES.find((p) => p.year === year);
    if (point) {
      facts.push({
        id: `fact_year_${year}_prod`,
        topic: `Ano ${year}`,
        key: `production_${year}`,
        value: point.productionTonnes,
        unit: 't',
        epistemicStatus: year >= 2017 ? 'OBSERVADO' : 'RECONSTITUÍDO / MODELADO',
        source: year >= 2017 ? 'SDAE Zavala' : 'Reconstituição em 3 Camadas',
        exactText: `No ano ${year}, a produção foi de ${point.productionTonnes.toLocaleString('pt-MZ')} toneladas (${year >= 2017 ? 'dado observado pelo SDAE' : 'dado modelado em 3 camadas'}).`,
      });
      if (point.chirpsRainfallMm) {
        facts.push({
          id: `fact_year_${year}_rain`,
          topic: `Ano ${year}`,
          key: `rainfall_${year}`,
          value: point.chirpsRainfallMm,
          unit: 'mm',
          epistemicStatus: 'OBSERVADO',
          source: 'CHIRPS v2.0',
          exactText: `No ano ${year}, a precipitação CHIRPS foi de ${point.chirpsRainfallMm} mm (anomalia de ${point.chirpsAnomalyPercent}%).`,
        });
      }
    }
  }

  // 2. Proporção 15% / Calibração Distrital
  if (analysis.isProportion15Percent) {
    facts.push({
      id: 'fact_prop_15_percent',
      topic: 'Calibração Distrital',
      key: 'proportion_zavala_inhambane',
      value: '~15%',
      epistemicStatus: 'MODELADO',
      source: 'PROSUL 2014-19; World Bank Jobs WP No. 31',
      exactText: 'Zavala foi calibrado como representando aproximadamente ~15% da produção provincial de mandioca de Inhambane em 127.000 hectares provinciais.',
    });
    facts.push({
      id: 'fact_confidence_15_percent',
      topic: 'Incerteza do Modelo',
      key: 'confidence_band_regular',
      value: '±15%',
      epistemicStatus: 'MODELADO',
      source: 'Dissertação de Mestrado',
      exactText: 'Bandas de confiança e incerteza metodológica fixadas em ±15% para anos regulares e ±20% para anos de choque.',
    });
  }

  // 3. Média e Indicadores Globais
  facts.push({
    id: 'fact_avg_production',
    topic: 'Série Histórica 1994–2024',
    key: 'average_production',
    value: THESIS_CORE_FACTS.averageProductionTonnes,
    unit: 't/ano',
    epistemicStatus: 'OBSERVADO',
    source: 'Dissertação de Mestrado (SSoT)',
    exactText: `A produção média anual ao longo dos 31 anos analisados (1994–2024) foi de ${THESIS_CORE_FACTS.averageProductionTonnes.toLocaleString('pt-MZ')} toneladas.`,
  });

  // 4. Perdas Acumuladas 547.224 t
  if (normalizedQuery.includes('547') || normalizedQuery.includes('perda')) {
    facts.push({
      id: 'fact_accumulated_losses',
      topic: 'Perdas Biofísicas',
      key: 'accumulated_losses_1994_2016',
      value: THESIS_CORE_FACTS.accumulatedLossesTonnes,
      unit: 't',
      epistemicStatus: 'MODELADO',
      source: 'Tabela 4.4 da Dissertação',
      exactText: 'O valor de 547.224 toneladas corresponde a uma estimativa biofísica contrafactual acumulada ao longo de 14 safras adversas (1994–2016), e não a pesagem física de perdas no terreno ou armazém.',
    });
  }

  // 5. CHIRPS
  if (normalizedQuery.includes('chirps') || normalizedQuery.includes('correlacao') || normalizedQuery.includes('chuva') || normalizedQuery.includes('precipitacao')) {
    facts.push({
      id: 'fact_chirps_correlation',
      topic: 'Clima e Pluviometria',
      key: 'chirps_pearson_r',
      value: CHIRPS_CORRELATION_ANALYSIS.pearsonR,
      epistemicStatus: 'OBSERVADO',
      source: 'CHIRPS v2.0 & Dissertação Secção 4.2',
      exactText: `Correlação linear de Pearson r = ${CHIRPS_CORRELATION_ANALYSIS.pearsonR} (p = ${CHIRPS_CORRELATION_ANALYSIS.pValue}; R² = 0,003), demonstrando correlação praticamente nula entre precipitação acumulada e produção.`,
    });
  }

  // 6. Quissico 11 bairros / 22.343 ha
  if (normalizedQuery.includes('quissico') || normalizedQuery.includes('bairro') || normalizedQuery.includes('22.343') || normalizedQuery.includes('22343')) {
    facts.push({
      id: 'fact_quissico_spatial',
      topic: 'Dimensão Espacial',
      key: 'quissico_area_ha',
      value: THESIS_CORE_FACTS.spatialAreaQuissicoHa,
      unit: 'ha',
      epistemicStatus: 'OBSERVADO',
      source: 'Sentinel-2 & SRTM (Capítulo 5)',
      exactText: 'A análise espacial cartográfica e altimétrica circunscreve-se estritamente aos 11 bairros do Posto Administrativo de Quissico (22.343 ha) e não pode ser extrapolada para todo o distrito de Zavala.',
    });
  }

  // 7. Campo (77 inquéritos, 51 páginas de caderno)
  if (normalizedQuery.includes('campo') || normalizedQuery.includes('produtor') || normalizedQuery.includes('campones') || normalizedQuery.includes('inquerito')) {
    facts.push({
      id: 'fact_field_data',
      topic: 'Trabalho de Campo Etnográfico',
      key: 'field_surveys',
      value: THESIS_FIELD_DATA_SUMMARY.totalTranscribedQuestionnaireForms,
      unit: 'inquéritos',
      epistemicStatus: 'TESTEMUNHO DE CAMPO',
      source: 'Caderno de Campo de Yolanda Tamele',
      exactText: `Foram realizados ${THESIS_FIELD_DATA_SUMMARY.totalTranscribedQuestionnaireForms} inquéritos etnográficos a produtores em 8 localidades, transcritos em ${THESIS_FIELD_DATA_SUMMARY.totalNotebookPages} páginas do caderno de campo.`,
    });
  }

  // 8. Mann-Kendall e OLS
  if (normalizedQuery.includes('mann') || normalizedQuery.includes('tendencia') || normalizedQuery.includes('ols') || normalizedQuery.includes('chow')) {
    facts.push({
      id: 'fact_mann_kendall',
      topic: 'Estatística de Tendência',
      key: 'mann_kendall_z',
      value: 'Z = 3,100; p = 0,0019',
      epistemicStatus: 'OBSERVADO',
      source: 'Hamed & Rao (1998) / Dissertação Cap. 4',
      exactText: 'Mann-Kendall com correcção de autocorrelação serial: Z = 3,100 (p = 0,0019), comprovando tendência secular ascendente estatisticamente significativa a 99,8%.',
    });
    facts.push({
      id: 'fact_ols_growth',
      topic: 'Regressão OLS Newey-West',
      key: 'ols_slope',
      value: '+4.229 t/ano',
      epistemicStatus: 'OBSERVADO',
      source: 'Dissertação Cap. 4',
      exactText: 'Taxa média de expansão linear OLS-HAC: +4.229 toneladas/ano (p = 0,020; R² = 0,174).',
    });
    facts.push({
      id: 'fact_chow_test',
      topic: 'Quebra Estrutural de Chow',
      key: 'chow_f',
      value: 'F = 0,84; p = 0,443',
      epistemicStatus: 'OBSERVADO',
      source: 'Dissertação Cap. 4',
      exactText: 'Teste de quebra estrutural de Chow entre a série modelada (1994–2016) e observada (2017–2024): F = 0,84 (p = 0,443), indicando estabilidade e ausência de quebra estrutural.',
    });
  }

  return facts;
}

export function evaluateDeterministicContext(
  analysis: AnalyzedResearchQuestion,
  evidence: RetrievedEvidenceItem[]
): DeterministicEvaluation {
  const facts = extractCanonicalFacts(analysis, evidence);
  const guardrails = auditTextForEpistemicRisks(analysis.originalQuery);

  let primaryEpistemicStatus: EpistemicStatus = 'INTERPRETAÇÃO';
  let statusCategory: ResponseStatusCategory = 'SUPORTADA PELOS DADOS';

  if (analysis.isDataGapTopic) {
    primaryEpistemicStatus = 'INTERPRETAÇÃO';
    statusCategory = 'SUPORTE INSUFICIENTE';
  } else if (analysis.isExternalTopic) {
    primaryEpistemicStatus = 'CONTEXTUALIZAÇÃO EXTERNA';
    statusCategory = 'CONTEXTUALIZAÇÃO EXTERNA';
  } else if (analysis.detectedYears.length > 0) {
    const yr = analysis.detectedYears[0];
    primaryEpistemicStatus = yr >= 2017 ? 'OBSERVADO' : 'RECONSTITUÍDO / MODELADO';
  } else if (analysis.normalizedQuery.includes('547') || analysis.isProportion15Percent) {
    primaryEpistemicStatus = 'MODELADO';
  } else if (analysis.normalizedQuery.includes('campo') || analysis.normalizedQuery.includes('campones') || analysis.normalizedQuery.includes('produtor')) {
    primaryEpistemicStatus = 'TESTEMUNHO DE CAMPO';
  } else if (evidence.length > 0 && evidence[0].epistemicStatus) {
    primaryEpistemicStatus = evidence[0].epistemicStatus;
  }

  // Resumo de evidências e limitações
  const evidenceSummary = evidence
    .slice(0, 4)
    .map((e) => `• ${e.provenanceTrail || e.source} (${e.internalReference})`)
    .join('\n');

  const interpretationBreakdown =
    primaryEpistemicStatus === 'OBSERVADO'
      ? '• Dado Documentado: Registo oficial e primário do SDAE ou satélite CHIRPS/Sentinel-2.\n• Estatuto Epistemológico: OBSERVADO.'
      : primaryEpistemicStatus === 'RECONSTITUÍDO / MODELADO' || primaryEpistemicStatus === 'MODELADO'
      ? '• Dado Reconstituído/Modelado: Estimativa determinística em 3 camadas (1994–2016).\n• Estatuto Epistemológico: MODELADO.'
      : primaryEpistemicStatus === 'TESTEMUNHO DE CAMPO'
      ? '• Testemunho de Campo: Percepção empírica relatada pelos produtores nos inquéritos.\n• Estatuto Epistemológico: TESTEMUNHO DE CAMPO.'
      : primaryEpistemicStatus === 'CONTEXTUALIZAÇÃO EXTERNA'
      ? '• Contextualização Externa: Informação conceitual de apoio não derivada directamente dos dados empíricos de Zavala.'
      : '• Interpretação da Dissertação: Dedução econométrica e espacial fundamentada no corpus do estudo.';

  const limitation =
    'Os dados primários observados do SDAE abrangem o período 2017–2024; o período 1994–2016 corresponde à reconstituição determinística em três camadas.';

  return {
    facts,
    primaryEpistemicStatus,
    statusCategory,
    guardrails,
    directAnswerLead: '',
    evidenceSummary,
    interpretationBreakdown,
    limitation,
  };
}

/**
 * Valida o texto do LLM contra os factos canónicos.
 * Regra: DETERMINISTIC ENGINE WINS.
 * Se o LLM alucinar valores, estatutos ou causalidades, corrige cirurgicamente.
 */
export function validateAndEnforceDeterministicTruth(
  llmAnswer: string,
  analysis: AnalyzedResearchQuestion,
  facts: CanonicalFact[]
): {
  validatedAnswer: string;
  hasCorrections: boolean;
  correctionLog: string[];
} {
  let validatedAnswer = llmAnswer;
  let hasCorrections = false;
  const correctionLog: string[] = [];

  // 1. Verificar valores numéricos canónicos específicos
  // Ano 2021: deve ser 273.773 t
  if (analysis.detectedYears.includes(2021)) {
    if (/\b2021\b/.test(validatedAnswer) && !validatedAnswer.includes('273.773') && !validatedAnswer.includes('273773')) {
      validatedAnswer = validatedAnswer.replace(
        /produ[cç][aã]o\s+(?:em\s+2021\s+)?(?:foi\s+de\s+)?\b\d+[\d.,]*\s*(?:toneladas|t)?/i,
        'produção em 2021 foi de 273.773 toneladas'
      );
      hasCorrections = true;
      correctionLog.push('Correcção canónica do valor de produção de 2021 para 273.773 t.');
    }
  }

  // Ano 1994: deve ser 52.164 t
  if (analysis.detectedYears.includes(1994)) {
    if (/\b1994\b/.test(validatedAnswer) && !validatedAnswer.includes('52.164') && !validatedAnswer.includes('52164')) {
      validatedAnswer = validatedAnswer.replace(
        /produ[cç][aã]o\s+(?:em\s+1994\s+)?(?:foi\s+de\s+)?\b\d+[\d.,]*\s*(?:toneladas|t)?/i,
        'produção em 1994 foi de 52.164 toneladas'
      );
      hasCorrections = true;
      correctionLog.push('Correcção canónica do valor de produção de 1994 para 52.164 t.');
    }
  }

  // Ano 2023: deve ser 35.371 t
  if (analysis.detectedYears.includes(2023)) {
    if (/\b2023\b/.test(validatedAnswer) && !validatedAnswer.includes('35.371') && !validatedAnswer.includes('35371')) {
      validatedAnswer = validatedAnswer.replace(
        /produ[cç][aã]o\s+(?:em\s+2023\s+)?(?:foi\s+de\s+)?\b\d+[\d.,]*\s*(?:toneladas|t)?/i,
        'produção em 2023 foi de 35.371 toneladas'
      );
      hasCorrections = true;
      correctionLog.push('Correcção canónica do valor de produção de 2023 para 35.371 t.');
    }
  }

  // 2. Correcção de Invariante: 1994–2016 é modelado e NÃO observado
  if (
    /(?:1994\s+é\s+um\s+dado\s+observado|dados\s+observados\s+em\s+1994|período\s+de\s+1994\s+a\s+2024\s+é\s+totalmente\s+observado)/i.test(
      validatedAnswer
    )
  ) {
    validatedAnswer = validatedAnswer.replace(
      /(?:1994\s+é\s+um\s+dado\s+observado|dados\s+observados\s+em\s+1994)/gi,
      '1994 integra o período reconstituído e modelado em três camadas (1994–2016)'
    );
    hasCorrections = true;
    correctionLog.push('Imposição do estatuto RECONSTITUÍDO / MODELADO para 1994.');
  }

  // 3. Correcção de Invariante: Chuva não causa linearmente produção (r = 0,057)
  if (
    /(?:a\s+chuva\s+causou\s+a\s+queda|precipita[cç][aã]o\s+explica\s+directamente\s+a\s+produ[cç][aã]o)/i.test(
      validatedAnswer
    )
  ) {
    validatedAnswer = validatedAnswer.replace(
      /(?:a\s+chuva\s+causou\s+a\s+queda|precipita[cç][aã]o\s+explica\s+directamente\s+a\s+produ[cç][aã]o)/gi,
      'a análise revela correlação praticamente nula entre precipitação linear e produção (r = 0,057; p = 0,762)'
    );
    hasCorrections = true;
    correctionLog.push('Substituição de causalidade pluviométrica por correlação estatística nula (r = 0,057).');
  }

  // 4. Correcção de Invariante: 547.224 t foram estimadas contrafactualmente e NÃO pesadas fisicamente
  if (
    /(?:foram\s+pesadas\s+547\.224|547\.224\s+toneladas\s+foram\s+pesadas)/i.test(
      validatedAnswer
    )
  ) {
    validatedAnswer = validatedAnswer.replace(
      /(?:foram\s+pesadas\s+547\.224|547\.224\s+toneladas\s+foram\s+pesadas)/gi,
      'as 547.224 toneladas representam uma estimativa biofísica contrafactual e não perdas físicas pesadas no terreno'
    );
    hasCorrections = true;
    correctionLog.push('Correcção da natureza contrafactual das 547.224 t.');
  }

  // 5. Correcção de Invariante: Quissico 22.343 ha não generaliza todo Zavala
  if (
    /(?:os\s+11\s+bairros\s+representam\s+todo\s+o\s+distrito|aplicam-se\s+a\s+todo\s+o\s+distrito\s+de\s+zavala)/i.test(
      validatedAnswer
    )
  ) {
    validatedAnswer = validatedAnswer.replace(
      /(?:os\s+11\s+bairros\s+representam\s+todo\s+o\s+distrito|aplicam-se\s+a\s+todo\s+o\s+distrito\s+de\s+zavala)/gi,
      'a análise espacial dos 11 bairros circunscreve-se ao Posto Administrativo de Quissico (22.343 ha) e não se generaliza a todo o distrito'
    );
    hasCorrections = true;
    correctionLog.push('Circunscrição territorial estrita aos 11 bairros de Quissico.');
  }

  return {
    validatedAnswer,
    hasCorrections,
    correctionLog,
  };
}
