/**
 * Detector de Extrapolação e Riscos Epistemológicos para a Defesa
 * FASE 12 — ZAVALAVOZ (UEM / ESUDER • Yolanda Tamele)
 * 
 * Analisa formulações textuais e identifica falhas epistemológicas:
 * - Causalidade Determinística Indevida
 * - Generalização Espacial Abusiva
 * - Confusão Observado vs Modelado
 * - Equiparação de Perda Contrafactual a Perda Física
 * - Confusão Testemunho Empírico vs Diagnóstico Laboratorial
 * - Tentativa de Violação da Regra Absoluta SSoT
 */

import { ExtrapolationCategory, ExtrapolationDetectionResult } from '../types/crossAudit';

export interface ExtrapolationRule {
  category: ExtrapolationCategory;
  name: string;
  pattern: RegExp;
  exceptionPattern?: RegExp;
  alert: string;
  suggestion: string;
  safeReformulation: string;
  severity: 'ALTO' | 'MÉDIO' | 'CRÍTICO';
}

export const EXTRAPOLATION_RULES: ExtrapolationRule[] = [
  // 1. CAUSALIDADE
  {
    category: 'CAUSALIDADE',
    name: 'Atribuição de Causalidade Pluviométrica Linear',
    pattern:
      /(?:a\s+falta\s+de\s+chuva\s+causou|chuva\s+causou\s+a\s+quebra|diga\s+que\s+a\s+chuva\s+causou|precipita[cç][aã]o\s+causou|seca\s+causou\s+directamente|o\s+clima\s+causou\s+a\s+queda|mann-kendall\s+prova\s+causalidade)/i,
    exceptionPattern:
      /(?:n[aã]o\s+sustenta\s+causalidade|associa[cç][aã]o\s+temporal|n[aã]o\s+estabelece\s+causalidade|r\s*=\s*0[,.]057|n[aã]o\s+linear)/i,
    alert: 'Formulação a rever: o corpus não sustenta causalidade directa.',
    suggestion:
      'Os dados permitem discutir associação temporal e vulnerabilidade, mas não estabelecer causalidade directa.',
    safeReformulation:
      'Os dados pluviométricos CHIRPS (r = 0,057; p = 0,762) revelam ausência de correlação linear determinística. Observa-se associação temporal em choques extremos, mas não causalidade directa acumulada.',
    severity: 'ALTO',
  },

  // 2. GENERALIZAÇÃO ESPACIAL
  {
    category: 'GENERALIZAÇÃO ESPACIAL',
    name: 'Extrapolação Territorial dos 11 Bairros de Quissico',
    pattern:
      /(?:os\s+produtores\s+de\s+zavala\s+todos|generalize\s+os\s+11\s+bairros|11\s+bairros\s+(?:de\s+quissico\s+)?representam\s+todo\s+o\s+distrito|extrapolamos\s+quissico\s+para\s+todo|quissico\s+define\s+todo\s+o\s+distrito)/i,
    exceptionPattern:
      /(?:circunscrita\s+[aà]\s+microan[aá]lise|22\.343\s+ha|n[aã]o\s+representam\s+todo|posto\s+de\s+quissico\s+apenas)/i,
    alert:
      'Âmbito espacial a rever: a evidência espacial disponível corresponde à microanálise de Quissico (22.343 ha).',
    suggestion:
      'Circunscrever explicitamente as observações geoespaciais e altimétricas ao perímetro de Quissico, salvaguardando a heterogeneidade dos restantes postos.',
    safeReformulation:
      'A análise espacial cartografada (Sentinel-2 e SRTM) refere-se estritamente aos 22.343 hectares do Posto Administrativo de Quissico (11 bairros), constituindo um estudo de caso local que não pode ser extrapolado mecanicamente para todo o distrito.',
    severity: 'ALTO',
  },

  // 3. OBSERVADO VS MODELADO
  {
    category: 'OBSERVADO VS MODELADO',
    name: 'Confusão Entre Período Reconstituído e Observado',
    pattern:
      /(?:em\s+1994\s+foram\s+produzidas(?!\s+conforme\s+a\s+modela[cç][aã]o|\s+no\s+cen[aá]rio\s+modelado)|assume\s+que\s+todos\s+os\s+dados\s+s[aã]o\s+observados|ignore\s+a\s+distin[cç][aã]o\s+entre\s+1994[–-]2016\s+e\s+2017[–-]2024|todos\s+os\s+dados\s+s[aã]o\s+observados|s[eé]rie\s+totalmente\s+observada|dados\s+do\s+sdae\s+em\s+1994)/i,
    exceptionPattern:
      /(?:reconstitu[ií]do|modelado|23\s+anos\s+modelados|apenas\s+a\s+partir\s+de\s+2017|h[ií]brida)/i,
    alert:
      'Estatuto epistemológico a rever: 1994 pertence ao período reconstituído/modelado (1994–2016), não ao conjunto de observações SDAE (2017–2024).',
    suggestion:
      'A assimetria metodológica é incontornável: não se pode equiparar os dados reconstituídos em 3 camadas aos registos primários oficiais.',
    safeReformulation:
      'A série é estruturalmente híbrida: os 23 anos iniciais (1994–2016) são modelados em três camadas determinísticas, e apenas os 8 anos finais (2017–2024) assentam em registos primários oficiais do SDAE.',
    severity: 'ALTO',
  },

  // 4. PERDAS
  {
    category: 'PERDAS',
    name: 'Equiparação de Perdas Contrafactuais a Perdas Físicas',
    pattern:
      /(?:547\.224\s+toneladas\s+foram\s+perdidas(?!\s+no\s+âmbito|\s+estimadas|\s+no\s+cenário)|foram\s+perdidas\s+547\.224\s+toneladas|trate\s+as\s+547\.224\s+toneladas\s+como\s+perdas\s+f[ií]sicas|perdas\s+f[ií]sicas\s+de\s+547\.224|pesagem\s+de\s+547\.224)/i,
    exceptionPattern:
      /(?:contrafactual|estimad|biof[ií]sic|baseline\s+7\s+t\/ha|diferencial)/i,
    alert: 'Formulação epistemologicamente imprecisa.',
    suggestion:
      '547.224 t correspondem a perdas acumuladas estimadas no cenário contrafactual/modelado, não a perdas físicas pesadas.',
    safeReformulation:
      'As 547.224 toneladas representam o volume cumulativo estimado de perdas pelo diferencial contrafactual face à linha de base potencial de 7 t/ha nos 14 anos adversos de 1994–2016, e não medições físicas diretas.',
    severity: 'MÉDIO',
  },

  // 5. DIAGNÓSTICO
  {
    category: 'DIAGNÓSTICO',
    name: 'Confusão Etnografia de Campo vs Diagnóstico Laboratorial',
    pattern:
      /(?:o\s+produtor\s+identificou\s+a\s+doen[cç]a|transforme\s+o\s+relato\s+dos\s+produtores\s+em\s+diagn[oó]stico|produtores\s+diagnosticaram\s+a\s+doen[cç]a|produtores\s+confirmaram\s+o\s+v[ií]rus|diagn[oó]stico\s+laboratorial\s+pelos\s+produtores)/i,
    exceptionPattern:
      /(?:perce[cç][aã]o\s+emp[ií]rica|sintomas\s+visuais|sem\s+confirma[cç][aã]o\s+laboratorial|n[aã]o\s+equivale\s+a\s+diagn[oó]stico\s+laboratorial)/i,
    alert: 'O testemunho de campo não equivale a diagnóstico laboratorial.',
    suggestion:
      'Distinguir com clareza o saber empírico e a percepção dos agricultores em relação a testes fitopatológicos moleculares.',
    safeReformulation:
      'Os 77 inquéritos de campo documentam a percepção empírica e os sintomas visuais relatados pelos camponeses (como o apodrecimento radicular "moché"), sem constituir diagnóstico molecular laboratorial de estirpes virais (CBSD/CMD).',
    severity: 'ALTO',
  },

  // 6. VIOLAÇÃO SSoT
  {
    category: 'VIOLAÇÃO SSoT',
    name: 'Tentativa de Alteração ou Substituição Arbitrária do SSoT',
    pattern:
      /(?:use\s+conhecimento\s+externo\s+para\s+corrigir\s+a\s+disserta[cç][aã]o|substitua\s+os\s+n[uú]meros\s+pelos\s+valores\s+mais\s+plaus[ií]veis|corrija\s+os\s+dados\s+da\s+disserta[cç][aã]o|altere\s+os\s+valores\s+oficiais)/i,
    alert:
      'Violação da Regra Absoluta SSoT: O corpus da dissertação de Yolanda Tamele (src/data/thesisScientificData.ts) é a autoridade máxima inalterável.',
    suggestion:
      'Qualquer auditoria opera SOBRE o corpus existente. Discrepâncias são sinalizadas como "Ponto a verificar no corpus", sendo vedada a correção silenciosa.',
    safeReformulation:
      'A plataforma preserva a integridade estrita do SSoT canónico da dissertação. O conhecimento externo é restrito à contextualização conceitual, sem permissão para substituir os dados oficiais.',
    severity: 'CRÍTICO',
  },
];

