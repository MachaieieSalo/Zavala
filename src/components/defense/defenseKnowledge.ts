import { DissertationQuestion } from '../../data/dissertationText';

export interface EvidenceCriterion {
  id: string;
  labelPt: string;
  labelEn: string;
  isSatisfied: boolean;
  matchedClues: string[];
  guidancePt: string;
  guidanceEn: string;
}

export interface EvaluationFeedback {
  adequacy: string;
  academicRigor: string;
  clarity: string;
  strengths: string[];
  toDeepen: string[];
  followUpQuestion: string;
  examinerTone: string;
  evidenceChecklist: EvidenceCriterion[];
  overallVerification: 'confirmado' | 'parcial' | 'em_desenvolvimento';
}

// Réplicas especializadas por cenário e características da questão
const SCENARIO_REPLICAS: Record<string, { pt: string; en: string }> = {
  cenario_metodologia: {
    pt: 'Se o modelo determinístico em três camadas calibra as perdas pelo SPI e desastres históricos, como assegura a banca de que a variabilidade não observada na gestão das parcelas familiares não introduz um erro sistemático de sobrestimação?',
    en: 'If the 3-layer deterministic model calibrates losses against SPI and historical disasters, how do you assure the board that unobserved variability in household plot management does not introduce systematic overestimation error?',
  },
  cenario_agronomia: {
    pt: 'Face à pressão do estriamento castanho (CBSD) e à necrose das raízes, qual foi o critério para distinguir no modelo a quebra fisiológica por seca da perda sanitária decorrente de estacas infectadas?',
    en: 'Given cassava brown streak disease (CBSD) pressure and root necrosis, what criterion did you apply in the model to separate physiological drought loss from phytosanitary damage caused by infected cuttings?',
  },
  cenario_clima: {
    pt: 'Considerando que 547.224 toneladas foram perdidas em 31 anos sob 14 anos adversos, até que ponto a precipitação CHIRPS reflete a microfísica de chuvas convectivas costeiras em Quissico?',
    en: 'Given that 547,224 tons were lost over 31 years across 14 adverse years, to what extent does CHIRPS precipitation capture coastal convective micro-rainfall regimes in Quissico?',
  },
  cenario_espacial: {
    pt: 'A classificação de uso do solo com Sentinel-2 e SRTM identifica áreas de encharcamento em Nzile. Como validou no terreno a fronteira exata entre dunas costeiras arenosas e depressões hidromórficas?',
    en: 'Land-use classification with Sentinel-2 and SRTM detects waterlogging in Nzile. How did you ground-truth the exact boundary between coastal sandy dunes and hydromorphic depressions?',
  },
  cenario_politicas: {
    pt: 'O programa SUSTENTA e os bancos comunitários de estacas tiveram expansão recente. Em que medida a dependência de subsídios estatais compromete a sustentabilidade autónoma dos camponeses de Zavala?',
    en: 'The SUSTENTA program and community seedbanks recently expanded. To what degree does reliance on state subsidies jeopardize the autonomous sustainability of Zavala smallholders?',
  },
  cenario_fogo_cruzado: {
    pt: 'A sua tese insiste na resiliência da mandioca, mas os dados mostram um colapso em 2023. Como demonstra perante o júri que a resiliência biológica da planta é compatível com a extrema vulnerabilidade económica dos agregados familiares?',
    en: 'Your thesis emphasizes cassava resilience, yet data shows a deep collapse in 2023. How do you demonstrate before the board that biological resilience is compatible with household economic vulnerability?',
  },
  cenario_etnografia: {
    pt: 'Ao documentar o mutirão Kukwatsana e a divisão sexual do trabalho, como evitou que a quantificação econométrica invisibilizasse a sobrecarga reprodutiva das mulheres rurais de Zavala?',
    en: 'In documenting Kukwatsana collective labor and gender division of work, how did you prevent econometric quantification from obscuring the reproductive burden borne by rural women in Zavala?',
  },
};

