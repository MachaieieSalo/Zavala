/**
 * Validação da Fase 15.2 — Arquitectura Híbrida Real da Pesquisa Científica
 * ZAVALAVOZ — UEM / ESUDER • Yolanda Tamele (1994–2024)
 *
 * Testes A a J:
 * A: Explicação direta da proporção de 15% (sem template genérico de Camada 1)
 * B: Pergunta de verificação dos 11 bairros (Quissico vs Zavala)
 * C: Pergunta de causalidade pluviométrica (CHIRPS r = 0,057; p = 0,762)
 * D: Pergunta sobre 547.224 t (estimativa contrafactual vs pesagem física)
 * E: Pergunta sobre série temporal (hibridez: 23 modelados vs 8 observados)
 * F: Pergunta factual sobre 2021 (273.773 t)
 * G: Pergunta factual sobre 1994 (52.164 t)
 * H: Pergunta fora do corpus (trigo / lacuna documental)
 * I: Pergunta externa (FAO / segurança alimentar)
 * J: Gestão do estado de API e fallback sem créditos (LLM_UNAVAILABLE_NO_CREDITS)
 */

import { handleResearchQuery } from '../server/researchEngine';

interface TestResult {
  code: string;
  title: string;
  passed: boolean;
  details: string;
}

const FORBIDDEN_PREAMBLES = [
  'com base no corpus',
  'com base nos dados',
  'de acordo com o corpus',
  'segundo a dissertação',
  'com base na dissertação',
  'segundo os dados',
  'no âmbito da dissertação',
  'conforme os dados',
  'com base na análise',
];

function startsWithForbiddenPreamble(text: string): boolean {
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return FORBIDDEN_PREAMBLES.some((p) => norm.startsWith(p));
}

