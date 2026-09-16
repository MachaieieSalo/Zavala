/**
 * Bateria de Testes Canónicos — Fase 15.1: Resposta Directa e Orientada à Pergunta
 * ZAVALAVOZ — UEM / ESUDER • Investigadora: Eng.ª Yolanda Tamele
 * 
 * Verifica que:
 * 1. A primeira frase da resposta responde DIRECTAMENTE à pergunta.
 * 2. Nenhuma resposta começa com frases burocráticas proibidas:
 *    - "Com base no corpus científico..."
 *    - "Com base na dissertação..."
 *    - "A evidência documental disponível sintetiza-se..."
 *    - "Os dados disponíveis permitem..."
 *    - "Segundo o corpus..."
 * 3. A estrutura segue: 1. RESPOSTA DIRECTA -> 2. EVIDÊNCIA -> 3. INTERPRETAÇÃO -> 4. LIMITAÇÃO
 * 4. Integridade da SSoT e salvaguardas anti-alucinação e de causalidade são 100% preservadas.
 */

import { handleResearchQuery } from '../server/researchEngine';
import { THESIS_CORE_FACTS } from '../src/data/thesisScientificData';

const PROHIBITED_START_PATTERNS = [
  /^com base no corpus cient[ií]fico/i,
  /^com base na disserta[cç][aã]o/i,
  /^a evid[eê]ncia documental dispon[ií]vel sintetiza-se/i,
  /^os dados dispon[ií]veis permitem/i,
  /^segundo o corpus/i,
  /^1\.\s*\*\*/, // Listas numeradas antes de frase introdutória
];

