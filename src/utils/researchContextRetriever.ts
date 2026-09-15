/**
 * Motor de Recuperação Selectiva de Contexto Científico
 * ZAVALAVOZ — UEM / ESUDER
 * Hierarquia Nível 1 a Nível 5 com Rastreabilidade de Origem e Estatuto Epistemológico
 */

import {
  RetrievedEvidenceItem,
  ResearchScope,
  ResponseStatusCategory,
  EpistemicStatus,
} from '../types/research';
import {
  SCIENTIFIC_TIME_SERIES,
  SCIENTIFIC_TREND_STATISTICS,
  CHIRPS_CORRELATION_ANALYSIS,
  QUISSICO_BAIRROS_SPATIAL,
  THESIS_CORE_FACTS,
  SCIENTIFIC_LIMITATIONS,
  DATA_SOURCES_REGISTRY,
} from '../data/thesisScientificData';
import {
  DISSERTATION_METADATA,
  DISSERTATION_FULL_QUESTIONS,
} from '../data/dissertationText';
import {
  THESIS_CLIMATE_SHOCKS,
  THESIS_METHODOLOGY_LAYERS,
} from '../data/thesisModelData';
import { FIELD_INTERVIEWS } from '../data/fieldInterviews';
import { REAL_FIELD_PHOTOS } from '../data/fieldPhotos';
import { ADVERSARIAL_VULNERABILITIES } from '../data/adversarialVulnerabilities';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export interface RetrievalResult {
  evidenceItems: RetrievedEvidenceItem[];
  formattedContextForLLM: string;
  hasDirectMatch: boolean;
  statusCategory: ResponseStatusCategory;
  primaryEpistemicStatus: EpistemicStatus;
  isExternalKnowledgeNeeded: boolean;
  isInsufficientEvidence: boolean;
  detectedYear?: number;
}