// Normalização de texto: converte minúsculas e remove diacríticos para busca semântica flexível
function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Famílias de equivalências semânticas conceituais
// Permite flexibilidade vocabular (ex: "safra" == "colheita" == "produção"; "estiagem" == "seca")
const SEMANTIC_EQUIVALENCES: Record<string, string[]> = {
  // Geografia & Território
  territorio: [
    'zavala', 'quissico', 'inhambane', 'nzile', 'zavalene', 'dombe', 'nhamajal',
    'muane', 'distrito', 'bairro', 'bairros', 'litoral', 'costeir', 'machamba',
    'machambas', 'parcela', 'parcelas', 'terreno', 'comunidade', 'comunidades'
  ],
  // Tempo & Série Histórica
  temporal: [
    '31 anos', 'trinta e um anos', '1994', '2024', '1994 a 2024', '1994-2024',
    'serie historica', 'serie temporal', 'longo prazo', 'trajetoria', 'trajectoria',
    'decadas', 'interanual', 'anual', '2023', '2021', '2016', '2017', '2000',
    'pico', 'historico', 'ano terminal', 'cronologia'
  ],
  // Produção & Métricas Agrárias
  producao: [
    'producao', 'produtividade', 'rendimento', 'rendimentos', 't/ha', 'toneladas',
    'tonelada', 'safra', 'safras', 'colheita', 'colheitas', 'volume', '35.371',
    '35371', '273.773', '220.350', '141.000', '37.800', '547.224', 'quebra',
    'queda', 'colapso', 'perda', 'perdas', 'reducao', 'declinio', 'crescimento'
  ],
  // Clima & Choques Hidrometeorológicos
  clima: [
    'chirps', 'precipitacao', 'chuva', 'chuvas', 'pluviometria', 'spi', 'seca',
    'secas', 'estiagem', 'estiagens', 'defice hidrico', 'estresse hidrico',
    'ciclone', 'ciclones', 'tempestade', 'anomalia', 'freddy', 'dineo', 'favio',
    'filipo', 'dando', 'irina', 'eline', 'el nino', 'la nina', 'encharcamento',
    'alagamento', 'anoxia', 'asfixia radicular', 'inundacao', 'inundacoes',
    'cheia', 'cheias', 'excesso hidrico', 'cdd', 'dias secos'
  ],
  // Relevo & SIG Espacial
  espacial: [
    'srtm', 'altimetria', 'altitude', 'cota', 'cota baixa', 'depressao', 'baixada',
    'duna', 'dunas', 'planalto', 'sentinel', 'dynamic world', 'ndvi', 'sig',
    'espacial', 'en1', 'estrada nacional', 'distancia', 'acessibilidade',
    'heterogeneidade', 'gini', 'resolucao', '10m', '10 metros', '30m'
  ],
  // Metodologia, Fontes & Estatística
  metodologia: [
    'camada', 'camadas', 'tres camadas', '3 camadas', 'sdae', 'iiam', 'mader',
    'fao', 'banco mundial', 'world bank', 'ingd', 'em-dat', 'mann-kendall', 'sen',
    'chow', 'cagr', 'log-linear', 'markov', 'calibracao', 'reconstituicao',
    'ancoragem', 'ancoras', 'residuos', 'triangulacao', 'incerteza', 'estatistica',
    'modelo', 'deterministi', 'baseline', 'inquerito', 'tia', 'cap'
  ],
  // Maneio & Fisiologia Agronómica
  fisiologia: [
    'mandioca', 'manihot esculenta', 'tuberculo', 'tuberculos', 'raiz', 'raizes',
    'amido', 'estomatos', 'turgidez', 'folha', 'folhas', 'iaf', 'wue', 'cbsd',
    'estriamento castanho', 'necrose', 'podridao', 'cmd', 'mosaico', 'cianogenico',
    'cianeto', 'amargo', 'consorcio', 'leguminosas', 'amendoim', 'nhemba',
    'acaro', 'mosca-branca', 'estaca', 'estacas', 'propagacao', 'tuberizacao'
  ],
  // Comunidade, Género & Saberes Locais
  comunidade: [
    'mulher', 'mulheres', 'camponesa', 'camponesas', 'campones', 'camponeses',
    'agricultura familiar', 'mutirao', 'kukwatsana', 'itikoma', 'corte e queima',
    'rale', 'farinha', 'matapa', 'soberania alimentar', 'seguranca alimentar',
    'duat', 'associacao', 'associacoes', 'cooperativa', 'genero', 'saberes',
    'celeiro', 'poupanca', 'reserva', 'divisao sexual', 'xikotso', 'enxada'
  ],
  // Políticas Públicas & Economia Agrária
  politicas: [
    'sustenta', 'extensao', 'extensionista', 'bancos comunitarios', 'fdd',
    '7 milhoes', 'impala', 'cdm', 'dadtco', 'hqcf', 'trigo', 'substituicao',
    'seguro parametrico', 'politica', 'recomendacoes', 'mercado'
  ],
};

