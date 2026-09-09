import {
  THESIS_COMPLETE_TIME_SERIES,
  THESIS_CLIMATE_SHOCKS,
  THESIS_OBSERVED_SDAE,
  THESIS_CLIMATE_IMPACT_LOSSES,
  THESIS_MODEL_ASSUMPTIONS,
  THESIS_METHODOLOGY_LAYERS,
  TOTAL_ESTIMATED_LOSSES_1994_2016,
} from '../data/thesisModelData';
import {
  QUISSICO_BAIRROS_SPATIAL,
  SCIENTIFIC_TREND_STATISTICS,
  CHIRPS_CORRELATION_ANALYSIS,
} from '../data/thesisScientificData';
import { REAL_FIELD_PHOTOS } from '../data/fieldPhotos';
import { FIELD_INTERVIEWS } from '../data/fieldInterviews';
import { CROSS_EVIDENCE_ITEMS } from '../data/fieldCrossEvidence';
import { DISSERTATION_FULL_QUESTIONS } from '../data/dissertationText';

export type SearchResultCategory = 'todos' | 'dados' | 'campo' | 'metodologia' | 'defesa';

export interface SearchResultItem {
  id: string;
  category: 'dados' | 'campo' | 'metodologia' | 'defesa';
  categoryLabel: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  snippet: string;
  fullSpeechText: string;
  metadataBadges: string[];
  targetTab: 'dados' | 'campo' | 'estudio' | 'defesa';
  targetParam?: string | number;
}

