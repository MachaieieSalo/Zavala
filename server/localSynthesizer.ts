/**
 * Sintetizador Linguístico Local de Pesquisa Científica
 * ZAVALAVOZ — UEM / ESUDER • Arquitectura Híbrida Real (Fase 15.2)
 *
 * Responsável por:
 * 1. Produzir síntese linguística em linguagem natural quando o LLM externo estiver indisponível (429, timeout, sem créditos).
 * 2. Assegurar DIRECT ANSWER FIRST: a PRIMEIRA FRASE responde directamente à pergunta feita pelo utilizador.
 * 3. Nunca devolver trechos genéricos como "Camada 1: Âncoras..." que não respondem à pergunta.
 * 4. Integrar estritamente os factos canónicos da SSoT e evidências recuperadas.
 * 5. Estruturar as 4 secções editoriais obrigatórias:
 *    ### RESPOSTA, ### EVIDÊNCIA, ### INTERPRETAÇÃO, ### LIMITAÇÃO
 *    (e estrutura de sustentação oral em modo Preparar para Defesa).
 */

import {
  AnalyzedResearchQuestion,
  DeterministicEvaluation,
  RetrievedEvidenceItem,
  EpistemicStatus,
} from '../src/types/research';
import {
  THESIS_CORE_FACTS,
  SCIENTIFIC_TIME_SERIES,
  CHIRPS_CORRELATION_ANALYSIS,
  THESIS_FIELD_DATA_SUMMARY,
} from '../src/data/thesisScientificData';
import { sanitizeDirectAnswer, formatOralResponse } from './researchEngine';