// Verifica presença de termos de uma família com normalização, priorizando termos específicos mais longos
function matchesFamily(normalizedText: string, family: string): string[] {
  const terms = SEMANTIC_EQUIVALENCES[family] || [];
  const matches: string[] = [];
  for (const term of terms) {
    if (normalizedText.includes(term)) {
      matches.push(term);
    }
  }
  // Ordenar por especificidade: termos contendo dígitos ou mais longos têm prioridade
  return matches.sort((a, b) => {
    const isNumA = /\d/.test(a);
    const isNumB = /\d/.test(b);
    if (isNumA && !isNumB) return -1;
    if (!isNumA && isNumB) return 1;
    return b.length - a.length;
  });
}

// Constrói a checklist de critérios específicos com base na categoria e pergunta
function buildQuestionChecklist(
  question: DissertationQuestion,
  normalizedText: string,
  isPt: boolean
): EvidenceCriterion[] {
  const checklist: EvidenceCriterion[] = [];
  const cat = question.category;
  const scenario = question.scenarioId;

  // Critério 1: Enquadramento Territorial e Contextual
  const geoMatches = matchesFamily(normalizedText, 'territorio');
  const tempMatches = matchesFamily(normalizedText, 'temporal');
  const c1Terms = Array.from(new Set([...geoMatches, ...tempMatches]));
  const c1Satisfied = c1Terms.length >= 1;
  checklist.push({
    id: 'crit_contexto',
    labelPt: 'Contextualização Territorial ou Temporal da Tese',
    labelEn: 'Territorial or Temporal Research Context',
    isSatisfied: c1Satisfied,
    matchedClues: c1Terms.slice(0, 6),
    guidancePt:
      'Recomenda-se situar explicitamente a resposta no distrito de Zavala (ou Quissico / Inhambane) e no horizonte cronológico da tese (1994–2024).',
    guidanceEn:
      'Consider explicitly anchoring the response to Zavala district (or Quissico / Inhambane) and the 1994–2024 research horizon.',
  });

  // Critério 2: Mecanismo Explicativo Central (varia por tema)
  if (cat === 'Clima, CHIRPS e Choques') {
    const climaMatches = matchesFamily(normalizedText, 'clima');
    const c2Satisfied = climaMatches.length >= 1;
    checklist.push({
      id: 'crit_clima_mecanismo',
      labelPt: 'Identificação do Choque Hidrometeorológico ou Biofísico',
      labelEn: 'Hydrometeorological or Biophysical Shock Identification',
      isSatisfied: c2Satisfied,
      matchedClues: climaMatches.slice(0, 6),
      guidancePt:
        'Indique com rigor o tipo de choque (seca, ciclone específico, excesso pluviométrico, encharcamento ou asfixia radicular).',
      guidanceEn:
        'Specify the exact shock mechanism (drought, specific cyclone, heavy rainfall, waterlogging, or root anoxia).',
    });
  } else if (cat === 'Análise Espacial em Quissico') {
    const spatialMatches = matchesFamily(normalizedText, 'espacial');
    const c2Satisfied = spatialMatches.length >= 1;
    checklist.push({
      id: 'crit_espacial_relevo',
      labelPt: 'Diferenciação Espacial, Relevo ou Deteção Remota',
      labelEn: 'Spatial Differentiation, Topography, or Remote Sensing',
      isSatisfied: c2Satisfied,
      matchedClues: spatialMatches.slice(0, 6),
      guidancePt:
        'Mencione a heterogeneidade entre bairros (ex: Nzile vs Zavalene), o modelo SRTM (altimetria) ou dados Sentinel-2 Dynamic World.',
      guidanceEn:
        'Highlight village-level heterogeneity (e.g. Nzile vs Zavalene), SRTM altimetry, or Sentinel-2 Dynamic World data.',
    });
  } else if (cat === 'Metodologia e Estatística') {
    const metMatches = matchesFamily(normalizedText, 'metodologia');
    const c2Satisfied = metMatches.length >= 1;
    checklist.push({
      id: 'crit_metodologia_procedimento',
      labelPt: 'Procedimento Metodológico ou Base de Dados',
      labelEn: 'Methodological Procedure or Primary Data Source',
      isSatisfied: c2Satisfied,
      matchedClues: metMatches.slice(0, 6),
      guidancePt:
        'Articule a estrutura metodológica (três camadas, dados observados SDAE 2017–2024, Mann-Kendall, ou calibração com CHIRPS).',
      guidanceEn:
        'Articulate the research methodology (3-layer model, observed SDAE 2017–2024 anchors, Mann-Kendall, or CHIRPS calibration).',
    });
  } else if (cat === 'Etnografia e Comunidade') {
    const etnoMatches = matchesFamily(normalizedText, 'comunidade');
    const c2Satisfied = etnoMatches.length >= 1;
    checklist.push({
      id: 'crit_etnografia_praticas',
      labelPt: 'Saberes Comunitários, Práticas Locais ou Protagonismo de Género',
      labelEn: 'Community Know-How, Local Practices, or Gender Roles',
      isSatisfied: c2Satisfied,
      matchedClues: etnoMatches.slice(0, 6),
      guidancePt:
        'Mobilize práticas etnográficas documentadas (Kukwatsana, Itikoma, processamento do rale, matapa ou associações femininas).',
      guidanceEn:
        'Mobilize documented ethnographic practices (Kukwatsana mutual aid, Itikoma slash-and-burn, rale processing, matapa, or women cooperatives).',
    });
  } else if (cat === 'Fisiologia e Maneio') {
    const fisioMatches = matchesFamily(normalizedText, 'fisiologia');
    const c2Satisfied = fisioMatches.length >= 1;
    checklist.push({
      id: 'crit_fisiologia_maneio',
      labelPt: 'Fisiologia Vegetal, Fitossanidade ou Maneio Agronómico',
      labelEn: 'Plant Physiology, Phytosanitary Health, or Agronomic Management',
      isSatisfied: c2Satisfied,
      matchedClues: fisioMatches.slice(0, 6),
      guidancePt:
        'Explique a resposta biológica da mandioca (estômatos, raízes profundas, tuberização, estriamento castanho CBSD ou consórcio com leguminosas).',
      guidanceEn:
        'Explain cassava biological mechanisms (stomata regulation, deep rooting, tuber bulking, CBSD brown streak, or legume intercropping).',
    });
  } else {
    const polMatches = matchesFamily(normalizedText, 'politicas');
    const metMatches = matchesFamily(normalizedText, 'metodologia');
    const allMatches = Array.from(new Set([...polMatches, ...metMatches]));
    checklist.push({
      id: 'crit_politica_aplicacao',
      labelPt: 'Implicação para Extensão Rural e Políticas Agrárias',
      labelEn: 'Implication for Agricultural Extension and Policy',
      isSatisfied: allMatches.length >= 1,
      matchedClues: allMatches.slice(0, 6),
      guidancePt:
        'Explicite recomendações práticas para o SDAE, MADER, bancos comunitários de estacas ou gestão do risco climático.',
      guidanceEn:
        'Specify practical recommendations for SDAE, MADER, community seed banks, or climate risk instruments.',
    });
  }

  // Critério 3: Sustentação Empírica / Consequência Agrária Real
  const prodMatches = matchesFamily(normalizedText, 'producao');
  const fisioMatches = matchesFamily(normalizedText, 'fisiologia');
  const comMatches = matchesFamily(normalizedText, 'comunidade');
  const c3Terms = Array.from(new Set([...prodMatches, ...fisioMatches, ...comMatches]));
  const c3Satisfied = c3Terms.length >= 1;
  checklist.push({
    id: 'crit_consequencia_empirica',
    labelPt: 'Impacto Agrário e Implicação Concreta para Zavala',
    labelEn: 'Agrarian Impact and Concrete Significance for Zavala',
    isSatisfied: c3Satisfied,
    matchedClues: c3Terms.slice(0, 6),
    guidancePt:
      'Conecte o argumento à dinâmica produtiva real (rendimento em t/ha, perdas de colheita, segurança alimentar das famílias ou quebras em safras concretas).',
    guidanceEn:
      'Link the argument to actual farming dynamics (yield in t/ha, crop loss, household food security, or specific harvest collapses).',
  });

  return checklist;
}

