import { DissertationQuestion, DISSERTATION_FULL_QUESTIONS } from './dissertationText';

export interface AdversarialVulnerability {
  id: string;
  code: string; // V1 .. V20
  title: string;
  titleEn: string;
  category: string;
  primaryPressure: string;
  primaryPressureEn: string;
  secondaryPressure: string;
  secondaryPressureEn: string;
  epistemicGuardrail: string;
  epistemicGuardrailEn: string;
  internalAppEvidence: {
    tab: 'dados' | 'campo' | 'estudio' | 'defesa';
    param?: string;
    locationLabel: string;
    locationLabelEn: string;
  };
  associatedQuestionNumbers: number[];
}

export const ADVERSARIAL_VULNERABILITIES: AdversarialVulnerability[] = [
  {
    id: 'v1',
    code: 'V1',
    title: 'Estatuto Epistemológico dos Dados 1994–2016',
    titleEn: 'Epistemic Status of 1994–2016 Data',
    category: 'Metodologia e Estatística',
    primaryPressure:
      'Se os dados oficiais contínuos do SDAE apenas existem a partir de 2017, como pode sustentar conclusões temporais de 31 anos sem incorrer em ficção estatística?',
    primaryPressureEn:
      'If continuous official SDAE records only begin in 2017, how can you uphold 31-year temporal findings without lapsing into statistical fiction?',
    secondaryPressure:
      'Mesmo preenchendo a lacuna com a literatura e inquéritos nacionais, como garante que essa série histórica pré-2017 não mascara dinâmicas locais imprevisíveis?',
    secondaryPressureEn:
      'Even if filling gaps via literature and national surveys, how do you ensure this pre-2017 series does not obscure unpredictable local dynamics?',
    epistemicGuardrail:
      'A candidata deve declarar abertamente o estatuto de reconstituição determinística híbrida dos 23 anos (1994–2016), nunca tratando essa fase como medição empírica direta.',
    epistemicGuardrailEn:
      'The candidate must openly state the hybrid deterministic modeled status of the 23 years (1994–2016), never presenting it as direct empirical observation.',
    internalAppEvidence: {
      tab: 'dados',
      param: 'serie',
      locationLabel: 'Estação de Dados · Tabela 4.1 e Nota Metodológica de Reconstituição',
      locationLabelEn: 'Data Station · Table 4.1 & Reconstruction Methodological Note',
    },
    associatedQuestionNumbers: [1, 2, 4, 40],
  },
  {
    id: 'v2',
    code: 'V2',
    title: 'Âncora Observacional de 2017',
    titleEn: '2017 Observational Baseline Anchor',
    category: 'Metodologia e Estatística',
    primaryPressure:
      'Por que razão a safra de 2017 (141.000 t) foi eleita como âncora primordial de convergência do modelo em vez de uma média móvel plurianual?',
    primaryPressureEn:
      'Why was the 2017 harvest (141,000 t) chosen as the primary model convergence anchor rather than a multi-year moving average?',
    secondaryPressure:
      'Se 2017 tivesse sido um ano atípico não documentado, todo o modelo retroativo ficaria enviesado para cima ou para baixo. Como mitigou esse risco?',
    secondaryPressureEn:
      'If 2017 were an undocumented anomalous harvest, the entire backcast model would be skewed upwards or downwards. How was this mitigated?',
    epistemicGuardrail:
      'A candidata deve demonstrar que 2017 coincide com o primeiro ano do registo sistemático distrital pós-reforma administrativa do SDAE, validado contra o TIA provincial.',
    epistemicGuardrailEn:
      'The candidate must show that 2017 marks the first systematic post-reform SDAE district record, cross-checked against provincial agricultural surveys (TIA).',
    internalAppEvidence: {
      tab: 'dados',
      param: '2017',
      locationLabel: 'Estação de Dados · Ano Agrícola 2017 (Início do Período Observado)',
      locationLabelEn: 'Data Station · Agricultural Year 2017 (Start of Observed Period)',
    },
    associatedQuestionNumbers: [2, 4, 40],
  },
  {
    id: 'v3',
    code: 'V3',
    title: 'Método de Reconstrução em Três Camadas',
    titleEn: 'Three-Layer Reconstruction Architecture',
    category: 'Metodologia e Estatística',
    primaryPressure:
      'O modelo de três camadas é uma construção sofisticada, mas onde termina a evidência documental e onde começa a calibração matemática arbitrária da investigadora?',
    primaryPressureEn:
      'The 3-layer architecture is mathematically sophisticated, but where does documentary evidence end and subjective researcher calibration begin?',
    secondaryPressure:
      'Se um examinador rejeitar a Camada 2 (crescimento log-linear de Adebayo et al.), que conclusões substantivas da tese ainda permanecem de pé?',
    secondaryPressureEn:
      'If an examiner rejects Layer 2 (log-linear growth parameters after Adebayo et al.), what substantive thesis conclusions still remain valid?',
    epistemicGuardrail:
      'A candidata deve justificar que a Camada 1 fixa os dados observados (2017–2024), a Camada 2 impõe taxas demográficas provinciais e a Camada 3 calibra os choques biofísicos com sensoriamento remoto.',
    epistemicGuardrailEn:
      'The candidate must show Layer 1 anchors observed points (2017–2024), Layer 2 constrains provincial demographic growth, and Layer 3 incorporates remote-sensing biophysical shocks.',
    internalAppEvidence: {
      tab: 'dados',
      param: 'metodologia',
      locationLabel: 'Estação de Dados · Painel Metodológico das Três Camadas (Folha E)',
      locationLabelEn: 'Data Station · Three-Layer Methodological Panel (Sheet E)',
    },
    associatedQuestionNumbers: [2, 40],
  },
  {
    id: 'v4',
    code: 'V4',
    title: 'Teste Não-Paramétrico de Mann-Kendall (Z = 3,100; p = 0,0019)',
    titleEn: 'Mann-Kendall Trend Test (Z = 3.100; p = 0.0019)',
    category: 'Metodologia e Estatística',
    primaryPressure:
      'O teste de Mann-Kendall reporta Z = 3,100 (p = 0,0019), mas a safra final de 2024 é inferior à inicial de 1994 e o CAGR foi de -0,24%. O teste não está a falsear a realidade produtiva?',
    primaryPressureEn:
      'Mann-Kendall test reports Z = 3.100 (p = 0.0019), yet 2024 output is lower than 1994 and CAGR was -0.24%. Is the test not distorting real productivity?',
    secondaryPressure:
      'Significância estatística de tendência temporal NÃO é sinónimo de melhoria estrutural das condições de vida dos camponeses. Como defende essa distinção perante o júri?',
    secondaryPressureEn:
      'Statistical trend significance does NOT mean structural improvement in smallholder livelihoods. How do you defend this before the board?',
    epistemicGuardrail:
      'A candidata deve esclarecer que Mann-Kendall avalia a monotonicidade ordinal de todos os 31 pares temporais (imune ao colapso pontual de 2023), enquanto o CAGR de 2 pontos é refém do choque terminal.',
    epistemicGuardrailEn:
      'The candidate must clarify Mann-Kendall assesses ordinal monotonicity across all 31 time pairs (resilient to terminal shock), whereas 2-point CAGR is hostage to the terminal collapse.',
    internalAppEvidence: {
      tab: 'dados',
      param: 'estatistica',
      locationLabel: 'Estação de Dados · Síntese Estatística de Mann-Kendall & Hamed-Rao',
      locationLabelEn: 'Data Station · Mann-Kendall & Hamed-Rao Statistical Summary',
    },
    associatedQuestionNumbers: [3, 4],
  },
  {
    id: 'v5',
    code: 'V5',
    title: 'Declividade de Sen vs Previsão Determinística',
    titleEn: "Sen's Slope Estimator (+4.482 t/ano)",
    category: 'Metodologia e Estatística',
    primaryPressure:
      'A declividade de Sen estimada em +4.482 t/ano pode ser usada pelo SDAE para planificar metas agrícolas futuras para o distrito?',
    primaryPressureEn:
      "Can Sen's slope of +4,482 t/year be safely used by SDAE to forecast future agricultural production targets for the district?",
    secondaryPressure:
      'Se a variabilidade climática extrema se intensificar com eventos como o Ciclone Freddy, a declividade linear perde qualquer validade prescritiva. Reconhece essa limitação?',
    secondaryPressureEn:
      'If extreme climate variability intensifies with events like Cyclone Freddy, linear slope loses predictive validity. Do you acknowledge this limitation?',
    epistemicGuardrail:
      'A candidata deve frisar que a declividade de Sen é um estimador não-paramétrico descritivo da trajectória histórica e NÃO uma função de previsão determinística para planeamento.',
    epistemicGuardrailEn:
      "The candidate must stress Sen's slope is a descriptive non-parametric historical metric, NOT a deterministic forecast model for agricultural planning.",
    internalAppEvidence: {
      tab: 'dados',
      param: 'estatistica',
      locationLabel: 'Estação de Dados · Estimadores de Tendência (Sen e OLS)',
      locationLabelEn: 'Data Station · Trend Estimators (Sen & OLS)',
    },
    associatedQuestionNumbers: [3, 4],
  },
  {
    id: 'v6',
    code: 'V6',
    title: 'Regressão OLS com Erros HAC Newey-West (+4.229 t/ano; p = 0,020)',
    titleEn: 'OLS Regression with Newey-West HAC Errors (+4,229 t/year; p = 0.020)',
    category: 'Metodologia e Estatística',
    primaryPressure:
      'Com um R² de apenas 0,174, a regressão OLS deixa mais de 82% da variância produtiva por explicar. Não é excessivo afirmar que existe uma tendência sólida?',
    primaryPressureEn:
      'With an R² of only 0.174, OLS regression leaves over 82% of variance unexplained. Is it not an overstatement to claim a robust trend?',
    secondaryPressure:
      'Porque foi obrigatório recorrer aos erros padrão robustos de Newey-West em vez do teste t de Student convencional?',
    secondaryPressureEn:
      'Why was it mandatory to apply Newey-West HAC standard errors rather than conventional Student t-tests?',
    epistemicGuardrail:
      'A candidata deve explicar que o baixo R² é típico de séries agrícolas tropicais com choques climáticos extremos recorrentes, e que Newey-West foi indispensável para corrigir autocorrelação serial e heterocedasticidade.',
    epistemicGuardrailEn:
      'The candidate must explain low R² is standard in tropical crop series punctuated by extreme shocks, and Newey-West was essential to correct for serial autocorrelation and heteroskedasticity.',
    internalAppEvidence: {
      tab: 'dados',
      param: 'estatistica',
      locationLabel: 'Estação de Dados · Regressão Linear com Newey-West (p = 0,020)',
      locationLabelEn: 'Data Station · Linear Regression with Newey-West (p = 0.020)',
    },
    associatedQuestionNumbers: [1, 3],
  },
  {
    id: 'v7',
    code: 'V7',
    title: 'Transição Metodológica e Teste de Chow em 2016/2017',
    titleEn: 'Methodological Transition & Chow Breakpoint Test (2016/2017)',
    category: 'Metodologia e Estatística',
    primaryPressure:
      'A transição entre a reconstituição modelada (até 2016) e os relatórios do SDAE (desde 2017) não introduz uma quebra artificial no comportamento estatístico da série?',
    primaryPressureEn:
      'Does the transition from modeled reconstruction (pre-2016) to SDAE reports (post-2017) not create an artificial statistical breakpoint?',
    secondaryPressure:
      'Como demonstra matematicamente que o crescimento observado a partir de 2017 não é mero artefacto da melhoria dos métodos de registo dos extensionistas?',
    secondaryPressureEn:
      'How do you mathematically prove post-2017 growth is not simply an artifact of improved reporting protocols by extensionists?',
    epistemicGuardrail:
      'A candidata deve citar o Teste de Chow para quebras estruturais e a âncora de convergência em 2016/2017, demonstrando ausência de descontinuidade abrupta.',
    epistemicGuardrailEn:
      'The candidate must cite the Chow breakpoint test and the convergence anchor at 2016/2017, proving the absence of an abrupt level shift.',
    internalAppEvidence: {
      tab: 'dados',
      param: '2016',
      locationLabel: 'Estação de Dados · Teste de Quebra Estrutural de Chow (2016/2017)',
      locationLabelEn: 'Data Station · Chow Structural Break Test (2016/2017)',
    },
    associatedQuestionNumbers: [4, 40],
  },
  {
    id: 'v8',
    code: 'V8',
    title: '547.224 Toneladas de Perdas Biofísicas Acumuladas',
    titleEn: '547,224 Tons of Cumulative Biophysical Losses',
    category: 'Clima, CHIRPS e Choques',
    primaryPressure:
      'Como pode defender perante o júri uma perda de 547.224 toneladas se nenhum extensionista pesou fisicamente raízes podres na machamba entre 1994 e 2016?',
    primaryPressureEn:
      'How can you defend 547,224 tons of losses before the board when no extensionist physically weighed rotten roots in fields between 1994 and 2016?',
    secondaryPressure:
      'Ao chamar a essa estimativa "perda", a candidata não está a induzir decisores públicos a tratarem um número contrafactual como realidade fática?',
    secondaryPressureEn:
      'By calling this estimate "loss", are you not leading policymakers to mistake a counterfactual model output for physical fact?',
    epistemicGuardrail:
      'A candidata deve esclarecer que as 547.224 t representam o diferencial contrafactual acumulado entre a tendência potencial teórica e a produção efetiva penalizada por choques biofísicos catalogados.',
    epistemicGuardrailEn:
      'The candidate must clarify that 547,224 t represents the cumulative counterfactual gap between theoretical potential trend and actual shock-penalized production.',
    internalAppEvidence: {
      tab: 'dados',
      param: 'choques',
      locationLabel: 'Estação de Dados · Matriz de Perdas Acumuladas (Folha D)',
      locationLabelEn: 'Data Station · Cumulative Losses Matrix (Sheet D)',
    },
    associatedQuestionNumbers: [9, 11, 40],
  },
  {
    id: 'v9',
    code: 'V9',
    title: 'Inventário de 14 Anos Adversos em 23 Safras Modeladas',
    titleEn: 'Inventory of 14 Adverse Years Across 23 Modeled Seasons',
    category: 'Clima, CHIRPS e Choques',
    primaryPressure:
      'Em 23 anos modelados, 14 foram classificados como anos adversos (60,8%). Isso não indica que o conceito de "ano normal" na sua tese é uma abstração irrealista?',
    primaryPressureEn:
      'In 23 modeled years, 14 were classified as adverse (60.8%). Does this not indicate your baseline of a "normal year" is an unrealistic abstraction?',
    secondaryPressure:
      'Se a adversidade é o padrão predominante em Zavala, como pode uma cultura dita "resiliente" falhar na maioria dos anos?',
    secondaryPressureEn:
      'If adversity is the prevailing norm in Zavala, how can a reputedly "resilient" crop experience losses in the majority of seasons?',
    epistemicGuardrail:
      'A candidata deve explicar que a adversidade não significa colapso total em todos os 14 anos, mas sim desvios em relação à curva ótima contrafactual decorrentes de secas, pragas ou tempestades.',
    epistemicGuardrailEn:
      'The candidate must explain that adversity does not imply complete collapse across all 14 seasons, but rather deviations from counterfactual potential due to dry spells, pests, or storms.',
    internalAppEvidence: {
      tab: 'dados',
      param: 'choques',
      locationLabel: 'Estação de Dados · Tabela de Choques e Eventos Extremos',
      locationLabelEn: 'Data Station · Shocks & Extreme Events Inventory Table',
    },
    associatedQuestionNumbers: [9, 11],
  },
  {
    id: 'v10',
    code: 'V10',
    title: 'Série Pluviométrica Satelital CHIRPS v2.0 (0.05° de Resolução)',
    titleEn: 'CHIRPS v2.0 Satellite Precipitation Series (0.05° Resolution)',
    category: 'Clima, CHIRPS e Choques',
    primaryPressure:
      'Os dados do CHIRPS baseiam-se em estimativas infravermelhas com calibração de estações escassas em Moçambique. Como assegura a precisão em nível de microclima costeiro em Zavala?',
    primaryPressureEn:
      'CHIRPS data relies on thermal infrared estimates with sparse rain-gauge calibration in Mozambique. How do you ensure accuracy for coastal microclimates in Zavala?',
    secondaryPressure:
      'Quissico possui uma escarpa com lagoas costeiras que geram brisas marítimas locais. O píxel de 5 km do satélite capta essas tempestades convectivas pontuais?',
    secondaryPressureEn:
      'Quissico features an escarpment and coastal lagoons generating sea breezes. Can a 5km satellite pixel capture localized convective storms?',
    epistemicGuardrail:
      'A candidata deve reconhecer a resolução de 0.05° como a melhor aproximação pública contínua disponível, admitindo a ausência de pluviógrafos automáticos densos na rede do INAM.',
    epistemicGuardrailEn:
      'The candidate must recognize 0.05° resolution as the best publicly available continuous record, acknowledging the absence of dense INAM weather station networks in Zavala.',
    internalAppEvidence: {
      tab: 'dados',
      param: 'chirps',
      locationLabel: 'Estação de Dados · Secção 4.4 de Validação Pluviométrica CHIRPS',
      locationLabelEn: 'Data Station · Section 4.4 CHIRPS Rainfall Validation',
    },
    associatedQuestionNumbers: [10, 11, 40],
  },
  {
    id: 'v11',
    code: 'V11',
    title: 'Correlação Quase Nula: r = 0,057',
    titleEn: 'Near-Zero Pearson Correlation: r = 0.057',
    category: 'Clima, CHIRPS e Choques',
    primaryPressure:
      'Se o coeficiente de correlação entre precipitação sazonal e produção distrital é irrisório (r = 0,057), a tese não deveria concluir que a chuva não tem relevância para a mandioca?',
    primaryPressureEn:
      'If the correlation coefficient between seasonal rainfall and district production is negligible (r = 0.057), shouldn’t the thesis conclude rainfall is irrelevant for cassava?',
    secondaryPressure:
      'Como justifica perante agrônomos experientes da banca que uma cultura de sequeiro apresente correlação linear praticamente nula com a água da chuva?',
    secondaryPressureEn:
      'How do you justify before seasoned agronomy examiners that a rainfed crop exhibits virtually zero linear correlation with rainfall?',
    epistemicGuardrail:
      'A candidata deve demonstrar que a relação é não-linear: mandioca tolera défices moderados graças ao fecho estomático, mas sofre perdas severas em extremos opostos (seca extrema < 550 mm vs excesso hídrico com anoxia > 1300 mm).',
    epistemicGuardrailEn:
      'The candidate must demonstrate the relationship is non-linear: cassava withstands moderate deficits via stomatal closure, but suffers severe losses under extreme tails (drought < 550mm vs waterlogging > 1300mm).',
    internalAppEvidence: {
      tab: 'dados',
      param: 'chirps',
      locationLabel: 'Estação de Dados · Painel de Correlação Linear CHIRPS (r = 0,057)',
      locationLabelEn: 'Data Station · CHIRPS Linear Correlation Panel (r = 0.057)',
    },
    associatedQuestionNumbers: [10, 11],
  },
  {
    id: 'v12',
    code: 'V12',
    title: 'Ausência de Significância Linear: p = 0,762',
    titleEn: 'Lack of Linear Significance: p = 0.762',
    category: 'Clima, CHIRPS e Choques',
    primaryPressure:
      'Um p-valor de 0,762 inviabiliza qualquer hipótese de dependência linear na estatística clássica. Que base científica lhe resta para discutir o clima na dissertação?',
    primaryPressureEn:
      'A p-value of 0.762 invalidates any hypothesis of linear dependence in classical statistics. What scientific basis remains to discuss climate in your thesis?',
    secondaryPressure:
      'A candidata não correu o risco de forçar narrativas qualitativas sobre ciclones e secas onde a estatística bivariada diz claramente que não há efeito comprovado?',
    secondaryPressureEn:
      'Did you not risk forcing qualitative narratives about cyclones and droughts where bivariate statistics clearly indicate no provable linear effect?',
    epistemicGuardrail:
      'A candidata deve enunciar o princípio: "Associação temporal não implica causalidade" e justificar que a precipitação acumulada precisa ser desagregada em índices de extremos (CDD, dias consecutivos de chuva e encharcamento).',
    epistemicGuardrailEn:
      'The candidate must state: "Temporal association does not imply causality" and justify that cumulative rainfall must be disaggregated into extreme indices (CDD, storm spells, and waterlogging).',
    internalAppEvidence: {
      tab: 'dados',
      param: 'chirps',
      locationLabel: 'Estação de Dados · Teste de Significância CHIRPS (p = 0,762)',
      locationLabelEn: 'Data Station · CHIRPS Significance Test (p = 0.762)',
    },
    associatedQuestionNumbers: [10, 11, 40],
  },
  {
    id: 'v13',
    code: 'V13',
    title: 'Seca Severa de El Niño em 2016 (Quebra de -59,4%)',
    titleEn: '2016 Severe El Niño Drought (-59.4% Harvest Loss)',
    category: 'Clima, CHIRPS e Choques',
    primaryPressure:
      'Em 2016 a precipitação acumulada caiu para 534,3 mm e a tese modela uma quebra de -59,4%. Como sabe que essa quebra foi causada pela seca e não por surto de pragas ou desmotivação dos produtores?',
    primaryPressureEn:
      'In 2016 rainfall fell to 534.3 mm and the thesis models a -59.4% drop. How do you know this was driven by drought rather than pest outbreaks or farmer disengagement?',
    secondaryPressure:
      'Se não existem registos fitossanitários sistemáticos distritais de 2016, atribuir toda a quebra à seca de El Niño não é uma simplificação causal?',
    secondaryPressureEn:
      'Without systematic 2016 district phytosanitary records, isn’t attributing the entire harvest loss to El Niño drought a causal oversimplification?',
    epistemicGuardrail:
      'A candidata deve reconhecer a coocorrência de múltiplos fatores de estresse, apontando a dessecação hídrica extrema como gatilho primário corroborado pela literatura regional (FEWS NET / FAO).',
    epistemicGuardrailEn:
      'The candidate must acknowledge co-occurring stress factors, framing extreme moisture deficit as the primary trigger corroborated by regional reporting (FEWS NET / FAO).',
    internalAppEvidence: {
      tab: 'dados',
      param: '2016',
      locationLabel: 'Estação de Dados · Choque de 2016 (Seca de El Niño, 534,3 mm)',
      locationLabelEn: 'Data Station · 2016 Shock (El Niño Drought, 534.3 mm)',
    },
    associatedQuestionNumbers: [9, 11],
  },
  {
    id: 'v14',
    code: 'V14',
    title: 'O Colapso Inédito de 2023 (-87,1%) e o Paradoxo da Pluviosidade Positiva',
    titleEn: 'Unprecedented 2023 Collapse (-87.1%) and Positive Rainfall Paradox',
    category: 'Clima, CHIRPS e Choques',
    primaryPressure:
      'Em 2023 a safra desabou para 35.371 t (-87,1%), mas o CHIRPS marcou anomalia pluviométrica POSITIVA (+78,1%). Uma mandioca não morre afogada em solo arenoso de Zavala!',
    primaryPressureEn:
      'In 2023 production collapsed to 35,371 t (-87.1%), yet CHIRPS recorded a POSITIVE rainfall anomaly (+78.1%). Cassava does not drown in Zavala’s sandy soils!',
    secondaryPressure:
      'Se a mandioca é a rainha da resistência alimentar, como justifica um colapso tão devastador sem admitir que a vulnerabilidade do sistema agrário é estrutural?',
    secondaryPressureEn:
      'If cassava is the cornerstone of drought survival, how do you explain such a devastating collapse without admitting structural agrarian vulnerability?',
    epistemicGuardrail:
      'A candidata deve explicar a física do solo e a fisiologia radicular: embora os solos de topo dunar sejam arenosos, nas depressões e áreas de declive suave (ex.: Nzile e Quissico Sul) a precipitação torrencial do Ciclone Freddy causou encharcamento prolongado, anoxia e podridão bacteriana em massa.',
    epistemicGuardrailEn:
      'The candidate must explain soil physics and root physiology: while dune crests are sandy, depressions and low slopes (e.g. Nzile) suffered waterlogging from Cyclone Freddy, triggering anoxia and bacterial soft rot.',
    internalAppEvidence: {
      tab: 'dados',
      param: '2023',
      locationLabel: 'Estação de Dados · Ano Agrícola 2023 (Ciclone Freddy e Colapso)',
      locationLabelEn: 'Data Station · 2023 Agricultural Year (Cyclone Freddy & Collapse)',
    },
    associatedQuestionNumbers: [10, 11, 13],
  },
  {
    id: 'v15',
    code: 'V15',
    title: 'Ciclone Favio em 2007 (Passagem a 219,8 km de Zavala)',
    titleEn: 'Cyclone Favio in 2007 (Track at 219.8 km from Zavala)',
    category: 'Clima, CHIRPS e Choques',
    primaryPressure:
      'O Ciclone Favio fez landfall em Vilanculos, a mais de 200 km a norte de Zavala. Como pode a dissertação imputar a Favio uma quebra colossal de 74.902 t no distrito?',
    primaryPressureEn:
      'Cyclone Favio made landfall in Vilanculos, over 200 km north of Zavala. How can your thesis attribute a massive 74,902 t loss in Zavala to Favio?',
    secondaryPressure:
      'Não estaria a tese a usar ciclones noticiosos para justificar quebras de safra cuja origem real pode ter sido agronômica ou socioeconômica?',
    secondaryPressureEn:
      'Was the thesis not using high-profile media cyclones to explain yield losses that actually had agronomic or socioeconomic causes?',
    epistemicGuardrail:
      'A candidata deve recorrer à base IBTrACS v4 e ao raio de ventos destrutivos: o desfolhamento forçado e o acamamento mecânico provocados pelas bandas de tempestade periféricas reduziram drasticamente o índice de área foliar (IAF) e a taxa fotossintética.',
    epistemicGuardrailEn:
      'The candidate must invoke IBTrACS v4 data and storm wind radii: peripheral severe gale bands caused defoliation and mechanical lodging, cutting leaf area index (LAI) and photosynthetic tuber bulking.',
    internalAppEvidence: {
      tab: 'dados',
      param: '2007',
      locationLabel: 'Estação de Dados · Evento Favio 2007 (Trajetória IBTrACS e Perdas)',
      locationLabelEn: 'Data Station · 2007 Favio Event (IBTrACS Track & Modeled Losses)',
    },
    associatedQuestionNumbers: [9, 11],
  },
  {
    id: 'v16',
    code: 'V16',
    title: 'Delimitação Espacial aos 11 Bairros de Quissico',
    titleEn: 'Spatial Delimitation to the 11 Quissico Bairros',
    category: 'Análise Espacial em Quissico',
    primaryPressure:
      'A dissertação intitula-se "Distrito de Zavala", mas o estudo de sensoriamento remoto com Sentinel-2 limita-se estritamente aos 11 bairros do Posto de Quissico. Isso não é uma promessa quebrada no título?',
    primaryPressureEn:
      'The thesis title refers to "Zavala District", yet Sentinel-2 spatial analysis is strictly confined to Quissico’s 11 bairros. Is this not a mismatch with the title?',
    secondaryPressure:
      'Como pode afirmar que os 11 bairros de Quissico refletem as realidades agrícolas de Zandamela ou Mavila, onde a ecologia e o acesso a mercados são totalmente distintos?',
    secondaryPressureEn:
      'How can you claim Quissico’s 11 bairros reflect realities in Zandamela or Mavila, where agroecology and market access are entirely different?',
    epistemicGuardrail:
      'A candidata deve esclarecer a hierarquia escalar: a série temporal macro é distrital (Zavala integral, 31 anos), ao passo que o recorte micro-espacial em alta resolução (10m) foi circunscrito a Quissico como estudo de caso representativo e metodologicamente viável.',
    epistemicGuardrailEn:
      'The candidate must explain scalar hierarchy: macro time-series covers the whole district (31 years), while high-resolution 10m spatial analysis was focused on Quissico as a representative, feasible case study.',
    internalAppEvidence: {
      tab: 'dados',
      param: 'espacial',
      locationLabel: 'Estação de Dados · Cartografia e Tabela 7 dos 11 Bairros de Quissico',
      locationLabelEn: 'Data Station · Mapping & Table 7 of Quissico 11 Bairros',
    },
    associatedQuestionNumbers: [13, 14, 15],
  },
  {
    id: 'v17',
    code: 'V17',
    title: 'Área Cartográfica de 22.343 Hectares em Quissico',
    titleEn: '22,343 Hectares Cartographic Footprint in Quissico',
    category: 'Análise Espacial em Quissico',
    primaryPressure:
      'Ao aplicar o Dynamic World e Sentinel-2 sobre 22.343 ha, a tese calcula índices de Gini de concentração agrícola. A validação de campo cobriu verdadeiramente essas áreas remotas?',
    primaryPressureEn:
      'Applying Dynamic World and Sentinel-2 over 22,343 ha, the thesis calculates Gini agricultural concentration indices. Did field ground-truthing genuinely cover these remote zones?',
    secondaryPressure:
      'O índice de Kappa de concordância da classificação de solo foi suficientemente alto para garantir que áreas de pousio arbustivo não foram confundidas com mandiocais jovens?',
    secondaryPressureEn:
      'Was classification Kappa coefficient high enough to guarantee scrub fallow was not misclassified as young cassava stands?',
    epistemicGuardrail:
      'A candidata deve citar os pontos de GPS de controlo in-situ e a matriz de confusão, admitindo margem de incerteza em parcelas consorciadas de pequena dimensão (< 0,5 ha).',
    epistemicGuardrailEn:
      'The candidate must cite in-situ GPS ground control points and confusion matrix, acknowledging uncertainty margins in small intercropped plots (< 0.5 ha).',
    internalAppEvidence: {
      tab: 'dados',
      param: 'espacial',
      locationLabel: 'Estação de Dados · Limitações Metodológicas da Classificação Orbital',
      locationLabelEn: 'Data Station · Methodological Limitations of Orbital Classification',
    },
    associatedQuestionNumbers: [13, 14, 15],
  },
  {
    id: 'v18',
    code: 'V18',
    title: 'Estatuto das 77 Entrevistas e 51 Páginas do Caderno de Campo',
    titleEn: 'Epistemic Status of 77 Farmer Interviews & 51 Notebook Pages',
    category: 'Etnografia e Comunidade',
    primaryPressure:
      'Setenta e sete agricultores entrevistados por amostragem de conveniência não possuem representatividade probabilística sobre os milhares de produtores de Zavala. Como legitima essas conclusões?',
    primaryPressureEn:
      'Seventy-seven convenience-sampled farmers lack probabilistic statistical representation across Zavala’s thousands of growers. How do you legitimize your conclusions?',
    secondaryPressure:
      'A candidata não correu o risco de converter relatos individuais subjetivos sobre pragas e quebras de safra em "provas agronômicas" sem diagnóstico laboratorial?',
    secondaryPressureEn:
      'Did you not risk turning subjective farmer recollections of pests and harvest losses into "agronomic proofs" without laboratory testing?',
    epistemicGuardrail:
      'A candidata deve afirmar a natureza qualitativa e etnográfica da amostra: as 77 entrevistas servem para triangulação hermenêutica de percepções, práticas de manejo e história oral, nunca como censo probabilístico.',
    epistemicGuardrailEn:
      'The candidate must affirm the qualitative, ethnographic nature of the sample: the 77 interviews provide hermeneutic triangulation of farmer perceptions, never a probabilistic census.',
    internalAppEvidence: {
      tab: 'campo',
      param: 'entrevistas',
      locationLabel: 'Trabalho de Campo · 77 Fichas de Inquérito Transcritas',
      locationLabelEn: 'Field Work · 77 Transcribed Survey Forms',
    },
    associatedQuestionNumbers: [16, 17, 18, 19, 38],
  },
  {
    id: 'v19',
    code: 'V19',
    title: 'Divisão Sexual do Trabalho, Enxada Curta (Xikotso) e Kukwatsana',
    titleEn: 'Gender Division of Labor, Short-Hoe (Xikotso) & Kukwatsana Mutual Aid',
    category: 'Etnografia e Comunidade',
    primaryPressure:
      'Ao analisar o trabalho feminino com enxada curta (Xikotso) e o mutirão Kukwatsana, a dissertação não romantiza a penosidade física e a pobreza das mulheres rurais de Zavala?',
    primaryPressureEn:
      'In analyzing women’s labor with short-handled hoes (Xikotso) and Kukwatsana mutual aid, does your thesis not romanticize the extreme physical hardship and poverty of rural women?',
    secondaryPressure:
      'Qual é a proposta concreta da tese para mecanização ou alívio ergonômico, para além da mera descrição antropológica da labuta diária?',
    secondaryPressureEn:
      'What is your thesis’s concrete recommendation for mechanization or ergonomic relief, beyond purely describing daily anthropological toil?',
    epistemicGuardrail:
      'A candidata deve articular que o registo etnográfico documenta a sobrecarga reprodutiva e propõe políticas públicas concretas: tração animal leve, cooperativas de descasque e acesso a crédito rural direto para mulheres chefes de família.',
    epistemicGuardrailEn:
      'The candidate must articulate that the ethnographic record highlights reproductive burdens and advocates concrete policies: light animal traction, peeling cooperatives, and direct rural credit for female-headed households.',
    internalAppEvidence: {
      tab: 'campo',
      param: 'cruz_04',
      locationLabel: 'Trabalho de Campo · Nó de Triangulação Etnográfica (Foto 6 e Kukwatsana)',
      locationLabelEn: 'Field Work · Ethnographic Triangulation Node (Photo 6 & Kukwatsana)',
    },
    associatedQuestionNumbers: [19, 38],
  },
  {
    id: 'v20',
    code: 'V20',
    title: 'Limitações Institucionais e Técnicas dos Relatórios do SDAE',
    titleEn: 'Institutional & Technical Constraints of SDAE District Reporting',
    category: 'Políticas Públicas e Extensão',
    primaryPressure:
      'Os extensionistas do SDAE em Zavala enfrentam falta de combustível, balanças e GPS. Não é arriscado fundar uma dissertação de mestrado da UEM em dados administrativos tão frágeis?',
    primaryPressureEn:
      'SDAE extension staff in Zavala lack fuel, scales, and GPS units. Isn’t it precarious to anchor an Eduardo Mondlane University master’s thesis on fragile administrative reports?',
    secondaryPressure:
      'Se a própria candidata reconhece as fragilidades do SDAE, que garantia tem a banca de que as análises de tendência não replicam erros de medição burocráticos?',
    secondaryPressureEn:
      'If the candidate acknowledges SDAE limitations, what guarantee does the board have that trend analyses do not simply mirror bureaucratic reporting errors?',
    epistemicGuardrail:
      'A candidata deve responder com o protocolo de triangulação e calibração cruzada: os relatórios do SDAE nunca foram aceites como verdade absoluta, tendo sido cotejados com satélites Sentinel-2, índices pluviométricos CHIRPS e inquéritos de campo.',
    epistemicGuardrailEn:
      'The candidate must emphasize the triangulation and cross-calibration protocol: SDAE records were never accepted uncritically, but verified against Sentinel-2 imagery, CHIRPS rainfall, and field interviews.',
    internalAppEvidence: {
      tab: 'dados',
      param: 'limitacoes',
      locationLabel: 'Estação de Dados · Registo de Limitações Científicas e Metodológicas',
      locationLabelEn: 'Data Station · Registry of Scientific & Methodological Limitations',
    },
    associatedQuestionNumbers: [20, 37, 40],
  },
];