export function synthesizeLocalNaturalLanguageResponse(
  analysis: AnalyzedResearchQuestion,
  deterministicContext: DeterministicEvaluation,
  evidence: RetrievedEvidenceItem[],
  isDefenseMode: boolean = false
): {
  answerText: string;
  epistemicStatus: EpistemicStatus;
} {
  const { normalizedQuery, originalQuery, detectedYears } = analysis;
  let primaryEpistemicStatus = deterministicContext.primaryEpistemicStatus;

  let directAnswer = '';
  let naturalExplanation = '';
  let specificEvidence = deterministicContext.evidenceSummary;
  let specificInterpretation = deterministicContext.interpretationBreakdown;
  let specificLimitation = deterministicContext.limitation;

  // =========================================================================
  // 1. CASO ESPECÍFICO: Proporção de 15% / Calibração Distrital (Inhambane / Zavala)
  // =========================================================================
  if (analysis.isProportion15Percent) {
    primaryEpistemicStatus = 'MODELADO';
    directAnswer =
      'A proporção de aproximadamente ~15% refere-se à calibração metodológica da participação do Distrito de Zavala na produção provincial de mandioca de Inhambane (fundamentada nos inquéritos do projecto PROSUL 2014–2019 e do documento World Bank Jobs WP No. 31 sobre 127.000 hectares provinciais).';

    naturalExplanation =
      'Na dissertação de Yolanda Tamele, Zavala é caracterizado como o epicentro agroecológico da cultura em Inhambane, respondendo historicamente por cerca de 15% do volume provincial sob solos arenosos de elevada vulnerabilidade. Complementarmente, a dissertação incorpora bandas de confiança e incerteza metodológica de ±15% para anos regulares de colheita e discute, no plano das políticas públicas de pós-colheita, o potencial de incorporação obrigatória de 15% a 20% de farinha de mandioca de alta qualidade (HQCF) no fabrico de pão para contenção de importações de trigo.';

    specificEvidence =
      '• thesisModelData.ts → Camada 1: Âncoras Observadas Distritais (PROSUL 2014–19; World Bank Jobs WP No. 31)\n• dissertationText.ts → Questão #1 & Questão #38 da Banca de Defesa\n• thesisScientificData.ts → Registo de Bandas de Incerteza do Modelo (±15%)';

    specificInterpretation =
      '• Dado Documentado: Calibração distrital de Zavala em ~15% da produção provincial de Inhambane em 127.000 ha.\n• Estatuto Epistemológico: MODELADO / INTERPRETAÇÃO.';

    specificLimitation =
      'A proporção constitui um parâmetro de calibração histórica de escala agregada para os anos sem dados primários, não devendo ser interpretada como percentagem física invariável em todas as safras.';
  }

  // =========================================================================
  // 2. CASOS DE HYPOTHESIS VERIFICATION (Perguntas Binárias / Diretas)
  // =========================================================================
  else if (
    normalizedQuery.includes('11 bairros') ||
    (normalizedQuery.includes('quissico') && (normalizedQuery.includes('representam') || normalizedQuery.includes('todo o distrito') || normalizedQuery.includes('generaliz')))
  ) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'Não, a análise espacial dos 11 bairros circunscreve-se exclusivamente ao Posto Administrativo de Quissico (abrangendo 22.343 ha) e não pode ser extrapolada para a totalidade do Distrito de Zavala.';

    naturalExplanation =
      'A dissertação mapeou com precisão de satélite (Sentinel-2 Dynamic World e altimetria SRTM) os 22.343 hectares de Quissico divididos em 11 bairros municipais. Os postos administrativos de Zandamela, Massava e Mavila possuem características geomorfológicas e regimes de drenagem distintos que não foram objecto de levantamento cartográfico de alta resolução na dissertação.';

    specificEvidence =
      '• Capítulo 5 da Dissertação (Tabela 5.2 e Carta 5.1)\n• SSoT → QUISSICO_BAIRROS_SPATIAL (11 bairros, 22.343 ha)';

    specificInterpretation =
      '• Dado Documentado: 11 bairros cartografados em 22.343 ha de Quissico.\n• Salvaguarda Espacial: Proibição estrita de generalização ao distrito inteiro.';

    specificLimitation =
      'A cartografia digital detalhada de cotas e uso do solo cobre unicamente Quissico.';
  } else if (
    normalizedQuery.includes('chuva explica') ||
    normalizedQuery.includes('chuva causa') ||
    normalizedQuery.includes('precipitacao explica') ||
    normalizedQuery.includes('precipitacao causa') ||
    (normalizedQuery.includes('chuva') && normalizedQuery.includes('producao') && normalizedQuery.includes('explica'))
  ) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'Não, a análise estatística comprova que a precipitação linear não explica a produção de mandioca em Zavala, registando uma correlação de Pearson praticamente nula (r = 0,057; p = 0,762).';

    naturalExplanation =
      'A ausência de correlação linear (R² = 0,003) demonstra que o regime pluviométrico acumulado na estação chuvosa não dita univariadamente o volume colhido. A mandioca é uma cultura fisiologicamente rústica, capaz de resistir a secas moderadas por dormência estomática, mas altamente sensível a excessos extremos de precipitação em várzeas baixas que provocam asfixia radicular e podridão.';

    specificEvidence =
      '• SSoT → CHIRPS_CORRELATION_ANALYSIS (r = 0,057; p = 0,762; R² = 0,003)\n• Tabela 4.3 e Figura 4.4 da Dissertação de Mestrado';

    specificInterpretation =
      '• Dado Documentado: Registo satelital CHIRPS v2.0 confrontado com a série de produção de 31 anos.\n• Salvaguarda Causal: Refutação categórica de determinismo pluviométrico linear simples.';

    specificLimitation =
      'O índice CHIRPS agrega valores diários em grelha de 0,05° (~5,5 km), não capturando microclimas específicos de cada encosta.';
  } else if (
    normalizedQuery.includes('547') &&
    (normalizedQuery.includes('pesadas') || normalizedQuery.includes('terreno') || normalizedQuery.includes('armazem') || normalizedQuery.includes('reais'))
  ) {
    primaryEpistemicStatus = 'MODELADO';
    directAnswer =
      'Não, as 547.224 toneladas representam uma estimativa biofísica contrafactual acumulada ao longo de 14 safras adversas (1994–2016), e não perdas físicas medidas ou pesadas no terreno ou em armazém.';

    naturalExplanation =
      'Este valor foi calculado através de um modelo determinístico em três camadas que confrontou o rendimento efetivamente alcançado em anos de choque agroclimático com a linha de base potencial de 7,0 t/ha. O indicador quantifica o custo de oportunidade biofísico sofrido pelo distrito face a secas, cheias e escassez de material vegetativo, não constituindo pesagem directa de colheitas perdidas.';

    specificEvidence =
      '• SSoT → THESIS_CORE_FACTS (accumulatedLossesTonnes: 547.224 t em 14 anos adversos)\n• Tabela 4.4 da Dissertação de Mestrado';

    specificInterpretation =
      '• Dado Documentado: Estimativa biofísica contrafactual modelada em 3 camadas.\n• Salvaguarda Epistemológica: Distinção estrita entre contrafactual analítico e pesagem física.';

    specificLimitation =
      'O cálculo assume a baseline potencial de 7,0 t/ha e depende das taxas de área do modelo híbrido.';
  } else if (
    normalizedQuery.includes('sao todos observados') ||
    normalizedQuery.includes('todos observados') ||
    normalizedQuery.includes('integralmente observada') ||
    (normalizedQuery.includes('1994 a 2024') && normalizedQuery.includes('observad'))
  ) {
    primaryEpistemicStatus = 'RECONSTITUÍDO / MODELADO';
    directAnswer =
      'Não, os dados de 1994 a 2024 não são todos observados: a série histórica de 31 anos é rigorosamente híbrida, com 23 anos modelados (1994–2016) e apenas 8 anos observados (2017–2024).';

    naturalExplanation =
      'Os dados oficiais primários do SDAE de Zavala só existem de forma contínua a partir de 2017. Para o intervalo de 1994 a 2016, a dissertação desenvolveu uma reconstituição metodológica em três camadas determinísticas, ancorada em inquéritos do Banco Mundial (Jobs WP 31), censos da FAO e choques climáticos satelitais, validada pelo teste de Chow (F = 0,84; p = 0,443).';

    specificEvidence =
      '• SSoT → THESIS_CORE_FACTS (modeledPeriod: 23 anos vs observedPeriod: 8 anos)\n• Metodologia em 3 Camadas da Dissertação de Yolanda Tamele';

    specificInterpretation =
      '• Dado Documentado: 23 anos modelados (1994–2016) e 8 anos observados (2017–2024).\n• Salvaguarda Metodológica: Transparência inequívoca sobre a hibridez da série temporal.';

    specificLimitation =
      'A incerteza dos 23 anos modelados é mitigada pela ancoragem econométrica e testes de estabilidade estrutural.';
  } else if (
    normalizedQuery.includes('camponeses') &&
    (normalizedQuery.includes('diagnostico') || normalizedQuery.includes('molecular') || normalizedQuery.includes('laboratorial') || normalizedQuery.includes('cbsd'))
  ) {
    primaryEpistemicStatus = 'TESTEMUNHO DE CAMPO';
    directAnswer =
      'Não, os camponeses relataram percepções etnográficas e sintomas visuais de podridão radicular no terreno, não tendo realizado diagnóstico fitopatológico molecular ou laboratorial.';

    naturalExplanation =
      'As informações recolhidas nos 77 inquéritos de campo e nas 51 páginas do caderno de notas documentam a voz e o conhecimento empírico tradicional dos produtores familiares. A identificação de podridão, amarelecimento foliar e estrias radiculares reflecte sintomas macroscópicos de campo, cuja etiologia viral (CBSD ou CMD) carece de confirmação por análises biológicas laboratoriais.';

    specificEvidence =
      '• Caderno de Campo de Yolanda Tamele (51 páginas transcritas)\n• Corpus de 77 Inquéritos Etnográficos a Produtores e Líderes Comunitários';

    specificInterpretation =
      '• Testemunho de Campo: Percepção etnográfica empírica dos camponeses.\n• Salvaguarda Epistemológica: Não equiparação de relato visual a diagnóstico molecular.';

    specificLimitation =
      'A ausência de testes laboratoriais restringe as conclusões sobre doenças ao plano da percepção agronómica empírica.';
  } else if (
    normalizedQuery.includes('resiste a seca') ||
    normalizedQuery.includes('resistencia a seca') ||
    normalizedQuery.includes('fisiologia')
  ) {
    primaryEpistemicStatus = 'INTERPRETAÇÃO';
    directAnswer =
      'Sim, a mandioca apresenta elevada rusticidade e tolerância fisiológica à seca em Zavala devido a mecanismos de estivação e dormência foliar temporária.';

    naturalExplanation =
      'Perante défices hídricos prolongados, a planta reduz a área foliar transpirante e concentra as reservas energéticas no sistema radicular subterrâneo tuberoso. Esta resiliência agronómica torna a mandioca a cultura de segurança alimentar fundamental nas zonas arenosas de Zavala, operando como reserva estratégica familiar em períodos de quebra dos cereais.';

    specificEvidence =
      '• Capítulo 2 e 4 da Dissertação (Enquadramento Fisiológico e Histórico da Mandioca)\n• Caderno de Campo (Relatos de produtores sobre resiliência em solos arenosos)';

    specificInterpretation =
      '• Interpretação Agronómica: Mecanismo de estivação e tolerância a solos de baixa capacidade de retenção hídrica.';

    specificLimitation =
      'Embora tolere secas, o rendimento sofre reduções de acumulação de amido se o défice hídrico coincidir com o período crítico de tuberização.';
  }

  // =========================================================================
  // 3. CASOS DE ANOS ESPECÍFICOS (Factual Metric / Single Year)
  // =========================================================================
  else if (detectedYears.includes(2021) && (normalizedQuery.includes('producao') || normalizedQuery.includes('quanto') || normalizedQuery.includes('pico'))) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'A produção observada em 2021 foi de 273.773 toneladas, constituindo o pico histórico de toda a série de 31 anos analisada na dissertação.';

    naturalExplanation =
      'Este ápice produtivo foi atingido com uma área colhida de 27.654 hectares e rendimento médio de 9,90 t/ha, sob precipitação CHIRPS de 1.050,4 mm (+7,1% de anomalia). O registo provém de relatórios oficiais primários do SDAE de Zavala, documentando a fase de plena expansão da bacia produtiva.';

    specificEvidence =
      '• SSoT → Série Histórica (Ano 2021: 273.773 t; 27.654 ha; 9,90 t/ha; 1.050,4 mm)\n• Relatório Anual Oficial do SDAE de Zavala (2021)';

    specificInterpretation =
      '• Dado Documentado: Registo oficial e primário do SDAE para a safra de 2021.\n• Estatuto Epistemológico: OBSERVADO.';

    specificLimitation =
      'Os dados do SDAE assentam no reporte dos extensionistas distritais e nas áreas declaradas nas localidades.';
  } else if (detectedYears.includes(1994) && (normalizedQuery.includes('producao') || normalizedQuery.includes('quanto') || normalizedQuery.includes('inicial'))) {
    primaryEpistemicStatus = 'RECONSTITUÍDO / MODELADO';
    directAnswer =
      'A produção estimada em 1994 foi de 52.164 toneladas, correspondendo ao ano base da série temporal distrital e integrando o período de reconstituição modelada em três camadas.';

    naturalExplanation =
      'Em 1994, o distrito encontrava-se na fase imediata pós-Acordo Geral de Paz (1992), com grave escassez de material vegetativo sadio e estacas, registando uma área estimada de 16.200 hectares e rendimento de 3,22 t/ha. Trata-se de um valor modelado determinísticamente, e não de pesagem primária de arquivo distrital.';

    specificEvidence =
      '• SSoT → Série Histórica (Ano 1994: 52.164 t; 16.200 ha; 3,22 t/ha; Choque: pós-guerra)\n• Tabela 4.1 da Dissertação de Mestrado';

    specificInterpretation =
      '• Dado Reconstituído: Estimativa em 3 camadas ancorada em inquéritos TIA/FAO e choques históricos.\n• Estatuto Epistemológico: MODELADO.';

    specificLimitation =
      'A inexistência de registos contínuos do SDAE em 1994 exigiu a reconstituição biofísica determinística.';
  } else if (detectedYears.includes(2023) && (normalizedQuery.includes('producao') || normalizedQuery.includes('colapso') || normalizedQuery.includes('freddy') || normalizedQuery.includes('quanto'))) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'A produção observada em 2023 foi de 35.371 toneladas, registando um colapso severo de -87,1% em relação ao pico de 2021 associado ao impacto devastador do Ciclone Freddy.';

    naturalExplanation =
      'O ano hidrológico de 2023 registou 1.746,0 mm de precipitação satelital CHIRPS (+78,1% acima da média histórica), provocando inundações e saturação hídrica extrema com asfixia radicular das machambas de mandioca situadas nas depressões arenosas e várzeas de Zavala. O dado é oficial e observado pelo SDAE.';

    specificEvidence =
      '• SSoT → Série Histórica (Ano 2023: 35.371 t; perda de 138.561 t face à tendência)\n• CHIRPS v2.0 (Precipitação 2023: 1.746,0 mm; anomalia +78,1%)\n• Relatório de Danos Agrários do SDAE e INGD (2023)';

    specificInterpretation =
      '• Dado Documentado: Registo oficial primário do SDAE e satelital CHIRPS.\n• Interpretação Agronómica: Mecanismo de asfixia radicular por excesso pluvial extremo.';

    specificLimitation =
      'A agregação satelital CHIRPS complementa mas não substitui a observação directa de campo das cotas inundadas.';
  } else if (detectedYears.includes(2024)) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'A produção observada em 2024 foi de 48.573 toneladas, evidenciando uma recuperação parcial após o colapso de 2023, sob seca severa associada ao evento El Niño.';

    naturalExplanation =
      'Com precipitação CHIRPS reduzida a 667,2 mm (-31,9% de anomalia), o rendimento médio situou-se em 2,82 t/ha sobre 17.200 hectares colhidos. O dado constitui o fecho da série temporal de 31 anos analisada na dissertação de Yolanda Tamele e é um dado observado oficial do SDAE.';

    specificEvidence =
      '• SSoT → Série Histórica (Ano 2024: 48.573 t; 17.200 ha; 667,2 mm; El Niño)\n• Boletim Anual do SDAE de Zavala (Dezembro de 2024)';

    specificInterpretation =
      '• Dado Documentado: Registo oficial e primário do SDAE para o encerramento da série.\n• Estatuto Epistemológico: OBSERVADO.';

    specificLimitation =
      'Os dados de 2024 reflectem as condições do ciclo agrícola fechado no final do ano civil.';
  }

  // =========================================================================
  // 4. INDICADORES ESTATÍSTICOS E MÉTRICAS GLOBAIS
  // =========================================================================
  else if (normalizedQuery.includes('mann-kendall') || normalizedQuery.includes('mann kendall')) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'A análise de tendência temporal calculada pelo teste não-paramétrico de Mann-Kendall comprova um crescimento secular positivo e estatisticamente significativo (Z = 3,100; p = 0,0019).';

    naturalExplanation =
      'A metodologia aplicou a modificação de Hamed & Rao (1998) para corrigir os efeitos de autocorrelação serial de primeira e segunda ordem na série de 31 anos. O resultado rejeita a hipótese nula de estagnação a um nível de confiança superior a 99,8%, confirmando a expansão estrutural da cultura no distrito de Zavala.';

    specificEvidence =
      '• SSoT → SCIENTIFIC_TREND_STATISTICS (Mann-Kendall Z = 3,100; p = 0,0019; método Hamed & Rao 1998)\n• Dissertação de Mestrado, Capítulo 4 (p. 74–77)';

    specificInterpretation =
      '• Dado Documentado: Parâmetro econométrico oficial da dissertação de Yolanda Tamele.\n• Estatuto Epistemológico: OBSERVADO.';

    specificLimitation =
      'O teste avalia a monotonia ordinal da série completa de 31 anos, incluindo anos modelados e observados.';
  } else if (normalizedQuery.includes('taxa de crescimento linear') || (normalizedQuery.includes('ols') && normalizedQuery.includes('taxa'))) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'A taxa de crescimento linear estimada por regressão OLS com correcção Newey-West foi de +4.229 toneladas/ano (p = 0,020; R² = 0,174).';

    naturalExplanation =
      'O modelo estrutural de Mínimos Quadrados Ordinários ajustado para heterocedasticidade e autocorrelação (HAC) indica que Zavala incorporou em média mais de 4.200 toneladas anuais à sua capacidade produtiva entre 1994 e 2024, impulsionado pela expansão das machambas e renovação de material vegetativo.';

    specificEvidence =
      '• SSoT → SCIENTIFIC_TREND_STATISTICS (OLS Newey-West: β = +4.229 t/ano; p = 0,020; R² = 0,174)\n• Dissertação de Mestrado, Capítulo 4';

    specificInterpretation =
      '• Dado Documentado: Declive da regressão linear OLS com erros padrão robustos HAC.\n• Estatuto Epistemológico: OBSERVADO.';

    specificLimitation =
      'O R² de 0,174 demonstra que grande parte da variabilidade anual é explicada por choques climáticos e não apenas por tendência linear.';
  } else if (normalizedQuery.includes('media anual') || normalizedQuery.includes('producao media')) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'A produção média anual ao longo dos 31 anos analisados na dissertação (1994–2024) foi de 115.333 toneladas.';

    naturalExplanation =
      'A série temporal exibe forte assimetria e volatilidade, com mediana de 100.990 t/ano, desvio-padrão de 64.965 t e Coeficiente de Variação de 56,3%, reflectindo a alternância contínua entre ciclos de expansão e colapsos associados a secas e ciclones.';

    specificEvidence =
      '• SSoT → THESIS_CORE_FACTS (averageProductionTonnes: 115.333 t; median: 100.990 t; CV: 56,3%)\n• Tabela 4.2 da Dissertação de Mestrado';

    specificInterpretation =
      '• Dado Documentado: Estatística descritiva oficial da série temporal de 31 anos.\n• Estatuto Epistemológico: OBSERVADO.';

    specificLimitation =
      'A média engloba tanto os 23 anos reconstituídos como os 8 anos observados pelo SDAE.';
  } else if (normalizedQuery.includes('teste de chow') || (normalizedQuery.includes('chow') && normalizedQuery.includes('quebra'))) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'O teste de quebra estrutural de Chow na dissertação obteve F = 0,84 (p = 0,443), comprovando a ausência de quebra estrutural e a estabilidade dos parâmetros entre a série modelada (1994–2016) e a série observada (2017–2024).';

    naturalExplanation =
      'Ao testar a hipótese nula de constância dos coeficientes entre os dois subperíodos, o valor de F não atingiu significância estatística, legitimando cientificamente a fusão dos 23 anos reconstituídos com os 8 anos observados para a realização das inferências longitudinais da dissertação.';

    specificEvidence =
      '• SSoT → SCIENTIFIC_TREND_STATISTICS (Chow F = 0,84; p = 0,443; F-crítico = 3,34)\n• Dissertação de Mestrado, Secção 4.1';

    specificInterpretation =
      '• Dado Documentado: Teste econométrico de estabilidade de parâmetros estruturais.\n• Estatuto Epistemológico: OBSERVADO.';

    specificLimitation =
      'O teste valida a consistência agregada dos coeficientes médios, sem eliminar as margens de erro individuais dos anos reconstituídos.';
  }

  // =========================================================================
  // 5. TRABALHO DE CAMPO, ÁREA ESPACIAL E PRECIPITAÇÃO FREDDY
  // =========================================================================
  else if (normalizedQuery.includes('quantos inqueritos') || normalizedQuery.includes('inqueritos a produtores')) {
    primaryEpistemicStatus = 'TESTEMUNHO DE CAMPO';
    directAnswer =
      'Foram realizados 77 inquéritos a produtores e líderes locais no terreno, transcritos em 51 páginas do caderno de campo etnográfico.';

    naturalExplanation =
      'A amostra cobriu 8 localidades rurais do Distrito de Zavala, envolvendo 62 camponeses individuais e 5 líderes comunitários, com 61,1% de representação de mulheres produtoras. O levantamento recolheu dados qualitativos sobre práticas de consociação, variedades locais e sintomas empíricos de pragas.';

    specificEvidence =
      '• SSoT → THESIS_FIELD_DATA_SUMMARY (77 inquéritos transcritos, 51 páginas físicas de caderno)\n• fieldInterviews.ts (Corpus integral de 77 entrevistas)';

    specificInterpretation =
      '• Dado Documentado: Registo etnográfico das entrevistas transcritas da investigadora Yolanda Tamele.\n• Estatuto Epistemológico: TESTEMUNHO DE CAMPO.';

    specificLimitation =
      'Trata-se de uma amostragem qualitativa intencional orientada a zonas de produção tradicional de mandioca.';
  } else if (normalizedQuery.includes('quantos hectares') && normalizedQuery.includes('quissico')) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'Foram analisados 22.343 hectares em Quissico com dados satelitais de altimetria e ocupação do solo, distribuídos por 11 bairros do posto administrativo.';

    naturalExplanation =
      'A cartografia digital combinou o modelo digital de terreno SRTM (resolução 30 m) com a classificação Dynamic World (Sentinel-2 a 10 m), identificando que 99,9% da área do posto municipal está discriminada em polígonos com as respectivas cotas de vulnerabilidade topográfica.';

    specificEvidence =
      '• SSoT → QUISSICO_BAIRROS_SPATIAL (11 bairros, 22.343 ha)\n• Carta de Altimetria e Ocupação do Solo do Capítulo 5 da Dissertação';

    specificInterpretation =
      '• Dado Documentado: Processamento SIG de dados espaciais Copernicus Sentinel-2 e NASA SRTM.\n• Estatuto Epistemológico: OBSERVADO.';

    specificLimitation =
      'A área de 22.343 ha limita-se estritamente ao Posto Administrativo de Quissico.';
  } else if (
    (normalizedQuery.includes('precipitacao') || normalizedQuery.includes('chuva')) &&
    (normalizedQuery.includes('freddy') || normalizedQuery.includes('1746'))
  ) {
    primaryEpistemicStatus = 'OBSERVADO';
    directAnswer =
      'A precipitação acumulada no ano do Ciclone Freddy (2023) foi de 1.746,0 mm segundo os registos satelitais CHIRPS v2.0, representando uma anomalia de +78,1% acima da média histórica.';

    naturalExplanation =
      'Este excesso pluvial sem precedentes na série causou a subida dos lençóis freáticos e o alagamento prolongado das depressões arenosas, resultando na destruição por asfixia radicular das machambas e na quebra da produção distrital para 35.371 toneladas.';

    specificEvidence =
      '• SSoT → THESIS_CORE_FACTS (cycloneFreddyRainfallMm = 1.746,0; anomalia = +78,1%)\n• Satélite CHIRPS v2.0 (Resolução 0,05°) confrontado com dados do SDAE de Zavala';

    specificInterpretation =
      '• Dado Documentado: Registo satelital diário agregado para a estação chuvosa de 2023.\n• Estatuto Epistemológico: OBSERVADO.';

    specificLimitation =
      'A medição por satélite estima a precipitação em células de grelha de 5 km, calibrada com as estações do INAM.';
  }

  // =========================================================================
  // 6. FORA DE ESCOPO / LACUNA DOCUMENTAL (Ex: trigo, soja, adubo NPK, etc.)
  // =========================================================================
  else if (analysis.isDataGapTopic || normalizedQuery.includes('trigo') || normalizedQuery.includes('adubo npk') || normalizedQuery.includes('artigos cientificos que provam que a chuva causa')) {
    primaryEpistemicStatus = 'INTERPRETAÇÃO';
    directAnswer =
      'Não encontrei evidência suficiente no corpus científico da plataforma para sustentar essa afirmação.';

    naturalExplanation =
      'A dissertação de mestrado de Yolanda Tamele (ESUDER / UEM) é um estudo monográfico centrado estritamente na dinâmica produtiva, agroclimática e espacial da cultura da mandioca no Distrito de Zavala (1994–2024). O corpus científico não recolheu dados empíricos sobre culturas externas ausentes do sistema agrícola familiar distrital nem documenta relações que contradigam os factos apurados no terreno.';

    specificEvidence =
      '• Registo de Limites e Lacunas Documentais da Dissertação (thesisScientificData.ts)\n• Fronteira Epistemológica do Estudo de Caso de Zavala';

    specificInterpretation =
      '• Suporte Insuficiente: O tema consultado excede o perímetro temático e empírico da dissertação de Yolanda Tamele.';

    specificLimitation =
      'A plataforma restringe-se aos dados auditados da dissertação sobre a mandioca em Zavala.';
  }

  // =========================================================================
  // 7. CONHECIMENTO EXTERNO (FAO, segurança alimentar global, etc.)
  // =========================================================================
  else if (analysis.isExternalTopic || normalizedQuery.includes('fao')) {
    primaryEpistemicStatus = 'CONTEXTUALIZAÇÃO EXTERNA';
    directAnswer =
      'Esta informação não pertence ao corpus documental da dissertação. Contextualização externa à dissertação: A nível global e segundo os quadros conceituais da Organização das Nações Unidas para a Alimentação e a Agricultura (FAO), a segurança alimentar compreende quatro pilares fundamentais: disponibilidade, acesso, utilização biológica e estabilidade temporal dos alimentos.';

    naturalExplanation =
      'No contexto da dissertação de Yolanda Tamele sobre Zavala, estes pilares globais traduzem-se no papel estratégico que a mandioca desempenha como cultivo de subsistência e reserva perante secas, assegurando a estabilidade calórica das famílias camponesas quando as culturas de grãos fracassam sob solos arenosos de fraca retenção.';

    specificEvidence =
      '• Nível 5: Literatura agronómica e quadros normativos internacionais de segurança alimentar (FAO)\n• Dissertação de Mestrado: Enquadramento Teórico Inicial';

    specificInterpretation =
      '• Contextualização Externa: Definição conceitual internacional não resultante de medição empírica directa em Zavala.';

    specificLimitation =
      'Esta conceitualização teórica internacional serve de apoio analítico e não constitui dado primário do distrito de Zavala.';
  }

  // =========================================================================
  // 8. SÍNTESE GERAL / OUTRAS PERGUNTAS (Open Research)
  // =========================================================================
  else {
    const firstEv = evidence[0];
    const snippetClean = firstEv ? firstEv.snippet.replace(/^•\s*/, '').trim() : '';
    const leadSentence = snippetClean.includes('.') ? snippetClean.slice(0, snippetClean.indexOf('.') + 1) : snippetClean;

    directAnswer = leadSentence
      ? leadSentence
      : 'A dinâmica produtiva de mandioca em Zavala ao longo de 31 anos (1994–2024) evidencia expansão secular consistente (Mann-Kendall Z = 3,100; p = 0,0019), com produção média de 115.333 toneladas/ano.';

    naturalExplanation =
      'A dissertação de Yolanda Tamele combina a reconstituição determinística de 23 anos (1994–2016) com 8 anos de dados oficiais observados do SDAE (2017–2024), comprovando a estabilidade da série através do teste de Chow (F = 0,84; p = 0,443) e fundamentando a análise espacial e humana em 22.343 ha de Quissico e 77 inquéritos de campo.';
  }

  // Aplicar formato oral se estiver em Modo de Preparação para Defesa
  if (isDefenseMode) {
    const formattedOral = formatOralResponse(
      `${directAnswer} ${naturalExplanation}`,
      originalQuery
    );
    const fullText = `### RESPOSTA\n${formattedOral}\n\n### EVIDÊNCIA\n${specificEvidence}\n\n### INTERPRETAÇÃO\n${specificInterpretation}\n\n### LIMITAÇÃO\n${specificLimitation}`;
    return {
      answerText: sanitizeDirectAnswer(fullText),
      epistemicStatus: primaryEpistemicStatus,
    };
  }

  const fullText = `### RESPOSTA\n${directAnswer}\n\n${naturalExplanation}\n\n### EVIDÊNCIA\n${specificEvidence}\n\n### INTERPRETAÇÃO\n${specificInterpretation}\n\n### LIMITAÇÃO\n${specificLimitation}`;

  return {
    answerText: sanitizeDirectAnswer(fullText),
    epistemicStatus: primaryEpistemicStatus,
  };
}