export function retrieveScientificContext(
  query: string,
  scope: ResearchScope = 'todos'
): RetrievalResult {
  const normQuery = normalize(query);
  const words = normQuery.split(/[^a-z0-9_]+/).filter((w) => w.length >= 3);

  const matchedEvidences: { item: RetrievedEvidenceItem; score: number }[] = [];
  let matchedYearNum: number | undefined = undefined;

  // Helper de cálculo de relevância
  const calculateScore = (searchableText: string, boost = 1): number => {
    const norm = normalize(searchableText);
    let score = 0;
    if (norm.includes(normQuery)) score += 20 * boost;
    for (const w of words) {
      if (norm.includes(w)) {
        score += (w.length > 5 ? 4 : 2) * boost;
      }
    }
    return score;
  };

  // -------------------------------------------------------------
  // NÍVEL 1: SSoT CIENTÍFICO (thesisScientificData.ts)
  // -------------------------------------------------------------
  if (['todos', 'dados', 'clima', 'resultados', 'metodologia'].includes(scope)) {
    // 1.1 Estatísticas de Tendência
    SCIENTIFIC_TREND_STATISTICS.forEach((stat) => {
      const text = `${stat.name} ${stat.value} ${stat.metric} ${stat.methodology} ${stat.interpretation} ${stat.dissertationRef}`;
      const score = calculateScore(text, 2.5);
      if (score > 3) {
        matchedEvidences.push({
          score,
          item: {
            id: `ssot_stat_${stat.id}`,
            hierarchyLevel: 'NÍVEL 1: SSoT Científico',
            section: 'Estatística e Tendência (Capítulo 4)',
            variable: stat.name,
            tableOrFigure: stat.dissertationRef,
            component: 'Parâmetro Econométrico Oficial',
            source: 'SSoT • thesisScientificData.ts',
            internalReference: `Dados Estatísticos · ${stat.name} (${stat.value})`,
            provenanceTrail: `SSoT → Séries Estatísticas → Tendência (${stat.name})`,
            epistemicStatus: 'MODELADO',
            contextActionLabel: 'Ver série histórica',
            snippet: `${stat.name}: ${stat.value} (${stat.metric}). Metodologia: ${stat.methodology}. Interpretação: ${stat.interpretation}. Ref: ${stat.dissertationRef}.`,
            targetTab: 'dados',
            targetParam: 'tendencia',
          },
        });
      }
    });

    // 1.2 Análise Pluviométrica CHIRPS
    const chirpsText = `chirps correlacao precipitacao r=0.057 p=0.762 r2=0.003 ${CHIRPS_CORRELATION_ANALYSIS.scientificCaveat}`;
    const chirpsScore = calculateScore(chirpsText, 3.0);
    if (chirpsScore > 4 || normQuery.includes('chirps') || normQuery.includes('correlacao') || normQuery.includes('chuva') || normQuery.includes('precipitacao')) {
      matchedEvidences.push({
        score: chirpsScore + 15,
        item: {
          id: 'ssot_chirps_correlation',
          hierarchyLevel: 'NÍVEL 1: SSoT Científico',
          section: 'Clima e Pluviometria (Secção 4.2)',
          variable: 'Correlação de Pearson (Precipitação CHIRPS vs Produção)',
          tableOrFigure: 'Tabela 4.3 & Figura 4.4',
          component: 'Correlação Linear CHIRPS v2.0',
          source: 'SSoT • CHIRPS_CORRELATION_ANALYSIS',
          internalReference: 'Estação de Dados · Registo CHIRPS (r = 0,057; p = 0,762)',
          provenanceTrail: 'SSoT → Análise Pluviométrica → CHIRPS v2.0 (1994–2024)',
          epistemicStatus: 'OBSERVADO',
          contextActionLabel: 'Ver análise CHIRPS',
          snippet: `r = ${CHIRPS_CORRELATION_ANALYSIS.pearsonR}; p = ${CHIRPS_CORRELATION_ANALYSIS.pValue}. ${CHIRPS_CORRELATION_ANALYSIS.scientificCaveat} Paradoxo 2023: ${CHIRPS_CORRELATION_ANALYSIS.keyParadox.agronomicMechanism}.`,
          targetTab: 'dados',
          targetParam: 'clima',
        },
      });
    }

    // 1.3 Série Temporal (Anos específicos ou choques)
    const yearMatches = query.match(/\b(199\d|20[0-2]\d)\b/g);
    if (yearMatches && yearMatches.length > 0) {
      yearMatches.forEach((yStr) => {
        const yearNum = parseInt(yStr, 10);
        const point = SCIENTIFIC_TIME_SERIES.find((p) => p.year === yearNum);
        if (point) {
          matchedYearNum = point.year;
          const isObservedYear = point.year >= 2017;
          matchedEvidences.push({
            score: 30,
            item: {
              id: `ssot_year_${point.year}`,
              hierarchyLevel: 'NÍVEL 1: SSoT Científico',
              section: `Série Histórica Anual (${point.year})`,
              variable: 'Produção e Condições Agroclimáticas',
              year: point.year,
              tableOrFigure: 'Tabela 4.1 da Dissertação',
              component: `Registo de Safra (${point.status})`,
              source: `SSoT • ${point.statusLabel}`,
              internalReference: `Estação de Dados · Ano ${point.year}`,
              provenanceTrail: `SSoT → Série Histórica → Ano ${point.year} (${isObservedYear ? 'Observado SDAE' : 'Modelado 3 Camadas'})`,
              epistemicStatus: isObservedYear ? 'OBSERVADO' : 'RECONSTITUÍDO / MODELADO',
              contextActionLabel: 'Ver série histórica',
              snippet: `Ano ${point.year}: Produção ${point.productionTonnes.toLocaleString('pt-MZ')} t; Área ${point.areaHa.toLocaleString('pt-MZ')} ha; Rendimento ${point.effectiveYieldTonnesHa} t/ha; Chuva CHIRPS ${point.chirpsRainfallMm} mm (anomalia ${point.chirpsAnomalyPercent}%); Choque/Evento: ${point.eventOrShock || 'Normal'}. Estatuto: ${point.statusLabel}. Nota: ${point.methodologicalNote}.`,
              targetTab: 'dados',
              targetParam: point.year,
            },
          });
        }
      });
    }

    // Perdas Acumuladas 547.224 t
    if (normQuery.includes('547') || normQuery.includes('perda') || normQuery.includes('acumulad') || normQuery.includes('contrafactual')) {
      matchedEvidences.push({
        score: 35,
        item: {
          id: 'ssot_accumulated_losses',
          hierarchyLevel: 'NÍVEL 1: SSoT Científico',
          section: 'Balanço de Perdas Biofísicas (Secção 4.3)',
          variable: 'Perdas Biofísicas Acumuladas (1994–2016)',
          tableOrFigure: 'Tabela 4.4 da Dissertação',
          component: 'Estimativa Contrafactual em 3 Camadas',
          source: 'SSoT • THESIS_CORE_FACTS',
          internalReference: 'Estação de Dados · 547.224 t Perdas Acumuladas',
          provenanceTrail: 'SSoT → Modelo de Perdas → 14 Safras Adversas (547.224 t)',
          epistemicStatus: 'MODELADO',
          contextActionLabel: 'Ver balanço de perdas',
          snippet: `547.224 toneladas acumuladas ao longo de 14 safras adversas (1994–2016). Trata-se de uma estimativa biofísica contrafactual (baseline potencial de 7 t/ha vs produção modelada), e não de pesagem física documental directa em armazém ou no campo.`,
          targetTab: 'dados',
          targetParam: 'perdas',
        },
      });
    }

    // Análise Espacial Quissico
    if (
      ['todos', 'sig', 'dados', 'campo'].includes(scope) ||
      normQuery.includes('quissico') ||
      normQuery.includes('bairro') ||
      normQuery.includes('srtm') ||
      normQuery.includes('nzile') ||
      normQuery.includes('macomane') ||
      normQuery.includes('espacial') ||
      normQuery.includes('topografic')
    ) {
      QUISSICO_BAIRROS_SPATIAL.slice(0, 4).forEach((bairro) => {
        matchedEvidences.push({
          score: 16,
          item: {
            id: `ssot_bairro_${bairro.id}`,
            hierarchyLevel: 'NÍVEL 1: SSoT Científico',
            section: 'Análise Espacial de Quissico (Capítulo 5)',
            variable: `Bairro ${bairro.name} (${bairro.zoneGroup})`,
            tableOrFigure: 'Tabela 5.2 & Carta 5.1',
            component: 'Ocupação do Solo Sentinel-2 & Altimetria SRTM',
            source: 'SSoT • QUISSICO_BAIRROS_SPATIAL',
            internalReference: `Estação de Dados · Bairro ${bairro.name}`,
            provenanceTrail: `SSoT → Análise Espacial Quissico → Bairro ${bairro.name}`,
            epistemicStatus: 'OBSERVADO',
            contextActionLabel: 'Ver mapa de Quissico',
            snippet: `Bairro ${bairro.name} (Quissico): Área ${bairro.territorialAreaHa} ha; Cota média SRTM ${bairro.srtmAverageElevationM} m; <9m: ${bairro.srtmBelow9mPercent}%; Ocupação agrícola: ${bairro.dynamicWorldCropsSharePercent}%. Risco topográfico: ${bairro.topographicRisk}. Nota: aplica-se estritamente ao perímetro de Quissico.`,
            targetTab: 'dados',
            targetParam: 'espacial',
          },
        });
      });
    }
  }

  // -------------------------------------------------------------
  // NÍVEL 2: TEXTO E EVIDÊNCIAS DA PRÓPRIA DISSERTAÇÃO (dissertationText.ts)
  // -------------------------------------------------------------
  if (['todos', 'defesa', 'metodologia', 'resultados'].includes(scope)) {
    // Metadados Gerais
    const metaScore = calculateScore(
      `${DISSERTATION_METADATA.title} ${DISSERTATION_METADATA.author} ${DISSERTATION_METADATA.institution} ${DISSERTATION_METADATA.metrics.period} ${DISSERTATION_METADATA.metrics.averageProduction} ${DISSERTATION_METADATA.metrics.mannKendallZ}`,
      1.5
    );
    if (metaScore > 5) {
      matchedEvidences.push({
        score: metaScore,
        item: {
          id: 'thesis_metadata',
          hierarchyLevel: 'NÍVEL 2: Texto e Evidências da Dissertação',
          section: 'Ficha Técnica e Metadados Canónicos',
          component: 'Corpus Dissertação UEM / ESUDER',
          source: 'dissertationText.ts • DISSERTATION_METADATA',
          internalReference: 'Dissertação de Mestrado Yolanda Tamele (2026)',
          provenanceTrail: 'Dissertação → Metadados Canónicos',
          epistemicStatus: 'INTERPRETAÇÃO',
          contextActionLabel: 'Ver ficha técnica',
          snippet: `Título: ${DISSERTATION_METADATA.title}. Autora: ${DISSERTATION_METADATA.author} (ESUDER / UEM). Período: ${DISSERTATION_METADATA.metrics.period}. Média: ${DISSERTATION_METADATA.metrics.averageProduction}. Mann-Kendall: ${DISSERTATION_METADATA.metrics.mannKendallZ}. OLS: ${DISSERTATION_METADATA.metrics.olsTrend}. Perdas: ${DISSERTATION_METADATA.metrics.accumulatedLosses}.`,
          targetTab: 'dados',
        },
      });
    }

    // Perguntas da Banca
    DISSERTATION_FULL_QUESTIONS.forEach((q) => {
      const qText = `${q.title} ${q.juryQuestion} ${q.candidateResponse} ${q.examinerRole} ${q.category} ${q.tags.join(' ')}`;
      const qScore = calculateScore(qText, 2.0);
      if (qScore > 6) {
        matchedEvidences.push({
          score: qScore,
          item: {
            id: `thesis_q_${q.id}`,
            hierarchyLevel: 'NÍVEL 2: Texto e Evidências da Dissertação',
            section: `Banca de Defesa · Questão #${q.number} (${q.category})`,
            component: `Arguição Oficial: ${q.examinerRole}`,
            source: `dissertationText.ts • Questão #${q.number}`,
            internalReference: `Banca de Defesa · Questão #${q.number}`,
            provenanceTrail: `Dissertação → Banca de Defesa → Questão #${q.number}`,
            epistemicStatus: 'INTERPRETAÇÃO',
            contextActionLabel: 'Ver questão da banca',
            snippet: `Pergunta (${q.examinerRole}): "${q.juryQuestion}". Resposta de Yolanda Tamele: "${q.candidateResponse.slice(0, 300)}..."`,
            targetTab: 'defesa',
            targetParam: q.id,
          },
        });
      }
    });

    // Camadas de Metodologia
    THESIS_METHODOLOGY_LAYERS.forEach((layer) => {
      const layerText = `${layer.title} ${layer.shortDesc} ${layer.details.join(' ')} ${layer.keyReferences.join(' ')}`;
      const lScore = calculateScore(layerText, 2.0);
      if (lScore > 4 || normQuery.includes('reconstitui') || normQuery.includes('camada') || normQuery.includes('modelo') || normQuery.includes('serie')) {
        matchedEvidences.push({
          score: lScore + 8,
          item: {
            id: `thesis_layer_${layer.layerNumber}`,
            hierarchyLevel: 'NÍVEL 2: Texto e Evidências da Dissertação',
            section: `Metodologia de Reconstituição (${layer.title})`,
            component: layer.title,
            source: 'thesisModelData.ts • Camadas Metodológicas',
            internalReference: `Estação de Dados · Camada ${layer.layerNumber}`,
            provenanceTrail: `Dissertação → Metodologia → Camada ${layer.layerNumber} (${layer.title})`,
            epistemicStatus: 'MODELADO',
            contextActionLabel: 'Ver metodologia',
            snippet: `${layer.title}: ${layer.shortDesc}. Detalhes: ${layer.details[0] || ''}`,
            targetTab: 'dados',
            targetParam: 'metodologia',
          },
        });
      }
    });
  }

  // -------------------------------------------------------------
  // NÍVEL 3: DADOS DE CAMPO E ENTREVISTAS (fieldInterviews.ts, fieldPhotos.ts)
  // -------------------------------------------------------------
  if (
    ['todos', 'campo', 'entrevistas'].includes(scope) ||
    normQuery.includes('produtor') ||
    normQuery.includes('campones') ||
    normQuery.includes('cova') ||
    normQuery.includes('entrevista') ||
    normQuery.includes('doenca') ||
    normQuery.includes('praga')
  ) {
    // Entrevistas
    FIELD_INTERVIEWS.slice(0, 40).forEach((interview) => {
      const intText = `${interview.name} ${interview.role} ${interview.locality} ${interview.administrativePost} ${interview.cassavaVarieties.join(' ')} ${interview.productionTrend} ${interview.trendCauses} ${interview.pestsAndDiseases}`;
      const iScore = calculateScore(intText, 1.8);
      if (iScore > 4) {
        matchedEvidences.push({
          score: iScore,
          item: {
            id: `field_interview_${interview.id}`,
            hierarchyLevel: 'NÍVEL 3: Dados de Campo e Entrevistas',
            section: `Inquéritos e Caderno de Campo · ${interview.name}`,
            component: `Entrevista Etnográfica (${interview.locality})`,
            source: 'fieldInterviews.ts • Corpus de 77 Entrevistas',
            internalReference: `Trabalho de Campo · ${interview.name} (${interview.role})`,
            provenanceTrail: `Trabalho de Campo → 77 Inquéritos → ${interview.name} (${interview.locality})`,
            epistemicStatus: 'TESTEMUNHO DE CAMPO',
            contextActionLabel: 'Ver registo de campo',
            snippet: `Informante ${interview.name} (${interview.role}, ${interview.locality}, ${interview.administrativePost}): Tendência relatada: "${interview.productionTrend}" Causas relatadas: "${interview.trendCauses}". Pragas/Sintomas: "${interview.pestsAndDiseases}". Variedades: ${interview.cassavaVarieties.join(', ')}. (Voz do produtor empírica).`,
            targetTab: 'campo',
            targetParam: interview.id,
          },
        });
      }
    });

    // Fotos de Campo
    REAL_FIELD_PHOTOS.forEach((photo) => {
      const photoText = `${photo.title} ${photo.subtitle} ${photo.location} ${photo.description} ${photo.tags.join(' ')} ${photo.category}`;
      const pScore = calculateScore(photoText, 1.8);
      if (pScore > 4) {
        matchedEvidences.push({
          score: pScore,
          item: {
            id: `field_photo_${photo.id}`,
            hierarchyLevel: 'NÍVEL 3: Dados de Campo e Entrevistas',
            section: `Registo Fotográfico de Campo · Foto ${photo.number}`,
            component: photo.title,
            source: 'fieldPhotos.ts • Caderno de Campo',
            internalReference: `Trabalho de Campo · Fotografia ${photo.number}`,
            provenanceTrail: `Trabalho de Campo → Apêndice D → Fotografia #${photo.number}`,
            epistemicStatus: 'TESTEMUNHO DE CAMPO',
            contextActionLabel: 'Ver fotografia',
            snippet: `Foto ${photo.number} (${photo.title}, ${photo.location}): ${photo.description}`,
            targetTab: 'campo',
            targetParam: photo.id,
          },
        });
      }
    });
  }

  // -------------------------------------------------------------
  // NÍVEL 4: LIMITAÇÕES METODOLÓGICAS E RASTREABILIDADE
  // -------------------------------------------------------------
  SCIENTIFIC_LIMITATIONS.forEach((lim) => {
    const limText = `${lim.title} ${lim.domain} ${lim.description} ${lim.scientificImpact} ${lim.mitigationOrCaution}`;
    const limScore = calculateScore(limText, 2.2);
    if (limScore > 4 || normQuery.includes('limitac') || normQuery.includes('cautela') || normQuery.includes('sdae')) {
      matchedEvidences.push({
        score: limScore + 10,
        item: {
          id: `limitation_${lim.id}`,
          hierarchyLevel: 'NÍVEL 4: Referências Bibliográficas',
          section: `Registo de Limitações Metodológicas (${lim.domain})`,
          component: lim.title,
          source: 'thesisScientificData.ts • Limitações Científicas',
          internalReference: `Estação de Dados · Limitação: ${lim.title}`,
          provenanceTrail: `Metodologia → Registo de Limitações → ${lim.title}`,
          epistemicStatus: 'OBSERVADO',
          contextActionLabel: 'Ver limitações metodológicas',
          snippet: `${lim.title}: ${lim.description} Impacto científico: ${lim.scientificImpact} Mitigação/Salvaguarda: ${lim.mitigationOrCaution}`,
          targetTab: 'dados',
          targetParam: 'limitacoes',
        },
      });
    }
  });

  // Rastreabilidade de Fontes
  DATA_SOURCES_REGISTRY.forEach((src) => {
    const srcText = `${src.name} ${src.agency} ${src.period} ${src.purposeInThesis} ${src.dissertationUsage}`;
    const srcScore = calculateScore(srcText, 1.8);
    if (srcScore > 4) {
      matchedEvidences.push({
        score: srcScore,
        item: {
          id: `datasource_${src.id}`,
          hierarchyLevel: 'NÍVEL 4: Referências Bibliográficas',
          section: `Rastreabilidade de Fontes · ${src.name}`,
          component: src.agency,
          source: 'thesisScientificData.ts • DATA_SOURCES_REGISTRY',
          internalReference: `Fonte: ${src.name} (${src.period})`,
          provenanceTrail: `Rastreabilidade de Fontes → ${src.name} (${src.period})`,
          epistemicStatus: 'OBSERVADO',
          contextActionLabel: 'Ver fontes',
          snippet: `${src.name} (${src.agency}, ${src.period}): ${src.purposeInThesis} Utilização na dissertação: ${src.dissertationUsage}`,
          targetTab: 'dados',
          targetParam: src.id,
        },
      });
    }
  });

  // Vulnerabilidades Adversariais
  ADVERSARIAL_VULNERABILITIES.forEach((v) => {
    const vText = `${v.code} ${v.title} ${v.primaryPressure} ${v.secondaryPressure} ${v.epistemicGuardrail}`;
    const vScore = calculateScore(vText, 2.0);
    if (vScore > 5) {
      matchedEvidences.push({
        score: vScore,
        item: {
          id: `vuln_${v.id}`,
          hierarchyLevel: 'NÍVEL 4: Referências Bibliográficas',
          section: `Arguição Adversarial · Vulnerabilidade ${v.code}`,
          component: v.title,
          source: 'adversarialVulnerabilities.ts • Matriz Epistemológica',
          internalReference: `Banca de Defesa · ${v.code}: ${v.title}`,
          provenanceTrail: `Matriz Epistemológica → Vulnerabilidade ${v.code}`,
          epistemicStatus: 'INTERPRETAÇÃO',
          contextActionLabel: 'Ver questão da banca',
          snippet: `Vulnerabilidade ${v.code} (${v.title}): Objecção da Banca: "${v.primaryPressure}". Salvaguarda: "${v.epistemicGuardrail}"`,
          targetTab: 'defesa',
          targetParam: v.code,
        },
      });
    }
  });

  // Detecção de termos explicitamente não cobertos pela dissertação (anti-alucinação)
  const isQueryClearlyOutOfScope =
    /\b(trigo|soja|milho\s+hibrido|trator|john\s+deere|adubo\s+npk\s+importado|capital\s+de|presidente\s+de|fao\s+definicao\s+geral|fao\s+mundial)\b/i.test(
      query
    );

  // Ordenar por score decrescente e remover duplicados por ID
  matchedEvidences.sort((a, b) => b.score - a.score);
  const uniqueItems: RetrievedEvidenceItem[] = [];
  const seenIds = new Set<string>();

  for (const entry of matchedEvidences) {
    if (!seenIds.has(entry.item.id)) {
      seenIds.add(entry.item.id);
      uniqueItems.push(entry.item);
      if (uniqueItems.length >= 7) break;
    }
  }

  // Análise de Suficiência da Evidência
  const hasDirectMatch = uniqueItems.length > 0 && !isQueryClearlyOutOfScope;
  const isInsufficientEvidence = !hasDirectMatch && !isQueryClearlyOutOfScope;
  const isExternalKnowledgeNeeded = isQueryClearlyOutOfScope;

  // Determinar estatuto epistemológico predominante
  let primaryEpistemicStatus: EpistemicStatus = 'INTERPRETAÇÃO';

  if (isExternalKnowledgeNeeded) {
    primaryEpistemicStatus = 'CONTEXTUALIZAÇÃO EXTERNA';
  } else if (isInsufficientEvidence) {
    primaryEpistemicStatus = 'INTERPRETAÇÃO';
  } else if (matchedYearNum !== undefined) {
    primaryEpistemicStatus = matchedYearNum >= 2017 ? 'OBSERVADO' : 'RECONSTITUÍDO / MODELADO';
  } else if (
    normQuery.includes('547') ||
    normQuery.includes('contrafactual') ||
    normQuery.includes('reconstitui') ||
    normQuery.includes('camada')
  ) {
    primaryEpistemicStatus = 'MODELADO';
  } else if (
    normQuery.includes('produtor') ||
    normQuery.includes('entrevista') ||
    normQuery.includes('campones') ||
    normQuery.includes('cova')
  ) {
    primaryEpistemicStatus = 'TESTEMUNHO DE CAMPO';
  } else if (uniqueItems.length > 0 && uniqueItems[0].epistemicStatus) {
    primaryEpistemicStatus = uniqueItems[0].epistemicStatus;
  }

  // Se não houver correspondência directa e não for explicitamente fora de escopo, fornecer síntese de segurança
  if (uniqueItems.length === 0) {
    uniqueItems.push({
      id: 'thesis_core_summary',
      hierarchyLevel: 'NÍVEL 1: SSoT Científico',
      section: 'Quadro Nuclear da Dissertação (1994–2024)',
      component: 'SSoT • THESIS_CORE_FACTS',
      source: 'thesisScientificData.ts',
      internalReference: 'Estação de Dados · Síntese do Distrito de Zavala',
      provenanceTrail: 'SSoT → Síntese Geral (1994–2024)',
      epistemicStatus: 'MODELADO',
      contextActionLabel: 'Ver série histórica',
      snippet: `Distrito de Zavala (1994–2024): 31 anos analisados (1994–2016 modelados em 3 camadas; 2017–2024 observados pelo SDAE). Média: 115.333 t/ano. Mann-Kendall Z = 3,100 (p = 0,0019). CHIRPS r = 0,057 (p = 0,762). Perdas contrafactuais acumuladas: 547.224 t em 14 anos adversos.`,
      targetTab: 'dados',
    });
  }

  // Formatar bloco textual para o LLM
  let formattedContextForLLM = `### EVIDÊNCIAS CIENTÍFICAS RECUPERADAS DA DISSERTAÇÃO (SSoT ZAVALAVOZ):\n\n`;
  uniqueItems.forEach((ev, idx) => {
    formattedContextForLLM += `[EVIDÊNCIA ${idx + 1} - ${ev.hierarchyLevel}]\n`;
    formattedContextForLLM += `Secção: ${ev.section} | Componente: ${ev.component}\n`;
    formattedContextForLLM += `Rastreabilidade: ${ev.provenanceTrail || ev.source}\n`;
    formattedContextForLLM += `Estatuto Epistemológico: ${ev.epistemicStatus || 'INTERPRETAÇÃO'}\n`;
    if (ev.variable) formattedContextForLLM += `Variável: ${ev.variable}\n`;
    if (ev.year) formattedContextForLLM += `Ano: ${ev.year}\n`;
    if (ev.tableOrFigure) formattedContextForLLM += `Tabela/Figura: ${ev.tableOrFigure}\n`;
    formattedContextForLLM += `Conteúdo: ${ev.snippet}\n\n`;
  });

  const statusCategory: ResponseStatusCategory = isExternalKnowledgeNeeded
    ? 'CONTEXTUALIZAÇÃO EXTERNA'
    : isInsufficientEvidence
    ? 'SUPORTE INSUFICIENTE'
    : 'SUPORTADA PELOS DADOS';

  return {
    evidenceItems: uniqueItems,
    formattedContextForLLM,
    hasDirectMatch,
    statusCategory,
    primaryEpistemicStatus,
    isExternalKnowledgeNeeded,
    isInsufficientEvidence,
    detectedYear: matchedYearNum,
  };
}