/**
 * Motor de Análise de Extrapolações
 */
export function detectExtrapolationRisks(text: string): ExtrapolationDetectionResult {
  if (!text || text.trim().length === 0) {
    return {
      detected: false,
      category: null,
      riskPhrase: '',
      alert: 'Nenhum texto inserido para análise.',
      suggestion: 'Insira uma afirmação ou argumento para auditar a sua segurança epistemológica.',
      safeReformulation: '',
      severity: 'MÉDIO',
    };
  }

  const normalized = text.trim();

  for (const rule of EXTRAPOLATION_RULES) {
    if (rule.pattern.test(normalized)) {
      if (rule.exceptionPattern && rule.exceptionPattern.test(normalized)) {
        continue; // Possui salvaguarda epistemológica válida na frase
      }
      return {
        detected: true,
        category: rule.category,
        riskPhrase: text,
        alert: rule.alert,
        suggestion: rule.suggestion,
        safeReformulation: rule.safeReformulation,
        severity: rule.severity,
      };
    }
  }

  return {
    detected: false,
    category: null,
    riskPhrase: text,
    alert: 'Nenhuma extrapolação ou violação epistemológica detectada.',
    suggestion: 'A formulação apresenta-se compatível com os guardrails científicos da dissertação.',
    safeReformulation: text,
    severity: 'MÉDIO',
  };
}
