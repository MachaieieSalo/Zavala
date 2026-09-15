/**
 * BATERIA OFICIAL DE VALIDAÇÃO EXECUTÁVEL — FASE 13
 * PESQUISA CIENTÍFICA ASSISTIDA POR LLM ("O MANUSCRITO VIVO")
 * ZAVALAVOZ — UEM / ESUDER
 * Yolanda Tamele (1994–2024)
 * 
 * Execução: npx tsx scripts/validate_phase13_research.ts
 * Contém os 18 Testes Canónicos Obrigatórios (Factuais, Metodológicos, Estatísticos, Defesa, Salvaguardas e SSoT).
 */

import { handleResearchQuery, generateRehearsalJuryQuestion } from '../server/researchEngine';
import { THESIS_CORE_FACTS, SCIENTIFIC_TIME_SERIES } from '../src/data/thesisScientificData';
import { retrieveScientificContext } from '../src/utils/researchContextRetriever';

interface ValidationResult {
  testId: string;
  category: 'FACTUAL' | 'METODOLÓGICO' | 'ESTATÍSTICO' | 'CAMPO' | 'DEFESA' | 'SALVAGUARDAS' | 'SSOT';
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

const results: ValidationResult[] = [];

function record(
  testId: string,
  category: ValidationResult['category'],
  name: string,
  passed: boolean,
  expected: string,
  actual: string,
  details?: string
) {
  results.push({ testId, category, name, passed, expected, actual, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${status}] ${testId} [${category}]: ${name}`);
  if (!passed) {
    console.error(`       Esperado: ${expected}`);
    console.error(`       Obtido:   ${actual}`);
    if (details) console.error(`       Detalhes: ${details}`);
  }
}

async function runPhase13Validation() {
  console.log('================================================================');
  console.log('BATERIA DE 18 TESTES OFICIAIS — FASE 13: PESQUISA ASSISTIDA POR LLM');
  console.log('ZAVALAVOZ — UEM / ESUDER • Eng.ª Yolanda Tamele');
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // BLOCO 1: FACTUAL (Testes 1 a 3)
  // --------------------------------------------------------------------------
  console.log('--- BLOCO 1: TESTES FACTUAIS ---');

  // TESTE 1: Produção em 2021 (Pico)
  const t1 = await handleResearchQuery({
    query: 'Qual foi a produção de mandioca no pico de 2021?',
    scope: 'dados',
  });
  const t1Passed =
    (t1.answer.includes('273.773') || t1.answer.includes('273773')) &&
    t1.epistemicStatus === 'OBSERVADO';
  record(
    'TESTE_1_PICO_2021',
    'FACTUAL',
    'Pico histórico de 2021 (273.773 t; Estatuto: OBSERVADO)',
    t1Passed,
    'Conter "273.773" e epistemicStatus: "OBSERVADO"',
    `Status: ${t1.epistemicStatus}; Conteúdo: ${t1.answer.slice(0, 90)}...`
  );

  // TESTE 2: Produção em 1994 (Ano Base Reconstituído)
  const t2 = await handleResearchQuery({
    query: 'Qual foi a produção em 1994?',
    scope: 'dados',
  });
  const t2Passed =
    (t2.answer.includes('52.164') || t2.answer.includes('52164')) &&
    t2.epistemicStatus === 'RECONSTITUÍDO / MODELADO';
  record(
    'TESTE_2_ANO_BASE_1994',
    'FACTUAL',
    'Ano base de 1994 (52.164 t; Estatuto: RECONSTITUÍDO / MODELADO)',
    t2Passed,
    'Conter "52.164" e epistemicStatus: "RECONSTITUÍDO / MODELADO"',
    `Status: ${t2.epistemicStatus}; Conteúdo: ${t2.answer.slice(0, 90)}...`
  );

  // TESTE 3: Ciclone Freddy em 2023
  const t3 = await handleResearchQuery({
    query: 'Qual foi a quebra de produção e o impacto do ciclone Freddy em 2023?',
    scope: 'dados',
  });
  const t3Passed =
    (t3.answer.includes('35.371') || t3.answer.includes('35371')) &&
    (t3.answer.includes('87') || t3.answer.includes('Freddy')) &&
    t3.epistemicStatus === 'OBSERVADO';
  record(
    'TESTE_3_QUEBRA_FREDDY_2023',
    'FACTUAL',
    'Quebra de 2023 pós-Freddy (35.371 t, queda de 87,1%, OBSERVADO)',
    t3Passed,
    'Conter "35.371", referência a Freddy e epistemicStatus: "OBSERVADO"',
    `Status: ${t3.epistemicStatus}; Conteúdo: ${t3.answer.slice(0, 90)}...`
  );

  // --------------------------------------------------------------------------
  // BLOCO 2: METODOLÓGICO (Testes 4 e 5)
  // --------------------------------------------------------------------------
  console.log('\n--- BLOCO 2: TESTES METODOLÓGICOS ---');

  // TESTE 4: Reconstituição em 3 Camadas & Teste de Chow
  const t4 = await handleResearchQuery({
    query: 'Como foi validada a reconstituição da série temporal entre 1994 e 2016?',
    scope: 'metodologia',
  });
  const t4Passed =
    (t4.answer.includes('Chow') || t4.answer.includes('0,84') || t4.answer.includes('3 camadas')) &&
    (t4.answer.includes('1994') && t4.answer.includes('2016'));
  record(
    'TESTE_4_RECONSTITUICAO_3_CAMADAS',
    'METODOLÓGICO',
    'Reconstituição em 3 camadas e teste estrutural de Chow (F=0,84; p=0,443)',
    t4Passed,
    'Mencionar modelo em 3 camadas e validação econométrica de Chow',
    `Conteúdo: ${t4.answer.slice(0, 110)}...`
  );

  // TESTE 5: Distinção Epistemológica 1994–2016 vs 2017–2024
  const t5 = await handleResearchQuery({
    query: 'Qual é a diferença entre os dados de 1994-2016 e 2017-2024?',
    scope: 'metodologia',
  });
  const t5Passed =
    (t5.answer.includes('23') || t5.answer.includes('1994–2016') || t5.answer.includes('1994-2016')) &&
    (t5.answer.includes('8') || t5.answer.includes('2017–2024') || t5.answer.includes('2017-2024')) &&
    (t5.answer.includes('modelado') || t5.answer.includes('reconstituído')) &&
    (t5.answer.includes('observado') || t5.answer.includes('SDAE'));
  record(
    'TESTE_5_DISTINCAO_TEMPORAL_EPISTEMICA',
    'METODOLÓGICO',
    'Distinção temporal explícita: 23 anos modelados vs 8 anos observados',
    t5Passed,
    'Diferenciar claramente 1994–2016 (modelados) de 2017–2024 (observados)',
    `Conteúdo: ${t5.answer.slice(0, 110)}...`
  );

  // --------------------------------------------------------------------------
  // BLOCO 3: ESTATÍSTICO (Testes 6 a 8)
  // --------------------------------------------------------------------------
  console.log('\n--- BLOCO 3: TESTES ESTATÍSTICOS ---');

  // TESTE 6: Tendência Mann-Kendall e Declive de Sen
  const t6 = await handleResearchQuery({
    query: 'Qual é o resultado do teste de Mann-Kendall e a inclinação de Sen para a produção?',
    scope: 'dados',
  });
  const t6Passed =
    (t6.answer.includes('3,1') || t6.answer.includes('3.1')) &&
    (t6.answer.includes('3.738') || t6.answer.includes('3738') || t6.answer.includes('Sen'));
  record(
    'TESTE_6_MANN_KENDALL_SEN',
    'ESTATÍSTICO',
    'Tendência de Mann-Kendall (Z = +3,1) e declive de Sen (+3.738 t/ano)',
    t6Passed,
    'Apresentar Mann-Kendall Z = 3,1 e inclinação de Sen = +3.738 t/ano',
    `Conteúdo: ${t6.answer.slice(0, 110)}...`
  );

  // TESTE 7: Correlação CHIRPS vs Produção (r = 0,057)
  const t7 = await handleResearchQuery({
    query: 'Existe correlação entre a precipitação CHIRPS e a produção de mandioca?',
    scope: 'clima',
  });
  const t7Passed =
    (t7.answer.includes('0,057') || t7.answer.includes('0.057')) &&
    (t7.answer.includes('fraca') || t7.answer.includes('não significativa') || t7.answer.includes('desacoplamento'));
  record(
    'TESTE_7_CORRELACAO_CHIRPS',
    'ESTATÍSTICO',
    'Desacoplamento pluviométrico satelital CHIRPS (r = 0,057; p = 0,76)',
    t7Passed,
    'Citar correlação r = 0,057 e descartar determinismo hídrico univariado',
    `Conteúdo: ${t7.answer.slice(0, 110)}...`
  );

  // TESTE 8: Estimativa Contrafactual de Perdas (547.224 t)
  const t8 = await handleResearchQuery({
    query: 'Qual é a estimativa contrafactual das perdas acumuladas em Zavala?',
    scope: 'dados',
  });
  const t8Passed =
    t8.answer.includes('547.224') || t8.answer.includes('547224');
  record(
    'TESTE_8_PERDAS_CONTRAFACTUAIS',
    'ESTATÍSTICO',
    'Estimativa contrafactual de perdas acumuladas (547.224 t)',
    t8Passed,
    'Conter "547.224 t"',
    `Conteúdo: ${t8.answer.slice(0, 110)}...`
  );

  // --------------------------------------------------------------------------
  // BLOCO 4: CAMPO & SIG (Testes 9 a 11)
  // --------------------------------------------------------------------------
  console.log('\n--- BLOCO 4: TESTES DE CAMPO E SIG ---');

  // TESTE 9: 77 Inquéritos e 11 Bairros de Quissico
  const t9 = await handleResearchQuery({
    query: 'Quantos produtores foram inquiridos no trabalho de campo e onde?',
    scope: 'campo',
  });
  const t9Passed =
    (t9.answer.includes('77') || t9.retrievedEvidence.some((e) => e.snippet.includes('77'))) &&
    (t9.answer.includes('Quissico') || t9.answer.includes('11') || t9.retrievedEvidence.some((e) => e.snippet.includes('Quissico')));
  record(
    'TESTE_9_INQUERITOS_CAMPO',
    'CAMPO',
    'Amostragem de campo: 77 inquéritos a produtores em 11 bairros de Quissico',
    t9Passed,
    'Citar 77 inquéritos e bairros de Quissico',
    `Conteúdo: ${t9.answer.slice(0, 110)}...`
  );

  // TESTE 10: Voz do Produtor vs Diagnóstico Molecular
  const t10 = await handleResearchQuery({
    query: 'Os camponeses relatam podridão radicular por virose no campo?',
    scope: 'campo',
  });
  const t10Passed =
    t10.epistemicStatus === 'TESTEMUNHO DE CAMPO' &&
    (t10.answer.includes('molecular') ||
      t10.answer.includes('laboratorial') ||
      t10.epistemicAlerts.some((a) => a.riskLabel.includes('DIAGNÓSTICO') || a.riskLabel.includes('VIROSE')));
  record(
    'TESTE_10_VOZ_VS_MOLECULAR',
    'CAMPO',
    'Testemunho empírico camponês com ressalva epistemológica de ausência de teste molecular',
    t10Passed,
    'epistemicStatus: TESTEMUNHO DE CAMPO e ressalva de teste laboratorial molecular',
    `Status: ${t10.epistemicStatus}; Alertas: ${t10.epistemicAlerts.length}`
  );

  // TESTE 11: SIG e Sensoriamento Remoto (22.343 ha, Sentinel-2 / Dynamic World)
  const t11 = await handleResearchQuery({
    query: 'Quais os dados de satélite e área total analisada em SIG?',
    scope: 'sig',
  });
  const t11Passed =
    (t11.answer.includes('22.343') || t11.answer.includes('22343') || t11.retrievedEvidence.some((e) => e.snippet.includes('22.343'))) &&
    (t11.answer.includes('Sentinel') || t11.answer.includes('Dynamic World') || t11.retrievedEvidence.some((e) => e.snippet.includes('Sentinel')));
  record(
    'TESTE_11_SIG_SENSOREAMENTO',
    'CAMPO',
    'Base cartográfica e espacial: 22.343 ha, Sentinel-2 / Dynamic World e SRTM',
    t11Passed,
    'Referência a 22.343 ha e Sentinel-2 / Dynamic World',
    `Conteúdo: ${t11.answer.slice(0, 110)}...`
  );

  // --------------------------------------------------------------------------
  // BLOCO 5: PREPARAÇÃO DE DEFESA (Testes 12 e 13)
  // --------------------------------------------------------------------------
  console.log('\n--- BLOCO 5: TESTES DE PREPARAÇÃO DE DEFESA ---');

  // TESTE 12: Modo "Preparar para Defesa" com Estrutura Oral em 4 Partes
  const t12 = await handleResearchQuery({
    query: 'Como defender a fiabilidade da série temporal perante a banca examinadora?',
    scope: 'defesa',
    defensePreparationMode: true,
  });
  const oral = t12.structuredResponse?.oralDefense;
  const t12Passed =
    !!oral &&
    !!oral.euDiria &&
    !!oral.osDadosMostram &&
    !!oral.contudo &&
    !!oral.porIsso;
  record(
    'TESTE_12_MODO_PREPARAR_DEFESA_ORAL',
    'DEFESA',
    'Estruturação oral de sustentação em 4 partes (EU DIRIA / OS DADOS MOSTRAM / CONTUDO / POR ISSO)',
    t12Passed,
    'Campos euDiria, osDadosMostram, contudo e porIsso preenchidos',
    oral
      ? `EU DIRIA: "${oral.euDiria.slice(0, 40)}..." | DADOS: "${oral.osDadosMostram.slice(0, 40)}..."`
      : 'Nenhuma estrutura oral gerada'
  );

  // TESTE 13: "Transformar em Pergunta da Banca" (Rehearsal Question)
  const retrieved13 = retrieveScientificContext('reconstituição 1994-2016 e quebra estrutural', 'defesa');
  const t13Jury = generateRehearsalJuryQuestion('reconstituição 1994-2016', 'defesa', retrieved13);
  const t13Passed =
    t13Jury.classification === 'PERGUNTA GERADA PARA ENSAIO' &&
    !!t13Jury.examinerQuestion &&
    !!t13Jury.defenseAngle &&
    !!t13Jury.supportingEvidence;
  record(
    'TESTE_13_PERGUNTA_BANCA_ENSAIO',
    'DEFESA',
    'Geração de pergunta de ensaio para banca com classificação explícita PERGUNTA GERADA PARA ENSAIO',
    t13Passed,
    'Classificação "PERGUNTA GERADA PARA ENSAIO" e pergunta de examinador plausível',
    `Classificação: "${t13Jury.classification}"; Pergunta: "${t13Jury.examinerQuestion.slice(0, 70)}..."`
  );

  // --------------------------------------------------------------------------
  // BLOCO 6: SALVAGUARDAS EPISTEMOLÓGICAS (Testes 14 a 17)
  // --------------------------------------------------------------------------
  console.log('\n--- BLOCO 6: TESTES DE SALVAGUARDAS EPISTEMOLÓGICAS ---');

  // TESTE 14: Salvaguarda contra Extrapolação Causal Pluviométrica
  const t14 = await handleResearchQuery({
    query: 'A seca provocada pelo El Niño causou diretamente a quebra de produção de mandioca?',
    scope: 'clima',
  });
  const t14Passed =
    t14.epistemicAlerts.some((a) => a.riskLabel.includes('CLIMA') || a.riskLabel.includes('CAUSAL')) ||
    t14.answer.includes('0,057') ||
    t14.answer.includes('desacoplamento');
  record(
    'TESTE_14_SALVAGUARDA_CAUSAL_CLIMA',
    'SALVAGUARDAS',
    'Alerta epistêmico ativo contra atribuição climática direta ou determinismo univariado',
    t14Passed,
    'Alerta epistemológico de causalidade climática ou explicitação de r=0,057',
    `Alertas: ${t14.epistemicAlerts.map((a) => a.riskLabel).join(', ')}`
  );

  // TESTE 15: Conhecimento Externo / Contextualização Externa (Aviso Obrigatório)
  const t15 = await handleResearchQuery({
    query: 'Qual é o padrão da FAO para o consumo diário de mandioca per capita em África?',
    scope: 'todos',
  });
  const t15Passed =
    (t15.epistemicStatus === 'CONTEXTUALIZAÇÃO EXTERNA' || t15.isExternalKnowledgeUsed === true) &&
    (t15.answer.includes('Esta informação não pertence ao corpus documental da dissertação') ||
      t15.structuredResponse?.externalContextNotice?.includes('não pertence') ||
      t15.answer.includes('Contextualização'));
  record(
    'TESTE_15_AVISO_CONTEXTUALIZACAO_EXTERNA',
    'SALVAGUARDAS',
    'Identificação de conhecimento externo e presença de aviso obrigatório de dissociação',
    t15Passed,
    'Estatuto CONTEXTUALIZAÇÃO EXTERNA e aviso documental explícito',
    `Status: ${t15.epistemicStatus}; ExternalUsed: ${t15.isExternalKnowledgeUsed}`
  );

  // TESTE 16: Lacuna Documental / Suporte Insuficiente
  const t16 = await handleResearchQuery({
    query: 'Qual foi a tonelagem exacta de adubo químico NPK aplicado pelos camponeses em 2005?',
    scope: 'dados',
  });
  const t16Passed =
    t16.statusCategory === 'SUPORTE INSUFICIENTE' ||
    t16.answer.includes('Não encontrei evidência suficiente') ||
    t16.answer.includes('lacuna') ||
    t16.answer.includes('ausente');
  record(
    'TESTE_16_LACUNA_DOCUMENTAL',
    'SALVAGUARDAS',
    'Declaração explícita de lacuna documental perante dados ausentes ou sem suporte na dissertação',
    t16Passed,
    'Status "SUPORTE INSUFICIENTE" ou declaração expressa de lacuna factual',
    `Categoria: ${t16.statusCategory}; Resposta: ${t16.answer.slice(0, 90)}...`
  );

  // TESTE 17: Fallback Determinístico sem Erro Fatal
  const t17 = await handleResearchQuery({
    query: 'Qual a evolução histórica do rendimento agrícola?',
    scope: 'dados',
  });
  const t17Passed =
    t17.isFallback === true &&
    typeof t17.fallbackNotice === 'string' &&
    t17.fallbackNotice.includes('Consulta LLM indisponível. A plataforma apresenta uma resposta baseada exclusivamente no corpus científico local.') &&
    !!t17.structuredResponse?.answerText;
  record(
    'TESTE_17_FALLBACK_DETERMINISTICO',
    'SALVAGUARDAS',
    'Execução transparente de fallback científico determinístico com aviso ao utilizador',
    t17Passed,
    'isFallback === true com fallbackNotice oficial da plataforma',
    `isFallback: ${t17.isFallback}; Notice: "${t17.fallbackNotice?.slice(0, 80)}..."`
  );

  // --------------------------------------------------------------------------
  // BLOCO 7: INTEGRIDADE DA SSoT (Teste 18)
  // --------------------------------------------------------------------------
  console.log('\n--- BLOCO 7: INTEGRIDADE DA FONTE ÚNICA DE VERDADE (SSoT) ---');

  // TESTE 18: Imutabilidade Total da SSoT
  const ssotPreserved =
    THESIS_CORE_FACTS.totalYears === 31 &&
    THESIS_CORE_FACTS.observedPeriodYears === 8 &&
    THESIS_CORE_FACTS.modeledPeriodYears === 23 &&
    THESIS_CORE_FACTS.initialProductionTonnes === 52164 &&
    THESIS_CORE_FACTS.peakProductionTonnes === 273773 &&
    THESIS_CORE_FACTS.minimumProductionTonnes === 35371 &&
    THESIS_CORE_FACTS.accumulatedLossesTonnes === 547224 &&
    THESIS_CORE_FACTS.mannKendallZ === 3.1 &&
    THESIS_CORE_FACTS.olsSlopeTonnesYear === 4229 &&
    THESIS_CORE_FACTS.chirpsRainfallCorrelation === 0.057 &&
    THESIS_CORE_FACTS.fieldTranscribedFormsCount === 77 &&
    THESIS_CORE_FACTS.spatialBairrosCount === 11 &&
    THESIS_CORE_FACTS.spatialAreaQuissicoHa === 22343 &&
    SCIENTIFIC_TIME_SERIES.length === 31;

  record(
    'TESTE_18_SSOT_INTEGRIDADE_ABSOLUTA',
    'SSOT',
    'Imutabilidade absoluta da SSoT: 31 anos, 273.773 t pico, 547.224 t perdas, r=0,057, 77 inquéritos',
    ssotPreserved,
    'Todos os 14 indicadores-chave da SSoT permanecem estritamente inalterados',
    ssotPreserved ? 'SSoT 100% íntegra e imutável' : 'Inconsistência detectada na SSoT'
  );

  // --------------------------------------------------------------------------
  // RESUMO FINAL EXECUTIVO
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  console.log(`RESULTADO FINAL DA BATERIA DA FASE 13: ${passedCount}/${totalCount} TESTES PASSADOS`);
  console.log('================================================================\n');

  if (passedCount !== totalCount) {
    console.error(`❌ FALHA: ${totalCount - passedCount} teste(s) não passaram.`);
    process.exit(1);
  } else {
    console.log('✅ SUCESSO: Todos os 18 testes canónicos da Fase 13 foram aprovados!');
  }
}

runPhase13Validation().catch((err) => {
  console.error('ERRO FATAL NA EXECUÇÃO DA VALIDAÇÃO:', err);
  process.exit(1);
});
