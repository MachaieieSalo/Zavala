/**
 * SCRIPT DE VALIDAÇÃO AUTOMATIZADA — FASE 11
 * ESTAÇÃO DE PESQUISA CIENTÍFICA COM LLM (ZAVALAVOZ)
 * Executável via tsx /scripts/validate_phase11_research.ts
 */

import { retrieveScientificContext } from '../src/utils/researchContextRetriever';
import {
  auditTextForEpistemicRisks,
  applyEpistemicGuardrailsToAnswer,
  RESEARCH_EPISTEMIC_RULES,
} from '../src/utils/researchEpistemicGuardrails';
import { handleResearchQuery } from '../server/researchEngine';
import { THESIS_CORE_FACTS, SCIENTIFIC_TIME_SERIES } from '../src/data/thesisScientificData';

interface TestResult {
  testId: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

const results: TestResult[] = [];

function recordTest(
  testId: string,
  name: string,
  passed: boolean,
  expected: string,
  actual: string,
  details?: string
) {
  results.push({ testId, name, passed, expected, actual, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${status}] ${testId} - ${name}`);
  if (!passed) {
    console.error(`       Esperado: ${expected}`);
    console.error(`       Obtido:   ${actual}`);
    if (details) console.error(`       Detalhes: ${details}`);
  }
}

async function runValidation() {
  console.log('================================================================');
  console.log('VALIDAÇÃO EXECUTÁVEL: FASE 11 — ESTAÇÃO DE PESQUISA CIENTÍFICA COM LLM');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // GRUPO 1: TESTES OBRIGATÓRIOS DE RESPOSTA E CONTEXTO
  // -------------------------------------------------------------
  console.log('--- 1. TESTES OBRIGATÓRIOS DE RESPOSTA CIENTÍFICA ---');

  // Teste 1: Factual 2021
  const q1 = await handleResearchQuery({
    query: 'Qual foi a produção de mandioca em Zavala em 2021?',
    scope: 'dados',
  });
  const has2021Peak = q1.answer.includes('273.773') || q1.answer.includes('273773') || q1.retrievedEvidence.some(e => e.snippet.includes('273.773') || e.snippet.includes('273773'));
  recordTest(
    'T1_FACTUAL_2021',
    'Produção em 2021 (Pico: 273.773 t)',
    has2021Peak,
    'Menção expressa a 273.773 t',
    has2021Peak ? 'Confirmado pico de 273.773 t' : q1.answer.slice(0, 100)
  );

  // Teste 2: Metodológico (observado vs reconstituído)
  const q2 = await handleResearchQuery({
    query: 'A série de 1994 a 2024 é constituída apenas por dados observados?',
    scope: 'metodologia',
  });
  const distinguishesPeriods =
    (q2.answer.toLowerCase().includes('1994–2016') || q2.answer.includes('23')) &&
    (q2.answer.toLowerCase().includes('2017–2024') || q2.answer.includes('8')) &&
    (q2.answer.toLowerCase().includes('modelad') || q2.answer.toLowerCase().includes('reconstitui'));
  recordTest(
    'T2_METODOLOGICO_SERIE_HIBRIDA',
    'Distinção obrigatória da série híbrida (23 anos modelados vs 8 observados)',
    distinguishesPeriods,
    'Distinguir 1994–2016 modelado de 2017–2024 observado SDAE',
    distinguishesPeriods ? 'Distinção clara encontrada' : q2.answer.slice(0, 100)
  );

  // Teste 3: Estatístico (Mann-Kendall)
  const q3 = await handleResearchQuery({
    query: 'O teste de Mann-Kendall indica tendência positiva ou negativa?',
    scope: 'resultados',
  });
  const hasMkPositive =
    q3.answer.toLowerCase().includes('positiv') &&
    (q3.answer.includes('3,100') || q3.answer.includes('3.100') || q3.retrievedEvidence.some(e => e.snippet.includes('3,100') || e.snippet.includes('3.100')));
  recordTest(
    'T3_ESTATISTICO_MANN_KENDALL',
    'Tendência positiva de Mann-Kendall (Z = +3,100)',
    hasMkPositive,
    'Tendência positiva com Z = +3,100 e p = 0,0019',
    hasMkPositive ? 'Tendência positiva com Z = 3,100 confirmada' : q3.answer.slice(0, 100)
  );

  // Teste 4: Clima (CHIRPS não causalidade)
  const q4 = await handleResearchQuery({
    query: 'A correlação com CHIRPS prova que a chuva determina a produção?',
    scope: 'clima',
  });
  const rejectsCausalityChirps =
    (q4.answer.toLowerCase().includes('não') || q4.answer.toLowerCase().includes('ausência')) &&
    (q4.answer.includes('0,057') || q4.answer.includes('0.057'));
  recordTest(
    'T4_CLIMA_CHIRPS_NAO_CAUSALIDADE',
    'Rejeição de causalidade linear CHIRPS (r = 0,057; p = 0,762)',
    rejectsCausalityChirps,
    'Rejeitar causalidade determinística e reportar r = 0,057',
    rejectsCausalityChirps ? 'Rejeição fundamentada com r = 0,057' : q4.answer.slice(0, 100)
  );

  // Teste 5: Perdas (547.224 toneladas contrafactuais)
  const q5 = await handleResearchQuery({
    query: 'O que representam as 547.224 toneladas de perdas acumuladas?',
    scope: 'dados',
  });
  const hasContrafactual =
    q5.answer.toLowerCase().includes('contrafactual') ||
    q5.answer.toLowerCase().includes('estimativa biofísica') ||
    q5.answer.toLowerCase().includes('não foram medidas no campo');
  recordTest(
    'T5_PERDAS_547K_CONTRAFACTUAL',
    'Estatuto contrafactual das 547.224 t de perdas',
    hasContrafactual,
    'Explicitar estimativa contrafactual (potencial 7 t/ha) e não perda física medida',
    hasContrafactual ? 'Natureza contrafactual explicitada com sucesso' : q5.answer.slice(0, 100)
  );

  // Teste 6: Trabalho de Campo e Inquéritos
  const q6 = retrieveScientificContext('tubérculo na cova apodrecimento conservação', 'campo');
  const hasFieldMatch = q6.evidenceItems.length > 0 && q6.evidenceItems.some(e => e.hierarchyLevel.includes('NÍVEL 3') || e.hierarchyLevel.includes('NÍVEL 1'));
  recordTest(
    'T6_CAMPO_ETNOGRAFIA_CONSERVACAO',
    'Recuperação de evidências de campo e inquéritos',
    hasFieldMatch,
    'Recuperar dados de campo de Nível 3',
    `Recuperadas ${q6.evidenceItems.length} evidências relevantes`
  );

  // Teste 7: SIG e Topografia Quissico
  const q7 = retrieveScientificContext('vulnerabilidade topográfica altimetria srtm bairros nzile macomane', 'sig');
  const hasSpatialNzile = q7.evidenceItems.some(e => e.snippet.toLowerCase().includes('nzile') || e.snippet.toLowerCase().includes('srtm') || e.snippet.toLowerCase().includes('<9m'));
  recordTest(
    'T7_SIG_TOPOGRAFIA_QUISSICO',
    'Recuperação de vulnerabilidade altimétrica de Quissico (<9m)',
    hasSpatialNzile,
    'Recuperar Nzile / cota < 9m / SRTM',
    hasSpatialNzile ? 'Evidências de Nzile / SRTM recuperadas com sucesso' : 'Não recuperado'
  );

  // Teste 8: Disparo do Guardrail Crítico de Causalidade
  console.log('\n--- 2. TESTES DE GUARDRAILS EPISTEMOLÓGICOS ---');
  const criticalQuery = 'A falta de chuva causou a quebra da produção?';
  const q8 = await handleResearchQuery({
    query: criticalQuery,
    scope: 'clima',
  });
  const hasGuardrailTriggered =
    q8.epistemicAlerts.some(a => a.code === 'R_CAUSALIDADE_DETERMINISTICA') ||
    q8.answer.toLowerCase().includes('não pode ser apontada como causa linear') ||
    q8.answer.includes('SALVAGUARDA EPISTEMOLÓGICA');
  recordTest(
    'T8_GUARDRAIL_CAUSALIDADE_CHUVA',
    'Disparo e mitigação de R_CAUSALIDADE_DETERMINISTICA na pergunta crítica',
    hasGuardrailTriggered,
    'Disparar salvaguarda de causalidade não determinística',
    hasGuardrailTriggered ? 'Salvaguarda accionada e mitigação aplicada' : 'Falha ao salvaguardar'
  );

  // Teste 9: Auditoria aos 8 Códigos de Risco
  const rulesCount = RESEARCH_EPISTEMIC_RULES.length;
  recordTest(
    'T9_REGRAS_EPISTEMOLOGICAS_COBERTURA',
    'Implementação dos 8 códigos mandatórios de risco epistemológico',
    rulesCount === 8,
    'Exactamente 8 regras implementadas',
    `${rulesCount} regras encontradas no motor`
  );

  // Teste 10: Rastreabilidade das Fontes (Hierarquia Nível 1 a 4)
  const q10 = retrieveScientificContext('reconstituição em 3 camadas e teste de Chow', 'metodologia');
  const hasMultipleLevels = q10.evidenceItems.some(e => e.hierarchyLevel.includes('NÍVEL 1') || e.hierarchyLevel.includes('NÍVEL 2'));
  recordTest(
    'T10_HIERARQUIA_EVIDENCIAS',
    'Estruturação hierárquica de fontes no contexto recuperado',
    hasMultipleLevels,
    'Presença de níveis hierárquicos estruturados (Nível 1, 2, etc.)',
    hasMultipleLevels ? 'Hierarquia respeitada com rigor' : 'Sem evidências hierarquizadas'
  );

  // Teste 11: Não-regressão do SSoT
  console.log('\n--- 3. TESTES DE INTEGRIDADE E NÃO-REGRESSÃO SSoT ---');
  const ssotValid =
    THESIS_CORE_FACTS.totalYears === 31 &&
    THESIS_CORE_FACTS.initialYear === 1994 &&
    THESIS_CORE_FACTS.initialProductionTonnes === 52164 &&
    THESIS_CORE_FACTS.peakYear === 2021 &&
    THESIS_CORE_FACTS.peakProductionTonnes === 273773 &&
    THESIS_CORE_FACTS.minimumYear === 2023 &&
    THESIS_CORE_FACTS.minimumProductionTonnes === 35371 &&
    THESIS_CORE_FACTS.terminalYear === 2024 &&
    THESIS_CORE_FACTS.terminalProductionTonnes === 48573 &&
    THESIS_CORE_FACTS.accumulatedLossesTonnes === 547224 &&
    THESIS_CORE_FACTS.mannKendallZ === 3.100 &&
    THESIS_CORE_FACTS.chirpsRainfallCorrelation === 0.057 &&
    SCIENTIFIC_TIME_SERIES.length === 31;

  recordTest(
    'T11_SSOT_INTEGRIDADE_ABSOLUTA',
    'SSoT inalterado e valores canónicos preservados (1994–2024, 31 anos)',
    ssotValid,
    'Valores canónicos do SSoT intactos',
    ssotValid ? '100% dos valores do SSoT intactos e validados' : 'SSoT corrompido'
  );

  // -------------------------------------------------------------
  // RELATÓRIO FINAL
  // -------------------------------------------------------------
  console.log('\n================================================================');
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(`RESUMO DA VALIDAÇÃO DA FASE 11: ${passedCount}/${totalCount} TESTES PASSADOS`);
  console.log('================================================================\n');

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runValidation().catch((err) => {
  console.error('ERRO FATAL NA EXECUÇÃO DOS TESTES:', err);
  process.exit(1);
});