// Mapeamento directo entre números das perguntas e vulnerabilidades principais
export function getVulnerabilitiesForQuestion(questionNumber: number): AdversarialVulnerability[] {
  return ADVERSARIAL_VULNERABILITIES.filter((v) =>
    v.associatedQuestionNumbers.includes(questionNumber)
  );
}

// Conjunto de perguntas com alto potencial adversarial metodológico (para sorteio da Banca Adversarial)
export const ADVERSARIAL_PRIORITY_QUESTION_NUMBERS: number[] = [
  1, 2, 3, 4, 7, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20, 37, 38, 40, 41, 42
];

// Seleciona perguntas com alto potencial de objecção para uma sessão da Banca Adversarial
export function selectAdversarialSessionQuestions(count: number = 5): DissertationQuestion[] {
  const priorityQuestions = DISSERTATION_FULL_QUESTIONS.filter((q) =>
    ADVERSARIAL_PRIORITY_QUESTION_NUMBERS.includes(q.number)
  );
  // Embaralhar e extrair count perguntas
  const shuffled = [...priorityQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// -------------------------------------------------------------
// SCANNER EPISTEMOLÓGICO EM TEMPO REAL
// -------------------------------------------------------------
export interface EpistemicRiskAlert {
  id: string;
  matchedPattern: string;
  dangerLevel: 'alto' | 'medio';
  riskMessagePt: string;
  riskMessageEn: string;
  reformulationPt: string;
  reformulationEn: string;
}

interface EpistemicRiskRule {
  pattern: RegExp;
  exceptionPattern?: RegExp;
  dangerLevel: 'alto' | 'medio';
  riskMessagePt: string;
  riskMessageEn: string;
  reformulationPt: string;
  reformulationEn: string;
}

const EPISTEMIC_RISK_RULES: EpistemicRiskRule[] = [
  {
    pattern: /(falta\s+de\s+chuva\s+causou|a\s+chuva\s+causou|as\s+chuvas\s+causaram|a\s+chuva\s+determinou)/i,
    dangerLevel: 'alto',
    riskMessagePt: 'A formulação ultrapassa o que a evidência apresentada permite afirmar (atribuição causal direta sem controle de outros fatores biofísicos).',
    riskMessageEn: 'The phrasing oversteps available empirical evidence (direct causal attribution without controlling for other biophysical factors).',
    reformulationPt: 'Recomenda-se: "A precipitação anómala coincidiu temporalmente com quebras acentuadas, configurando um estresse biofísico acentuado pela vulnerabilidade edáfica."',
    reformulationEn: 'Suggested: "Anomalous rainfall temporally coincided with sharp harvest losses, acting as a biophysical stress factor amplified by soil vulnerability."',
  },
  {
    pattern: /(ciclone\s+favio\s+provocou\s+(uma\s+)?perda|favio\s+provocou\s+(uma\s+)?perda|o\s+ciclone\s+causou\s+exactamente|o\s+ciclone\s+causou\s+exatamente)/i,
    dangerLevel: 'alto',
    riskMessagePt: 'A formulação atribui exatidão determinística a um cálculo que resulta de modelação contrafactual estimada.',
    riskMessageEn: 'The phrasing attributes deterministic precision to a calculation derived from estimated counterfactual modeling.',
    reformulationPt: 'Recomenda-se: "O impacto modelado do evento ciclónico estima quebras na ordem de magnitude indicada, através do desvio contrafactual da tendência."',
    reformulationEn: 'Suggested: "The modeled event impact estimates harvest losses of the indicated order of magnitude via counterfactual trend deviation."',
  },
  {
    pattern: /(a\s+correla[cç][aã]o\s+prova|a\s+correla[cç][aã]o\s+demonstra\s+causalidade|correla[cç][aã]o\s+chirps\s+demonstra)/i,
    dangerLevel: 'alto',
    riskMessagePt: 'Violação do princípio epistemológico: correlação estatística (especialmente r = 0,057 não-significativo) NÃO constitui prova causal nem demonstração de influência direta.',
    riskMessageEn: 'Epistemic violation: statistical correlation (especially non-significant r = 0.057) does NOT constitute proof of causality or direct influence.',
    reformulationPt: 'Recomenda-se: "A fraca correlação linear (r = 0,057; p = 0,762) demonstra que a precipitação acumulada linear não explica isoladamente a produção, indicando efeitos não-lineares e de extremos."',
    reformulationEn: 'Suggested: "The weak linear correlation (r = 0.057; p = 0.762) demonstrates that cumulative rainfall alone does not linearly explain production, highlighting non-linear extreme dynamics."',
  },
  {
    pattern: /(todos\s+os\s+dados\s+s[aã]o\s+observados|a\s+s[eé]rie\s+completa\s+foi\s+observada|s[eé]rie\s+integralmente\s+observada|1994\s+a\s+2024\s+[^\.]*constitu[ií]da\s+por\s+dados\s+observados|1994\s+a\s+2024\s+[^\.]*dados\s+observados)/i,
    dangerLevel: 'alto',
    riskMessagePt: 'Incorreção factual grave: a série cobre 31 anos, dos quais apenas 8 anos (2017–2024) são dados empíricos observados do SDAE.',
    riskMessageEn: 'Severe factual error: the series spans 31 years, of which only 8 years (2017–2024) are empirically observed SDAE records.',
    reformulationPt: 'Recomenda-se: "A série é estruturalmente híbrida: os 8 anos recentes (2017–2024) são observados pelo SDAE, enquanto os 23 anos anteriores (1994–2016) são reconstituídos por modelação determinística."',
    reformulationEn: 'Suggested: "The series is structurally hybrid: the 8 recent years (2017–2024) are observed by SDAE, while the 23 preceding years (1994–2016) are reconstructed via deterministic modeling."',
  },
  {
    pattern: /(foram\s+perdidas\s+547\.224|547\.224\s+toneladas\s+foram\s+perdidas)/i,
    exceptionPattern: /(contrafactual|estimad|modela|diferencial)/i,
    dangerLevel: 'medio',
    riskMessagePt: 'Risco de apresentar um volume contrafactual modelado (547.224 t) como perda física documental direta sem salvaguarda metodológica.',
    riskMessageEn: 'Risk of presenting a modeled counterfactual volume (547,224 t) as a direct physical documentary loss without methodological qualification.',
    reformulationPt: 'Recomenda-se: "As 547.224 toneladas representam o volume cumulativo estimado de perdas pelo diferencial contrafactual face à tendência potencial nos 14 anos adversos."',
    reformulationEn: 'Suggested: "The 547,224 tons represent estimated cumulative losses derived from counterfactual divergence against potential trend across 14 adverse years."',
  },
  {
    pattern: /(produtores\s+diagnosticaram|os\s+produtores\s+confirmaram\s+cientificamente|os\s+inqu[eé]ritos\s+provam\s+o\s+v[ií]rus)/i,
    dangerLevel: 'medio',
    riskMessagePt: 'Confusão epistemológica entre discurso declaratório dos produtores e diagnóstico biológico laboratorial fitopatológico.',
    riskMessageEn: 'Epistemic confusion between farmer declarative discourse and laboratory biological phytopathological diagnosis.',
    reformulationPt: 'Recomenda-se: "Os 77 inquéritos registam as percepções qualitativas e o saber empírico dos agricultores, apontando sintomas de campo consistentes com estriamento ou mosaico."',
    reformulationEn: 'Suggested: "The 77 interviews record qualitative perceptions and empirical knowledge, noting field symptoms consistent with brown streak or mosaic."',
  },
  {
    pattern: /(quissico\s+representa(m)?\s+todo\s+o\s+distrito|extrapolamos\s+quissico\s+para\s+todo\s+o\s+distrito|11\s+bairros\s+de\s+quissico\s+representa(m)?\s+todo\s+o\s+distrito)/i,
    dangerLevel: 'alto',
    riskMessagePt: 'Extrapolação espacial indevida: os 11 bairros de Quissico possuem especificidades geomorfológicas que não se aplicam aos outros postos.',
    riskMessageEn: 'Undue spatial extrapolation: Quissico’s 11 bairros have geomorphological traits that cannot be generalized to other administrative posts.',
    reformulationPt: 'Recomenda-se: "A análise cartográfica Sentinel-2 e SRTM refere-se estritamente aos 22.343 ha de Quissico, constituindo um estudo de caso local com limites metodológicos explícitos."',
    reformulationEn: 'Suggested: "Sentinel-2 and SRTM cartographic analysis is strictly confined to Quissico’s 22,343 ha, standing as a local case study with explicit methodological boundaries."',
  },
  {
    pattern: /(mann-kendall\s+prova\s+causalidade|mann-kendall\s+prova\s+que\s+a\s+produ[cç][aã]o\s+est[aá]\s+a\s+melhorar)/i,
    dangerLevel: 'alto',
    riskMessagePt: 'Erro conceitual: o teste de Mann-Kendall atesta monotonicidade ordinal de tendência, não causalidade nem progresso socioeconómico.',
    riskMessageEn: 'Conceptual error: Mann-Kendall test asserts ordinal monotonicity of trend, not causality or socioeconomic improvement.',
    reformulationPt: 'Recomenda-se: "O teste de Mann-Kendall confirma a existência de uma tendência monotónica positiva estatisticamente significativa (Z = 3,100; p = 0,0019) no conjunto dos 31 anos."',
    reformulationEn: 'Suggested: "The Mann-Kendall test confirms a statistically significant positive monotonic trend (Z = 3.100; p = 0.0019) across the 31-year timeline."',
  },
];

export function scanForEpistemicRisks(text: string): EpistemicRiskAlert[] {
  const alerts: EpistemicRiskAlert[] = [];
  if (!text || text.trim().length === 0) return alerts;

  EPISTEMIC_RISK_RULES.forEach((rule, idx) => {
    if (rule.pattern.test(text)) {
      if (rule.exceptionPattern && rule.exceptionPattern.test(text)) {
        return; // Salvaguarda prudente presente, não alertar
      }
      alerts.push({
        id: `risk_${idx}`,
        matchedPattern: rule.pattern.source,
        dangerLevel: rule.dangerLevel,
        riskMessagePt: rule.riskMessagePt,
        riskMessageEn: rule.riskMessageEn,
        reformulationPt: rule.reformulationPt,
        reformulationEn: rule.reformulationEn,
      });
    }
  });

  return alerts;
}