// Pre-build indexable documents from all attached files
export function buildSearchIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  // 1. Time Series Records (1994-2024)
  THESIS_COMPLETE_TIME_SERIES.forEach((row) => {
    const prodFormatted = row.finalProdTonnes.toLocaleString('pt-MZ');
    const speech = `No ano de ${row.year}, a produção de mandioca no Distrito de Zavala foi de ${prodFormatted} toneladas, classificada como ${row.status}. A área colhida foi de ${row.effectiveAreaHa.toLocaleString('pt-MZ')} hectares com rendimento de ${row.effectiveYieldTonnesHa.toFixed(2)} toneladas por hectare. Evento registrado: ${row.eventOrShock}.`;

    items.push({
      id: `ts_${row.year}`,
      category: 'dados',
      categoryLabel: 'Série Histórica (1994-2024)',
      badgeColor: row.status === 'OBSERVADO (SDAE)' ? 'emerald' : 'blue',
      title: `Ano ${row.year} • Produção de ${prodFormatted} t (${row.status})`,
      subtitle: `${row.eventOrShock}`,
      snippet: `Área Efectiva: ${row.effectiveAreaHa.toLocaleString('pt-MZ')} ha | Rendimento: ${row.effectiveYieldTonnesHa.toFixed(2)} t/ha | Choque: ${row.eventOrShock} | Var: ${row.annualVarPercent !== null ? (row.annualVarPercent > 0 ? `+${row.annualVarPercent}%` : `${row.annualVarPercent}%`) : 'Ano Base'}`,
      fullSpeechText: speech,
      metadataBadges: [
        `${row.year}`,
        `${prodFormatted} t`,
        row.status,
        row.annualVarPercent !== null ? `${row.annualVarPercent > 0 ? `+${row.annualVarPercent}%` : `${row.annualVarPercent}%`}` : '1994'
      ],
      targetTab: 'dados',
      targetParam: row.year
    });
  });

  // 2. Climate Shock Losses (Folha D)
  THESIS_CLIMATE_IMPACT_LOSSES.forEach((shock) => {
    const speech = `No evento climático de ${shock.year}, associado a ${shock.event}, a produção potencial de tendência em Zavala era de ${shock.trendProdTonnes.toLocaleString('pt-MZ')} toneladas, mas realizou-se apenas ${shock.actualProdTonnes.toLocaleString('pt-MZ')} toneladas, gerando uma perda estimada de ${shock.lossTonnes.toLocaleString('pt-MZ')} toneladas, equivalente a uma quebra de ${shock.lossPercent.toFixed(1)}%. Fonte: ${shock.source}.`;

    items.push({
      id: `shock_${shock.year}`,
      category: 'dados',
      categoryLabel: 'Choques e Perdas Estimadas',
      badgeColor: 'rose',
      title: `Choque Climático ${shock.year} • ${shock.event}`,
      subtitle: `Perda líquida de ${shock.lossTonnes.toLocaleString('pt-MZ')} toneladas (-${shock.lossPercent.toFixed(1)}%)`,
      snippet: `Tendência: ${shock.trendProdTonnes.toLocaleString('pt-MZ')} t | Realizado: ${shock.actualProdTonnes.toLocaleString('pt-MZ')} t | Perda: ${shock.lossTonnes.toLocaleString('pt-MZ')} t (-${shock.lossPercent}%) | Fonte de validação: ${shock.source}`,
      fullSpeechText: speech,
      metadataBadges: [
        `${shock.year}`,
        `Perda: -${shock.lossPercent.toFixed(1)}%`,
        `-${shock.lossTonnes.toLocaleString('pt-MZ')} t`,
        'Folha D'
      ],
      targetTab: 'dados',
      targetParam: shock.year
    });
  });

  // Total Losses Summary item
  items.push({
    id: 'total_losses_summary',
    category: 'dados',
    categoryLabel: 'Total Cumulativo de Perdas',
    badgeColor: 'rose',
    title: `Perdas Totais Cumulativas por Choques Climáticos (1994-2016): 547.224 Toneladas`,
    subtitle: 'Impacto agregado de secas, cheias e ciclones em Zavala documentado no modelo',
    snippet: `As perdas acumuladas em 23 anos (1994-2016) somam 547.224 toneladas de mandioca em Zavala, das quais os maiores impactos foram o Ciclone Favio em 2007 (74.902 t), a seca extrema de 2016 (131.627 t) e as cheias históricas de 2000 (46.291 t).`,
    fullSpeechText: `O modelo de reconstituição econométrica da tese calculou que entre 1994 e 2016, as perdas totais cumulativas provocadas por choques climáticos em Zavala totalizaram quinhentas e quarenta e sete mil, duzentas e vinte e quatro toneladas de mandioca. Este volume representa mais de quatro safras anuais completas de colheita média distrital perdidas.`,
    metadataBadges: ['547.224 t perdidas', '1994-2016', 'Choques Críticos'],
    targetTab: 'dados',
    targetParam: 'choques'
  });

  // 3. Model Assumptions & Methodology (Folha A e E)
  THESIS_MODEL_ASSUMPTIONS.forEach((assump) => {
    const speech = `No modelo econométrico de Zavala, o parâmetro ${assump.parameter} da categoria ${assump.category} tem o valor base de ${assump.value} ${assump.unit}, com intervalo de incerteza de ${assump.interval}. Fonte bibliográfica: ${assump.source}. ${assump.notes}.`;

    items.push({
      id: `assump_${assump.id}`,
      category: 'metodologia',
      categoryLabel: 'Pressupostos do Modelo (Folha A)',
      badgeColor: 'amber',
      title: `${assump.parameter}: ${assump.value} ${assump.unit}`,
      subtitle: `${assump.category} • Intervalo: ${assump.interval}`,
      snippet: `Valor: ${assump.value} ${assump.unit} | Incerteza: ${assump.interval} | Fonte: ${assump.source} | Nota: ${assump.notes}`,
      fullSpeechText: speech,
      metadataBadges: [assump.parameter, assump.value, assump.unit],
      targetTab: 'dados',
      targetParam: 'pressupostos'
    });
  });

  THESIS_METHODOLOGY_LAYERS.forEach((layer) => {
    const speech = `A dissertação utiliza a ${layer.title}. ${layer.shortDesc}. Detalhes principais: ${layer.details.join(' ')}. Referências principais: ${layer.keyReferences.join(', ')}.`;

    items.push({
      id: `layer_${layer.layerNumber}`,
      category: 'metodologia',
      categoryLabel: 'Metodologia Científica (Folha E)',
      badgeColor: 'purple',
      title: `${layer.title}`,
      subtitle: `${layer.shortDesc}`,
      snippet: `${layer.details.join(' ')} | Referências: ${layer.keyReferences.join('; ')}`,
      fullSpeechText: speech,
      metadataBadges: [`Camada ${layer.layerNumber}`, 'Folha E', 'Adebayo / Lobell / SDAE'],
      targetTab: 'dados',
      targetParam: 'metodologia'
    });
  });

  // 3.1. 11 Bairros of Quissico (Tabela 7 da Dissertação)
  QUISSICO_BAIRROS_SPATIAL.forEach((bairro) => {
    const speech = `Bairro de ${bairro.name} no Posto Administrativo de Quissico. Grupo geográfico: ${bairro.zoneGroup}. No Modelo B com satélite Sentinel-2 Dynamic World detém ${bairro.dynamicWorldCropsSharePercent}% do cultivo agrícola, contra ${bairro.territorialSharePercent}% da área territorial administrativa no Modelo A. Altitude média SRTM de ${bairro.srtmAverageElevationM} metros, com ${bairro.srtmBelow9mPercent}% na cota inferior a 9 metros. ${bairro.agriculturalProfile} ${bairro.topographicRisk}`;

    items.push({
      id: `bairro_${bairro.id}`,
      category: 'dados',
      categoryLabel: 'Análise Espacial • Quissico',
      badgeColor: 'emerald',
      title: `Bairro ${bairro.name} (${bairro.zoneGroup}) • Quissico`,
      subtitle: `${bairro.dynamicWorldCropsSharePercent}% colheita Sentinel-2 | ${bairro.territorialAreaHa.toLocaleString('pt-MZ')} ha`,
      snippet: `Dynamic World: ${bairro.dynamicWorldCropsSharePercent}% | Territorial: ${bairro.territorialSharePercent}% | Alt. SRTM: ${bairro.srtmAverageElevationM}m (Cota < 9m: ${bairro.srtmBelow9mPercent}%) | Perfil: ${bairro.agriculturalProfile}`,
      fullSpeechText: speech,
      metadataBadges: [
        bairro.name,
        `${bairro.dynamicWorldCropsSharePercent}% DW`,
        `${bairro.srtmAverageElevationM}m`,
        bairro.zoneGroup
      ],
      targetTab: 'dados',
      targetParam: 'espacial'
    });
  });

  // 3.2. Scientific Trend Statistics (Hamed-Rao Mann-Kendall, Newey-West OLS, Log-linear, CAGR)
  SCIENTIFIC_TREND_STATISTICS.forEach((stat) => {
    items.push({
      id: `trend_${stat.id}`,
      category: 'dados',
      categoryLabel: 'Estatística e Econometria',
      badgeColor: 'blue',
      title: `${stat.name}: ${stat.value}`,
      subtitle: `${stat.metric} • ${stat.pValue || stat.period}`,
      snippet: `${stat.methodology} | Interpretação: ${stat.interpretation} | Ref: ${stat.dissertationRef}`,
      fullSpeechText: `${stat.name}. Valor apurado: ${stat.value}, significância ${stat.pValue || 'não aplicável'}. ${stat.interpretation} Metodologia: ${stat.methodology}. Referência na dissertação: ${stat.dissertationRef}.`,
      metadataBadges: [
        stat.value,
        stat.pValue || '31 Anos',
        stat.id.replace('stat_', '').toUpperCase()
      ],
      targetTab: 'dados',
      targetParam: 'tendencia'
    });
  });

  // 3.3. CHIRPS Correlation & 2023 Paradox
  items.push({
    id: 'chirps_correlation_summary',
    category: 'dados',
    categoryLabel: 'Clima e CHIRPS v2.0',
    badgeColor: 'blue',
    title: 'Correlação Chuva CHIRPS vs Produção: r = 0,057 (p = 0,762)',
    subtitle: 'Ausência de causalidade linear estrita e o paradoxo de 2023 (+78,1% chuva, -87% safra)',
    snippet: CHIRPS_CORRELATION_ANALYSIS.scientificCaveat,
    fullSpeechText: CHIRPS_CORRELATION_ANALYSIS.scientificCaveat,
    metadataBadges: ['r = 0,057', 'p = 0,762', 'Não-Causalidade', 'Anoxia Radicular'],
    targetTab: 'dados',
    targetParam: 'chirps'
  });

  // 4. Real Field Photos (10 Photos uploaded by User)
  REAL_FIELD_PHOTOS.forEach((photo) => {
    const speech = `Fotografia de campo número ${photo.number}: ${photo.title}. Local: ${photo.location}, coordenadas ${photo.coords}. Descrição etnográfica: ${photo.description}. Detalhes técnicos observados: ${photo.technicalDetails.join(' ')}.`;

    items.push({
      id: `photo_${photo.id}`,
      category: 'campo',
      categoryLabel: 'Registo Fotográfico de Campo',
      badgeColor: 'emerald',
      title: `Foto ${photo.number}: ${photo.title}`,
      subtitle: `${photo.location} • ${photo.category}`,
      snippet: `${photo.description} | Coordenadas: ${photo.coords} | Detalhes: ${photo.technicalDetails.join(' ')}`,
      fullSpeechText: speech,
      metadataBadges: [
        `Foto ${photo.number}`,
        photo.category,
        photo.location.split('•')[0].trim()
      ],
      targetTab: 'campo',
      targetParam: photo.id
    });
  });

  // 5. 77 Field Survey Interviews (Apêndice & Caderno de Campo)
  FIELD_INTERVIEWS.forEach((intv) => {
    const speech = `Inquérito de campo número ${intv.recordIndex}, folha física ${intv.pageNumber}. Produtor: ${intv.name}, ${intv.role} em ${intv.locality}, Quissico. Variedades de mandioca: ${intv.rawVarietiesText}. Tendência da produção: ${intv.productionTrend} devido a ${intv.trendCauses}. Pragas declaradas: ${intv.pestsAndDiseases}. Apoio: ${intv.institutionalSupport}.`;

    items.push({
      id: `intv_${intv.id}`,
      category: 'campo',
      categoryLabel: 'Caderno de Campo · Inquéritos',
      badgeColor: intv.isLeaderQuestionnaire ? 'amber' : 'emerald',
      title: `${intv.name} (${intv.role}) • ${intv.locality}`,
      subtitle: `Folha Física ${intv.pageNumber} • Tempo de cultivo: ${intv.farmingYears}`,
      snippet: `Variedades: ${intv.rawVarietiesText} | Tendência: ${intv.productionTrend} (${intv.trendCauses}) | Pragas: ${intv.pestsAndDiseases} | Apoio: ${intv.institutionalSupport}`,
      fullSpeechText: speech,
      metadataBadges: [
        `Pág. ${intv.pageNumber}`,
        intv.locality,
        intv.productionTrend,
        intv.role.split(' ')[0]
      ],
      targetTab: 'campo',
      targetParam: intv.id
    });
  });

  // 6. Methodological Cross-Evidence (Triangulation Nodes)
  CROSS_EVIDENCE_ITEMS.forEach((ce) => {
    const speech = `Triangulação metodológica da tese: ${ce.title}. Categoria: ${ce.themeCategory}. Tipo de relação: ${ce.relationshipType}. Referência: ${ce.dissertationReference}. Citação de campo: ${ce.participantVoiceExcerpt}. Interpretação: ${ce.analyticalInterpretation}.`;

    items.push({
      id: `cross_${ce.id}`,
      category: 'metodologia',
      categoryLabel: 'Evidência Cruzada (Triangulação)',
      badgeColor: ce.relationshipType === 'Relação confirmada' ? 'emerald' : 'amber',
      title: `Triangulação: ${ce.title}`,
      subtitle: `${ce.relationshipType} • ${ce.dissertationChapter}`,
      snippet: `Voz do Participante: "${ce.participantVoiceExcerpt}" | Observação: ${ce.fieldObservationExcerpt} | Interpretação: ${ce.analyticalInterpretation}`,
      fullSpeechText: speech,
      metadataBadges: [
        ce.relationshipType,
        ce.themeCategory,
        ce.dissertationChapter.split(' ')[0]
      ],
      targetTab: 'campo',
      targetParam: ce.id
    });
  });

  // 7. 26 Dissertation Defense Questions & Answers
  DISSERTATION_FULL_QUESTIONS.forEach((q) => {
    items.push({
      id: `defesa_${q.id}`,
      category: 'defesa',
      categoryLabel: 'Perguntas da Defesa (Júri)',
      badgeColor: 'zinc',
      title: `Pergunta ${q.number}: ${q.title}`,
      subtitle: `Categoria: ${q.category}`,
      snippet: `Júri: "${q.juryQuestion}" | Resposta da Candidata: ${q.candidateResponse.substring(0, 180)}...`,
      fullSpeechText: q.text,
      metadataBadges: [`Pergunta ${q.number}`, q.category],
      targetTab: 'defesa',
      targetParam: q.id
    });
  });

  return items;
}

// Global cached index
let searchIndexCache: SearchResultItem[] | null = null;

export function searchAppDatabase(
  query: string,
  categoryFilter: SearchResultCategory = 'todos'
): SearchResultItem[] {
  if (!searchIndexCache) {
    searchIndexCache = buildSearchIndex();
  }

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    // Return curated key entries if empty
    return searchIndexCache
      .filter((item) => (categoryFilter === 'todos' ? true : item.category === categoryFilter))
      .slice(0, 15);
  }

  const queryTerms = cleanQuery.split(/\s+/).filter(Boolean);

  const matched = searchIndexCache.filter((item) => {
    // Category match
    if (categoryFilter !== 'todos' && item.category !== categoryFilter) {
      return false;
    }

    const searchableText = `${item.title} ${item.subtitle} ${item.snippet} ${item.metadataBadges.join(' ')} ${item.fullSpeechText}`.toLowerCase();

    // Must match all query terms or at least one significant term
    return queryTerms.every((term) => searchableText.includes(term));
  });

  return matched;
}