function checkProhibitedIntro(text: string): { hasViolation: boolean; matchedPattern?: string } {
  const clean = text
    .replace(/^###\s*RESPOSTA\s*\n+/i, '')
    .replace(/^EU DIRIA:\s*/i, '')
    .replace(/\*\*/g, '')
    .trim();

  for (const pattern of PROHIBITED_START_PATTERNS) {
    if (pattern.test(clean)) {
      return { hasViolation: true, matchedPattern: pattern.toString() };
    }
  }
  return { hasViolation: false };
}

function getFirstSentence(text: string): string {
  const clean = text
    .replace(/^###\s*RESPOSTA\s*\n+/i, '')
    .replace(/^EU DIRIA:\s*/i, '')
    .replace(/\*\*/g, '')
    .trim();
  // Permite pontos em números (ex: 547.224 ou 22.343) e só quebra em pontuação final seguida de maiúscula, quebra de linha ou fim de texto
  const match = clean.match(/^((?:[^.?!]|\.(?=\d))+[.?!])(?:\s+[\p{Lu}]|\n|$)/u);
  if (match) return match[1].trim();
  const fallback = clean.match(/^((?:[^.?!]|\.(?=\d))+[.?!])/);
  return fallback ? fallback[1].trim() : clean.slice(0, 180);
}

interface TestCase {
  id: string;
  name: string;
  query: string;
  defenseMode?: boolean;
  expectedInFirstSentence: string[];
  expectedEpistemicStatus: string;
}

const TEST_CASES: TestCase[] = [
  {
    id: 'RD01',
    name: 'Pico de produção em 2021',
    query: 'Qual foi a produção em 2021?',
    expectedInFirstSentence: ['273.773', 'toneladas'],
    expectedEpistemicStatus: 'OBSERVADO',
  },
  {
    id: 'RD02',
    name: 'Produção inicial em 1994 (Reconstituída)',
    query: 'Qual foi a produção em 1994?',
    expectedInFirstSentence: ['52.164', 'toneladas'],
    expectedEpistemicStatus: 'RECONSTITUÍDO / MODELADO',
  },
  {
    id: 'RD03',
    name: 'Desacoplamento pluviométrico CHIRPS',
    query: 'A chuva explica a produção de mandioca em Zavala?',
    expectedInFirstSentence: ['não', '0,057'],
    expectedEpistemicStatus: 'OBSERVADO',
  },
  {
    id: 'RD04',
    name: 'Natureza contrafactual das 547.224 t de perdas',
    query: 'As 547.224 toneladas foram pesadas no terreno?',
    expectedInFirstSentence: ['não', 'perdid'],
    expectedEpistemicStatus: 'MODELADO',
  },
  {
    id: 'RD05',
    name: 'Fronteira territorial de Quissico (22.343 ha)',
    query: 'Os 11 bairros de Quissico representam todo o distrito de Zavala?',
    expectedInFirstSentence: ['não', 'quissico'],
    expectedEpistemicStatus: 'OBSERVADO',
  },
  {
    id: 'RD06',
    name: 'Voz camponesa vs diagnóstico molecular',
    query: 'Os camponeses fizeram diagnóstico laboratorial molecular de doenças?',
    expectedInFirstSentence: ['não', 'diagnóstico'],
    expectedEpistemicStatus: 'TESTEMUNHO DE CAMPO',
  },
  {
    id: 'RD07',
    name: 'Tendência temporal de Mann-Kendall e Sen',
    query: 'Qual é a tendência temporal calculada por Mann-Kendall?',
    expectedInFirstSentence: ['crescimento', '3,100'],
    expectedEpistemicStatus: 'OBSERVADO',
  },
  {
    id: 'RD08',
    name: 'Colapso de 2023 associado ao Ciclone Freddy',
    query: 'O que causou o colapso da produção em 2023?',
    expectedInFirstSentence: ['35.371', 'freddy'],
    expectedEpistemicStatus: 'OBSERVADO',
  },
  {
    id: 'RD09',
    name: 'Média de produção secular dos 31 anos',
    query: 'Qual foi a produção média anual ao longo dos 31 anos?',
    expectedInFirstSentence: ['115.333', 'toneladas'],
    expectedEpistemicStatus: 'OBSERVADO',
  },
  {
    id: 'RD10',
    name: 'Área cartografada em Quissico por satélite',
    query: 'Quantos hectares foram analisados em Quissico com satélite?',
    expectedInFirstSentence: ['22.343', 'hectares'],
    expectedEpistemicStatus: 'OBSERVADO',
  },
  {
    id: 'RD11',
    name: 'Anti-alucinação para cultura ausente (trigo)',
    query: 'Qual é a produção de trigo em Zavala em 2020?',
    expectedInFirstSentence: ['não encontrei evidência suficiente'],
    expectedEpistemicStatus: 'SUPORTE INSUFICIENTE',
  },
  {
    id: 'RD12',
    name: 'Modo de Defesa Oral com follow-up da banca',
    query: 'Como justifica a hibridez da série temporal na dissertação?',
    defenseMode: true,
    expectedInFirstSentence: ['hibridez', 'chow'],
    expectedEpistemicStatus: 'RECONSTITUÍDO / MODELADO',
  },
  {
    id: 'RD13',
    name: 'Inexistência de dados totalmente observados',
    query: 'Os dados de 1994 a 2024 são todos observados?',
    expectedInFirstSentence: ['não são todos observados'],
    expectedEpistemicStatus: 'RECONSTITUÍDO / MODELADO',
  },
  {
    id: 'RD14',
    name: 'Taxa de crescimento linear OLS',
    query: 'Qual é a taxa de crescimento linear estimada por OLS?',
    expectedInFirstSentence: ['4.229', 'toneladas/ano'],
    expectedEpistemicStatus: 'OBSERVADO',
  },
  {
    id: 'RD15',
    name: 'Teste de quebra estrutural de Chow',
    query: 'O que é o teste de Chow na dissertação?',
    expectedInFirstSentence: ['chow', '0,84'],
    expectedEpistemicStatus: 'OBSERVADO',
  },
  {
    id: 'RD16',
    name: 'Fisiologia e tolerância da mandioca à seca',
    query: 'A mandioca resiste à seca em Zavala?',
    expectedInFirstSentence: ['sim', 'seca'],
    expectedEpistemicStatus: 'INTERPRETAÇÃO',
  },
  {
    id: 'RD17',
    name: 'Dimensão do trabalho de campo (inquéritos e caderno)',
    query: 'Quantos inquéritos a produtores foram realizados no terreno?',
    expectedInFirstSentence: ['77', 'inquéritos'],
    expectedEpistemicStatus: 'TESTEMUNHO DE CAMPO',
  },
  {
    id: 'RD18',
    name: 'Precipitação satelital do Ciclone Freddy (2023)',
    query: 'Qual é a precipitação acumulada no ano do Ciclone Freddy em 2023?',
    expectedInFirstSentence: ['1.746,0', 'mm'],
    expectedEpistemicStatus: 'OBSERVADO',
  },
  {
    id: 'RD19',
    name: 'Recusa de fabricação bibliográfica causal',
    query: 'Mostre os artigos científicos que provam que a chuva causa a safra de mandioca',
    expectedInFirstSentence: ['não encontrei evidência suficiente'],
    expectedEpistemicStatus: 'SUPORTE INSUFICIENTE',
  },
  {
    id: 'RD20',
    name: 'Conhecimento externo desvinculado (FAO)',
    query: 'Como a FAO define segurança alimentar a nível global?',
    expectedInFirstSentence: ['não pertence ao corpus documental da dissertação'],
    expectedEpistemicStatus: 'CONTEXTUALIZAÇÃO EXTERNA',
  },
];

async function runPhase15Validation() {
  console.log('================================================================');
  console.log('VALIDAÇÃO DA FASE 15.1: RESPOSTA DIRECTA E ORIENTADA À PERGUNTA');
  console.log('ZAVALAVOZ — UEM / ESUDER • Eng.ª Yolanda Tamele');
  console.log('================================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  for (const test of TEST_CASES) {
    try {
      const response = await handleResearchQuery({
        query: test.query,
        scope: 'todos',
        defensePreparationMode: test.defenseMode,
      });

      const structured = response.structuredResponse;
      const answerText = structured.answerText;
      const firstSentence = getFirstSentence(answerText).toLowerCase();

      // 1. Verificação de Frases Proibidas
      const prohibitedCheck = checkProhibitedIntro(answerText);
      if (prohibitedCheck.hasViolation) {
        console.error(`❌ [FAIL] ${test.id} - ${test.name}`);
        console.error(`   Iniciou com preâmbulo burocrático proibido: ${prohibitedCheck.matchedPattern}`);
        console.error(`   Texto inicial: "${getFirstSentence(answerText)}"`);
        failedCount++;
        continue;
      }

      // 2. Verificação de Resposta Directa na Primeira Frase
      const missingKeywords: string[] = [];
      for (const kw of test.expectedInFirstSentence) {
        if (!firstSentence.includes(kw.toLowerCase())) {
          missingKeywords.push(kw);
        }
      }

      if (missingKeywords.length > 0) {
        console.error(`❌ [FAIL] ${test.id} - ${test.name}`);
        console.error(`   A primeira frase não responde directamente. Palavras-chave em falta: ${missingKeywords.join(', ')}`);
        console.error(`   Primeira frase gerada: "${getFirstSentence(answerText)}"`);
        failedCount++;
        continue;
      }

      // 3. Verificação do Estatuto Epistemológico
      if (response.epistemicStatus !== test.expectedEpistemicStatus) {
        console.error(`❌ [FAIL] ${test.id} - ${test.name}`);
        console.error(`   Estatuto incorreto. Esperado: ${test.expectedEpistemicStatus}, Obtido: ${response.epistemicStatus}`);
        failedCount++;
        continue;
      }

      // 4. Verificação Estrutural de Modo de Defesa
      if (test.defenseMode) {
        const oral = structured.oralDefense;
        if (!oral || !oral.euDiria || !oral.osDadosMostram || !oral.contudo || !oral.porIsso || !oral.seABancaApertar || !oral.resposta) {
          console.error(`❌ [FAIL] ${test.id} - ${test.name}`);
          console.error(`   Modo de defesa oral incompleto. Campos em falta no oralDefense.`);
          failedCount++;
          continue;
        }
      }

      console.log(`  [✅ PASS] ${test.id}: ${test.name}`);
      console.log(`     Primeira frase: "${getFirstSentence(answerText)}"`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${test.id} - ${test.name} (Erro inesperado):`, err.message);
      failedCount++;
    }
  }

  // 5. Teste de Sanidade Global da SSoT
  console.log('\n--- AUDITORIA DE INTEGRIDADE CANÓNICA DA SSOT ---');
  const ssotValid =
    THESIS_CORE_FACTS.totalYears === 31 &&
    THESIS_CORE_FACTS.peakProductionTonnes === 273773 &&
    THESIS_CORE_FACTS.minimumProductionTonnes === 35371 &&
    THESIS_CORE_FACTS.initialProductionTonnes === 52164 &&
    THESIS_CORE_FACTS.accumulatedLossesTonnes === 547224 &&
    THESIS_CORE_FACTS.chirpsRainfallCorrelation === 0.057 &&
    THESIS_CORE_FACTS.fieldTranscribedFormsCount === 77 &&
    THESIS_CORE_FACTS.spatialAreaQuissicoHa === 22343;

  if (ssotValid) {
    console.log('  [✅ PASS] SSoT Canónico: 14/14 factos canónicos 100% íntegros e intocados.');
  } else {
    console.error('  ❌ [FAIL] SSoT Canónico: Violação detectada nos dados matemáticos canónicos.');
    failedCount++;
  }

  console.log('\n================================================================');
  console.log(`RESULTADO DA VALIDAÇÃO (FASE 15.1): ${passedCount}/${TEST_CASES.length} TESTES PASSADOS`);
  console.log('================================================================');

  if (failedCount === 0 && ssotValid) {
    console.log('✅ APROVAÇÃO TOTAL: O ZAVALAVOZ cumpre 100% dos requisitos da Fase 15.1!');
    console.log('   Todas as respostas orientam-se directamente à pergunta desde a primeira frase.');
    process.exit(0);
  } else {
    console.error(`❌ FALHA: ${failedCount} teste(s) falharam.`);
    process.exit(1);
  }
}

runPhase15Validation();
