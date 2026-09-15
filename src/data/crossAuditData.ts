/**
 * Base Canónica da Auditoria Científica Cruzada e Matriz de Coerência
 * FASE 12 — ZAVALAVOZ (UEM / ESUDER • Yolanda Tamele)
 * 
 * Regra Absoluta: SSoT em src/data/thesisScientificData.ts é a autoridade máxima.
 * Qualquer aparente divergência documental é sinalizada como "Ponto a verificar no corpus".
 */

import {
  THESIS_CORE_FACTS,
  SCIENTIFIC_TIME_SERIES,
  THESIS_FIELD_DATA_SUMMARY,
  QUISSICO_BAIRROS_SPATIAL,
  DATA_SOURCES_REGISTRY,
  SCIENTIFIC_LIMITATIONS,
} from './thesisScientificData';
import { REAL_FIELD_PHOTOS } from './fieldPhotos';
import { FIELD_INTERVIEWS } from './fieldInterviews';
import { ADVERSARIAL_VULNERABILITIES } from './adversarialVulnerabilities';
import { AuditAxisItem, CoherenceMatrixItem } from '../types/crossAudit';

// ============================================================================
// 1. QUATRO EIXOS EDITORIAIS DE AUDITORIA
// ============================================================================

export const AUDIT_AXES_ITEMS: AuditAxisItem[] = [
  // EIXO A: DADOS
  {
    id: 'eixo_dados_hibrido',
    axis: 'dados',
    title: 'Série Temporal Híbrida: 23 Anos Modelados vs 8 Anos Observados',
    canonicalFact: 'A série de 31 anos (1994–2024) compõe-se de 23 anos reconstituídos (1994–2016) e 8 anos observados (2017–2024).',
    epistemicStatus: 'RECONSTITUÍDO / MODELADO',
    ssotReference: 'THESIS_CORE_FACTS.modeledPeriod e observedPeriod',
    thesisSection: 'Capítulo 3 (Metodologia) & Capítulo 4 (Série Histórica)',
    verificationCheck: 'Confrontar se qualquer cálculo pré-2017 é apresentado como dado empírico observado do SDAE.',
    potentialTensionOrCaveat: 'Ponto a verificar no corpus: A ausência de registos contínuos pré-2017 exige demarcação clara entre dado observado e estimativa.',
    safeDefenseFormulation: 'Os dados do SDAE são primários entre 2017 e 2024 (8 anos). O período 1994–2016 (23 anos) assenta em reconstituição determinística em três camadas com ancoragem em inquéritos FAO/TIA.',
  },
  {
    id: 'eixo_dados_extremos',
    axis: 'dados',
    title: 'Valores Extremos Canónicos da Série Temporal',
    canonicalFact: '1994 = 52.164 t (base modelada); 2021 = 273.773 t (pico observado); 2023 = 35.371 t (mínimo observado pós-Freddy); 2024 = 48.573 t (safra final).',
    epistemicStatus: 'OBSERVADO',
    ssotReference: 'THESIS_CORE_FACTS: initialProductionTonnes, peakProductionTonnes, minimumProductionTonnes, terminalProductionTonnes',
    thesisSection: 'Capítulo 4 (Tabela 4.1 da Dissertação)',
    verificationCheck: 'Garantir que 1994 é classificado como MODELADO e 2021/2023/2024 como OBSERVADOS.',
    potentialTensionOrCaveat: 'Ponto a verificar no corpus: O valor de 1994 provém de modelação retrospectiva, enquanto 2021 constitui registo oficial primário do SDAE.',
    safeDefenseFormulation: 'A safra de 2021 atingiu o pico documentado de 273.773 toneladas em dados primários do SDAE. O valor base de 1994 (52.164 t) foi obtido pela modelação determinística.',
  },
  {
    id: 'eixo_dados_espacial',
    axis: 'dados',
    title: 'Circunscrição Espacial: Quissico (11 Bairros, 22.343 ha) vs Distrito',
    canonicalFact: 'A microanálise cartográfica de uso do solo e altimetria refere-se estritamente ao Posto Administrativo de Quissico (22.343 ha distribuídos por 11 bairros).',
    epistemicStatus: 'OBSERVADO',
    ssotReference: 'THESIS_CORE_FACTS.spatialAreaQuissicoHa e spatialBairrosCount',
    thesisSection: 'Capítulo 5 (Análise Espacial Intra-Posto)',
    verificationCheck: 'Verificar se conclusões sobre várzeas e risco de alagamento de Quissico estão a ser extrapoladas indevidamente para Zandamela, Massava ou Mavila.',
    potentialTensionOrCaveat: 'Ponto a verificar no corpus: Os 11 bairros cartografados cobrem o posto sede de Quissico, não a totalidade dos 4 postos de Zavala.',
    safeDefenseFormulation: 'A cartografia detalhada Sentinel-2 e SRTM refere-se exclusivamente aos 22.343 ha de Quissico, servindo como estudo de caso de heterogeneidade topográfica.',
  },

  // EIXO B: MÉTODO
  {
    id: 'eixo_metodo_mann_kendall',
    axis: 'metodo',
    title: 'Monotonicidade Temporal: Mann-Kendall com Ajuste de Hamed & Rao',
    canonicalFact: 'O teste de Mann-Kendall com correção de autocorrelação serial de Hamed & Rao (1998) revelou Z = 3,100 (p = 0,0019).',
    epistemicStatus: 'OBSERVADO',
    ssotReference: 'THESIS_CORE_FACTS.mannKendallZ e mannKendallPValue',
    thesisSection: 'Capítulo 4 (Tendência Não-Paramétrica)',
    verificationCheck: 'Verificar se o teste de Mann-Kendall está a ser interpretado apenas como tendência ordinal e não como causalidade funcional.',
    potentialTensionOrCaveat: 'Ponto a verificar no corpus: O teste confirma a direção monotónica da trajetória temporal dos 31 anos, mas não explica os motores causais do crescimento.',
    safeDefenseFormulation: 'O teste de Mann-Kendall atesta de forma estatisticamente robusta uma tendência monotónica crescente (Z = 3,100; p = 0,0019), sem assumir distribuição paramétrica.',
  },
  {
    id: 'eixo_metodo_regressao_ols',
    axis: 'metodo',
    title: 'Taxa Estrutural de Expansão: OLS com Erros Padrão Newey-West',
    canonicalFact: 'A regressão linear OLS com correção de Newey-West para autocorrelação e heterocedasticidade apurou declive de +4.229 t/ano (p = 0,020; R² = 0,174).',
    epistemicStatus: 'MODELADO',
    ssotReference: 'THESIS_CORE_FACTS.olsSlopeTonnesYear, olsPValue, olsR2',
    thesisSection: 'Capítulo 4 (Modelos Econométricos)',
    verificationCheck: 'Confirmar que o R² moderado (0,174) é interpretado como evidência da forte volatilidade e choque em torno da linha média.',
    potentialTensionOrCaveat: 'Ponto a verificar no corpus: O crescimento médio de 4.229 t/ano convive com oscilações anuais violentas provocadas por secas e ciclones.',
    safeDefenseFormulation: 'A regressão linear com erros corrigidos Newey-West aponta um acréscimo médio de 4.229 t/ano (p = 0,020), com R² de 0,174 que evidencia a elevada dispersão anual da cultura.',
  },
  {
    id: 'eixo_metodo_chirps_pearson',
    axis: 'metodo',
    title: 'Análise Agroclimática: Correlação Satelital CHIRPS v2.0',
    canonicalFact: 'A correlação linear de Pearson entre precipitação CHIRPS acumulada na estação chuvosa e a produção é r = 0,057 (p = 0,762; R² = 0,003).',
    epistemicStatus: 'OBSERVADO',
    ssotReference: 'THESIS_CORE_FACTS.chirpsRainfallCorrelation e chirpsPValue',
    thesisSection: 'Capítulo 4 (Análise Climática e Pluviometria)',
    verificationCheck: 'Assegurar que a correlação nula é explicitada, impedindo qualquer linguagem de causalidade pluviométrica linear.',
    potentialTensionOrCaveat: 'Ponto a verificar no corpus: r = 0,057 demonstra que a precipitação acumulada anual isolada não explica linearmente o volume de mandioca colhido.',
    safeDefenseFormulation: 'A correlação linear de Pearson é praticamente nula (r = 0,057; p = 0,762), demonstrando a não-linearidade biológica da mandioca face à chuva acumulada.',
  },

  // EIXO C: RESULTADOS
  {
    id: 'eixo_resultados_perdas_contrafactuais',
    axis: 'resultados',
    title: 'Perdas Biofísicas Acumuladas: 547.224 t em 14 Anos Adversos',
    canonicalFact: 'O diferencial acumulado de perdas nos 14 anos adversos do período 1994–2016 totaliza 547.224 toneladas sob a baseline potencial de 7 t/ha.',
    epistemicStatus: 'MODELADO',
    ssotReference: 'THESIS_CORE_FACTS.accumulatedLossesTonnes e adverseYearsCountModeled',
    thesisSection: 'Capítulo 4 (Estimativa Biofísica Contrafactual)',
    verificationCheck: 'Impedir terminantemente que as 547.224 t sejam apresentadas como pesagens físicas ou colheita perdida registada em armazém.',
    potentialTensionOrCaveat: 'Ponto a verificar no corpus: As 547.224 t são um constructo analítico contrafactual relativo ao potencial teórico sem restrições, não produto físico destruído.',
    safeDefenseFormulation: 'As 547.224 toneladas representam o volume cumulativo estimado no cenário contrafactual face à tendência potencial de 7 t/ha, e não perdas físicas pesadas.',
  },
  {
    id: 'eixo_resultados_paradoxo_2023',
    axis: 'resultados',
    title: 'Paradoxo de 2023: Excesso Hídrico e Asfixia Radicular no Ciclone Freddy',
    canonicalFact: 'Em 2023, sob precipitação recorde de 1.493 mm (anomalia de +52,3%), a produção colapsou para 35.371 t (-92,8% vs 2022).',
    epistemicStatus: 'OBSERVADO',
    ssotReference: 'SCIENTIFIC_TIME_SERIES (Ano 2023)',
    thesisSection: 'Capítulo 4 (Análise de Eventos Extremos)',
    verificationCheck: 'Verificar se o colapso é atribuído a seca em vez de asfixia radicular por excesso de água em várzeas arenosas.',
    potentialTensionOrCaveat: 'Ponto a verificar no corpus: Demonstração empírica de que tanto o défice hídrico severo como o alagamento prolongado destroem a mandioca.',
    safeDefenseFormulation: 'A safra de 2023 ilustra o paradoxo agroclimático da cultura: com 1.493 mm de chuva, o alagamento prolongado e a asfixia radicular causaram o colapso para 35.371 t.',
  },

  // EIXO D: INTERPRETAÇÃO
  {
    id: 'eixo_interpretacao_testemunho_diagnostico',
    axis: 'interpretacao',
    title: 'Testemunho Camponês vs Diagnóstico Laboratorial Fitopatológico',
    canonicalFact: 'Os 77 inquéritos colheram a percepção empírica e sintomas visuais descritos pelos produtores, sem testes moleculares ou isolamento de estirpes virais.',
    epistemicStatus: 'TESTEMUNHO DE CAMPO',
    ssotReference: 'THESIS_FIELD_DATA_SUMMARY (77 formulários, 51 páginas)',
    thesisSection: 'Capítulo 6 (Trabalho de Campo e Etnografia Agrária)',
    verificationCheck: 'Alertar se o relato camponês de apodrecimento na cova for tratado como confirmação biológica laboratorial de CBSD ou CMD.',
    potentialTensionOrCaveat: 'Ponto a verificar no corpus: A voz do produtor documenta o impacto agronómico vivido, mas a identificação clínica viral requer confirmação laboratorial ausente.',
    safeDefenseFormulation: 'Os inquéritos de campo documentam o saber empírico dos agricultores e os sintomas visuais observados, sem pretender substituir o diagnóstico fitopatológico laboratorial.',
  },
  {
    id: 'eixo_interpretacao_expansao_area',
    axis: 'interpretacao',
    title: 'Motor de Crescimento: Expansão Extensiva de Área vs Rendimento',
    canonicalFact: 'O aumento da produção total resultou primordialmente da expansão da área cultivada (16.200 ha em 1994 para 25.235 ha em 2024), mantendo rendimentos baixos.',
    epistemicStatus: 'INTERPRETAÇÃO',
    ssotReference: 'THESIS_CORE_FACTS e SCIENTIFIC_TIME_SERIES',
    thesisSection: 'Capítulo 7 (Discussão e Implicações)',
    verificationCheck: 'Evitar afirmar que a mandioca em Zavala registou um salto tecnológico de produtividade unitária.',
    potentialTensionOrCaveat: 'Ponto a verificar no corpus: A dinâmica observada é extensiva e resiliente por incorporação de terra, e não de intensificação agronómica com capitalização.',
    safeDefenseFormulation: 'Interpreto este resultado como uma resposta extensiva camponesa: o acréscimo de volume baseia-se na abertura de novas parcelas, mantendo rendimentos unitários modestos.',
  },
];

