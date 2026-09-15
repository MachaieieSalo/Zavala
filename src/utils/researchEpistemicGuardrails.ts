/**
 * Guardrails Epistemológicos da Estação de Pesquisa ZAVALAVOZ
 * Regras mandatórias da dissertação de Yolanda Tamele (ESUDER / UEM)
 */

import { EpistemicGuardrailAlert } from '../types/research';

export interface EpistemicRuleDefinition {
  code: EpistemicGuardrailAlert['code'];
  riskLabel: string;
  pattern: RegExp;
  exceptionPattern?: RegExp;
  guardrailMessage: string;
  remedyApplied: string;
}

export const RESEARCH_EPISTEMIC_RULES: EpistemicRuleDefinition[] = [
  {
    code: 'R_CAUSALIDADE_DETERMINISTICA',
    riskLabel: 'Atribuição Causal Determinística Não Demonstrada',
    pattern:
      /(?:a\s+falta\s+de\s+chuva\s+causou|chuva\s+causou\s+a\s+quebra|precipita[cç][aã]o\s+causou\s+a\s+queda|seca\s+provocou\s+directamente\s+a\s+perda|o\s+clima\s+determinou\s+a\s+produ[cç][aã]o)/i,
    exceptionPattern:
      /(?:n[aã]o\s+permite\s+estabelecer\s+causalidade|n[aã]o\s+demonstra\s+causalidade|associa[cç][aã]o\s+temporal|n[aã]o\s+h[aá]\s+causalidade\s+directa|r\s*=\s*0[,.]057|p\s*=\s*0[,.]762|aus[eê]ncia\s+de\s+rela[cç][aã]o\s+linear)/i,
    guardrailMessage:
      'A precipitação isolada não explica linearmente as variações de produção em Zavala. Os dados mostram uma associação temporal em anos específicos, mas não uma relação causal determinística.',
    remedyApplied:
      'A formulação deve substituir a afirmação de causalidade directa pela constatação de associação temporal e multicausalidade agronómica.',
  },
  {
    code: 'R_DADOS_OBSERVADOS_TOTAIS',
    riskLabel: 'Generalização Incorreta da Série como Totalmente Observada',
    pattern:
      /(?:a\s+s[eé]rie\s+de\s+1994\s+a\s+2024\s+[eé]\s+constitu[ií]da\s+por\s+dados\s+observados|todos\s+os\s+31\s+anos\s+s[aã]o\s+observados|dados\s+observados\s+de\s+1994\s+a\s+2024|a\s+s[eé]rie\s+1994[–-]2024\s+[eé]\s+integralmente\s+observada)/i,
    exceptionPattern:
      /(?:1994[–-]2016\s+correspondem\s+[aà]\s+reconstru[cç][aã]o|h[ií]brida|23\s+anos\s+modelados|8\s+anos\s+observados|reconstitu[ií]da)/i,
    guardrailMessage:
      'Apenas o período de 2017 a 2024 (8 anos) assenta em relatórios primários observados do SDAE. O período 1994–2016 (23 anos) resulta de reconstituição e modelação determinística em 3 camadas.',
    remedyApplied:
      'A resposta deve explicitar a natureza híbrida da série (23 anos modelados vs 8 anos observados).',
  },
  {
    code: 'R_PERDAS_TOTAIS_REAIS',
    riskLabel: 'Equiparação de Perda Contrafactual a Perda Física Medida',
    pattern:
      /(?:foram\s+perdidas\s+547\.224\s+toneladas(?!\s+de\s+forma\s+estimada|\s+no\s+âmbito|\s+estimadas)|547\.224\s+t\s+(?:deixaram\s+de\s+ser\s+produzidas|foram\s+medidas\s+no\s+campo|foram\s+destru[ií]das\s+fisicamente))/i,
    exceptionPattern:
      /(?:modela[cç][aã]o\s+contrafactual|estimadas\s+no\s+[aâ]mbito|perdas\s+biof[ií]sicas\s+estimadas|cen[aá]rio\s+contrafactual|n[aã]o\s+foram\s+medidas\s+no\s+campo|n[aã]o\s+correspondem\s+a\s+perda\s+f[ií]sica\s+medida)/i,
    guardrailMessage:
      'O valor de 547.224 toneladas corresponde a uma estimativa biofísica contrafactual (diferencial entre a linha de base potencial de 7 t/ha e o rendimento modelado), e não a um registo de perdas físicas documentadas em armazém ou no solo.',
    remedyApplied:
      'A resposta deve salvaguardar o estatuto estritamente contrafactual e modelado das 547.224 t.',
  },
  {
    code: 'R_CORRELACAO_CHIRPS_CAUSAL',
    riskLabel: 'Interpretação Causal Indevida da Análise Pluviométrica CHIRPS',
    pattern:
      /(?:correla[cç][aã]o\s+CHIRPS\s+demonstra\s+a\s+influ[eê]ncia|CHIRPS\s+prova\s+que\s+a\s+precipita[cç][aã]o\s+causou|forte\s+correla[cç][aã]o\s+entre\s+chuva\s+e\s+produ[cç][aã]o|precipita[cç][aã]o\s+explica\s+a\s+produ[cç][aã]o)/i,
    exceptionPattern:
      /(?:r\s*=\s*0[,.]057|p\s*=\s*0[,.]762|n[aã]o\s+h[aá]\s+rela[cç][aã]o\s+linear|aus[eê]ncia\s+de\s+correla[cç][aã]o|n[aã]o\s+demonstra\s+causalidade|correla[cç][aã]o\s+estatisticamente\s+nula)/i,
    guardrailMessage:
      'A análise estatística revelou correlação linear praticamente nula (r = 0,057; p = 0,762; R² = 0,003), demonstrando que a precipitação acumulada não é o determinante linear da produção.',
    remedyApplied:
      'Rejeitar qualquer interpretação causal da correlação CHIRPS, citando os valores r = 0,057 e p = 0,762.',
  },
  {
    code: 'R_EXTRAPOLACAO_QUISSICO',
    riskLabel: 'Extrapolação Indevida dos Bairros de Quissico ao Distrito Inteiro',
    pattern:
      /(?:os\s+11\s+bairros\s+de\s+quissico\s+representam\s+todo\s+o\s+distrito|resultados\s+de\s+quissico\s+aplicam-se\s+a\s+zavala\s+inteiro|generaliza[cç][aã]o\s+de\s+quissico\s+para\s+o\s+distrito)/i,
    exceptionPattern:
      /(?:circunscritos\s+aos\s+11\s+bairros|22\.343\s+ha|n[aã]o\s+representam\s+todo|limite\s+territorial|apenas\s+no\s+posto\s+administrativo)/i,
    guardrailMessage:
      'A análise espacial de ocupação do solo e altimetria refere-se exclusivamente aos 11 bairros do Posto Administrativo de Quissico (22.343 ha), não podendo ser extrapolada sem ressalvas para os outros postos de Zavala.',
    remedyApplied:
      'Circunscrever explicitamente as conclusões espaciais e etnográficas ao perímetro de Quissico.',
  },
  {
    code: 'R_DIAGNOSTICO_FITOPATOLOGICO_CAMPONES',
    riskLabel: 'Confusão Entre Perceção Empírica de Campo e Diagnóstico Laboratorial',
    pattern:
      /(?:os\s+produtores\s+diagnosticaram\s+a\s+causa\s+fitopatol[oó]gica|camponeses\s+identificaram\s+a\s+doen[cç]a\s+laboratorialmente|diagn[oó]stico\s+m[eé]dico-vegetal\s+dos\s+produtores)/i,
    exceptionPattern:
      /(?:perce[cç][aã]o\s+emp[ií]rica|sintomas\s+visuais|sem\s+confirma[cç][aã]o\s+laboratorial|n[aã]o\s+constitui\s+diagn[oó]stico\s+fitopatol[oó]gico)/i,
    guardrailMessage:
      'Os produtores relataram apodrecimento radicular e sintomas visuais de dessecação foliar. A dissertação não incluiu testes de diagnóstico fitopatológico molecular ou laboratorial para confirmação de patógenos (CBSD/CMD).',
    remedyApplied:
      'Distinguir com clareza os testemunhos etnográficos de campo da confirmação laboratorial fitopatológica.',
  },
  {
    code: 'R_CONFUSAO_OBSERVADO_RECONSTITUIDO',
    riskLabel: 'Confusão Metodológica Entre Período Observado e Reconstituído',
    pattern:
      /(?:dados\s+do\s+sdae\s+desde\s+1994|relat[oó]rios\s+do\s+governo\s+de\s+1994|medi[cç][aã]o\s+anual\s+completa\s+durante\s+31\s+anos)/i,
    exceptionPattern:
      /(?:reconstitui[cç][aã]o|modelo|2017[–-]2024|sdae\s+apenas|tr[eê]s\s+camadas)/i,
    guardrailMessage:
      'Os dados do SDAE só foram sistematizados com relatórios contínuos de 2017 a 2024. A reconstituição de 1994 a 2016 utilizou calibração das três camadas fundamentada em satélites e inquéritos da FAO/TIA.',
    remedyApplied:
      'Separar temporalmente a metodologia dos 23 anos modelados dos 8 anos observados.',
  },
  {
    code: 'R_INFERENCIA_SEM_EVIDENCIA',
    riskLabel: 'Inferência Sem Suporte Textual ou Empírico na Dissertação',
    pattern:
      /(?:ficou\s+provado\s+conclusivamente\s+que|prova\s+definitiva\s+que|n[aã]o\s+restam\s+d[uú]vidas\s+de\s+que\s+a\s+gest[aã]o\s+falhou)/i,
    exceptionPattern:
      /(?:sugere|indica|aponta|segundo\s+a\s+disserta[cç][aã]o|no\s+limite\s+dos\s+dados|com\s+cautela)/i,
    guardrailMessage:
      'A dissertação formula conclusões probabilísticas e contextualizadas, abstendo-se de afirmações definitivas que excedam as evidências coletadas em Zavala.',
    remedyApplied:
      'Atenuar a assertividade da frase, explicitando o estatuto de inferência ou interpretação com suporte limitado.',
  },
];