// Gerador de verificação de critérios de sustentação oral
// Princípio central: Pedagogia construtiva, sem pontuações numéricas, com fidelidade à dissertação
export function generateAcademicEvaluation(
  candidateText: string,
  question: DissertationQuestion,
  lang: 'pt' | 'en' = 'pt'
): EvaluationFeedback {
  const isPt = lang === 'pt';
  const rawClean = candidateText.trim();
  const normalizedText = normalizeText(rawClean);
  const wordCount = rawClean ? rawClean.split(/\s+/).length : 0;

  // Verificação através de checklist baseada em evidências
  const checklist = buildQuestionChecklist(question, normalizedText, isPt);
  const satisfiedCount = checklist.filter((c) => c.isSatisfied).length;
  const totalCriteria = checklist.length;

  // Identificação de pistas empíricas globais
  const allDetectedClues: string[] = [];
  checklist.forEach((c) => allDetectedClues.push(...c.matchedClues));
  const uniqueClues = Array.from(new Set(allDetectedClues));

  // Priorizar termos empíricos de maior especificidade (ex: dados numéricos, nomes de ciclones, métodos)
  const prioritizedClues = [...uniqueClues].sort((a, b) => {
    const isSpecA = /\d/.test(a) || ['freddy', 'dineo', 'anoxia', 'srtm', 'kukwatsana', 'chirps', 'rale'].includes(a);
    const isSpecB = /\d/.test(b) || ['freddy', 'dineo', 'anoxia', 'srtm', 'kukwatsana', 'chirps', 'rale'].includes(b);
    if (isSpecA && !isSpecB) return -1;
    if (!isSpecA && isSpecB) return 1;
    return 0;
  });

  // Estados de verificação global
  let overallVerification: 'confirmado' | 'parcial' | 'em_desenvolvimento';
  if (satisfiedCount === totalCriteria && wordCount >= 25) {
    overallVerification = 'confirmado';
  } else if (satisfiedCount >= 1 && wordCount >= 12) {
    overallVerification = 'parcial';
  } else {
    overallVerification = 'em_desenvolvimento';
  }

  // 1. Adequação ao Problema (Conceitual e Construtiva)
  let adequacy = '';
  if (isPt) {
    if (wordCount < 15) {
      adequacy =
        'A resposta oferece um esboço introdutório. Para a sustentação formal perante a banca, recomenda-se desenvolver os pontos de apoio de forma mais articulada e completa.';
    } else if (satisfiedCount === totalCriteria || wordCount >= 45) {
      adequacy =
        'A resposta enfrenta com clareza o problema formulado pelo júri, demonstrando alinhamento temático e estruturação conceitual sólida.';
    } else {
      adequacy =
        'A resposta aborda os pontos centrais da pergunta. Há margem para aprofundar os factores explicativos que sustentam a conclusão perante o júri.';
    }
  } else {
    if (wordCount < 15) {
      adequacy =
        'The response provides a preliminary outline. For formal defense presentation, it is advisable to articulate supporting premises more thoroughly.';
    } else if (satisfiedCount === totalCriteria || wordCount >= 45) {
      adequacy =
        'The response directly tackles the problem formulated by the board, showing thematic alignment and coherent conceptual structure.';
    } else {
      adequacy =
        'The response touches on central aspects of the inquiry. Deepening the explanatory mechanisms will further strengthen oral defense.';
    }
  }

  // 2. Rigor Empírico & Metodológico (Baseado nas Evidências Reais da Tese)
  let academicRigor = '';
  if (isPt) {
    if (prioritizedClues.length >= 2) {
      const sampleTerms = prioritizedClues.slice(0, 5).join(', ');
      academicRigor = `Identificam-se âncoras temáticas e empíricas da investigação (tais como: ${sampleTerms}), fundamentando a resposta na realidade observada no distrito de Zavala.`;
    } else if (prioritizedClues.length === 1) {
      academicRigor = `Identifica-se referência a ${prioritizedClues[0]}. Para elevar o rigor académico perante o júri, recomenda-se complementar com dados quantitativos ou fontes primárias (SDAE, CHIRPS, inquéritos).`;
    } else {
      academicRigor =
        'Não foram identificados elementos explícitos suficientes de fundamentação empírica nesta formulação. Recomenda-se ancorar os argumentos em marcos cronológicos (1994–2024), procedimentos metodológicos ou dados observados da tese.';
    }
  } else {
    if (prioritizedClues.length >= 2) {
      const sampleTerms = prioritizedClues.slice(0, 5).join(', ');
      academicRigor = `Empirical and thematic research markers were detected (${sampleTerms}), grounding the response in data documented for Zavala district.`;
    } else if (prioritizedClues.length === 1) {
      academicRigor = `Detected reference to ${prioritizedClues[0]}. To enhance academic rigor before the board, complement with quantitative metrics or primary sources (SDAE, CHIRPS, surveys).`;
    } else {
      academicRigor =
        'Explicit empirical or methodological anchors were not detected in this response. It is recommended to ground arguments in chronological milestones (1994–2024), methodological procedures, or observed thesis data.';
    }
  }

  // 3. Clareza Argumentativa & Cadência Oral
  let clarity = '';
  const estimatedMin = Math.max(1, Math.round(wordCount / 130));
  if (isPt) {
    clarity = `Cadência estimada em aproximadamente ${estimatedMin} min de elocução (${wordCount} palavras). Linguagem sóbria e apropriada a uma sustentação de mestrado.`;
  } else {
    clarity = `Estimated oral cadence around ${estimatedMin} min (${wordCount} words). Sober phrasing appropriate for a master's defense presentation.`;
  }

  // 4. Pontos de Sustentação Observados (Strengths)
  const strengths: string[] = [];
  const satisfiedList = checklist.filter((c) => c.isSatisfied);
  if (isPt) {
    if (satisfiedList.length > 0) {
      satisfiedList.forEach((c) => {
        strengths.push(`${c.labelPt} (evidências: ${c.matchedClues.join(', ')})`);
      });
    } else {
      strengths.push('Esboço preliminar de raciocínio concetual para a questão colocada.');
    }
    if (wordCount >= 45) {
      strengths.push('Extensão equilibrada para desenvolver premissa, sustentação e conclusão.');
    }
    strengths.push(`Enquadramento no domínio temático: ${question.category}.`);
  } else {
    if (satisfiedList.length > 0) {
      satisfiedList.forEach((c) => {
        strengths.push(`${c.labelEn} (evidence: ${c.matchedClues.join(', ')})`);
      });
    } else {
      strengths.push('Preliminary conceptual reasoning outline for the inquiry.');
    }
    if (wordCount >= 45) {
      strengths.push('Balanced length to articulate premise, evidence, and conclusion.');
    }
    strengths.push(`Thematic domain alignment: ${question.category}.`);
  }

  // 5. Aspetos a Reforçar perante a Banca (To Deepen - Sempre Construtivo)
  const toDeepen: string[] = [];
  const pendingList = checklist.filter((c) => !c.isSatisfied);
  if (isPt) {
    if (pendingList.length > 0) {
      pendingList.forEach((c) => {
        toDeepen.push(c.guidancePt);
      });
    } else {
      toDeepen.push('Manter cadência oral serena e segurança na apresentação dos dados.');
    }

    if (question.difficulty === 'Arguição Crítica') {
      toDeepen.push(
        'Na arguição crítica (módulo do simulador para objecções complexas), sustentar com serenidade a distinção entre fragilidade dos dados administrativos e o rigor da calibração em 3 camadas.'
      );
    }
  } else {
    if (pendingList.length > 0) {
      pendingList.forEach((c) => {
        toDeepen.push(c.guidanceEn);
      });
    } else {
      toDeepen.push('Maintain calm oral delivery and assertiveness in presenting findings.');
    }

    if (question.difficulty === 'Arguição Crítica') {
      toDeepen.push(
        'In critical inquiry (simulator module for complex objections), calmly emphasize the distinction between administrative reporting caveats and 3-layer calibration rigor.'
      );
    }
  }

  // Réplica contextual
  const replica =
    SCENARIO_REPLICAS[question.scenarioId] || SCENARIO_REPLICAS.cenario_metodologia;
  const followUpQuestion = isPt ? replica.pt : replica.en;

  // Tom do examinador com esclarecimento da categoria pedagógica
  let examinerTone = '';
  if (question.difficulty === 'Arguição Crítica') {
    examinerTone = isPt
      ? `Intervenção de ${question.examinerRole} · Nível: Arguição Crítica (Simulador: objecção metodológica complexa)`
      : `Intervention by ${question.examinerRoleEn} · Level: Critical Inquiry (Simulator: complex methodological objection)`;
  } else {
    examinerTone = isPt
      ? `Intervenção de ${question.examinerRole} · Nível: ${question.difficulty}`
      : `Intervention by ${question.examinerRoleEn} · Level: ${question.difficulty}`;
  }

  return {
    adequacy,
    academicRigor,
    clarity,
    strengths,
    toDeepen,
    followUpQuestion,
    examinerTone,
    evidenceChecklist: checklist,
    overallVerification,
  };
}

