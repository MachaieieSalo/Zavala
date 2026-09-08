import { DissertationQuestion } from '../../data/dissertationText';

export interface EvaluationFeedback {
  adequacy: string;
  academicRigor: string;
  clarity: string;
  strengths: string[];
  toDeepen: string[];
  followUpQuestion: string;
  examinerTone: string;
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
    pt: 'A sua tese insiste na resiliência da mandioca, mas os dados mostram um colapso de -92,5% em 2023. Não constitui isso uma contradição flagrante entre a teoria agronómica e a evidência empírica recolhida?',
    en: 'Your thesis emphasizes cassava resilience, yet data shows a -92.5% collapse in 2023. Does this not reveal a direct contradiction between agronomic theory and empirical evidence collected?',
  },
  cenario_etnografia: {
    pt: 'Ao documentar o mutirão Kukwatsana e a divisão sexual do trabalho, como evitou que a quantificação econométrica invisibilizasse a sobrecarga reprodutiva das mulheres rurais de Zavala?',
    en: 'In documenting Kukwatsana collective labor and gender division of work, how did you prevent econometric quantification from obscuring the reproductive burden borne by rural women in Zavala?',
  },
};

// Gerador de avaliação e parecer acadêmico estrito
export function generateAcademicEvaluation(
  candidateText: string,
  question: DissertationQuestion,
  lang: 'pt' | 'en' = 'pt'
): EvaluationFeedback {
  const isPt = lang === 'pt';
  const textClean = candidateText.trim().toLowerCase();
  const wordCount = textClean ? textClean.split(/\s+/).length : 0;

  // Verificação de palavras-chave empíricas de Zavala
  const empiricalKeywords = [
    'zavala',
    'quissico',
    'sdae',
    '31 anos',
    '1994',
    '2024',
    '547',
    'mann-kendall',
    'chirps',
    'cbsd',
    'nzile',
    'sustenta',
    'iiam',
    'toneladas',
    'rendimento',
    'choque',
    'arenos',
    'eline',
    'favio',
    'filipo',
  ];

  const matchedKeywords = empiricalKeywords.filter((k) => textClean.includes(k));
  const hasEmpiricalData = matchedKeywords.length >= 2;
  const isShort = wordCount < 35;
  const isWellStructured = wordCount >= 70;

  // Adequação
  let adequacy = '';
  if (isPt) {
    if (isShort) {
      adequacy =
        'Resposta preliminar e excessivamente concisa. Embora tangencie o ponto arguido pelo examinador, carece do desenvolvimento conceitual esperado numa defesa de mestrado.';
    } else if (isWellStructured) {
      adequacy =
        'Excelente enquadramento direto ao cerne da pergunta do examinador, demonstrando segurança epistemológica e foco no problema investigado.';
    } else {
      adequacy =
        'Adequação satisfatória ao enunciado da banca, abordando a questão central com clareza objetiva.';
    }
  } else {
    if (isShort) {
      adequacy =
        'Preliminary and overly concise answer. While it touches the examiner\'s inquiry, it lacks the depth expected in a master\'s defense.';
    } else if (isWellStructured) {
      adequacy =
        'Excellent framing directly addressing the core of the examination question, exhibiting scientific security and thematic focus.';
    } else {
      adequacy =
        'Satisfactory alignment with the board\'s inquiry, addressing the main concept with objective clarity.';
    }
  }

  // Rigor Académico & Evidência
  let academicRigor = '';
  if (isPt) {
    if (hasEmpiricalData) {
      academicRigor = `Demonstra sólido embasamento empírico ao mobilizar indicadores específicos da tese (${matchedKeywords.slice(0, 3).join(', ')}), sustentando a argumentação em factos documentados do Distrito de Zavala.`;
    } else {
      academicRigor =
        'Fundamentação predominantemente teórica. Recomenda-se ancorar explicitamente a resposta nos dados empíricos da tese (ex: série de 31 anos, dados do SDAE, indicadores de campo de Zavala).';
    }
  } else {
    if (hasEmpiricalData) {
      academicRigor = `Exhibits robust empirical grounding by citing specific thesis markers (${matchedKeywords.slice(0, 3).join(', ')}), reinforcing arguments with documented Zavala fieldwork.`;
    } else {
      academicRigor =
        'Primarily theoretical justification. It is strongly advised to ground the answer directly in empirical dissertation data (e.g. 31-year series, SDAE records, Zavala indicators).';
    }
  }

  // Clareza & Oratória
  let clarity = '';
  if (isPt) {
    clarity = `Cadência estimada em ${Math.max(1, Math.round(wordCount / 130))} min de elocução oral (${wordCount} palavras). Postura analítica sóbria e sem circunlóquios vazios.`;
  } else {
    clarity = `Estimated oral delivery time: ${Math.max(1, Math.round(wordCount / 130))} min (${wordCount} words). Sober analytical tone free of unnecessary rhetoric.`;
  }

  // Pontos Fortes
  const strengths: string[] = [];
  if (isPt) {
    if (hasEmpiricalData) {
      strengths.push('Mobilização direta de dados quantitativos e âncoras documentais da dissertação.');
    } else {
      strengths.push('Clareza de raciocínio conceitual e defesa imediata da tese.');
    }
    if (wordCount >= 50) {
      strengths.push('Estrutura argumentativa lógica com premissa, sustentação e conclusão delimitada.');
    }
    strengths.push(`Domínio do cenário temático: ${question.category}.`);
  } else {
    if (hasEmpiricalData) {
      strengths.push('Direct mobilization of quantitative metrics and thesis documentation anchors.');
    } else {
      strengths.push('Clear conceptual reasoning and immediate thesis defense.');
    }
    if (wordCount >= 50) {
      strengths.push('Logical argumentative flow with defined premise, evidence, and clear synthesis.');
    }
    strengths.push(`Command over the subject domain: ${question.category}.`);
  }

  // A Aprofundar
  const toDeepen: string[] = [];
  if (isPt) {
    if (!hasEmpiricalData) {
      toDeepen.push('Citar expressamente os números exatos e marcos temporais da série de Zavala (1994–2024).');
    }
    if (isShort) {
      toDeepen.push('Desenvolver os pressupostos metodológicos subjacentes para evitar abertura a réplicas contundentes.');
    }
    if (question.difficulty === 'Fogo Cruzado') {
      toDeepen.push('Antecipar a objeção sobre a vulnerabilidade extrema de 2023, mantendo a firmeza na distinção entre choque exógeno e falha estrutural.');
    } else {
      toDeepen.push('Reforçar a ligação entre o resultado agronómico e a implicação prática para as comunidades rurais de Quissico.');
    }
  } else {
    if (!hasEmpiricalData) {
      toDeepen.push('Explicitly cite exact figures and temporal milestones of the Zavala series (1994–2024).');
    }
    if (isShort) {
      toDeepen.push('Elaborate on underlying methodological assumptions to forestall rigorous rejoinders.');
    }
    if (question.difficulty === 'Fogo Cruzado') {
      toDeepen.push('Anticipate the objection regarding extreme 2023 vulnerability, firmly separating exogenous shocks from structural failure.');
    } else {
      toDeepen.push('Strengthen the link between agronomic findings and practical implications for Quissico farming communities.');
    }
  }

  // Réplica da banca
  const replica =
    SCENARIO_REPLICAS[question.scenarioId] || SCENARIO_REPLICAS.cenario_metodologia;
  const followUpQuestion = isPt ? replica.pt : replica.en;

  const examinerTone = isPt
    ? `Intervenção de ${question.examinerRole} (${question.difficulty})`
    : `Intervention by ${question.examinerRoleEn} (${question.difficulty})`;

  return {
    adequacy,
    academicRigor,
    clarity,
    strengths,
    toDeepen,
    followUpQuestion,
    examinerTone,
  };
}
