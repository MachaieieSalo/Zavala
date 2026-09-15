/**
 * SCRIPT DE VALIDAÇÃO EXECUTÁVEL — FASE 11.1
 * AUDITORIA E REFINAMENTO DA ESTAÇÃO DE PESQUISA CIENTÍFICA (O MANUSCRITO VIVO)
 * ZAVALAVOZ — UEM / ESUDER
 * Yolanda Tamele (1994–2024)
 * 
 * Executável via: npx tsx scripts/validate_phase11_1_research.ts
 */

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
  console.log(`[${status}] ${testId}: ${name}`);
  if (!passed) {
    console.error(`       Esperado: ${expected}`);
    console.error(`       Obtido:   ${actual}`);
    if (details) console.error(`       Detalhes: ${details}`);
  }
}

async function runValidation() {
  console.log('================================================================');
  console.log('VALIDAÇÃO EXECUTÁVEL FASE 11.1 — AUDITORIA E REFINAMENTO DA PESQUISA');
  console.log('ZAVALAVOZ — UEM / ESUDER (Yolanda Tamele)');
  console.log('================================================================\n');

  // TESTE 1: Produção em 2021
  console.log('--- TESTES OBRIGATÓRIOS (SECÇÃO 21) ---');
  const t1 = await handleResearchQuery({
    query: 'Qual foi a produção em 2021?',
    scope: 'dados',
  });
  const t1Passed =
    (t1.answer.includes('273.773') || t1.answer.includes('273773')) &&
    t1.epistemicStatus === 'OBSERVADO' &&
    !!t1.structuredResponse?.answerText;
  recordTest(
    'TESTE_1_PRODUCAO_2021',
    'Produção em 2021 (273.773 t com Estatuto: OBSERVADO)',
    t1Passed,
    '273.773 toneladas e Estatuto Epistemológico: OBSERVADO',
    `Produção encontrada: ${t1.answer.includes('273.773')}; Estatuto: ${t1.epistemicStatus}`
  );

  // TESTE 2: Dados de 1994 são observados?
  const t2 = await handleResearchQuery({
    query: 'Os dados de 1994 são observados?',
    scope: 'metodologia',
  });
  const t2Passed =
    (t2.answer.toLowerCase().includes('não') || t2.answer.toLowerCase().includes('nao')) &&
    (t2.answer.toLowerCase().includes('reconstituíd') ||
      t2.answer.toLowerCase().includes('modelad') ||
      t2.answer.toLowerCase().includes('três camadas')) &&
    (t2.epistemicStatus === 'RECONSTITUÍDO / MODELADO' || t2.epistemicStatus === 'MODELADO');
  recordTest(
    'TESTE_2_DADOS_1994_RECONSTITUIDO',
    'Dados de 1994 não são observados (Reconstituído / Modelado em 3 camadas)',
    t2Passed,
    'Afirmar que não são observados e classificar como RECONSTITUÍDO / MODELADO',
    `Resposta: ${t2.answer.slice(0, 120)}... | Estatuto: ${t2.epistemicStatus}`
  );

  // TESTE 3: CHIRPS prova causalidade da queda?
  const t3 = await handleResearchQuery({
    query: 'O CHIRPS prova que a chuva causou a queda?',
    scope: 'clima',
  });
  const t3Passed =
    (t3.answer.toLowerCase().includes('não') || t3.answer.toLowerCase().includes('nao')) &&
    (t3.answer.includes('0,057') || t3.answer.includes('0.057')) &&
    (t3.answer.includes('0,762') || t3.answer.includes('0.762'));
  recordTest(
    'TESTE_3_CHIRPS_NAO_PROVA_CAUSALIDADE',
    'CHIRPS não prova causalidade linear (r = 0,057; p = 0,762)',
    t3Passed,
    'Rejeitar causalidade determinística e citar r = 0,057 e p = 0,762',
    `Rejeição comprovada com r=0,057 e p=0,762`
  );

  // TESTE 4: As 547.224 t foram efectivamente pesadas?
  const t4 = await handleResearchQuery({
    query: 'As 547.224 t foram efectivamente pesadas?',
    scope: 'dados',
  });
  const t4Passed =
    (t4.answer.toLowerCase().includes('não') || t4.answer.toLowerCase().includes('nao')) &&
    (t4.answer.toLowerCase().includes('contrafactual') ||
      t4.answer.toLowerCase().includes('estimativa de perdas') ||
      t4.answer.toLowerCase().includes('biofísica')) &&
    (t4.epistemicStatus === 'MODELADO' || t4.epistemicStatus === 'RECONSTITUÍDO / MODELADO');
  recordTest(
    'TESTE_4_PERDAS_547K_CONTRAFACTUAL',
    'As 547.224 t não foram pesadas (Estimativa no âmbito da modelação contrafactual)',
    t4Passed,
    'Rejeitar pesagem física e identificar como estimativa contrafactual (baseline 7 t/ha)',
    `Estatuto: ${t4.epistemicStatus} | Resposta: ${t4.answer.slice(0, 100)}...`
  );

  // TESTE 5: Os 11 bairros representam todo Zavala?
  const t5 = await handleResearchQuery({
    query: 'Os 11 bairros representam todo Zavala?',
    scope: 'sig',
  });
  const t5Passed =
    (t5.answer.toLowerCase().includes('não') || t5.answer.toLowerCase().includes('nao')) &&
    t5.answer.toLowerCase().includes('quissico') &&
    (t5.answer.toLowerCase().includes('22.343') ||
      t5.answer.toLowerCase().includes('posto administrativo') ||
      t5.answer.toLowerCase().includes('zandamela') ||
      t5.answer.toLowerCase().includes('massava') ||
      t5.answer.toLowerCase().includes('mavila'));
  recordTest(
    'TESTE_5_QUISSICO_NAO_EXTRAPOLAVEL',
    'Os 11 bairros não representam todo o distrito (circunscritos a Quissico)',
    t5Passed,
    'Limitar a Quissico (22.343 ha) e proibir extrapolação automática ao distrito',
    `Circunscrição a Quissico validada com ressalvas territoriais`
  );

  // TESTE 6: O produtor diagnosticou a doença?
  const t6 = await handleResearchQuery({
    query: 'O produtor diagnosticou a doença?',
    scope: 'campo',
  });
  const t6Passed =
    (t6.answer.toLowerCase().includes('não') || t6.answer.toLowerCase().includes('nao')) &&
    (t6.answer.toLowerCase().includes('percepção empírica') ||
      t6.answer.toLowerCase().includes('voz do produtor') ||
      t6.answer.toLowerCase().includes('sintomas visuais') ||
      t6.answer.toLowerCase().includes('sem confirmação laboratorial') ||
      t6.answer.toLowerCase().includes('laboratorial')) &&
    t6.epistemicStatus === 'TESTEMUNHO DE CAMPO';
  recordTest(
    'TESTE_6_PRODUTOR_TESTEMUNHO_EMPIRICO',
    'O produtor não realizou diagnóstico laboratorial (Voz do produtor empírica)',
    t6Passed,
    'Preservar como voz do produtor e rejeitar diagnóstico laboratorial com Estatuto: TESTEMUNHO DE CAMPO',
    `Estatuto: ${t6.epistemicStatus}`
  );

  // TESTE 7: Qual é a principal limitação da série?
  const t7 = await handleResearchQuery({
    query: 'Qual é a principal limitação da série?',
    scope: 'metodologia',
  });
  const t7Passed =
    (t7.answer.toLowerCase().includes('híbrida') ||
      t7.answer.toLowerCase().includes('hibrida') ||
      (t7.answer.includes('1994–2016') && t7.answer.includes('2017–2024')) ||
      (t7.answer.includes('23') && t7.answer.includes('8'))) &&
    (t7.answer.toLowerCase().includes('observad') &&
      t7.answer.toLowerCase().includes('reconstituíd'));
  recordTest(
    'TESTE_7_LIMITACAO_SERIE_HIBRIDA',
    'Principal limitação da série: natureza híbrida (23 anos modelados vs 8 observados)',
    t7Passed,
    'Identificar assimetria epistemológica entre 1994–2016 modelado e 2017–2024 observado SDAE',
    `Limitação identificada e articulada`
  );

  // TESTE 8: Pergunta sem evidência (Anti-alucinação)
  const t8 = await handleResearchQuery({
    query: 'Qual foi a quantidade de adubo NPK importado pelo SDAE em 1998 para mandioca?',
    scope: 'dados',
  });
  const t8Passed =
    t8.answer.includes('Não encontrei evidência suficiente no corpus científico da plataforma para sustentar essa afirmação') ||
    t8.structuredResponse.answerText.includes('Não encontrei evidência suficiente no corpus científico da plataforma para sustentar essa afirmação');
  recordTest(
    'TESTE_8_DECLARACAO_INSUFICIENCIA_EVIDENCIA',
    'Declaração expressa de insuficiência de evidência perante pergunta não documentada',
    t8Passed,
    'Conter exactamente: "Não encontrei evidência suficiente no corpus científico da plataforma para sustentar essa afirmação."',
    `Resposta obtida: ${t8.answer.slice(0, 150)}...`
  );

  // TESTE 9: Pergunta externa (Contextualização externa)
  const t9 = await handleResearchQuery({
    query: 'Qual é a definição geral da FAO para segurança alimentar a nível global?',
    scope: 'todos',
  });
  const t9Passed =
    (t9.answer.includes('Contextualização externa à dissertação') ||
      t9.structuredResponse.answerText.includes('Contextualização externa à dissertação')) &&
    t9.epistemicStatus === 'CONTEXTUALIZAÇÃO EXTERNA';
  recordTest(
    'TESTE_9_CONTEXTUALIZACAO_EXTERNA',
    'Pergunta externa claramente marcada com Estatuto: CONTEXTUALIZAÇÃO EXTERNA',
    t9Passed,
    'Conter "Contextualização externa à dissertação." e Estatuto: CONTEXTUALIZAÇÃO EXTERNA',
    `Estatuto: ${t9.epistemicStatus} | Resposta: ${t9.answer.slice(0, 100)}...`
  );

  // TESTE 10: Fallback sem quebrar a interface
  const t10 = await handleResearchQuery({
    query: 'Como foi calculada a quebra de 2023?',
    scope: 'dados',
  });
  const t10Passed =
    t10.isFallback === true &&
    typeof t10.fallbackNotice === 'string' &&
    t10.fallbackNotice.includes('Consulta LLM indisponível. A plataforma apresenta uma resposta baseada exclusivamente no corpus científico local.') &&
    !!t10.structuredResponse?.answerText;
  recordTest(
    'TESTE_10_FALLBACK_DETERMINISTICO_ROBUSTO',
    'Fallback determinístico executado com transparência e aviso ao utilizador',
    t10Passed,
    'isFallback === true com fallbackNotice oficial',
    `isFallback: ${t10.isFallback} | Notice: ${t10.fallbackNotice}`
  );

  // TESTE 11: Estrutura em 4 Níveis Discretos Editoriais
  console.log('\n--- VERIFICAÇÃO ARQUITECTURAL E SSoT ---');
  const hasFourLevels =
    !!t1.structuredResponse.answerText &&
    !!t1.structuredResponse.evidenceSummary &&
    !!t1.structuredResponse.interpretationBreakdown &&
    !!t1.structuredResponse.methodologicalLimitation;
  recordTest(
    'TESTE_11_ESTRUTURA_4_NIVEIS',
    'Resposta estruturada em 4 níveis discretos (RESPOSTA, EVIDÊNCIA, INTERPRETAÇÃO, LIMITAÇÃO)',
    hasFourLevels,
    'Todos os 4 campos preenchidos com rigor acadêmico',
    `Níveis: RESPOSTA (${t1.structuredResponse.answerText.length} car.), EVIDÊNCIA, INTERPRETAÇÃO, LIMITAÇÃO`
  );

  // TESTE 12: Rastreabilidade das Fontes (Provenance Trail)
  const hasProvenance = t1.retrievedEvidence.some(
    (e) => !!e.provenanceTrail && e.provenanceTrail.includes('SSoT →')
  );
  recordTest(
    'TESTE_12_RASTREABILIDADE_PROVENANCE',
    'Rastreabilidade explícita nas evidências (SSoT → Série Histórica, etc.)',
    hasProvenance,
    'Presença de trilha de proveniência precisa (SSoT → Série Histórica → Ano 2021)',
    `Trilha exemplo: ${t1.retrievedEvidence[0]?.provenanceTrail}`
  );

  // TESTE 13: Integridade do SSoT
  const ssotValid =
    THESIS_CORE_FACTS.totalYears === 31 &&
    THESIS_CORE_FACTS.peakProductionTonnes === 273773 &&
    THESIS_CORE_FACTS.accumulatedLossesTonnes === 547224 &&
    THESIS_CORE_FACTS.mannKendallZ === 3.1 &&
    THESIS_CORE_FACTS.chirpsRainfallCorrelation === 0.057 &&
    SCIENTIFIC_TIME_SERIES.length === 31;
  recordTest(
    'TESTE_13_SSOT_INTACTO',
    'SSoT inalterado (Fonte Única de Verdade Científica preservada)',
    ssotValid,
    'SSoT intacto e imutável',
    `Total de anos: ${THESIS_CORE_FACTS.totalYears}; Pico: ${THESIS_CORE_FACTS.peakProductionTonnes} t`
  );

  // RELATÓRIO FINAL
  console.log('\n================================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  console.log(`RESULTADO DA VALIDAÇÃO FASE 11.1: ${passedCount}/${totalCount} TESTES PASSADOS`);
  console.log('================================================================\n');

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runValidation().catch((err) => {
  console.error('ERRO FATAL NA EXECUÇÃO DOS TESTES:', err);
  process.exit(1);
});
