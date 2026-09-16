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

export type SearchEvidenceType =
  | 'serie_historica'
  | 'choque_climatico'
  | 'fotografia'
  | 'inquerito'
  | 'triangulacao'
  | 'pergunta_banca'
  | 'estatistica'
  | 'pressuposto_modelo'
  | 'metodologia'
  | 'espacial_bairros';

export type SearchResultCategory =
  | 'todos'
  | 'series_anos'
  | 'choques'
  | 'fotos_campo'
  | 'inqueritos'
  | 'defesa_banca'
  | 'metodologia';

export interface SuggestedCrossing {
  label: string;
  targetTab: 'dados' | 'campo' | 'estudio' | 'defesa';
  targetParam?: string | number;
  relationNote: string;
}

export interface SearchResultItem {
  id: string;
  category: 'series_anos' | 'choques' | 'fotos_campo' | 'inqueritos' | 'defesa_banca' | 'metodologia';
  categoryLabel: string;
  evidenceType: SearchEvidenceType;
  evidenceTypeLabel: string;
  title: string;
  subtitle: string;
  dissertationLocation: string;
  occurrenceContext: string;
  matchReason?: string;
  snippet: string;
  fullSpeechText: string;
  metadataBadges: string[];
  targetTab: 'dados' | 'campo' | 'estudio' | 'defesa';
  targetParam?: string | number;
  tabularData?: {
    year: number;
    status: string;
    productionTonnes: number;
    areaHa: number;
    yieldTonnesHa: number;
    annualVar?: number | null;
    shock?: string;
  };
  shockData?: {
    year: number;
    eventName: string;
    lossTonnes: number;
    lossPercent: number;
    trendTonnes: number;
    actualTonnes: number;
    source: string;
  };
  photoReference?: {
    number: number;
    originalFileName: string;
    coords: string;
    location: string;
    category: string;
  };
  interviewRecord?: {
    pageNumber: number;
    recordIndex: number;
    farmerName: string;
    locality: string;
    role: string;
    farmingYears: string;
    varieties: string;
    trend: string;
    causes: string;
  };
  defenseQuestion?: {
    number: number;
    category: string;
    examinerQuestion: string;
    candidateExcerpt: string;
  };
  suggestedCrossings: SuggestedCrossing[];
}

