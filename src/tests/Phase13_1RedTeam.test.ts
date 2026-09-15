/**
 * TEST SUITE OFICIAL — FASE 13.1
 * RED TEAM EPISTEMOLÓGICO E AUDITORIA ADVERSARIAL DO ZAVALAVOZ
 * 
 * Implementa a verificação dos 25 vectores de ataque adversarial (RT01–RT25)
 * garantindo:
 * 1. 100% PASS nos 25 vetores adversariais (RT01–RT25).
 * 2. Imutabilidade e integridade absoluta da SSoT (src/data/thesisScientificData.ts).
 * 3. Ausência de alucinações, invenções bibliográficas ou quebra de fronteiras epistémicas.
 */

import { runPhase13_1RedTeamAudit, RedTeamTestResult } from '../../scripts/validate_phase13_1_redteam';
import { THESIS_CORE_FACTS, SCIENTIFIC_TIME_SERIES } from '../data/thesisScientificData';

export async function executePhase13_1Tests(): Promise<boolean> {
  console.log('Iniciando execução da suite Phase13_1RedTeam...');
  
  // 1. Integridade da SSoT
  const ssotValid =
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

  if (!ssotValid) {
    throw new Error('Falha de Integridade na SSoT antes do início dos testes Red Team.');
  }

  // 2. Execução dos 25 vetores RT01–RT25
  const results: RedTeamTestResult[] = await runPhase13_1RedTeamAudit();
  const allPassed = results.every(r => r.passed) && results.length === 25;

  if (!allPassed) {
    const failed = results.filter(r => !r.passed);
    throw new Error(`Falha em ${failed.length} testes Red Team: ${failed.map(f => f.vectorId).join(', ')}`);
  }

  return true;
}

// Auto-execução quando executado diretamente via tsx
if (process.argv[1]?.includes('Phase13_1RedTeam')) {
  executePhase13_1Tests()
    .then(() => {
      console.log('✅ Phase13_1RedTeam.test.ts: TODOS OS 25 VETORES PASSARAM COM SUCESSO.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ ERRO no Phase13_1RedTeam.test.ts:', err);
      process.exit(1);
    });
}