function getFirstSentence(text: string): string {
  const clean = text.replace(/###\s*RESPOSTA\s*/i, '').trim();
  const match = clean.match(/^([^\n.]+?[.!?])(?:\s+|$)/);
  if (match) return match[1].trim();
  const firstLine = clean.split('\n')[0];
  return firstLine.trim();
}

async function runPhase15_2Validation() {
  console.log('========================================================================');
  console.log('FASE 15.2 — VALIDAÇÃO DA ARQUITECTURA HÍBRIDA REAL DA PESQUISA');
  console.log('ZAVALAVOZ — LLM + MOTOR CIENTÍFICO DETERMINÍSTICO');
  console.log('========================================================================\n');

  const results: TestResult[] = [];

  // TESTE A: Proporção 15% Inhambane Zavala
  try {
    const qA = 'Explica a parte que aparece proporção 15 por cento Inhambane Zavala';
    const resA = await handleResearchQuery({ query: qA });
    const firstSentenceA = getFirstSentence(resA.structuredResponse.answerText);
    const has15 = firstSentenceA.includes('15%') || firstSentenceA.includes('15 por cento') || firstSentenceA.includes('15');
    const hasCalibOrInhambane = firstSentenceA.toLowerCase().includes('calibra') || firstSentenceA.toLowerCase().includes('inhambane') || firstSentenceA.toLowerCase().includes('participa');
    const notGenericLayerTemplate = !firstSentenceA.startsWith('Camada 1: Âncoras');
    const passedA = has15 && hasCalibOrInhambane && notGenericLayerTemplate && !startsWithForbiddenPreamble(firstSentenceA);

    results.push({
      code: 'TESTE_A',
      title: 'Explicação Directa da Proporção de 15% (Inhambane / Zavala)',
      passed: passedA,
      details: `Primeira frase: "${firstSentenceA.slice(0, 100)}..." | Refere 15%: ${has15} | Não é template genérico: ${notGenericLayerTemplate}`,
    });
  } catch (err: any) {
    results.push({ code: 'TESTE_A', title: 'Explicação Directa da Proporção de 15%', passed: false, details: err.message });
  }

  // TESTE B: 11 Bairros representam todo o distrito
  try {
    const qB = 'Os 11 bairros representam todo o distrito de Zavala?';
    const resB = await handleResearchQuery({ query: qB });
    const firstSentenceB = getFirstSentence(resB.structuredResponse.answerText);
    const startsNo = /^não\b/i.test(firstSentenceB);
    const mentionsQuissico = firstSentenceB.toLowerCase().includes('quissico');
    const passedB = startsNo && mentionsQuissico && !startsWithForbiddenPreamble(firstSentenceB);

    results.push({
      code: 'TESTE_B',
      title: 'Verificação Territorial (11 Bairros vs Distrito Inteiro)',
      passed: passedB,
      details: `Primeira frase: "${firstSentenceB.slice(0, 100)}..." | Começa com Não: ${startsNo} | Cita Quissico: ${mentionsQuissico}`,
    });
  } catch (err: any) {
    results.push({ code: 'TESTE_B', title: 'Verificação Territorial (11 Bairros)', passed: false, details: err.message });
  }

  // TESTE C: Chuva explica a produção
  try {
    const qC = 'A chuva explica a produção de mandioca em Zavala?';
    const resC = await handleResearchQuery({ query: qC });
    const firstSentenceC = getFirstSentence(resC.structuredResponse.answerText);
    const startsNo = /^não\b/i.test(firstSentenceC);
    const mentionsCorrOrZero = firstSentenceC.includes('0,057') || firstSentenceC.toLowerCase().includes('nula') || firstSentenceC.toLowerCase().includes('nao explica');
    const passedC = startsNo && mentionsCorrOrZero && !startsWithForbiddenPreamble(firstSentenceC);

    results.push({
      code: 'TESTE_C',
      title: 'Causalidade Pluviométrica CHIRPS (r = 0,057; p = 0,762)',
      passed: passedC,
      details: `Primeira frase: "${firstSentenceC.slice(0, 100)}..." | Começa com Não: ${startsNo} | Refuta causalidade: ${mentionsCorrOrZero}`,
    });
  } catch (err: any) {
    results.push({ code: 'TESTE_C', title: 'Causalidade Pluviométrica CHIRPS', passed: false, details: err.message });
  }

  // TESTE D: 547.224 toneladas foram pesadas no terreno
  try {
    const qD = 'As 547.224 toneladas foram pesadas no terreno?';
    const resD = await handleResearchQuery({ query: qD });
    const firstSentenceD = getFirstSentence(resD.structuredResponse.answerText);
    const startsNo = /^não\b/i.test(firstSentenceD);
    const mentionsContrafactual = firstSentenceD.toLowerCase().includes('contrafactual') || firstSentenceD.toLowerCase().includes('estimativa');
    const passedD = startsNo && mentionsContrafactual && !startsWithForbiddenPreamble(firstSentenceD);

    results.push({
      code: 'TESTE_D',
      title: 'Natureza Contrafactual das 547.224 t de Perdas',
      passed: passedD,
      details: `Primeira frase: "${firstSentenceD.slice(0, 100)}..." | Começa com Não: ${startsNo} | Cita contrafactual: ${mentionsContrafactual}`,
    });
  } catch (err: any) {
    results.push({ code: 'TESTE_D', title: 'Natureza Contrafactual das 547.224 t', passed: false, details: err.message });
  }

  // TESTE E: Série temporal é toda observada
  try {
    const qE = 'Os dados de 1994 a 2024 são todos observados?';
    const resE = await handleResearchQuery({ query: qE });
    const firstSentenceE = getFirstSentence(resE.structuredResponse.answerText);
    const startsNo = /^não\b/i.test(firstSentenceE);
    const mentionsHibridOr23 = firstSentenceE.toLowerCase().includes('híbrida') || firstSentenceE.toLowerCase().includes('hibrida') || firstSentenceE.includes('23');
    const passedE = startsNo && mentionsHibridOr23 && !startsWithForbiddenPreamble(firstSentenceE);

    results.push({
      code: 'TESTE_E',
      title: 'Hibridez da Série Histórica (23 Modelados vs 8 Observados)',
      passed: passedE,
      details: `Primeira frase: "${firstSentenceE.slice(0, 100)}..." | Começa com Não: ${startsNo} | Identifica hibridez: ${mentionsHibridOr23}`,
    });
  } catch (err: any) {
    results.push({ code: 'TESTE_E', title: 'Hibridez da Série Histórica', passed: false, details: err.message });
  }

  // TESTE F: Produção em 2021 (pico histórico)
  try {
    const qF = 'Qual foi a produção de mandioca em Zavala no ano 2021?';
    const resF = await handleResearchQuery({ query: qF });
    const firstSentenceF = getFirstSentence(resF.structuredResponse.answerText);
    const mentions273 = firstSentenceF.includes('273.773') || firstSentenceF.includes('273773');
    const passedF = mentions273 && !startsWithForbiddenPreamble(firstSentenceF);

    results.push({
      code: 'TESTE_F',
      title: 'Exactidão Factual da Produção de 2021 (273.773 t)',
      passed: passedF,
      details: `Primeira frase: "${firstSentenceF.slice(0, 100)}..." | Valor canónico 273.773 t: ${mentions273}`,
    });
  } catch (err: any) {
    results.push({ code: 'TESTE_F', title: 'Exactidão Factual de 2021', passed: false, details: err.message });
  }

  // TESTE G: Produção em 1994 (ano inicial modelado)
  try {
    const qG = 'Qual foi a produção estimada em 1994?';
    const resG = await handleResearchQuery({ query: qG });
    const firstSentenceG = getFirstSentence(resG.structuredResponse.answerText);
    const mentions52 = firstSentenceG.includes('52.164') || firstSentenceG.includes('52164');
    const passedG = mentions52 && !startsWithForbiddenPreamble(firstSentenceG);

    results.push({
      code: 'TESTE_G',
      title: 'Exactidão Factual da Produção de 1994 (52.164 t)',
      passed: passedG,
      details: `Primeira frase: "${firstSentenceG.slice(0, 100)}..." | Valor canónico 52.164 t: ${mentions52}`,
    });
  } catch (err: any) {
    results.push({ code: 'TESTE_G', title: 'Exactidão Factual de 1994', passed: false, details: err.message });
  }

  // TESTE H: Fora do Corpus (Trigo / Lacuna Documental)
  try {
    const qH = 'Qual é a produção de trigo em Zavala segundo a dissertação?';
    const resH = await handleResearchQuery({ query: qH });
    const firstSentenceH = getFirstSentence(resH.structuredResponse.answerText);
    const mentionsGap = firstSentenceH.toLowerCase().includes('não encontrei evidência suficiente') || firstSentenceH.toLowerCase().includes('suporte insuficiente');
    const passedH = mentionsGap;

    results.push({
      code: 'TESTE_H',
      title: 'Repúdio Rigoroso de Dados Fora do Corpus (Trigo / Lacuna)',
      passed: passedH,
      details: `Primeira frase: "${firstSentenceH.slice(0, 100)}..." | Declara ausência de evidência: ${mentionsGap}`,
    });
  } catch (err: any) {
    results.push({ code: 'TESTE_H', title: 'Dados Fora do Corpus', passed: false, details: err.message });
  }

  // TESTE I: Conhecimento Externo (FAO / Segurança Alimentar)
  try {
    const qI = 'O que é segurança alimentar segundo a FAO?';
    const resI = await handleResearchQuery({ query: qI });
    const fullTextI = resI.answer;
    const hasExternalLabel = fullTextI.includes('Esta informação não pertence ao corpus documental da dissertação') || fullTextI.includes('Contextualização externa');
    const passedI = hasExternalLabel;

    results.push({
      code: 'TESTE_I',
      title: 'Rotulagem de Conhecimento Externo (FAO / Pilares)',
      passed: passedI,
      details: `Rotulado como externo à dissertação: ${hasExternalLabel} | Categoria: ${resI.statusCategory}`,
    });
  } catch (err: any) {
    results.push({ code: 'TESTE_I', title: 'Conhecimento Externo', passed: false, details: err.message });
  }

  // TESTE J: Gestão do Estado do LLM e Fallback Transparente
  try {
    const qJ = 'Explica a taxa de crescimento linear de Newey-West';
    const resJ = await handleResearchQuery({ query: qJ });
    const hasLLMState = !!resJ.llmState;
    const hasNotice = resJ.isFallback ? !!resJ.fallbackNotice : true;
    const has4Sections =
      resJ.answer.includes('### RESPOSTA') &&
      resJ.answer.includes('### EVIDÊNCIA') &&
      resJ.answer.includes('### INTERPRETAÇÃO') &&
      resJ.answer.includes('### LIMITAÇÃO');
    const passedJ = hasLLMState && hasNotice && has4Sections;

    results.push({
      code: 'TESTE_J',
      title: 'Gestão de Estado de API, Fallback Transparente e 4 Níveis Estruturados',
      passed: passedJ,
      details: `LLM State: ${resJ.llmState} | Is Fallback: ${resJ.isFallback} | 4 Secções: ${has4Sections} | Notice presente: ${hasNotice}`,
    });
  } catch (err: any) {
    results.push({ code: 'TESTE_J', title: 'Gestão de Estado de API', passed: false, details: err.message });
  }

  // Resumo
  console.log('\n========================================================================');
  console.log('RESULTADOS DOS TESTES (A a J):');
  console.log('========================================================================');

  let allPassed = true;
  for (const r of results) {
    const icon = r.passed ? '✅' : '❌';
    if (!r.passed) allPassed = false;
    console.log(`${icon} [${r.code}] ${r.title}`);
    console.log(`   └─ Detalhes: ${r.details}\n`);
  }

  const passedCount = results.filter((r) => r.passed).length;
  console.log(`TOTAL: ${passedCount}/${results.length} testes aprovados.`);

  if (allPassed) {
    console.log('\n🎉 TODOS OS TESTES DA FASE 15.2 FORAM BEM-SUCEDIDOS COM SUCESSO TOTAL!');
  } else {
    console.error('\n⚠️ ALGUNS TESTES FALHARAM. VERIFIQUE OS LOGS ACIMA.');
    process.exit(1);
  }
}

runPhase15_2Validation().catch((err) => {
  console.error('Erro fatal na execução da validação:', err);
  process.exit(1);
});