// ============================================================================
// 2. MATRIZ DE COERÊNCIA (AFIRMAÇÕES CANÓNICAS DA DISSERTAÇÃO)
// ============================================================================

export const COHERENCE_MATRIX_ITEMS: CoherenceMatrixItem[] = [
  // 1. TENDÊNCIA TEMPORAL CRESCENTE
  {
    id: 'matriz_tendencia_crescente',
    title: 'Tendência Estrutural Crescente da Produção de Mandioca',
    statement: 'A produção de mandioca no Distrito de Zavala apresenta uma tendência temporal estatisticamente significativa e crescente ao longo dos 31 anos (1994–2024).',
    domain: 'Tendência Temporal',
    question: 'Qual foi o comportamento temporal de longo prazo da produção de mandioca no Distrito de Zavala entre 1994 e 2024?',
    dataBasis: {
      period: '1994–2024 (31 anos)',
      values: 'Produção média 115.333 t; mínimo 35.371 t (2023); máximo 273.773 t (2021)',
      source: 'Série Histórica Híbrida (Reconstituição 1994–2016 e SDAE 2017–2024)',
      status: 'RECONSTITUÍDO / MODELADO',
    },
    methodBasis: 'Teste não-paramétrico de Mann-Kendall com correção de Hamed & Rao (1998) e Regressão Linear OLS com estimador de Newey-West.',
    resultBasis: 'Mann-Kendall: Z = 3,100 (p = 0,0019); OLS: declive = +4.229 t/ano (p = 0,020; R² = 0,174); Crescimento log-linear = 3,20% a.a. (p = 0,014).',
    interpretationBasis: 'Existe uma trajetória estrutural de expansão da produção ao longo das três décadas, sustentada pela incorporação contínua de área cultivada pelas famílias camponesas.',
    limitationBasis: 'A tendência temporal agregada não demonstra ausência de vulnerabilidade nem causalidade climática linear; o R² de 0,174 reflete forte dispersão em anos de choque.',
    provenanceTrail: 'SSoT → THESIS_CORE_FACTS → Modelos Econométricos (olsSlopeTonnesYear, mannKendallZ)',
    associatedVulnerabilityCode: 'V10',
    evidenceNodes: [
      {
        id: 'ev_mk_stat',
        title: 'Estatística de Mann-Kendall',
        epistemicType: 'OBSERVADO',
        description: 'Z = 3,100; p = 0,0019 com ajuste de Hamed & Rao para autocorrelação serial.',
        sourceSsot: 'THESIS_CORE_FACTS.mannKendallZ',
        provenance: 'Capítulo 4 da Dissertação (Tabela 4.2)',
      },
      {
        id: 'ev_ols_slope',
        title: 'Declive OLS Newey-West',
        epistemicType: 'MODELADO',
        description: '+4.229 toneladas/ano (p = 0,020; R² = 0,174) com variância corrigida.',
        sourceSsot: 'THESIS_CORE_FACTS.olsSlopeTonnesYear',
        provenance: 'Capítulo 4 da Dissertação (Tabela 4.2)',
      },
      {
        id: 'ev_series_hybrid',
        title: 'Série Temporal 31 Anos',
        epistemicType: 'RECONSTITUÍDO / MODELADO',
        description: '31 anos totais (23 anos modelados em 3 camadas e 8 anos observados do SDAE).',
        sourceSsot: 'SCIENTIFIC_TIME_SERIES',
        provenance: 'Capítulo 3 (Metodologia) & Capítulo 4 (Tabela 4.1)',
      },
    ],
    defenseConfrontation: {
      directQuestion: 'Como sabe que essa tendência crescente não resulta unicamente da forma como a série foi modelada antes de 2017?',
      counterArgument: 'Se 23 dos 31 anos são reconstituídos através de um modelo determinístico, que confiança científica atribui a essa taxa de 4.229 t/ano?',
      pressureQuestion: 'Então a candidata está a apresentar à banca como evidência observacional uma tendência gerada em larga medida pela própria modelação?',
      safeDefenseResponse: {
        introduction: 'Eu diria que a tendência foi testada com absoluto rigor econométrico para evitar qualquer artefacto da reconstituição.',
        dataProof: 'Os dados mostram um teste não-paramétrico de Mann-Kendall com Z = 3,100 (p = 0,0019) e uma regressão OLS de +4.229 t/ano com erros Newey-West robustos.',
        limitationCaveat: 'Contudo, há uma limitação estrutural reconhecida: 23 anos são modelados e apenas 8 são observações primárias do SDAE, embora o teste de Chow (F = 0,84; p = 0,443) comprove a estabilidade entre os períodos.',
        conclusion: 'Por isso, interpreto este resultado como a demonstração de uma trajetória de expansão extensiva camponesa de longo prazo, e não como uma previsão mecânica livre de choques.',
        fullOralText: 'Eu diria que a tendência foi testada com absoluto rigor econométrico. Os dados mostram um teste de Mann-Kendall de Z = 3,100 (p = 0,0019) e acréscimo OLS de 4.229 t/ano. Contudo, há uma limitação estrutural: 23 anos são reconstituídos e 8 observados, com teste de Chow a assegurar estabilidade. Por isso, interpreto este resultado como uma expansão extensiva camponesa de longo prazo.',
      },
    },
  },

  // 2. NATUREZA HÍBRIDA DA SÉRIE TEMPORAL
  {
    id: 'matriz_serie_hibrida',
    title: 'Hibridez Metodológica da Série Histórica (1994–2024)',
    statement: 'A série temporal de produção de mandioca é estruturalmente híbrida, conjugando 23 anos de reconstituição determinística (1994–2016) e 8 anos de dados primários observados do SDAE (2017–2024).',
    domain: 'Série Híbrida',
    question: 'Qual é o estatuto epistemológico e a proveniência dos dados que sustentam a série temporal de 31 anos?',
    dataBasis: {
      period: '1994–2016 (23 anos) vs 2017–2024 (8 anos)',
      values: '1994–2016: Reconstituição determinística em 3 camadas; 2017–2024: Registos oficiais SDAE Zavala',
      source: 'DATA_SOURCES_REGISTRY (SDAE Zavala, TIA/FAO, CHIRPS v2.0)',
      status: 'RECONSTITUÍDO / MODELADO',
    },
    methodBasis: 'Reconstituição em três camadas (Camada 1: ancoragem TIA/FAO; Camada 2: calibração SPI/CHIRPS; Camada 3: ajuste por eventos históricos) e teste de quebra estrutural de Chow.',
    resultBasis: '8 anos empíricos observados (2017–2024); 23 anos modelados (1994–2016); Teste de Chow: F = 0,84 (p = 0,443), sem quebra estrutural artificial.',
    interpretationBasis: 'A reconstituição permitiu colmatar a ausência de registos distritais no período pós-guerra civil (1994–2016) mantendo coerência estatística com a fase observada.',
    limitationBasis: 'A assimetria metodológica entre dados reconstituídos e observados exige prudência: as variações anuais pré-2017 devem ser lidas como aproximações calibradas.',
    provenanceTrail: 'SSoT → THESIS_CORE_FACTS → modeledPeriod, observedPeriod, DATA_SOURCES_REGISTRY',
    associatedVulnerabilityCode: 'V1',
    evidenceNodes: [
      {
        id: 'ev_sdae_obs',
        title: 'Registos Primários SDAE',
        epistemicType: 'OBSERVADO',
        description: 'Dados oficiais contínuos distritais cobrindo 2017 a 2024 (8 safras completas).',
        sourceSsot: 'SCIENTIFIC_TIME_SERIES (2017–2024)',
        provenance: 'Relatórios Oficiais do SDAE Zavala',
      },
      {
        id: 'ev_model_3layers',
        title: 'Modelação em 3 Camadas',
        epistemicType: 'MODELADO',
        description: 'Reconstituição retrospectiva determinística para 1994–2016.',
        sourceSsot: 'SCIENTIFIC_TIME_SERIES (1994–2016)',
        provenance: 'Capítulo 3 (Metodologia da Dissertação)',
      },
      {
        id: 'ev_chow_test',
        title: 'Teste de Quebra de Chow',
        epistemicType: 'MODELADO',
        description: 'F = 0,84; p = 0,443 confirmando estabilidade dos parâmetros entre períodos.',
        sourceSsot: 'SCIENTIFIC_LIMITATIONS',
        provenance: 'Capítulo 3 (Secção 3.4)',
      },
    ],
    defenseConfrontation: {
      directQuestion: 'Porque não limitou a dissertação aos 8 anos com dados oficiais em vez de recorrer a 23 anos de dados modelados?',
      counterArgument: 'Se um membro da banca argumentar que uma série de 8 anos seria insuficiente, mas que 23 anos modelados não passam de ficção matemática, como responde?',
      pressureQuestion: 'A candidata admite que grande parte dos números que analisa não foram colhidos no terreno mas gerados no computador?',
      safeDefenseResponse: {
        introduction: 'Eu diria que a opção pela série de 31 anos respondeu à necessidade de compreender a dinâmica histórica de longa duração pós-guerra.',
        dataProof: 'Os dados mostram que os 8 anos do SDAE representam observações primárias sólidas e que a transição com os 23 anos anteriores foi validada pelo teste de Chow (F = 0,84; p = 0,443).',
        limitationCaveat: 'Contudo, há uma limitação epistemológica clara: os 23 anos são modelados e não medições de campo, pelo que nunca os apresento como observações diretas.',
        conclusion: 'Por isso, interpreto este modelo como uma aproximação metodológica transparente que permitiu resgatar a memória produtiva distrital sem mascarar as suas incertezas.',
        fullOralText: 'Eu diria que a reconstituição respondeu à necessidade de avaliar a dinâmica de longa duração pós-guerra. Os dados mostram 8 anos primários validados e 23 anos modelados com teste de Chow (F = 0,84; p = 0,443). Contudo, assumo a limitação: não são medições diretas de campo. Por isso, interpreto a série como uma aproximação transparente e robusta.',
      },
    },
  },

  // 3. AUSÊNCIA DE CAUSALIDADE PLUVIOMÉTRICA LINEAR (CHIRPS)
  {
    id: 'matriz_clima_chirps',
    title: 'Ausência de Causalidade Linear da Precipitação Satelital (CHIRPS v2.0)',
    statement: 'A precipitação acumulada anual da estação chuvosa não explica de forma linear as flutuações da produção de mandioca no Distrito de Zavala.',
    domain: 'Clima e CHIRPS',
    question: 'Qual é o grau de associação estatística entre o volume pluviométrico satelital CHIRPS e a produção distrital de mandioca?',
    dataBasis: {
      period: '1994–2024 (31 anos)',
      values: 'Média pluviométrica histórica: 980,4 mm; extremos: 534,3 mm (2016) e 1.493,0 mm (2023)',
      source: 'CHIRPS v2.0 (Grelha 0,05° satelital calibrada)',
      status: 'OBSERVADO',
    },
    methodBasis: 'Cálculo do coeficiente de correlação linear de Pearson e análise de regressão bivariada com defasagens fenológicas.',
    resultBasis: 'Correlação de Pearson: r = 0,057; p = 0,762; R² = 0,003 (estatisticamente nula).',
    interpretationBasis: 'A mandioca possui plasticidade fenológica e capacidade de estivação biológica; choques operam por mecanismos não-lineares de desfasamento e asfixia de várzeas.',
    limitationBasis: 'A precipitação satelital de grelha (0,05°) estima volumes regionais acumulados, não captando a intensidade diária intra-parcelar nem a rápida percolação nos solos arenosos.',
    provenanceTrail: 'SSoT → THESIS_CORE_FACTS → chirpsRainfallCorrelation, chirpsPValue',
    associatedVulnerabilityCode: 'V3',
    evidenceNodes: [
      {
        id: 'ev_chirps_corr',
        title: 'Coeficiente de Pearson CHIRPS',
        epistemicType: 'OBSERVADO',
        description: 'r = 0,057 (p = 0,762; R² = 0,003) comprovando ausência de relação linear.',
        sourceSsot: 'THESIS_CORE_FACTS.chirpsRainfallCorrelation',
        provenance: 'Capítulo 4 da Dissertação (Tabela 4.3)',
      },
      {
        id: 'ev_chirps_anomaly_2016',
        title: 'Seca de El Niño 2016',
        epistemicType: 'OBSERVADO',
        description: '534,3 mm de chuva (-45,5% de anomalia) e perda modelada de 131.627 t.',
        sourceSsot: 'SCIENTIFIC_TIME_SERIES (Ano 2016)',
        provenance: 'Capítulo 4 (Figura 4.4)',
      },
      {
        id: 'ev_chirps_flood_2023',
        title: 'Cheia de Freddy 2023',
        epistemicType: 'OBSERVADO',
        description: '1.493,0 mm (+52,3% de anomalia) com quebra de safra para 35.371 t por asfixia.',
        sourceSsot: 'SCIENTIFIC_TIME_SERIES (Ano 2023)',
        provenance: 'Capítulo 4 (Figura 4.4)',
      },
    ],
    defenseConfrontation: {
      directQuestion: 'Se a mandioca é uma cultura de sequeiro em solo arenoso, como sustenta que a chuva não causou as quedas de produção?',
      counterArgument: 'Dizer que uma correlação de r = 0,057 significa que o clima é irrelevante não contraria a realidade física de Zavala?',
      pressureQuestion: 'A candidata está a sugerir que a seca não afeta a produção agrícola familiar?',
      safeDefenseResponse: {
        introduction: 'Eu diria que nunca afirmo que o clima é irrelevante, mas sim que a sua relação não é linear nem determinística.',
        dataProof: 'Os dados mostram um coeficiente de Pearson de r = 0,057 (p = 0,762), o que prova que anos com mais chuva acumulada não correspondem automaticamente a mais colheita.',
        limitationCaveat: 'Contudo, há uma limitação inerente aos índices de satélite: o CHIRPS acumula milímetros em grelhas de 5 km, mas não regista a asfixia em baixas nem a distribuição dos dias sem chuva.',
        conclusion: 'Por isso, interpreto este resultado como prova da não-linearidade biológica da mandioca, em que tanto a seca extrema como o alagamento de 2023 geram quebras graves.',
        fullOralText: 'Eu diria que nunca afirmo que o clima é irrelevante, mas sim que a relação não é linear. Os dados mostram r = 0,057 (p = 0,762), provando que mais chuva acumulada não significa mais mandioca. Contudo, há a limitação de que o satélite mede agregados regionais e não a asfixia radicular local. Por isso, interpreto o resultado como prova da resiliência e não-linearidade da cultura.',
      },
    },
  },

  // 4. PERDAS BIOFÍSICAS CONTRAFACTUAIS (547.224 t)
  {
    id: 'matriz_perdas_contrafactuais',
    title: 'Estimativa Contrafactual de Perdas Biofísicas Acumuladas',
    statement: 'As 547.224 toneladas correspondem ao diferencial acumulado de perdas face à linha de base potencial de 7 t/ha nos 14 anos adversos do período 1994–2016.',
    domain: 'Perdas Contrafactuais',
    question: 'Qual é a natureza e a magnitude das perdas calculadas para os anos de choque agroclimático na série histórica?',
    dataBasis: {
      period: '1994–2016 (14 anos adversos)',
      values: '547.224 toneladas acumuladas; maior perda individual: 131.627 t na seca de 2016',
      source: 'Modelo Determinístico de Perdas Biofísicas (baseline 7,0 t/ha)',
      status: 'MODELADO',
    },
    methodBasis: 'Cálculo da trajetória potencial contrafactual ($Y^* = 7,0\\text{ t/ha} \\times \\text{Área}$) deduzida da produção modelada para cada ano adverso.',
    resultBasis: '547.224 t perdidas cumulativamente em 14 anos adversos no período 1994–2016.',
    interpretationBasis: 'O número exprime o custo de oportunidade biofísico decorrente de choques de seca, cheia e escassez de material vegetativo sadio.',
    limitationBasis: 'Não se trata de produto físico pesado ou destruído em armazéns; assume que a área plantada teria atingido 7 t/ha na ausência de restrições bióticas ou climáticas.',
    provenanceTrail: 'SSoT → THESIS_CORE_FACTS → accumulatedLossesTonnes, adverseYearsCountModeled',
    associatedVulnerabilityCode: 'V6',
    evidenceNodes: [
      {
        id: 'ev_loss_tonnes',
        title: 'Volume Acumulado de Perdas',
        epistemicType: 'MODELADO',
        description: '547.224 toneladas estimadas no período 1994–2016 em 14 safras adversas.',
        sourceSsot: 'THESIS_CORE_FACTS.accumulatedLossesTonnes',
        provenance: 'Capítulo 4 da Dissertação (Tabela 4.4)',
      },
      {
        id: 'ev_baseline_7t',
        title: 'Linha de Base Potencial de 7 t/ha',
        epistemicType: 'MODELADO',
        description: 'Rendimento agroecológico de referência para mandioca em sequeiro sem choques.',
        sourceSsot: 'SCIENTIFIC_LIMITATIONS',
        provenance: 'Capítulo 3 (Secção 3.3)',
      },
    ],
    defenseConfrontation: {
      directQuestion: 'Quem pesou essas 547.224 toneladas de mandioca perdida no campo?',
      counterArgument: 'Se ninguém pesou este volume, não está a apresentar uma estimativa hipotética como se fosse uma estatística de produção real?',
      pressureQuestion: 'A candidata reconhece que este valor de mais de meio milhão de toneladas é puramente teórico?',
      safeDefenseResponse: {
        introduction: 'Eu diria que ninguém pesou categoricamente estas toneladas no campo, porque se trata de uma estimativa contrafactual.',
        dataProof: 'Os dados mostram um diferencial acumulado de 547.224 toneladas calculado estritamente nos 14 anos adversos face à linha de base de 7 t/ha.',
        limitationCaveat: 'Contudo, há que demarcar com rigor: não são perdas físicas pesadas em balança nem registos de armazém, mas um constructo biofísico modelado.',
        conclusion: 'Por isso, interpreto este valor como a quantificação da oportunidade produtiva perdida pelas famílias camponesas devido aos choques sucessivos.',
        fullOralText: 'Eu diria com clareza que ninguém pesou estas toneladas, pois trata-se de uma estimativa contrafactual. Os dados mostram 547.224 t calculadas pelo diferencial face à baseline de 7 t/ha em 14 anos adversos. Contudo, há que demarcar: não é perda física pesada. Por isso, interpreto este resultado como a mensuração da oportunidade perdida face aos choques sucessivos.',
      },
    },
  },

  // 5. ANÁLISE ESPACIAL CIRCUNSCRITA AOS 11 BAIRROS DE QUISSICO
  {
    id: 'matriz_espacial_quissico',
    title: 'Heterogeneidade Topográfica e Espacial nos 11 Bairros de Quissico',
    statement: 'A análise espacial de uso da terra e altimetria comprova acentuada heterogeneidade intra-posto nos 11 bairros de Quissico (22.343 ha), com bairros deprimidos sujeitos a asfixia radicular.',
    domain: 'Espacial Quissico',
    question: 'Qual é a diferenciação espacial e topográfica da produção e do risco de alagamento no Posto de Quissico?',
    dataBasis: {
      period: '2023–2024 (Cartografia atual) & Série Histórica ESA-CCI',
      values: '22.343 hectares totais; 11 bairros cartografados; bairros Nzile e Macomane com cotas < 9 metros',
      source: 'SRTM Altimetria (30m) & Sentinel-2 Dynamic World (10m) & ESA-CCI',
      status: 'OBSERVADO',
    },
    methodBasis: 'Cruzamento geoespacial em SIG entre polígonos dos bairros, modelo digital de elevação SRTM e classificação de cobertura da terra Dynamic World (P75).',
    resultBasis: '11 bairros classificados em Costeiros, Intermédios e Interiores; cotas médias entre 6,2m (Nzile) e 142m (bairros interiores).',
    interpretationBasis: 'A vulnerabilidade à asfixia radicular não é homogénea no território; agricultores que cultivam em baixas litorâneas enfrentam risco crítico em anos de ciclone.',
    limitationBasis: 'A análise cartográfica detalhada está circunscrita ao Posto de Quissico (22.343 ha) e não pode ser generalizada automaticamente para os outros 3 postos de Zavala.',
    provenanceTrail: 'SSoT → THESIS_CORE_FACTS → spatialAreaQuissicoHa, QUISSICO_BAIRROS_SPATIAL',
    associatedVulnerabilityCode: 'V5',
    evidenceNodes: [
      {
        id: 'ev_quissico_area',
        title: 'Delimitação Territorial Quissico',
        epistemicType: 'OBSERVADO',
        description: '22.343 ha nos 11 bairros cartografados (99,9% da área do posto).',
        sourceSsot: 'THESIS_CORE_FACTS.spatialAreaQuissicoHa',
        provenance: 'Capítulo 5 da Dissertação (Tabela 5.2)',
      },
      {
        id: 'ev_srtm_elevation',
        title: 'Modelo de Elevação SRTM 30m',
        epistemicType: 'OBSERVADO',
        description: 'Primeiro quartil altimétrico (< 9m) concentrado nos bairros litorâneos.',
        sourceSsot: 'QUISSICO_BAIRROS_SPATIAL',
        provenance: 'Capítulo 5 (Carta 5.2)',
      },
      {
        id: 'ev_dynamic_world',
        title: 'Sentinel-2 Dynamic World',
        epistemicType: 'OBSERVADO',
        description: 'Fração de cobertura de culturas agrícolas estimada a 10m de resolução.',
        sourceSsot: 'QUISSICO_BAIRROS_SPATIAL',
        provenance: 'Capítulo 5 (Carta 5.1)',
      },
    ],
    defenseConfrontation: {
      directQuestion: 'Os 11 bairros que analisou representam fielmente a realidade agrária de todo o Distrito de Zavala?',
      counterArgument: 'Se a amostra espacial cobre apenas 22.343 hectares em Quissico, como pode tirar conclusões sobre a dinâmica distrital?',
      pressureQuestion: 'Não houve aqui uma extrapolação indevida dos dados do posto sede para os outros três postos administrativos?',
      safeDefenseResponse: {
        introduction: 'Eu diria que, com toda a segurança metodológica, os 11 bairros não representam todo o distrito e que nunca foram extrapolados dessa forma.',
        dataProof: 'Os dados mostram uma delimitação explícita aos 22.343 ha do Posto de Quissico, onde bairros como Nzile apresentam cotas abaixo de 9m.',
        limitationCaveat: 'Contudo, há uma fronteira espacial que declaro expressamente: os postos de Zandamela, Massava e Mavila possuem características agroecológicas distintas que não foram mapeadas na mesma escala.',
        conclusion: 'Por isso, interpreto a análise de Quissico como um estudo de caso aprofundado da heterogeneidade topográfica intra-posto e do risco localizado de asfixia radicular.',
        fullOralText: 'Eu diria com rigor que os 11 bairros não representam todo o distrito e que não foram extrapolados. Os dados mostram uma análise cartográfica restrita aos 22.343 ha de Quissico. Contudo, há a limitação territorial clara: Zandamela, Massava e Mavila têm dinâmicas que exigem estudos próprios. Por isso, interpreto Quissico como um estudo de caso da heterogeneidade e do risco topográfico.',
      },
    },
  },

  // 6. TRABALHO DE CAMPO EMPÍRICO E AUSÊNCIA DE DIAGNÓSTICO LABORATORIAL
  {
    id: 'matriz_trabalho_campo',
    title: 'Percepção Empírica dos Produtores vs Diagnóstico Fitopatológico',
    statement: 'Os inquéritos e o caderno de campo recolhem os relatos fidedignos e a perceção agronómica das famílias rurais, não constituindo validação laboratorial fitopatológica.',
    domain: 'Trabalho de Campo',
    question: 'Qual é o alcance metodológico dos testemunhos dos produtores sobre pragas e quebras de rendimento em Zavala?',
    dataBasis: {
      period: 'Campanhas Agrícolas 2023/2024 e Recenseamento Etnográfico',
      values: '77 inquéritos transcritos em 51 páginas de caderno; 10 fotografias reais documentadas',
      source: 'Caderno de Campo de Yolanda Tamele (FIELD_INTERVIEWS, REAL_FIELD_PHOTOS)',
      status: 'TESTEMUNHO DE CAMPO',
    },
    methodBasis: 'Entrevistas semiestruturadas com agricultores e líderes comunitários, aliadas à observação direta e registo fotográfico em talhões.',
    resultBasis: '77 inquéritos válidos (61,1% mulheres); sintomatologia visual mais citada: apodrecimento da raiz na cova ("moché") e dessecação foliar.',
    interpretationBasis: 'O saber camponês documenta o impacto direto dos choques e orienta a compreensão da crise de sementes e material propagativo na comunidade.',
    limitationBasis: 'A investigação não realizou análises laboratoriais moleculares (PCR ou ELISA) para isolamento do vírus do estriamento castanho (CBSD) ou mosaico (CMD).',
    provenanceTrail: 'SSoT → THESIS_FIELD_DATA_SUMMARY → totalTranscribedQuestionnaireForms, totalNotebookPages',
    associatedVulnerabilityCode: 'V13',
    evidenceNodes: [
      {
        id: 'ev_interviews_77',
        title: '77 Inquéritos Transcritos',
        epistemicType: 'TESTEMUNHO DE CAMPO',
        description: 'Transcrição integral das 51 páginas de campo com relatos individuais e comunitários.',
        sourceSsot: 'THESIS_FIELD_DATA_SUMMARY.totalTranscribedQuestionnaireForms',
        provenance: 'Caderno de Campo (fieldInterviews.ts)',
      },
      {
        id: 'ev_field_photos_10',
        title: '10 Registos Fotográficos de Campo',
        epistemicType: 'TESTEMUNHO DE CAMPO',
        description: 'Documentação visual de talhões de sequeiro, arquitectura foliar e solos arenosos.',
        sourceSsot: 'REAL_FIELD_PHOTOS',
        provenance: 'Apêndice D da Dissertação (fieldPhotos.ts)',
      },
    ],
    defenseConfrontation: {
      directQuestion: 'Como pode afirmar que houve surto de CBSD se não realizou qualquer ensaio laboratorial nos tecidos das plantas?',
      counterArgument: 'Se um patologista vegetal contestar os testemunhos dos agricultores dizendo que o apodrecimento decorreu apenas de encharcamento e não de vírus, o que contrapõe?',
      pressureQuestion: 'A candidata não confunde percepção leiga camponesa com evidência agronómica fitopatológica?',
      safeDefenseResponse: {
        introduction: 'Eu diria que a dissertação distingue formalmente a percepção empírica do diagnóstico laboratorial.',
        dataProof: 'Os dados mostram 77 inquéritos transcritos em 51 páginas de caderno, onde os produtores descrevem sintomas visuais macroscópicos consistentes com quebras de safra.',
        limitationCaveat: 'Contudo, assumo a limitação metodológica: não realizei testes moleculares de biologia vegetal, pelo que nunca afirmo confirmação diagnóstica de laboratório.',
        conclusion: 'Por isso, interpreto esses testemunhos como a evidência etnográfica do choque sentido pelas famílias e como fundamento para a hipótese de infestação pós-Freddy.',
        fullOralText: 'Eu diria que a dissertação separa formalmente percepção empírica de diagnóstico laboratorial. Os dados mostram 77 inquéritos em 51 páginas onde os agricultores descrevem sintomas visuais. Contudo, assumo com clareza: não realizei testes moleculares de confirmação fitopatológica. Por isso, interpreto estes testemunhos como evidência socioprodutiva do impacto sentido pelas comunidades.',
      },
    },
  },

  // 7. PARADOXO DO CHOQUE HÍDRICO DE 2023 (FREDDY)
  {
    id: 'matriz_paradoxo_2023',
    title: 'Paradoxo Agroclimático de 2023: Asfixia Radicular por Excesso Hídrico',
    statement: 'O colapso da safra de 2023 para 35.371 toneladas sob precipitação de 1.493 mm comprova a vulnerabilidade da mandioca ao excesso hídrico prolongado e asfixia radicular.',
    domain: 'Choque Freddy 2023',
    question: 'Como se explica a queda histórica da produção de 2023 num ano de precipitação muito superior à média distrital?',
    dataBasis: {
      period: 'Ano Agrícola 2023 (Ciclone Freddy)',
      values: 'Produção: 35.371 t (-92,8% vs 2022); Chuva CHIRPS: 1.493,0 mm (+52,3% vs média 980,4 mm)',
      source: 'SDAE Zavala & CHIRPS v2.0 (Ano 2023)',
      status: 'OBSERVADO',
    },
    methodBasis: 'Análise de anomalia pluviométrica combinada com registos administrativos de calamidade e relatos de campo.',
    resultBasis: 'Mínimo absoluto de produção da série recente de 8 anos observado pelo SDAE (35.371 t) simultâneo à maior precipitação anual da série.',
    interpretationBasis: 'A mandioca tolera défices moderados de água mas não suporta hipóxia radicular prolongada em várzeas saturadas e baixas topográficas litorâneas.',
    limitationBasis: 'A estimativa do SDAE para 2023 foi realizada em condições de emergência humanitária pós-Freddy, podendo conter margens de subavaliação logística.',
    provenanceTrail: 'SSoT → SCIENTIFIC_TIME_SERIES (Ano 2023) → productionTonnes, chirpsRainfallMm',
    associatedVulnerabilityCode: 'V4',
    evidenceNodes: [
      {
        id: 'ev_prod_2023',
        title: 'Produção Primária SDAE 2023',
        epistemicType: 'OBSERVADO',
        description: '35.371 toneladas registadas oficialmente pelo SDAE Zavala.',
        sourceSsot: 'SCIENTIFIC_TIME_SERIES (2023)',
        provenance: 'Relatório Anual SDAE Zavala 2023',
      },
      {
        id: 'ev_rain_2023',
        title: 'Precipitação CHIRPS 2023',
        epistemicType: 'OBSERVADO',
        description: '1.493,0 mm de precipitação acumulada (+52,3% face à média histórica).',
        sourceSsot: 'SCIENTIFIC_TIME_SERIES (2023)',
        provenance: 'CHIRPS v2.0 Grid Point Zavala',
      },
    ],
    defenseConfrontation: {
      directQuestion: 'Se choveu 1.493 mm em 2023, porque não houve uma colheita recorde em vez do pior colapso de sempre?',
      counterArgument: 'Será que a quebra de 2023 não foi antes provocada por abandono dos campos e desmotivação dos produtores?',
      pressureQuestion: 'A candidata tem a certeza de que os dados do SDAE de 2023 não foram simplesmente distorcidos para solicitar ajuda de emergência?',
      safeDefenseResponse: {
        introduction: 'Eu diria que a safra de 2023 é o exemplo clássico do paradoxo agroclimático da mandioca.',
        dataProof: 'Os dados mostram 1.493 mm de chuva satelital concomitantes com a queda oficial para 35.371 toneladas no SDAE.',
        limitationCaveat: 'Contudo, reconheço a limitação operacional: a colheita dos dados pelo SDAE decorreu sob contingência severa após a passagem do Ciclone Freddy.',
        conclusion: 'Por isso, interpreto este resultado como a prova fisiológica de que a mandioca é destruída pela asfixia radicular quando o lençol freático sobe nas depressões litorâneas.',
        fullOralText: 'Eu diria que 2023 ilustra o paradoxo da cultura. Os dados mostram 1.493 mm de precipitação e uma colheita oficial de apenas 35.371 t. Contudo, há a limitação de que o levantamento do SDAE foi feito no rescaldo do Freddy. Por isso, interpreto o colapso como asfixia radicular em solos arenosos com drenagem impedida pelo lençol freático.',
      },
    },
  },

  // 8. ESTABILIDADE ECONOMÉTRICA E TESTE DE CHOW
  {
    id: 'matriz_quebra_chow',
    title: 'Estabilidade Paramétrica da Série: Teste de Quebra Estrutural de Chow',
    statement: 'O teste de Chow não rejeita a estabilidade dos parâmetros entre o período modelado e o período observado, validando a integração analítica dos 31 anos.',
    domain: 'Quebra Estrutural',
    question: 'A junção dos dados modelados (1994–2016) com os dados primários (2017–2024) introduz quebra estrutural artificial na série econométrica?',
    dataBasis: {
      period: 'Ponto de quebra no ano de 2017',
      values: 'F-calculado = 0,84 face a F-crítico = 3,34 (gl: 2, 27); p = 0,443',
      source: 'SCIENTIFIC_LIMITATIONS & Capítulo 3 da Dissertação',
      status: 'MODELADO',
    },
    methodBasis: 'Aplicação do teste econométrico de quebra de estabilidade paramétrica de Chow (1960) nas duas subamostras temporais.',
    resultBasis: 'F = 0,84 (p = 0,443). Não há evidência estatística de quebra na inclinação ou no intercepto da função de produção.',
    interpretationBasis: 'A reconstituição em três camadas foi calibrada de forma contínua com os dados do SDAE, garantindo homogeneidade da série para fins de análise de tendência.',
    limitationBasis: 'A não-rejeição da hipótese nula atesta compatibilidade paramétrica linear, mas não anula a diferença epistemológica inerente entre estimativa e registo empírico.',
    provenanceTrail: 'SSoT → SCIENTIFIC_LIMITATIONS → chowTestStatistic',
    associatedVulnerabilityCode: 'V2',
    evidenceNodes: [
      {
        id: 'ev_chow_stat',
        title: 'Estatística de Chow',
        epistemicType: 'MODELADO',
        description: 'F = 0,84 (p = 0,443) abaixo do valor crítico de F a 5% (3,34).',
        sourceSsot: 'SCIENTIFIC_LIMITATIONS',
        provenance: 'Capítulo 3 (Secção 3.4 da Dissertação)',
      },
    ],
    defenseConfrontation: {
      directQuestion: 'O teste de Chow garante que a série de 1994 a 2016 é equivalente a observações reais?',
      counterArgument: 'Se o modelo foi calibrado com base nos anos recentes, não é óbvio que o teste de Chow não encontraria quebra?',
      pressureQuestion: 'Um teste estatístico de estabilidade substitui a legitimidade de um registo oficial em falta?',
      safeDefenseResponse: {
        introduction: 'Eu diria que o teste de Chow não transforma estimativas em observações reais.',
        dataProof: 'Os dados mostram um teste com F = 0,84 (p = 0,443), confirmando que a relação econométrica não sofreu descontinuidade artificial no ponto de corte de 2017.',
        limitationCaveat: 'Contudo, há uma limitação epistemológica irremediável: o teste atesta consistência interna matemática, não veracidade empírica factual dos anos 90.',
        conclusion: 'Por isso, interpreto a série híbrida como estatisticamente coerente para avaliar tendências de três décadas, mas mantenho a separação estrita dos seus estatutos.',
        fullOralText: 'Eu diria que o teste de Chow não transforma modelos em dados observados. Os dados mostram F = 0,84 (p = 0,443), indicando estabilidade matemática dos parâmetros. Contudo, há a limitação óbvia: consistência não é veracidade documental. Por isso, interpreto o teste como validação econométrica da tendência, preservando sempre a separação epistemológica.',
      },
    },
  },

  // 9. EXPANSÃO DE ÁREA VS ESTAGNAÇÃO DE RENDIMENTOS
  {
    id: 'matriz_expansao_area',
    title: 'Dinâmica Produtiva: Incorporação de Terra vs Estagnação Tecnológica',
    statement: 'O crescimento da produção agregada de mandioca em Zavala assenta na expansão da área cultivada e não em ganhos de rendimento agrícola por hectare.',
    domain: 'Dinâmica de Área',
    question: 'Qual foi o fator preponderante para o crescimento da produção agregada: aumento de área colhida ou intensificação de produtividade?',
    dataBasis: {
      period: '1994–2024 (31 anos)',
      values: 'Área: 16.200 ha (1994) → 25.235 ha (2024); Rendimento: 3,22 t/ha (1994) → 1,92 t/ha (2024)',
      source: 'SCIENTIFIC_TIME_SERIES & Balanço Agrário Distrital',
      status: 'OBSERVADO',
    },
    methodBasis: 'Decomposição temporal da produção em produto de área colhida e rendimento médio unitário.',
    resultBasis: 'A área colhida expandiu-se em +55,8% ao longo dos 31 anos, enquanto o rendimento médio unitário oscilou entre 1,9 e 11,0 t/ha sem tendência ascendente sustentada.',
    interpretationBasis: 'A agricultura camponesa de Zavala responde à pressão alimentar aumentando a área de sequeiro com trabalho familiar, operando sob uma armadilha de baixa tecnologia e estacas de baixa sanidade.',
    limitationBasis: 'A área estimada inclui consociações tradicionais com leguminosas e milho, sendo difícil isolar a densidade populacional pura da mandioca na parcela.',
    provenanceTrail: 'SSoT → SCIENTIFIC_TIME_SERIES → areaHa, effectiveYieldTonnesHa',
    associatedVulnerabilityCode: 'V9',
    evidenceNodes: [
      {
        id: 'ev_area_growth',
        title: 'Evolução da Área Cultivada',
        epistemicType: 'OBSERVADO',
        description: 'Crescimento de 16.200 ha para 25.235 ha entre 1994 e 2024.',
        sourceSsot: 'SCIENTIFIC_TIME_SERIES (1994 e 2024)',
        provenance: 'Capítulo 4 da Dissertação (Tabela 4.1)',
      },
      {
        id: 'ev_yield_stagnation',
        title: 'Estagnação do Rendimento',
        epistemicType: 'OBSERVADO',
        description: 'Rendimento oscilando em torno de 5,8 t/ha, caindo para 1,92 t/ha em 2024.',
        sourceSsot: 'SCIENTIFIC_TIME_SERIES',
        provenance: 'Capítulo 4 (Figura 4.3)',
      },
    ],
    defenseConfrontation: {
      directQuestion: 'Se a produção agregada cresceu, não é sinal de que os camponeses adotaram melhores práticas agrícolas?',
      counterArgument: 'Como pode afirmar que o rendimento estagnou se em 2020 e 2021 o SDAE registou rendimentos superiores a 10 t/ha?',
      pressureQuestion: 'A expansão da área não prova antes o sucesso das políticas públicas agrárias como o SUSTENTA em Zavala?',
      safeDefenseResponse: {
        introduction: 'Eu diria que a evidência empírica mostra uma dinâmica eminentemente extensiva e não intensiva.',
        dataProof: 'Os dados mostram um aumento de 55,8% na área cultivada, enquanto os picos pontuais de 2020/2021 foram seguidos por quedas para menos de 2 t/ha em 2024.',
        limitationCaveat: 'Contudo, há que considerar a limitação dos dados de área, que englobam parcelas em consociação com amendoim e feijão.',
        conclusion: 'Por isso, interpreto este resultado como a confirmação de que o camponês de Zavala recorre à incorporação de terra para compensar a vulnerabilidade biológica das estacas.',
        fullOralText: 'Eu diria que a dinâmica foi extensiva e não intensiva. Os dados mostram a área a crescer mais de 50%, enquanto a produtividade por hectare permaneceu volátil e baixa. Contudo, há a limitação das consociações de culturas nos inquéritos. Por isso, interpreto a expansão da área como a estratégia de sobrevivência camponesa face à carência de estacas limpas e insumos.',
      },
    },
  },
];