export function auditTextForEpistemicRisks(text: string): EpistemicGuardrailAlert[] {
  const alerts: EpistemicGuardrailAlert[] = [];
  if (!text) return alerts;

  for (const rule of RESEARCH_EPISTEMIC_RULES) {
    if (rule.pattern.test(text)) {
      if (rule.exceptionPattern && rule.exceptionPattern.test(text)) {
        continue;
      }
      const match = text.match(rule.pattern);
      alerts.push({
        code: rule.code,
        riskLabel: rule.riskLabel,
        detectedTextSnippet: match ? match[0] : undefined,
        guardrailMessage: rule.guardrailMessage,
        remedyApplied: rule.remedyApplied,
      });
    }
  }

  return alerts;
}

export function applyEpistemicGuardrailsToAnswer(
  answer: string,
  userQuery: string
): {
  remediatedAnswer: string;
  alerts: EpistemicGuardrailAlert[];
  statusCategory: 'SUPORTADA PELOS DADOS' | 'INTERPRETAÇÃO' | 'CONTEXTUALIZAÇÃO EXTERNA' | 'SUPORTE INSUFICIENTE';
} {
  const answerAlerts = auditTextForEpistemicRisks(answer);
  const queryAlerts = auditTextForEpistemicRisks(userQuery);

  const combinedAlerts = [...answerAlerts];
  for (const qa of queryAlerts) {
    if (!combinedAlerts.some((a) => a.code === qa.code)) {
      combinedAlerts.push(qa);
    }
  }

  let remediatedAnswer = answer;

  // Se houver alerta e a resposta não incluir a devida salvaguarda, anexar a nota epistemológica de salvaguarda
  if (combinedAlerts.length > 0) {
    const safeguardsToAdd: string[] = [];
    for (const alert of combinedAlerts) {
      if (!remediatedAnswer.toLowerCase().includes(alert.code.toLowerCase())) {
        safeguardsToAdd.push(`• **${alert.riskLabel}:** ${alert.guardrailMessage}`);
      }
    }

    if (safeguardsToAdd.length > 0 && !remediatedAnswer.includes('SALVAGUARDA EPISTEMOLÓGICA')) {
      remediatedAnswer += `\n\n> ⚠️ **SALVAGUARDA EPISTEMOLÓGICA DA INVESTIGAÇÃO:**\n${safeguardsToAdd.join('\n')}`;
    }
  }

  // Determinar estatuto da resposta
  let statusCategory: 'SUPORTADA PELOS DADOS' | 'INTERPRETAÇÃO' | 'CONTEXTUALIZAÇÃO EXTERNA' | 'SUPORTE INSUFICIENTE' =
    'SUPORTADA PELOS DADOS';

  const lowerAnswer = remediatedAnswer.toLowerCase();
  if (
    lowerAnswer.includes('não está explicitamente documentada') ||
    lowerAnswer.includes('conhecimento externo') ||
    lowerAnswer.includes('nível 5')
  ) {
    statusCategory = 'CONTEXTUALIZAÇÃO EXTERNA';
  } else if (
    lowerAnswer.includes('suporte insuficiente') ||
    lowerAnswer.includes('dados não permitem') ||
    lowerAnswer.includes('não foi possível localizar')
  ) {
    statusCategory = 'SUPORTE INSUFICIENTE';
  } else if (
    combinedAlerts.length > 0 ||
    lowerAnswer.includes('interpretação') ||
    lowerAnswer.includes('inferência') ||
    lowerAnswer.includes('sugere')
  ) {
    statusCategory = 'INTERPRETAÇÃO';
  }

  return {
    remediatedAnswer,
    alerts: combinedAlerts,
    statusCategory,
  };
}
