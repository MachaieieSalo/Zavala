// Test Suite for Phase 6: Caderno Digital de Evidência de Campo
// Validates data integrity, epistemological layers, and search indexing.

import { FIELD_INTERVIEWS } from '../src/data/fieldInterviews';
import { CROSS_EVIDENCE_ITEMS } from '../src/data/fieldCrossEvidence';
import { buildSearchIndex } from '../src/utils/searchEngine';
import { REAL_FIELD_PHOTOS } from '../src/data/fieldPhotos';

function runTests() {
  console.log('=== INICIANDO TESTES DA FASE 6: CADERNO DIGITAL DE EVIDÊNCIA DE CAMPO ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`✅ [PASS] ${msg}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${msg}`);
      failed++;
    }
  }

  // 1. DATASET DE INQUÉRITOS (51 PÁGINAS / 77 REGISTOS)
  console.log('--- TESTE 1: Integridade dos Inquéritos de Campo (51 Páginas) ---');
  assert(FIELD_INTERVIEWS.length === 77, `Total de registos de inquérito é 77 (obtido: ${FIELD_INTERVIEWS.length})`);

  const uniquePages = new Set(FIELD_INTERVIEWS.map((i) => i.pageNumber));
  assert(uniquePages.size === 51, `Abrangência de todas as 51 páginas físicas (obtido: ${uniquePages.size})`);

  const leaders = FIELD_INTERVIEWS.filter((i) => i.isLeaderQuestionnaire);
  assert(leaders.length >= 4, `Mínimo de 4 líderes comunitários identificados (obtido: ${leaders.length})`);

  const withAnomalies = FIELD_INTERVIEWS.filter((i) => i.notesOrAnomalies && i.notesOrAnomalies.length > 0);
  assert(withAnomalies.length >= 8, `Sinalizações de integridade e anomalias documentais preservadas (obtido: ${withAnomalies.length})`);

  const femaleProducers = FIELD_INTERVIEWS.filter((i) => {
    const r = i.role.toLowerCase();
    return r.includes('produtora') || r.includes('agricultora') || r.includes('camponesa');
  });
  assert(femaleProducers.length >= 35, `Presença expressiva de produtoras mulheres (obtido: ${femaleProducers.length})`);

  // 2. MATRIZ DE EVIDÊNCIA CRUZADA (TRIANGULAÇÃO METODOLÓGICA)
  console.log('\n--- TESTE 2: Matriz de Evidência Cruzada e 4 Camadas Epistemológicas ---');
  assert(CROSS_EVIDENCE_ITEMS.length === 7, `Total de 7 nós de triangulação metodológica (obtido: ${CROSS_EVIDENCE_ITEMS.length})`);

  CROSS_EVIDENCE_ITEMS.forEach((node) => {
    assert(
      node.relationshipType === 'Relação confirmada' || node.relationshipType === 'Relação temática sugerida',
      `Nó '${node.title}' possui distinção rigorosa de relação (${node.relationshipType})`
    );
    assert(
      node.participantVoiceExcerpt.length > 10,
      `Nó '${node.title}' tem camada 1 (Voz do Participante)`
    );
    assert(
      node.fieldObservationExcerpt.length > 10,
      `Nó '${node.title}' tem camada 2 (Observação de Campo)`
    );
    assert(
      node.analyticalInterpretation.length > 10,
      `Nó '${node.title}' tem camada 3 (Interpretação Analítica)`
    );
    assert(
      node.dissertationReference.length > 5,
      `Nó '${node.title}' tem camada 4 (Referência na Dissertação: ${node.dissertationReference})`
    );
    assert(
      node.relatedPhotoIds.length > 0,
      `Nó '${node.title}' referencia fotos reais (${node.relatedPhotoIds.join(', ')})`
    );
    assert(
      node.relatedInterviewIds.length > 0,
      `Nó '${node.title}' referencia inquéritos de campo (${node.relatedInterviewIds.join(', ')})`
    );
  });

  // 3. INDEXAÇÃO NO MOTOR DE BUSCA GLOBAL
  console.log('\n--- TESTE 3: Indexação no Motor de Busca Global ---');
  const index = buildSearchIndex();
  assert(index.length > 150, `Índice de busca contém mais de 150 itens (obtido: ${index.length})`);

  const indexedInterviews = index.filter((item) => item.categoryLabel.includes('Inquéritos'));
  assert(indexedInterviews.length === 77, `Todos os 77 inquéritos foram indexados no motor de busca (obtido: ${indexedInterviews.length})`);

  const indexedCross = index.filter((item) => item.categoryLabel.includes('Evidência Cruzada'));
  assert(indexedCross.length === 7, `Todos os 7 nós de triangulação foram indexados no motor de busca (obtido: ${indexedCross.length})`);

  // 4. REGISTOS FOTOGRÁFICOS REAIS (APÊNDICE D)
  console.log('\n--- TESTE 4: Registos Fotográficos Reais (Apêndice D) ---');
  assert(REAL_FIELD_PHOTOS.length === 10, `Existem 10 registos fotográficos reais no catálogo (obtido: ${REAL_FIELD_PHOTOS.length})`);

  console.log(`\n========================================`);
  console.log(`RESULTADO DOS TESTES: ${passed} PASSOU, ${failed} FALHOU`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