export function buildSearchIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  // 1. Time Series Records (1994-2024)
  THESIS_COMPLETE_TIME_SERIES.forEach((row) => {
    const prodFormatted = row.finalProdTonnes.toLocaleString('pt-MZ');
    const isObserved = row.status === 'OBSERVADO (SDAE)';
    const speech = `No ano de ${row.year}, a produção de mandioca no Distrito de Zavala foi de ${prodFormatted} toneladas, classificada metodologicamente como ${row.status}. A área colhida foi de ${row.effectiveAreaHa.toLocaleString('pt-MZ')} hectares com rendimento de ${row.effectiveYieldTonnesHa.toFixed(2)} toneladas por hectare. Evento ou conjuntura registrada: ${row.eventOrShock}.`;

    const crossings: SuggestedCrossing[] = [
      {
        label: `Choques e perdas de ${row.year}`,
        targetTab: 'dados',
        targetParam: row.year,
        relationNote: 'Consultar matriz de perdas climáticas',
      },
    ];

    if (row.year >= 2020) {
      crossings.push({
        label: 'Inquéritos de campo contemporâneos',
        targetTab: 'campo',
        targetParam: 'entrevistas',
        relationNote: 'Evidência etnográfica in-situ',
      });
    }

    if (row.year === 2007 || row.year === 2016 || row.year === 2000) {
      crossings.push({
        label: `Questão de arguição sobre o choque de ${row.year}`,
        targetTab: 'defesa',
        targetParam: 'q_6',
        relationNote: 'Defesa oral perante a comissão examinadora',
      });
    }

    items.push({
      id: `ts_${row.year}`,
      category: 'series_anos',
      categoryLabel: 'Séries e Anos (1994–2024)',
      evidenceType: 'serie_historica',
      evidenceTypeLabel: isObserved ? 'Dado Observado (SDAE)' : 'Dado Modelado (Reconstituição)',
      title: `Ano Agrícola ${row.year} · Produção de ${prodFormatted} t (${row.status})`,
      subtitle: `${row.eventOrShock}`,
      dissertationLocation: `Capítulo 4 · Tabela 4.1 (Série Histórica de Zavala, Ano ${row.year})`,
      occurrenceContext: 'Reconstituição da série temporal oficial de 31 anos baseada no SDAE Zavala e World Bank Jobs WP 31',
      snippet: `Área Efectiva: ${row.effectiveAreaHa.toLocaleString('pt-MZ')} ha | Rendimento Médio: ${row.effectiveYieldTonnesHa.toFixed(2)} t/ha | Regime: ${row.status} | Evento Crítico: ${row.eventOrShock} | Variação Anual: ${row.annualVarPercent !== null ? (row.annualVarPercent > 0 ? `+${row.annualVarPercent}%` : `${row.annualVarPercent}%`) : 'Ano Base'}`,
      fullSpeechText: speech,
      metadataBadges: [
        `${row.year}`,
        `${prodFormatted} t`,
        isObserved ? 'OBSERVADO' : 'MODELADO',
        row.annualVarPercent !== null ? `${row.annualVarPercent > 0 ? `+${row.annualVarPercent}%` : `${row.annualVarPercent}%`}` : '1994',
      ],
      targetTab: 'dados',
      targetParam: row.year,
      tabularData: {
        year: row.year,
        status: row.status,
        productionTonnes: row.finalProdTonnes,
        areaHa: row.effectiveAreaHa,
        yieldTonnesHa: row.effectiveYieldTonnesHa,
        annualVar: row.annualVarPercent,
        shock: row.eventOrShock,
      },
      suggestedCrossings: crossings,
    });
  });

  // 2. Climate Shock Losses (Folha D)
  THESIS_CLIMATE_IMPACT_LOSSES.forEach((shock) => {
    const speech = `No evento climático de ${shock.year}, associado a ${shock.event}, a produção potencial de tendência em Zavala era de ${shock.trendProdTonnes.toLocaleString('pt-MZ')} toneladas, mas realizou-se apenas ${shock.actualProdTonnes.toLocaleString('pt-MZ')} toneladas, gerando uma perda estimada de ${shock.lossTonnes.toLocaleString('pt-MZ')} toneladas, equivalente a uma quebra de ${shock.lossPercent.toFixed(1)}%. Fonte: ${shock.source}.`;

    items.push({
      id: `shock_${shock.year}`,
      category: 'choques',
      categoryLabel: 'Choques Climáticos e Eventos Extremos',
      evidenceType: 'choque_climatico',
      evidenceTypeLabel: 'Impacto e Quebra de Safra Estimada',
      title: `Choque Climático de ${shock.year} · ${shock.event}`,
      subtitle: `Perda líquida calculada de ${shock.lossTonnes.toLocaleString('pt-MZ')} toneladas (-${shock.lossPercent.toFixed(1)}%)`,
      dissertationLocation: `Folha D · Matriz de Perdas e Eventos Extremos (Ano ${shock.year})`,
      occurrenceContext: 'Avaliação econométrica de desvio em relação à curva tendencial de produção distrital',
      snippet: `Produção Tendencial: ${shock.trendProdTonnes.toLocaleString('pt-MZ')} t | Realizada: ${shock.actualProdTonnes.toLocaleString('pt-MZ')} t | Perda Absoluta: -${shock.lossTonnes.toLocaleString('pt-MZ')} t (-${shock.lossPercent.toFixed(1)}%) | Fonte de Validação: ${shock.source}`,
      fullSpeechText: speech,
      metadataBadges: [
        `${shock.year}`,
        `-${shock.lossPercent.toFixed(1)}%`,
        `-${shock.lossTonnes.toLocaleString('pt-MZ')} t`,
        shock.event.split(' ')[0],
      ],
      targetTab: 'dados',
      targetParam: shock.year,
      shockData: {
        year: shock.year,
        eventName: shock.event,
        lossTonnes: shock.lossTonnes,
        lossPercent: shock.lossPercent,
        trendTonnes: shock.trendProdTonnes,
        actualTonnes: shock.actualProdTonnes,
        source: shock.source,
      },
      suggestedCrossings: [
        {
          label: `Ver ano ${shock.year} na série cronológica`,
          targetTab: 'dados',
          targetParam: shock.year,
          relationNote: 'Localizar ponto na curva temporal',
        },
        {
          label: 'Pergunta de arguição sobre o choque',
          targetTab: 'defesa',
          targetParam: 'q_6',
          relationNote: 'Explicação dos mecanismos de impacto',
        },
      ],
    });
  });

  // Total Losses Summary item
  items.push({
    id: 'total_losses_summary',
    category: 'choques',
    categoryLabel: 'Choques Climáticos e Eventos Extremos',
    evidenceType: 'choque_climatico',
    evidenceTypeLabel: 'Agregado Cumulativo de Perdas',
    title: `Perdas Totais Cumulativas por Choques Climáticos (1994–2016): ${TOTAL_ESTIMATED_LOSSES_1994_2016.toLocaleString('pt-MZ')} Toneladas`,
    subtitle: 'Impacto agregado de secas, cheias e ciclones em Zavala documentado no modelo',
    dissertationLocation: 'Capítulo 4 · Síntese de Danos Agregados e Folha D',
    occurrenceContext: 'Totalização dos 23 anos de histórico de choques climáticos no distrito de Zavala',
    snippet: `As perdas acumuladas somam ${TOTAL_ESTIMATED_LOSSES_1994_2016.toLocaleString('pt-MZ')} toneladas de mandioca em Zavala (1994–2016). Os maiores impactos foram o Ciclone Favio em 2007 (74.902 t), a seca severa de 2016 (131.627 t) e as cheias do ano 2000 (46.291 t).`,
    fullSpeechText: `O modelo de reconstituição econométrica da tese calculou que entre 1994 e 2016, as perdas totais cumulativas provocadas por choques climáticos em Zavala totalizaram quinhentas e quarenta e sete mil, duzentas e vinte e quatro toneladas de mandioca. Este volume representa mais de quatro safras anuais completas de colheita média distrital perdidas.`,
    metadataBadges: [`${TOTAL_ESTIMATED_LOSSES_1994_2016.toLocaleString('pt-MZ')} t perdidas`, '1994–2016', 'Folha D', 'Danos Cumulativos'],
    targetTab: 'dados',
    targetParam: 'choques',
    shockData: {
      year: 2016,
      eventName: 'Impacto Agregado de Choques (1994–2016)',
      lossTonnes: TOTAL_ESTIMATED_LOSSES_1994_2016,
      lossPercent: 28.4,
      trendTonnes: 1926845,
      actualTonnes: 1379621,
      source: 'Modelo Zavala Mandioca · Reconstituição da Dissertação',
    },
    suggestedCrossings: [
      {
        label: 'Matriz detalhada de perdas climáticas',
        targetTab: 'dados',
        targetParam: 'choques',
        relationNote: 'Tabela completa dos 7 choques identificados',
      },
      {
        label: 'Pergunta de banca sobre o Ciclone Favio (2007)',
        targetTab: 'defesa',
        targetParam: 'q_6',
        relationNote: 'Discussão sobre o choque mais destrutivo',
      },
    ],
  });

  // 3. Real Field Photos (10 Photos)
  REAL_FIELD_PHOTOS.forEach((photo) => {
    const speech = `Fotografia de campo número ${photo.number}: ${photo.title}. Local: ${photo.location}, coordenadas ${photo.coords}. Descrição etnográfica: ${photo.description}. Detalhes técnicos observados: ${photo.technicalDetails.join(' ')}.`;

    items.push({
      id: `photo_${photo.id}`,
      category: 'fotos_campo',
      categoryLabel: 'Registos de Campo e Fotografias',
      evidenceType: 'fotografia',
      evidenceTypeLabel: 'Registo Fotográfico In-Situ',
      title: `Foto ${photo.number}: ${photo.title}`,
      subtitle: `${photo.location} · ${photo.category}`,
      dissertationLocation: `Apêndice D · Documentação Fotográfica de Campo (Foto #${photo.number})`,
      occurrenceContext: 'Trabalho de campo etnográfico e agronómico conduzido in-situ em Quissico e povoados rurais de Zavala',
      snippet: `${photo.description} | Coordenadas GPS: ${photo.coords} | Detalhes Agronómicos: ${photo.technicalDetails.join('; ')}`,
      fullSpeechText: speech,
      metadataBadges: [
        `Foto #${photo.number}`,
        photo.category,
        photo.location.split('•')[0].trim(),
        'Apêndice D',
        ...(photo.tags || []),
      ],
      targetTab: 'campo',
      targetParam: photo.id,
      photoReference: {
        number: photo.number,
        originalFileName: photo.originalFileName,
        coords: photo.coords,
        location: photo.location,
        category: photo.category,
      },
      suggestedCrossings: [
        {
          label: 'Ver foto no Caderno de Campo',
          targetTab: 'campo',
          targetParam: photo.id,
          relationNote: 'Visualização ampliada com ficha etnográfica',
        },
        {
          label: 'Inquéritos no mesmo povoado',
          targetTab: 'campo',
          targetParam: 'entrevistas',
          relationNote: 'Triangulação com depoimentos dos camponeses',
        },
      ],
    });
  });

  // 4. Field Interviews (Inquéritos Transcritos do Caderno de Campo)
  FIELD_INTERVIEWS.forEach((intv) => {
    const speech = `Inquérito de campo número ${intv.recordIndex}, folha física ${intv.pageNumber}. Produtor: ${intv.name}, ${intv.role} em ${intv.locality}, Quissico. Variedades de mandioca declaradas: ${intv.rawVarietiesText}. Tendência da produção: ${intv.productionTrend} devido a ${intv.trendCauses}. Pragas declaradas: ${intv.pestsAndDiseases}. Apoio institucional: ${intv.institutionalSupport}.`;

    items.push({
      id: `intv_${intv.id}`,
      category: 'inqueritos',
      categoryLabel: 'Inquéritos e Produtores Rurais',
      evidenceType: 'inquerito',
      evidenceTypeLabel: intv.isLeaderQuestionnaire ? 'Inquérito a Liderança Comunitária' : 'Inquérito a Produtor Rural',
      title: `${intv.name} (${intv.role}) · ${intv.locality}`,
      subtitle: `Folha Física ${intv.pageNumber} · Cultiva há ${intv.farmingYears} numa área de ${intv.cassavaArea}`,
      dissertationLocation: `Caderno de Campo Original · Folha Física ${intv.pageNumber} (Registo #${intv.recordIndex})`,
      occurrenceContext: `Inquérito presencial individual aplicado no povoado de ${intv.locality}, Posto Administrativo de ${intv.administrativePost}`,
      snippet: `Variedades Registadas: "${intv.rawVarietiesText}" | Tendência: ${intv.productionTrend} (Causas: ${intv.trendCauses}) | Pragas/Doenças: ${intv.pestsAndDiseases} | Apoio: ${intv.institutionalSupport} | Solo: ${intv.soilType}`,
      fullSpeechText: speech,
      metadataBadges: [
        `Folha ${intv.pageNumber}`,
        intv.locality,
        intv.productionTrend.split(' ')[0],
        intv.isLeaderQuestionnaire ? 'Líder' : 'Produtor',
      ],
      targetTab: 'campo',
      targetParam: intv.id,
      interviewRecord: {
        pageNumber: intv.pageNumber,
        recordIndex: intv.recordIndex,
        farmerName: intv.name,
        locality: intv.locality,
        role: intv.role,
        farmingYears: intv.farmingYears,
        varieties: intv.rawVarietiesText,
        trend: intv.productionTrend,
        causes: intv.trendCauses,
      },
      suggestedCrossings: [
        {
          label: 'Ficha integral do inquérito no Caderno',
          targetTab: 'campo',
          targetParam: intv.id,
          relationNote: 'Consultar respostas completas do formulário',
        },
        {
          label: 'Matriz de evidência cruzada',
          targetTab: 'campo',
          targetParam: 'evidencia',
          relationNote: 'Triangulação deste povoado com a dissertação',
        },
      ],
    });
  });

  // 5. Defense Questions & Oral Examination
  DISSERTATION_FULL_QUESTIONS.forEach((q) => {
    items.push({
      id: `defesa_${q.id}`,
      category: 'defesa_banca',
      categoryLabel: 'Arguição Oral e Banca Examinadora',
      evidenceType: 'pergunta_banca',
      evidenceTypeLabel: 'Questão Provável da Comissão',
      title: `Questão ${q.number}: ${q.title}`,
      subtitle: `Cenário de Arguição: ${q.category}`,
      dissertationLocation: `Roteiro de Arguição Oral · Questão #${q.number} (UEM / ESUDER)`,
      occurrenceContext: 'Simulação formal de defesa perante a comissão examinadora de mestrado',
      snippet: `Júri / Examinador: "${q.juryQuestion}" | Linha de Resposta: ${q.candidateResponse.substring(0, 200)}...`,
      fullSpeechText: q.text,
      metadataBadges: [
        `Pergunta #${q.number}`,
        q.category.split(' ')[0],
        'Arguição Oral',
      ],
      targetTab: 'defesa',
      targetParam: q.id,
      defenseQuestion: {
        number: q.number,
        category: q.category,
        examinerQuestion: q.juryQuestion,
        candidateExcerpt: q.candidateResponse,
      },
      suggestedCrossings: [
        {
          label: 'Abrir na Sala de Defesa',
          targetTab: 'defesa',
          targetParam: q.id,
          relationNote: 'Praticar resposta com simulação da banca',
        },
        {
          label: 'Carregar resposta no Estúdio de Voz',
          targetTab: 'estudio',
          targetParam: q.id,
          relationNote: 'Ensaio vocal e locução da resposta',
        },
      ],
    });
  });

  // 6. Methodology & Triangulation Nodes
  CROSS_EVIDENCE_ITEMS.forEach((ce) => {
    const speech = `Triangulação metodológica da tese: ${ce.title}. Categoria: ${ce.themeCategory}. Tipo de relação: ${ce.relationshipType}. Referência: ${ce.dissertationReference}. Citação de campo: ${ce.participantVoiceExcerpt}. Interpretação analítica: ${ce.analyticalInterpretation}.`;

    items.push({
      id: `cross_${ce.id}`,
      category: 'metodologia',
      categoryLabel: 'Evidência Cruzada e Metodologia',
      evidenceType: 'triangulacao',
      evidenceTypeLabel: 'Nó de Triangulação Metodológica',
      title: `Triangulação: ${ce.title}`,
      subtitle: `${ce.relationshipType} · ${ce.dissertationChapter}`,
      dissertationLocation: `${ce.dissertationChapter} (${ce.dissertationReference})`,
      occurrenceContext: 'Confrontação epistemológica entre dados primários in-situ, literatura e modelo quantitativo',
      snippet: `Declaração Literal do Produtor: “${ce.participantVoiceExcerpt}” | Observação In-Situ: ${ce.fieldObservationExcerpt} | Interpretação Científica: ${ce.analyticalInterpretation} | Base Amostral: ${ce.empiricalBasis}`,
      fullSpeechText: speech,
      metadataBadges: [
        ce.relationshipType,
        ce.themeCategory,
        ce.dissertationChapter.split(' ')[0],
        'Triangulação',
      ],
      targetTab: 'campo',
      targetParam: ce.id,
      suggestedCrossings: [
        {
          label: 'Ver nó no Caderno de Evidência Cruzada',
          targetTab: 'campo',
          targetParam: ce.id,
          relationNote: 'Aceder às quatro camadas epistemológicas',
        },
        {
          label: 'Carregar citação no Estúdio',
          targetTab: 'estudio',
          targetParam: ce.id,
          relationNote: 'Ensaio de locução da evidência de campo',
        },
      ],
    });
  });

  // 7. Model Assumptions (Folha A)
  THESIS_MODEL_ASSUMPTIONS.forEach((assump) => {
    const speech = `No modelo econométrico de Zavala, o parâmetro ${assump.parameter} da categoria ${assump.category} tem o valor base de ${assump.value} ${assump.unit}, com intervalo de incerteza de ${assump.interval}. Fonte bibliográfica: ${assump.source}. ${assump.notes}.`;

    items.push({
      id: `assump_${assump.id}`,
      category: 'metodologia',
      categoryLabel: 'Conceitos e Metodologia',
      evidenceType: 'pressuposto_modelo',
      evidenceTypeLabel: 'Pressuposto Técnico do Modelo',
      title: `Parâmetro ${assump.parameter}: ${assump.value} ${assump.unit}`,
      subtitle: `${assump.category} · Incerteza: ${assump.interval}`,
      dissertationLocation: `Folha A · Matriz de Pressupostos Metodológicos (${assump.category})`,
      occurrenceContext: 'Parametrização do modelo econométrico de reconstituição agrária de Zavala',
      snippet: `Valor Central: ${assump.value} ${assump.unit} | Faixa de Sensibilidade: ${assump.interval} | Fonte Documental: ${assump.source} | Fundamentação: ${assump.notes}`,
      fullSpeechText: speech,
      metadataBadges: [
        assump.parameter,
        `${assump.value} ${assump.unit}`,
        'Folha A',
        assump.category.split(' ')[0],
      ],
      targetTab: 'dados',
      targetParam: 'pressupostos',
      suggestedCrossings: [
        {
          label: 'Consultar matriz de pressupostos em Dados',
          targetTab: 'dados',
          targetParam: 'pressupostos',
          relationNote: 'Revisão das equações do modelo',
        },
      ],
    });
  });

  // 8. Scientific Trend Statistics
  SCIENTIFIC_TREND_STATISTICS.forEach((stat) => {
    items.push({
      id: `trend_${stat.id}`,
      category: 'series_anos',
      categoryLabel: 'Séries e Anos (1994–2024)',
      evidenceType: 'estatistica',
      evidenceTypeLabel: 'Indicador Estatístico / Econométrico',
      title: `${stat.name}: ${stat.value}`,
      subtitle: `${stat.metric} · ${stat.pValue || stat.period}`,
      dissertationLocation: `${stat.dissertationRef}`,
      occurrenceContext: 'Tratamento estatístico da série temporal de 31 anos (Hamed-Rao, Newey-West OLS, CAGR)',
      snippet: `Metodologia: ${stat.methodology} | Interpretação Científica: ${stat.interpretation} | Referência: ${stat.dissertationRef}`,
      fullSpeechText: `${stat.name}. Valor apurado: ${stat.value}, significância ${stat.pValue || 'não aplicável'}. ${stat.interpretation} Metodologia: ${stat.methodology}. Referência na dissertação: ${stat.dissertationRef}.`,
      metadataBadges: [
        stat.value,
        stat.pValue || '31 Anos',
        stat.id.replace('stat_', '').toUpperCase(),
      ],
      targetTab: 'dados',
      targetParam: 'tendencia',
      suggestedCrossings: [
        {
          label: 'Ver análise de tendência na aba Dados',
          targetTab: 'dados',
          targetParam: 'tendencia',
          relationNote: 'Painel econométrico completo',
        },
      ],
    });
  });

  // 9. Quissico 11 Bairros Spatial Analysis
  QUISSICO_BAIRROS_SPATIAL.forEach((bairro) => {
    const speech = `Bairro de ${bairro.name} no Posto Administrativo de Quissico. Grupo geográfico: ${bairro.zoneGroup}. No Modelo B com satélite Sentinel-2 detém ${bairro.dynamicWorldCropsSharePercent}% do cultivo agrícola, contra ${bairro.territorialSharePercent}% da área territorial administrativa no Modelo A. Altitude média SRTM de ${bairro.srtmAverageElevationM} metros.`;

    items.push({
      id: `bairro_${bairro.id}`,
      category: 'series_anos',
      categoryLabel: 'Séries e Anos (1994–2024)',
      evidenceType: 'espacial_bairros',
      evidenceTypeLabel: 'Análise Espacial Intra-Distrital',
      title: `Bairro ${bairro.name} (${bairro.zoneGroup}) · Quissico`,
      subtitle: `${bairro.dynamicWorldCropsSharePercent}% colheita Sentinel-2 | Área: ${bairro.territorialAreaHa.toLocaleString('pt-MZ')} ha`,
      dissertationLocation: `Capítulo 4 · Tabela 4.7 (Desagregação Intra-Distrital de Quissico)`,
      occurrenceContext: 'Heterogeneidade territorial comparada entre Modelo Territorial A e Modelo Satelital B',
      snippet: `Dynamic World (Cultivo): ${bairro.dynamicWorldCropsSharePercent}% | Proporção Territorial: ${bairro.territorialSharePercent}% | Altitude SRTM: ${bairro.srtmAverageElevationM}m (Cota < 9m: ${bairro.srtmBelow9mPercent}%) | Perfil Agrário: ${bairro.agriculturalProfile} | Risco: ${bairro.topographicRisk}`,
      fullSpeechText: speech,
      metadataBadges: [
        bairro.name,
        `${bairro.dynamicWorldCropsSharePercent}% DW`,
        `${bairro.srtmAverageElevationM}m`,
        bairro.zoneGroup,
      ],
      targetTab: 'dados',
      targetParam: 'espacial',
      suggestedCrossings: [
        {
          label: 'Ver mapa espacial de Quissico em Dados',
          targetTab: 'dados',
          targetParam: 'espacial',
          relationNote: 'Matriz comparativa dos 11 bairros',
        },
      ],
    });
  });

  // 10. CHIRPS Correlation Summary
  items.push({
    id: 'chirps_correlation_summary',
    category: 'metodologia',
    categoryLabel: 'Conceitos e Metodologia',
    evidenceType: 'metodologia',
    evidenceTypeLabel: 'Análise Pluviométrica Satelital',
    title: 'Correlação Chuva CHIRPS v2.0 vs Produção: r = 0,057 (p = 0,762)',
    subtitle: 'Ausência de causalidade linear estrita e o paradoxo de 2023 (+78,1% chuva, -87% safra)',
    dissertationLocation: 'Capítulo 4 · Secção 4.4 (Validação Pluviométrica CHIRPS)',
    occurrenceContext: 'Verificação da hipótese de correlação direta entre precipitação acumulada e produção de mandioca',
    snippet: CHIRPS_CORRELATION_ANALYSIS.scientificCaveat,
    fullSpeechText: CHIRPS_CORRELATION_ANALYSIS.scientificCaveat,
    metadataBadges: ['r = 0,057', 'p = 0,762', 'Não-Linearidade', 'CHIRPS v2.0'],
    targetTab: 'dados',
    targetParam: 'chirps',
    suggestedCrossings: [
      {
        label: 'Ver análise CHIRPS na aba Dados',
        targetTab: 'dados',
        targetParam: 'chirps',
        relationNote: 'Série pluviométrica de 31 anos',
      },
      {
        label: 'Pergunta de arguição sobre chuva vs safra',
        targetTab: 'defesa',
        targetParam: 'q_7',
        relationNote: 'Fundamentação da não-linearidade biológica',
      },
    ],
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
  const baseList = categoryFilter === 'todos'
    ? searchIndexCache
    : searchIndexCache.filter((item) => item.category === categoryFilter);

  if (!cleanQuery) {
    return baseList.slice(0, 16).map((item) => ({
      ...item,
      matchReason: 'Registo fundamental da base de dados da dissertação',
    }));
  }

  const rawTerms = cleanQuery.split(/\s+/).filter(Boolean);
  const stopWords = new Set(['de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'e', 'a', 'o', 'as', 'os', 'um', 'uma', 't', 'ha']);
  const meaningfulTerms = rawTerms.filter((t) => !stopWords.has(t));
  const queryTerms = meaningfulTerms.length > 0 ? meaningfulTerms : rawTerms;

  const matched = baseList
    .map((item) => {
      const titleLower = item.title.toLowerCase();
      const subtitleLower = item.subtitle.toLowerCase();
      const locationLower = item.dissertationLocation.toLowerCase();
      const snippetLower = item.snippet.toLowerCase();
      const speechLower = item.fullSpeechText.toLowerCase();
      const badgesLower = item.metadataBadges.join(' ').toLowerCase();

      let score = 0;
      let reason = 'Correspondência geral no texto';

      const matchesAllTerms = queryTerms.every((term) => {
        // Support normalized number format (e.g. 547224 matching 547.224)
        const altTerm = term.includes('.') ? term.replace(/\./g, '') : null;

        const checkMatch = (target: string) => {
          if (target.includes(term)) return true;
          if (altTerm && target.replace(/\./g, '').includes(altTerm)) return true;
          return false;
        };

        const inTitle = checkMatch(titleLower);
        const inSubtitle = checkMatch(subtitleLower);
        const inLocation = checkMatch(locationLower);
        const inSnippet = checkMatch(snippetLower);
        const inSpeech = checkMatch(speechLower);
        const inBadges = checkMatch(badgesLower);

        if (inTitle) {
          score += 10;
          reason = 'Correspondência direta no título do registo';
        } else if (inLocation) {
          score += 8;
          reason = 'Correspondência na localização / capítulo da dissertação';
        } else if (inBadges) {
          score += 6;
          reason = 'Correspondência no metadado chave';
        } else if (inSubtitle) {
          score += 5;
          reason = 'Correspondência no sumário do registo';
        } else if (inSnippet) {
          score += 3;
          reason = 'Correspondência no excerto documental';
        } else if (inSpeech) {
          score += 1;
        }

        return inTitle || inSubtitle || inLocation || inSnippet || inSpeech || inBadges;
      });

      if (!matchesAllTerms) return null;

      return {
        ...item,
        score,
        matchReason: reason,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.score - a.score);

  return matched;
}
