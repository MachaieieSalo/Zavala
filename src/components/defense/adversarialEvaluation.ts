import { DissertationQuestion } from '../../data/dissertationText';
import {
  AdversarialVulnerability,
  scanForEpistemicRisks,
  EpistemicRiskAlert,
} from '../../data/adversarialVulnerabilities';

export type QualitativeGrade =
  | 'FORTE'
  | 'ADEQUADA'
  | 'PARCIAL'
  | 'VULNERÁVEL'
  | 'NÃO SUSTENTADA';

export type OverallPreparationStatus =
  | 'SUSTENTAÇÃO CONSISTENTE'
  | 'PONTOS A REFORÇAR'
  | 'PONTOS VULNERÁVEIS';

export interface AdversarialDimensionEvaluation {
  grade: QualitativeGrade;
  justificationPt: string;
  justificationEn: string;
}

export interface AdversarialEvaluationResult {
  adequacy: AdversarialDimensionEvaluation;
  epistemicRigor: AdversarialDimensionEvaluation;
  methodologicalMastery: AdversarialDimensionEvaluation;
  oralClarity: AdversarialDimensionEvaluation;
  overallStatus: OverallPreparationStatus;
  epistemicAlerts: EpistemicRiskAlert[];
  wordCount: number;
  estimatedMinutes: number;
  // Secções de comparação com a dissertação
  wellAnswered: string[];
  incompletePoints: string[];
  epistemicRisksFound: string[];
  supportingEvidence: string[];
  declaredLimitations: string[];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function evaluateAdversarialResponse(
  candidateText: string,
  secondaryResponseText: string,
  question: DissertationQuestion,
  vulnerability: AdversarialVulnerability | undefined,
  lang: 'pt' | 'en' = 'pt'
): AdversarialEvaluationResult {
  const isPt = lang === 'pt';
  const fullText = `${candidateText} ${secondaryResponseText}`.trim();
  const normalized = normalize(fullText);
  const words = fullText ? fullText.split(/\s+/).filter(Boolean).length : 0;
  const estimatedMinutes = Math.max(1, Math.round(words / 130));

  // Executar scanner de riscos epistemológicos
  const alerts = scanForEpistemicRisks(fullText);

  // Palavras-chave essenciais presentes na resposta de referência da tese
  const refNorm = normalize(question.candidateResponse);
  const coreThesisTerms = [
    'zavala', 'mandioca', 'sdae', 'quissico', '1994', '2024', '2017', '2023',
    'chirps', 'mann-kendall', 'sen', 'contrafactual', 'tres camadas', '3 camadas',
    'anoxia', 'encharcamento', 'seca', 'freddy', 'favio', 'srtm', 'sentinel',
    'kukwatsana', 'inquerito', '77', 'reconstituicao', 'modelo'
  ];

  const matchedTerms = coreThesisTerms.filter((term) => normalized.includes(term));
  const hasRefSpecifics = matchedTerms.length >= 3;

  // 1. ADEQUAÇÃO À PERGUNTA
  let adequacyGrade: QualitativeGrade = 'NÃO SUSTENTADA';
  let adequacyJustPt = '';
  let adequacyJustEn = '';

  if (words === 0) {
    adequacyGrade = 'NÃO SUSTENTADA';
    adequacyJustPt = 'A resposta não foi apresentada.';
    adequacyJustEn = 'No response provided.';
  } else if (words < 20) {
    adequacyGrade = 'VULNERÁVEL';
    adequacyJustPt = 'Resposta embrionária com extensão insuficiente para sustentar a tese perante a banca.';
    adequacyJustEn = 'Inchoate response with insufficient length to sustain the thesis before the board.';
  } else if (words < 50) {
    adequacyGrade = 'PARCIAL';
    adequacyJustPt = 'A resposta aborda o tópico geral, mas deixa de articular premissa e conclusão direta.';
    adequacyJustEn = 'The response touches the general topic but fails to articulate premise and direct conclusion.';
  } else if (hasRefSpecifics || words >= 80) {
    adequacyGrade = 'FORTE';
    adequacyJustPt = 'Enfrenta directamente a objecção com extensão e enquadramento sólidos.';
    adequacyJustEn = 'Directly tackles the objection with solid framing and thorough development.';
  } else {
    adequacyGrade = 'ADEQUADA';
    adequacyJustPt = 'Enquadramento satisfatório da questão com pertinência temática.';
    adequacyJustEn = 'Satisfactory framing of the question with thematic relevance.';
  }

  // 2. RIGOR EPISTEMOLÓGICO
  let rigorGrade: QualitativeGrade = 'ADEQUADA';
  let rigorJustPt = '';
  let rigorJustEn = '';

  if (words === 0) {
    rigorGrade = 'NÃO SUSTENTADA';
    rigorJustPt = 'Sem formulação para análise epistemológica.';
    rigorJustEn = 'No text for epistemological inspection.';
  } else if (alerts.length >= 2) {
    rigorGrade = 'VULNERÁVEL';
    rigorJustPt = `Foram detectadas ${alerts.length} formulações de causalidade indevida ou extrapolação que fragilizam a sustentação.`;
    rigorJustEn = `Detected ${alerts.length} undue causality or extrapolation phrasings that undermine defense rigor.`;
  } else if (alerts.length === 1) {
    rigorGrade = 'PARCIAL';
    rigorJustPt = 'Identificado 1 alerta de risco epistemológico que exige reformulação prudente.';
    rigorJustEn = 'Identified 1 epistemological risk alert requiring prudent reformulation.';
  } else if (
    normalized.includes('observado') ||
    normalized.includes('reconstitu') ||
    normalized.includes('contrafactual') ||
    normalized.includes('limita') ||
    normalized.includes('associac')
  ) {
    rigorGrade = 'FORTE';
    rigorJustPt = 'Excelente prudência epistemológica: salvaguardas explícitas entre observado e modelado.';
    rigorJustEn = 'Excellent epistemic prudence: explicit distinctions between observed and modeled data.';
  } else {
    rigorGrade = 'ADEQUADA';
    rigorJustPt = 'Ausência de incorreções graves de causalidade; prudência conceitual preservada.';
    rigorJustEn = 'No severe causality errors detected; conceptual prudence preserved.';
  }

  // 3. DOMÍNIO METODOLÓGICO
  let methodGrade: QualitativeGrade = 'ADEQUADA';
  let methodJustPt = '';
  let methodJustEn = '';

  if (words === 0) {
    methodGrade = 'NÃO SUSTENTADA';
    methodJustPt = 'Sem evidência metodológica apresentada.';
    methodJustEn = 'No methodological evidence presented.';
  } else if (matchedTerms.length >= 4) {
    methodGrade = 'FORTE';
    methodJustPt = `Mobilização exemplar de âncoras metodológicas da dissertação (${matchedTerms.slice(0, 4).join(', ')}).`;
    methodJustEn = `Exemplary mobilization of thesis methodological anchors (${matchedTerms.slice(0, 4).join(', ')}).`;
  } else if (matchedTerms.length >= 2) {
    methodGrade = 'ADEQUADA';
    methodJustPt = `Identificam-se procedimentos metodológicos legítimos (${matchedTerms.slice(0, 2).join(', ')}).`;
    methodJustEn = `Legitimate methodological procedures identified (${matchedTerms.slice(0, 2).join(', ')}).`;
  } else if (words >= 35) {
    methodGrade = 'PARCIAL';
    methodJustPt = 'Discurso genérico com pouca ancoragem nos procedimentos concretos da tese.';
    methodJustEn = 'Generic discourse with limited anchoring in the thesis’s concrete protocols.';
  } else {
    methodGrade = 'VULNERÁVEL';
    methodJustPt = 'Carência de vocabulário metodológico e de menção às fontes de dados.';
    methodJustEn = 'Lacks methodological terminology and references to data sources.';
  }

  // 4. CLAREZA DA SUSTENTAÇÃO
  let clarityGrade: QualitativeGrade = 'ADEQUADA';
  let clarityJustPt = '';
  let clarityJustEn = '';

  if (words === 0) {
    clarityGrade = 'NÃO SUSTENTADA';
    clarityJustPt = 'Nenhuma elocução registada.';
    clarityJustEn = 'No speech recorded.';
  } else if (words >= 60 && words <= 280) {
    clarityGrade = 'FORTE';
    clarityJustPt = `Cadência oral ideal (~${estimatedMinutes} min, ${words} palavras) para arguição formal.`;
    clarityJustEn = `Ideal oral cadence (~${estimatedMinutes} min, ${words} words) for formal viva defense.`;
  } else if (words < 25) {
    clarityGrade = 'VULNERÁVEL';
    clarityJustPt = `Sustentação demasiado telegráfica (${words} palavras); risco de parecer evasiva perante o júri.`;
    clarityJustEn = `Overly telegraphic defense (${words} words); risk of sounding evasive before examiners.`;
  } else if (words > 400) {
    clarityGrade = 'PARCIAL';
    clarityJustPt = `Excesso de extensão (${words} palavras, ~${estimatedMinutes} min); risco de dispersão e interrupção pela banca.`;
    clarityJustEn = `Overlong speech (${words} words, ~${estimatedMinutes} min); risk of losing focus or board interruption.`;
  } else {
    clarityGrade = 'ADEQUADA';
    clarityJustPt = `Extensão e sobriedade compatíveis com o tempo de arguição (${words} palavras).`;
    clarityJustEn = `Length and sober tone compatible with examination time constraints (${words} words).`;
  }

  // Determinar Estado Global de Preparação
  let overallStatus: OverallPreparationStatus = 'PONTOS A REFORÇAR';
  const grades = [adequacyGrade, rigorGrade, methodGrade, clarityGrade];
  const strongCount = grades.filter((g) => g === 'FORTE').length;
  const vulnerableCount = grades.filter((g) => g === 'VULNERÁVEL' || g === 'NÃO SUSTENTADA').length;

  if (vulnerableCount >= 1 || alerts.some((a) => a.dangerLevel === 'alto')) {
    overallStatus = 'PONTOS VULNERÁVEIS';
  } else if (strongCount >= 2 && vulnerableCount === 0) {
    overallStatus = 'SUSTENTAÇÃO CONSISTENTE';
  } else {
    overallStatus = 'PONTOS A REFORÇAR';
  }

  // Secções de Comparação com a Dissertação
  const wellAnswered: string[] = [];
  const incompletePoints: string[] = [];
  const epistemicRisksFound: string[] = [];
  const supportingEvidence: string[] = [];
  const declaredLimitations: string[] = [];

  // O que foi bem respondido
  if (adequacyGrade === 'FORTE' || adequacyGrade === 'ADEQUADA') {
    wellAnswered.push(isPt ? 'Enquadramento temático alinhado com o objecto de estudo de Zavala.' : 'Thematic framing aligned with Zavala research object.');
  }
  if (matchedTerms.length > 0) {
    wellAnswered.push(
      isPt
        ? `Menção explícita a termos e fontes nucleares: ${matchedTerms.slice(0, 5).join(', ')}.`
        : `Explicit mention of core concepts and sources: ${matchedTerms.slice(0, 5).join(', ')}.`
    );
  }
  if (alerts.length === 0 && words >= 30) {
    wellAnswered.push(isPt ? 'Manutenção de sobriedade científica sem asserções causais precipitadas.' : 'Maintained scientific restraint without premature causal claims.');
  }

  // O que ficou incompleto
  if (!normalized.includes('observado') && !normalized.includes('2017')) {
    incompletePoints.push(
      isPt
        ? 'Declaração explícita de que os dados observados contínuos do SDAE apenas vigoram entre 2017 e 2024.'
        : 'Explicit acknowledgement that continuous observed SDAE data covers only 2017 to 2024.'
    );
  }
  if (!normalized.includes('contrafactual') && (question.number === 9 || question.number === 11)) {
    incompletePoints.push(
      isPt
        ? 'Caracterização das 547.224 t como diferencial contrafactual de perdas, e não pesagem física in-situ.'
        : 'Characterization of the 547,224 t as a counterfactual loss differential, not physical in-situ weighing.'
    );
  }
  if (words < 45) {
    incompletePoints.push(
      isPt
        ? 'Aprofundamento dos mecanismos explicativos biofísicos e agronómicos que sustentam a conclusão.'
        : 'Deepening of the biophysical and agronomic explanatory mechanisms underlying the conclusion.'
    );
  }

  // Onde existe risco epistemológico
  if (alerts.length > 0) {
    alerts.forEach((alert) => {
      epistemicRisksFound.push(isPt ? alert.riskMessagePt : alert.riskMessageEn);
    });
  } else {
    epistemicRisksFound.push(
      isPt
        ? 'Nenhum risco epistemológico de causalidade indevida detectado na resposta formulada.'
        : 'No undue causality epistemic risk detected in the response.'
    );
  }

  // Que evidência sustenta a resposta
  if (vulnerability) {
    supportingEvidence.push(
      isPt
        ? `${vulnerability.internalAppEvidence.locationLabel} (${vulnerability.title}).`
        : `${vulnerability.internalAppEvidence.locationLabelEn} (${vulnerability.titleEn}).`
    );
    supportingEvidence.push(
      isPt
        ? `Salvaguarda metodológica de referência: ${vulnerability.epistemicGuardrail}`
        : `Reference methodological guardrail: ${vulnerability.epistemicGuardrailEn}`
    );
  } else {
    supportingEvidence.push(
      isPt
        ? `Sustentação oficial da dissertação (Pergunta ${question.number}): "${question.candidateResponse.substring(0, 140)}..."`
        : `Official dissertation defense (Question ${question.number}): "${question.candidateResponseEn.substring(0, 140)}..."`
    );
  }

  // Que limitação deveria ter sido declarada
  if (vulnerability) {
    declaredLimitations.push(
      isPt
        ? `Limitação metodológica obrigatória: ${vulnerability.epistemicGuardrail}`
        : `Mandatory methodological limitation: ${vulnerability.epistemicGuardrailEn}`
    );
  }
  declaredLimitations.push(
    isPt
      ? 'A dissertação reconhece a escassez de pluviógrafos automáticos densos e a natureza de estudo de caso dos 11 bairros de Quissico (22.343 ha).'
      : 'The thesis explicitly acknowledges sparse automatic rain-gauges and the case-study nature of Quissico’s 11 bairros (22,343 ha).'
  );

  return {
    adequacy: {
      grade: adequacyGrade,
      justificationPt: adequacyJustPt,
      justificationEn: adequacyJustEn,
    },
    epistemicRigor: {
      grade: rigorGrade,
      justificationPt: rigorJustPt,
      justificationEn: rigorJustEn,
    },
    methodologicalMastery: {
      grade: methodGrade,
      justificationPt: methodJustPt,
      justificationEn: methodJustEn,
    },
    oralClarity: {
      grade: clarityGrade,
      justificationPt: clarityJustPt,
      justificationEn: clarityJustEn,
    },
    overallStatus,
    epistemicAlerts: alerts,
    wordCount: words,
    estimatedMinutes,
    wellAnswered,
    incompletePoints,
    epistemicRisksFound,
    supportingEvidence,
    declaredLimitations,
  };
}
