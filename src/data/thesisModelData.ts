// Dados oficiais do Modelo Zavala Mandioca (1994-2024)
// Extraídos do ficheiro anexo da dissertação de Yolanda Tamele (UEM ESUDER)

export interface ModelAssumption {
  id: string;
  category: string;
  parameter: string;
  value: string;
  unit: string;
  interval: string;
  source: string;
  notes: string;
}

export interface ClimateShockFactor {
  year: number;
  event: string;
  fArea: number;
  fYield: number;
  fProd: number;
  source: string;
  confidence: 'Alto' | 'Médio' | 'Baixo';
}

export interface ObservedSDAERecord {
  year: number;
  productionTonnes: number;
  shockOrContext: string;
  source: string;
}

export interface TimeSeriesRow {
  year: number;
  status: 'ESTIMATIVA' | 'OBSERVADO (SDAE)';
  trendAreaHa: number;
  fArea: number;
  effectiveAreaHa: number;
  trendYieldTonnesHa: number;
  fYield: number;
  effectiveYieldTonnesHa: number;
  estimatedProdTonnes: number;
  observedProdTonnes: number | null;
  finalProdTonnes: number;
  lowerConfidenceTonnes: number | null;
  upperConfidenceTonnes: number | null;
  annualVarPercent: number | null;
  eventOrShock: string;
}

export interface ClimateImpactLossRow {
  year: number;
  event: string;
  trendProdTonnes: number;
  actualProdTonnes: number;
  lossTonnes: number;
  lossPercent: number;
  source: string;
}

export interface MethodologyLayer {
  layerNumber: number;
  title: string;
  shortDesc: string;
  details: string[];
  keyReferences: string[];
}

export const THESIS_MODEL_ASSUMPTIONS: ModelAssumption[] = [
  // 1. Área
  {
    id: 'p_area_base',
    category: '1. Área Cultivada Base e Taxas de Crescimento',
    parameter: 'area_base_1994',
    value: '18.000',
    unit: 'ha',
    interval: '15.000 - 21.000',
    source: 'WB Jobs WP No.31; PROSUL 2014-19; proporção Zavala ~15% de Inhambane (127.000 ha)',
    notes: 'Valor base para 1994; tendência cresce a partir daqui'
  },
  {
    id: 'p_area_1994_2006',
    category: '1. Área Cultivada Base e Taxas de Crescimento',
    parameter: 'taxa_area_1994_2006',
    value: '0,008',
    unit: 'ha/ha/ano (0,8%)',
    interval: '0.005 - 0.012',
    source: 'FAO Africa cassava trends; Adebayo 2023 Heliyon 9(9); pré-programas',
    notes: 'Taxa anual composta de expansão de área cultivada pós-guerra'
  },
  {
    id: 'p_area_2007_2016',
    category: '1. Área Cultivada Base e Taxas de Crescimento',
    parameter: 'taxa_area_2007_2016',
    value: '0,010',
    unit: 'ha/ha/ano (1,0%)',
    interval: '0.008 - 0.015',
    source: 'PROSUL 2014-19; crescimento pós-Favio 2007',
    notes: 'Recuperação e expansão apoiada por programas agrários'
  },
  {
    id: 'p_area_2017_2024',
    category: '1. Área Cultivada Base e Taxas de Crescimento',
    parameter: 'taxa_area_2017_2024',
    value: '0,018',
    unit: 'ha/ha/ano (1,8%)',
    interval: '0.012 - 0.025',
    source: 'SUSTENTA 2020; MADER 2023; 127.000 ha provinciais',
    notes: 'Aceleração com SUSTENTA e introdução de variedades melhoradas'
  },
  // 2. Rendimento
  {
    id: 'p_rend_base',
    category: '2. Rendimento Base e Taxas de Melhoria',
    parameter: 'rendimento_base_1994',
    value: '3,500',
    unit: 't/ha',
    interval: '3.0 - 4.0',
    source: 'WB Jobs WP No.31 (<5 t/ha Inhambane/Gaza); Folmer et al.; FAO Mozambique 1994-2000',
    notes: 'Rendimento base com variedades tradicionais em solo arenoso'
  },
  {
    id: 'p_rend_1994_2009',
    category: '2. Rendimento Base e Taxas de Melhoria',
    parameter: 'taxa_rend_1994_2009',
    value: '0,040',
    unit: 't/ha/ano (4,0% rel.)',
    interval: '0.02 - 0.06',
    source: 'FAO Mozambique; Folmer et al. ScienceDirect; pré-DADTCO',
    notes: 'Crescimento anual lento pré-programas industriais'
  },
  {
    id: 'p_rend_2010_2016',
    category: '2. Rendimento Base e Taxas de Melhoria',
    parameter: 'taxa_rend_2010_2016',
    value: '0,070',
    unit: 't/ha/ano (7,0% rel.)',
    interval: '0.05 - 0.10',
    source: 'DADTCO início Nampula 2011; IIAM variedades; WB Jobs WP No.31',
    notes: 'Aceleração moderada com chegada e preparação da fábrica DADTCO'
  },
  {
    id: 'p_rend_2017_2024',
    category: '2. Rendimento Base e Taxas de Melhoria',
    parameter: 'taxa_rend_2017_2024',
    value: '0,180',
    unit: 't/ha/ano (18,0% rel.)',
    interval: '0.12 - 0.25',
    source: 'SUSTENTA Fase 2 (2020); DADTCO 9-22 t/ha; MADER 2023; IIAM Chigoma mafia/Mulaleia',
    notes: 'Alta taxa com variedades melhoradas, fertilização e extensão técnica'
  }
];

export const THESIS_CLIMATE_SHOCKS: ClimateShockFactor[] = [
  { year: 1994, event: 'Recuperação pós-guerra civil 1977-92', fArea: 0.90, fYield: 0.92, fProd: 0.83, source: 'FAO Mozambique Country Profile; African Studies Review 2022', confidence: 'Médio' },
  { year: 1995, event: 'Condições normais', fArea: 1.00, fYield: 1.00, fProd: 1.00, source: 'FAO', confidence: 'Baixo' },
  { year: 1996, event: 'Condições normais', fArea: 1.00, fYield: 1.00, fProd: 1.00, source: 'FAO', confidence: 'Baixo' },
  { year: 1997, event: 'Condições normais', fArea: 1.00, fYield: 1.00, fProd: 1.00, source: 'FAO', confidence: 'Baixo' },
  { year: 1998, event: 'Seca moderada sul Moçambique', fArea: 0.97, fYield: 0.88, fProd: 0.85, source: 'FEWS NET Historical Archive; FAO 1998', confidence: 'Médio' },
  { year: 1999, event: 'Condições normais', fArea: 1.00, fYield: 0.97, fProd: 0.97, source: 'FAO', confidence: 'Baixo' },
  { year: 2000, event: 'Cheias históricas + Ciclones Eline & Hudah Cat.4', fArea: 0.72, fYield: 0.62, fProd: 0.45, source: 'OCHA/ReliefWeb Sit.Rep. Fev.2000; 800 mortos; 100.000+ deslocados', confidence: 'Alto' },
  { year: 2001, event: 'Recuperação pós-cheias 2000', fArea: 0.85, fYield: 0.80, fProd: 0.68, source: 'ReliefWeb; FAO 2001 Recovery', confidence: 'Alto' },
  { year: 2002, event: 'Recuperação gradual', fArea: 0.97, fYield: 0.95, fProd: 0.92, source: 'FAO', confidence: 'Médio' },
  { year: 2003, event: 'Condições normais', fArea: 1.00, fYield: 1.00, fProd: 1.00, source: 'FAO', confidence: 'Baixo' },
  { year: 2004, event: 'Condições normais', fArea: 1.00, fYield: 1.00, fProd: 1.00, source: 'FAO', confidence: 'Baixo' },
  { year: 2005, event: 'Condições normais', fArea: 1.00, fYield: 1.00, fProd: 1.00, source: 'FAO', confidence: 'Baixo' },
  { year: 2006, event: 'Condições normais', fArea: 1.00, fYield: 1.00, fProd: 1.00, source: 'FAO', confidence: 'Baixo' },
  { year: 2007, event: 'Ciclone Favio Cat.4 - Landfall Vilanculos/Zavala (203 km/h)', fArea: 0.65, fYield: 0.55, fProd: 0.36, source: 'OCHA Flash Appeal 2007; 277.000 ha destruídos Inhambane; $71M danos; 160.000 afectados', confidence: 'Alto' },
  { year: 2008, event: 'Recuperação pós-Favio', fArea: 0.80, fYield: 0.72, fProd: 0.58, source: 'FAO/WFP CFSAM 2008; destruição sementes e estacas', confidence: 'Alto' },
  { year: 2009, event: 'Recuperação gradual', fArea: 0.93, fYield: 0.90, fProd: 0.84, source: 'FAO 2009', confidence: 'Médio' },
  { year: 2010, event: 'Cheias sazonais moderadas Inhambane', fArea: 0.95, fYield: 0.87, fProd: 0.83, source: 'FAO/WFP CFSAM 2010; zonas baixas Inhambane afectadas', confidence: 'Médio' },
  { year: 2011, event: 'Condições normais; início DADTCO Nampula', fArea: 1.00, fYield: 1.02, fProd: 1.02, source: 'CTA/DADTCO 2011; IFDC; efeito positivo incipiente', confidence: 'Médio' },
  { year: 2012, event: 'Cheias sazonais graves sul Moçambique', fArea: 0.88, fYield: 0.82, fProd: 0.72, source: 'ReliefWeb/INGD 2013; 113+ mortos; 240.000+ afectados nacionais', confidence: 'Alto' },
  { year: 2013, event: 'Recuperação cheias; início variedades melhoradas', fArea: 0.95, fYield: 0.93, fProd: 0.88, source: 'INGD 2013; IIAM variedades CBSD-resistentes distribuídas', confidence: 'Médio' },
  { year: 2014, event: 'Condições normais; DADTCO fábrica Zavala operacional', fArea: 1.00, fYield: 1.05, fProd: 1.05, source: 'CTA; Portal Gov. Inhambane 2014; duplicação produção documentada', confidence: 'Médio' },
  { year: 2015, event: 'Início seca El Niño; atraso chuvas >30 dias', fArea: 0.90, fYield: 0.72, fProd: 0.65, source: 'FEWS NET Jun.2016; INGD 2016; fracasso parcial', confidence: 'Alto' },
  { year: 2016, event: 'Seca El Niño extrema - fracasso total colheitas Inhambane', fArea: 0.78, fYield: 0.52, fProd: 0.41, source: 'FEWS NET Jun.2016: "fracasso total"; 66.119 IPC3+ Inhambane; pior seca 35 anos; INGD 2016', confidence: 'Alto' }
];

export const THESIS_OBSERVED_SDAE: ObservedSDAERecord[] = [
  { year: 2017, productionTonnes: 220350.00, shockOrContext: 'Ciclone Dineo Cat.3 Zavala (170 km/h) no ano anterior', source: 'SDAE Zavala - Dados primários distritais' },
  { year: 2018, productionTonnes: 187415.00, shockOrContext: 'Condições normais pós-Dineo', source: 'SDAE Zavala - Dados primários distritais' },
  { year: 2019, productionTonnes: 196349.70, shockOrContext: 'Ciclone Idai impacto indirecto', source: 'SDAE Zavala - Dados primários distritais' },
  { year: 2020, productionTonnes: 259570.58, shockOrContext: 'SUSTENTA Fase 2 - crescimento agrário 8,2%', source: 'SDAE Zavala - Dados primários distritais' },
  { year: 2021, productionTonnes: 273773.02, shockOrContext: 'Expansão variedades melhoradas - MÁXIMO DA SÉRIE HISTÓRICA', source: 'SDAE Zavala - Dados primários distritais' },
  { year: 2022, productionTonnes: 173931.67, shockOrContext: 'Cheias sazonais + MADER 38M Mt alocados', source: 'SDAE Zavala - Dados primários distritais' },
  { year: 2023, productionTonnes: 35371.00, shockOrContext: 'Seca El Niño 2023-24 - colapso produção (−87% vs 2021)', source: 'SDAE Zavala - Dados primários distritais' },
  { year: 2024, productionTonnes: 48573.39, shockOrContext: 'Seca El Niño persistente - recuperação parcial', source: 'SDAE Zavala - Dados primários distritais' }
];

export const THESIS_COMPLETE_TIME_SERIES: TimeSeriesRow[] = [
  { year: 1994, status: 'ESTIMATIVA', trendAreaHa: 18000, fArea: 0.90, effectiveAreaHa: 16200, trendYieldTonnesHa: 3.50, fYield: 0.92, effectiveYieldTonnesHa: 3.22, estimatedProdTonnes: 52164, observedProdTonnes: null, finalProdTonnes: 52164, lowerConfidenceTonnes: 44339, upperConfidenceTonnes: 59989, annualVarPercent: null, eventOrShock: 'Recuperação pós-guerra civil 1977-92' },
  { year: 1995, status: 'ESTIMATIVA', trendAreaHa: 18144, fArea: 1.00, effectiveAreaHa: 18144, trendYieldTonnesHa: 3.64, fYield: 1.00, effectiveYieldTonnesHa: 3.64, estimatedProdTonnes: 66044, observedProdTonnes: null, finalProdTonnes: 66044, lowerConfidenceTonnes: 56138, upperConfidenceTonnes: 75951, annualVarPercent: 26.6, eventOrShock: 'Condições normais' },
  { year: 1996, status: 'ESTIMATIVA', trendAreaHa: 18289, fArea: 1.00, effectiveAreaHa: 18289, trendYieldTonnesHa: 3.79, fYield: 1.00, effectiveYieldTonnesHa: 3.79, estimatedProdTonnes: 69235, observedProdTonnes: null, finalProdTonnes: 69235, lowerConfidenceTonnes: 58850, upperConfidenceTonnes: 79621, annualVarPercent: 4.8, eventOrShock: 'Condições normais' },
  { year: 1997, status: 'ESTIMATIVA', trendAreaHa: 18435, fArea: 1.00, effectiveAreaHa: 18435, trendYieldTonnesHa: 3.94, fYield: 1.00, effectiveYieldTonnesHa: 3.94, estimatedProdTonnes: 72581, observedProdTonnes: null, finalProdTonnes: 72581, lowerConfidenceTonnes: 61694, upperConfidenceTonnes: 83468, annualVarPercent: 4.8, eventOrShock: 'Condições normais' },
  { year: 1998, status: 'ESTIMATIVA', trendAreaHa: 18583, fArea: 0.97, effectiveAreaHa: 18025, trendYieldTonnesHa: 4.09, fYield: 0.88, effectiveYieldTonnesHa: 3.60, estimatedProdTonnes: 64949, observedProdTonnes: null, finalProdTonnes: 64949, lowerConfidenceTonnes: 55206, upperConfidenceTonnes: 74691, annualVarPercent: -10.5, eventOrShock: 'Seca moderada sul Moçambique' },
  { year: 1999, status: 'ESTIMATIVA', trendAreaHa: 18732, fArea: 1.00, effectiveAreaHa: 18732, trendYieldTonnesHa: 4.26, fYield: 0.97, effectiveYieldTonnesHa: 4.13, estimatedProdTonnes: 77372, observedProdTonnes: null, finalProdTonnes: 77372, lowerConfidenceTonnes: 65766, upperConfidenceTonnes: 88977, annualVarPercent: 19.1, eventOrShock: 'Condições normais' },
  { year: 2000, status: 'ESTIMATIVA', trendAreaHa: 18881, fArea: 0.72, effectiveAreaHa: 13595, trendYieldTonnesHa: 4.43, fYield: 0.62, effectiveYieldTonnesHa: 2.75, estimatedProdTonnes: 37327, observedProdTonnes: null, finalProdTonnes: 37327, lowerConfidenceTonnes: 29862, upperConfidenceTonnes: 44793, annualVarPercent: -51.8, eventOrShock: 'Cheias históricas + Ciclones Eline & Hudah Cat.4 (-55,4% vs tendência)' },
  { year: 2001, status: 'ESTIMATIVA', trendAreaHa: 19033, fArea: 0.85, effectiveAreaHa: 16178, trendYieldTonnesHa: 4.61, fYield: 0.80, effectiveYieldTonnesHa: 3.68, estimatedProdTonnes: 59608, observedProdTonnes: null, finalProdTonnes: 59608, lowerConfidenceTonnes: 50667, upperConfidenceTonnes: 68550, annualVarPercent: 59.7, eventOrShock: 'Recuperação pós-cheias 2000' },
  { year: 2002, status: 'ESTIMATIVA', trendAreaHa: 19185, fArea: 0.97, effectiveAreaHa: 18609, trendYieldTonnesHa: 4.79, fYield: 0.95, effectiveYieldTonnesHa: 4.55, estimatedProdTonnes: 84681, observedProdTonnes: null, finalProdTonnes: 84681, lowerConfidenceTonnes: 71979, upperConfidenceTonnes: 97383, annualVarPercent: 42.1, eventOrShock: 'Recuperação gradual' },
  { year: 2003, status: 'ESTIMATIVA', trendAreaHa: 19338, fArea: 1.00, effectiveAreaHa: 19338, trendYieldTonnesHa: 4.98, fYield: 1.00, effectiveYieldTonnesHa: 4.98, estimatedProdTonnes: 96335, observedProdTonnes: null, finalProdTonnes: 96335, lowerConfidenceTonnes: 81885, upperConfidenceTonnes: 110786, annualVarPercent: 13.8, eventOrShock: 'Condições normais' },
  { year: 2004, status: 'ESTIMATIVA', trendAreaHa: 19493, fArea: 1.00, effectiveAreaHa: 19493, trendYieldTonnesHa: 5.18, fYield: 1.00, effectiveYieldTonnesHa: 5.18, estimatedProdTonnes: 100990, observedProdTonnes: null, finalProdTonnes: 100990, lowerConfidenceTonnes: 85842, upperConfidenceTonnes: 116139, annualVarPercent: 4.8, eventOrShock: 'Condições normais' },
  { year: 2005, status: 'ESTIMATIVA', trendAreaHa: 19649, fArea: 1.00, effectiveAreaHa: 19649, trendYieldTonnesHa: 5.39, fYield: 1.00, effectiveYieldTonnesHa: 5.39, estimatedProdTonnes: 105870, observedProdTonnes: null, finalProdTonnes: 105870, lowerConfidenceTonnes: 89990, upperConfidenceTonnes: 121751, annualVarPercent: 4.8, eventOrShock: 'Condições normais' },
  { year: 2006, status: 'ESTIMATIVA', trendAreaHa: 19806, fArea: 1.00, effectiveAreaHa: 19806, trendYieldTonnesHa: 5.60, fYield: 1.00, effectiveYieldTonnesHa: 5.60, estimatedProdTonnes: 110986, observedProdTonnes: null, finalProdTonnes: 110986, lowerConfidenceTonnes: 94338, upperConfidenceTonnes: 127634, annualVarPercent: 4.8, eventOrShock: 'Condições normais' },
  { year: 2007, status: 'ESTIMATIVA', trendAreaHa: 20004, fArea: 0.65, effectiveAreaHa: 13003, trendYieldTonnesHa: 5.83, fYield: 0.55, effectiveYieldTonnesHa: 3.21, estimatedProdTonnes: 41677, observedProdTonnes: null, finalProdTonnes: 41677, lowerConfidenceTonnes: 33342, upperConfidenceTonnes: 50013, annualVarPercent: -62.4, eventOrShock: 'Ciclone Favio Cat.4 Landfall Vilanculos/Zavala (203 km/h, -64,3% perda)' },
  { year: 2008, status: 'ESTIMATIVA', trendAreaHa: 20204, fArea: 0.80, effectiveAreaHa: 16163, trendYieldTonnesHa: 6.06, fYield: 0.72, effectiveYieldTonnesHa: 4.36, estimatedProdTonnes: 70534, observedProdTonnes: null, finalProdTonnes: 70534, lowerConfidenceTonnes: 56427, upperConfidenceTonnes: 84641, annualVarPercent: 69.2, eventOrShock: 'Recuperação pós-Favio (destruição de sementes e estacas)' },
  { year: 2009, status: 'ESTIMATIVA', trendAreaHa: 20406, fArea: 0.93, effectiveAreaHa: 18978, trendYieldTonnesHa: 6.30, fYield: 0.90, effectiveYieldTonnesHa: 5.67, estimatedProdTonnes: 107661, observedProdTonnes: null, finalProdTonnes: 107661, lowerConfidenceTonnes: 91511, upperConfidenceTonnes: 123810, annualVarPercent: 52.6, eventOrShock: 'Recuperação gradual' },
  { year: 2010, status: 'ESTIMATIVA', trendAreaHa: 20610, fArea: 0.95, effectiveAreaHa: 19580, trendYieldTonnesHa: 6.74, fYield: 0.87, effectiveYieldTonnesHa: 5.87, estimatedProdTonnes: 114889, observedProdTonnes: null, finalProdTonnes: 114889, lowerConfidenceTonnes: 97656, upperConfidenceTonnes: 132123, annualVarPercent: 6.7, eventOrShock: 'Cheias sazonais moderadas Inhambane' },
  { year: 2011, status: 'ESTIMATIVA', trendAreaHa: 20816, fArea: 1.00, effectiveAreaHa: 20816, trendYieldTonnesHa: 7.22, fYield: 1.02, effectiveYieldTonnesHa: 7.36, estimatedProdTonnes: 153229, observedProdTonnes: null, finalProdTonnes: 153229, lowerConfidenceTonnes: 130245, upperConfidenceTonnes: 176214, annualVarPercent: 33.4, eventOrShock: 'Condições normais; início DADTCO Nampula e efeito de variedades' },
  { year: 2012, status: 'ESTIMATIVA', trendAreaHa: 21025, fArea: 0.88, effectiveAreaHa: 18502, trendYieldTonnesHa: 7.72, fYield: 0.82, effectiveYieldTonnesHa: 6.33, estimatedProdTonnes: 117150, observedProdTonnes: null, finalProdTonnes: 117150, lowerConfidenceTonnes: 99578, upperConfidenceTonnes: 134723, annualVarPercent: -23.5, eventOrShock: 'Cheias sazonais graves sul Moçambique (240.000+ afectados)' },
  { year: 2013, status: 'ESTIMATIVA', trendAreaHa: 21235, fArea: 0.95, effectiveAreaHa: 20173, trendYieldTonnesHa: 8.26, fYield: 0.93, effectiveYieldTonnesHa: 7.68, estimatedProdTonnes: 155009, observedProdTonnes: null, finalProdTonnes: 155009, lowerConfidenceTonnes: 131758, upperConfidenceTonnes: 178261, annualVarPercent: 32.3, eventOrShock: 'Recuperação cheias; início distribuição variedades resistentes a CBSD' },
  { year: 2014, status: 'ESTIMATIVA', trendAreaHa: 21447, fArea: 1.00, effectiveAreaHa: 21447, trendYieldTonnesHa: 8.84, fYield: 1.05, effectiveYieldTonnesHa: 9.28, estimatedProdTonnes: 199089, observedProdTonnes: null, finalProdTonnes: 199089, lowerConfidenceTonnes: 169225, upperConfidenceTonnes: 228952, annualVarPercent: 28.4, eventOrShock: 'Condições normais; fábrica DADTCO de processamento em Zavala operacional' },
  { year: 2015, status: 'ESTIMATIVA', trendAreaHa: 21662, fArea: 0.90, effectiveAreaHa: 19495, trendYieldTonnesHa: 9.46, fYield: 0.72, effectiveYieldTonnesHa: 6.81, estimatedProdTonnes: 132781, observedProdTonnes: null, finalProdTonnes: 132781, lowerConfidenceTonnes: 106225, upperConfidenceTonnes: 159338, annualVarPercent: -33.3, eventOrShock: 'Início seca severa El Niño; atraso de chuvas >30 dias (-35,2% perda)' },
  { year: 2016, status: 'ESTIMATIVA', trendAreaHa: 21878, fArea: 0.78, effectiveAreaHa: 17065, trendYieldTonnesHa: 10.12, fYield: 0.52, effectiveYieldTonnesHa: 5.26, estimatedProdTonnes: 89818, observedProdTonnes: null, finalProdTonnes: 89818, lowerConfidenceTonnes: 71855, upperConfidenceTonnes: 107782, annualVarPercent: -32.4, eventOrShock: 'Seca El Niño extrema - fracasso total de colheitas em Inhambane (-59,4% perda)' },
  { year: 2017, status: 'OBSERVADO (SDAE)', trendAreaHa: 22272, fArea: 1.00, effectiveAreaHa: 22272, trendYieldTonnesHa: 11.94, fYield: 1.00, effectiveYieldTonnesHa: 11.94, estimatedProdTonnes: 266009, observedProdTonnes: 220350.00, finalProdTonnes: 220350.00, lowerConfidenceTonnes: null, upperConfidenceTonnes: null, annualVarPercent: 145.3, eventOrShock: 'SDAE: 220.350 t | Ciclone Dineo Cat.3 em Zavala (170 km/h) no ano anterior' },
  { year: 2018, status: 'OBSERVADO (SDAE)', trendAreaHa: 22673, fArea: 1.00, effectiveAreaHa: 22673, trendYieldTonnesHa: 14.09, fYield: 1.00, effectiveYieldTonnesHa: 14.09, estimatedProdTonnes: 319541, observedProdTonnes: 187415.00, finalProdTonnes: 187415.00, lowerConfidenceTonnes: null, upperConfidenceTonnes: null, annualVarPercent: -14.9, eventOrShock: 'SDAE: 187.415 t | Condições normais pós-Dineo' },
  { year: 2019, status: 'OBSERVADO (SDAE)', trendAreaHa: 23081, fArea: 1.00, effectiveAreaHa: 23081, trendYieldTonnesHa: 16.63, fYield: 1.00, effectiveYieldTonnesHa: 16.63, estimatedProdTonnes: 383846, observedProdTonnes: 196349.70, finalProdTonnes: 196349.70, lowerConfidenceTonnes: null, upperConfidenceTonnes: null, annualVarPercent: 4.8, eventOrShock: 'SDAE: 196.350 t | Ciclone Idai impacto indirecto' },
  { year: 2020, status: 'OBSERVADO (SDAE)', trendAreaHa: 23497, fArea: 1.00, effectiveAreaHa: 23497, trendYieldTonnesHa: 19.62, fYield: 1.00, effectiveYieldTonnesHa: 19.62, estimatedProdTonnes: 461091, observedProdTonnes: 259570.58, finalProdTonnes: 259570.58, lowerConfidenceTonnes: null, upperConfidenceTonnes: null, annualVarPercent: 32.2, eventOrShock: 'SDAE: 259.571 t | SUSTENTA Fase 2 - crescimento agrário 8,2%' },
  { year: 2021, status: 'OBSERVADO (SDAE)', trendAreaHa: 23919, fArea: 1.00, effectiveAreaHa: 23919, trendYieldTonnesHa: 23.16, fYield: 1.00, effectiveYieldTonnesHa: 23.16, estimatedProdTonnes: 553881, observedProdTonnes: 273773.02, finalProdTonnes: 273773.02, lowerConfidenceTonnes: null, upperConfidenceTonnes: null, annualVarPercent: 5.5, eventOrShock: 'SDAE: 273.773 t | Expansão variedades melhoradas - MÁXIMO DA SÉRIE' },
  { year: 2022, status: 'OBSERVADO (SDAE)', trendAreaHa: 24350, fArea: 1.00, effectiveAreaHa: 24350, trendYieldTonnesHa: 27.32, fYield: 1.00, effectiveYieldTonnesHa: 27.32, estimatedProdTonnes: 665343, observedProdTonnes: 173931.67, finalProdTonnes: 173931.67, lowerConfidenceTonnes: null, upperConfidenceTonnes: null, annualVarPercent: -36.5, eventOrShock: 'SDAE: 173.932 t | Cheias sazonais + MADER 38M Mt alocados' },
  { year: 2023, status: 'OBSERVADO (SDAE)', trendAreaHa: 24788, fArea: 1.00, effectiveAreaHa: 24788, trendYieldTonnesHa: 32.24, fYield: 1.00, effectiveYieldTonnesHa: 32.24, estimatedProdTonnes: 799237, observedProdTonnes: 35371.00, finalProdTonnes: 35371.00, lowerConfidenceTonnes: null, upperConfidenceTonnes: null, annualVarPercent: -79.7, eventOrShock: 'SDAE: 35.371 t | Seca El Niño 2023-24 - colapso de produção (-87% vs 2021)' },
  { year: 2024, status: 'OBSERVADO (SDAE)', trendAreaHa: 25235, fArea: 1.00, effectiveAreaHa: 25235, trendYieldTonnesHa: 38.05, fYield: 1.00, effectiveYieldTonnesHa: 38.05, estimatedProdTonnes: 960076, observedProdTonnes: 48573.39, finalProdTonnes: 48573.39, lowerConfidenceTonnes: null, upperConfidenceTonnes: null, annualVarPercent: 37.3, eventOrShock: 'SDAE: 48.573 t | Seca El Niño persistente - recuperação parcial' }
];

export const THESIS_CLIMATE_IMPACT_LOSSES: ClimateImpactLossRow[] = [
  { year: 1994, event: 'Recuperação pós-guerra civil 1977-92', trendProdTonnes: 63000, actualProdTonnes: 52164, lossTonnes: 10836, lossPercent: 17.2, source: 'FAO Mozambique Country Profile; African Studies Review 2022' },
  { year: 1998, event: 'Seca moderada sul Moçambique', trendProdTonnes: 76088, actualProdTonnes: 64949, lossTonnes: 11139, lossPercent: 14.6, source: 'FEWS NET Historical Archive; FAO 1998' },
  { year: 1999, event: 'Condições normais', trendProdTonnes: 79765, actualProdTonnes: 77372, lossTonnes: 2393, lossPercent: 3.0, source: 'FAO' },
  { year: 2000, event: 'Cheias históricas + Ciclones Eline & Hudah Cat.4', trendProdTonnes: 83619, actualProdTonnes: 37327, lossTonnes: 46291, lossPercent: 55.4, source: 'OCHA/ReliefWeb Sit.Rep. Fev.2000; 800 mortos; 100.000+ deslocados' },
  { year: 2001, event: 'Recuperação pós-cheias 2000', trendProdTonnes: 87659, actualProdTonnes: 59608, lossTonnes: 28051, lossPercent: 32.0, source: 'ReliefWeb; FAO 2001 Recovery' },
  { year: 2002, event: 'Recuperação gradual', trendProdTonnes: 91895, actualProdTonnes: 84681, lossTonnes: 7214, lossPercent: 7.9, source: 'FAO' },
  { year: 2007, event: 'Ciclone Favio Cat.4 - Landfall Vilanculos/Zavala (203 km/h)', trendProdTonnes: 116579, actualProdTonnes: 41677, lossTonnes: 74902, lossPercent: 64.3, source: 'OCHA Flash Appeal 2007; 277.000 ha destruídos; $71M danos' },
  { year: 2008, event: 'Recuperação pós-Favio', trendProdTonnes: 122455, actualProdTonnes: 70534, lossTonnes: 51921, lossPercent: 42.4, source: 'FAO/WFP CFSAM 2008; destruição de sementes e estacas' },
  { year: 2009, event: 'Recuperação gradual', trendProdTonnes: 128627, actualProdTonnes: 107661, lossTonnes: 20966, lossPercent: 16.3, source: 'FAO 2009' },
  { year: 2010, event: 'Cheias sazonais moderadas Inhambane', trendProdTonnes: 139007, actualProdTonnes: 114889, lossTonnes: 24118, lossPercent: 17.4, source: 'FAO/WFP CFSAM 2010; zonas baixas afectadas' },
  { year: 2012, event: 'Cheias sazonais graves sul Moçambique', trendProdTonnes: 162348, actualProdTonnes: 117150, lossTonnes: 45198, lossPercent: 27.8, source: 'ReliefWeb/INGD 2013; 113+ mortos; 240.000+ afectados nacionais' },
  { year: 2013, event: 'Recuperação cheias; início variedades melhoradas', trendProdTonnes: 175449, actualProdTonnes: 155009, lossTonnes: 20440, lossPercent: 11.7, source: 'INGD 2013; IIAM variedades CBSD-resistentes distribuídas' },
  { year: 2015, event: 'Início seca El Niño; atraso chuvas >30 dias', trendProdTonnes: 204909, actualProdTonnes: 132781, lossTonnes: 72128, lossPercent: 35.2, source: 'FEWS NET Jun.2016; INGD 2016; fracasso parcial' },
  { year: 2016, event: 'Seca El Niño extrema - fracasso total colheitas Inhambane', trendProdTonnes: 221446, actualProdTonnes: 89818, lossTonnes: 131627, lossPercent: 59.4, source: 'FEWS NET Jun.2016: "fracasso total"; 66.119 IPC3+; pior seca 35 anos' },
  { year: 2022, event: '[OBSERVADO] Cheias sazonais + SUSTENTA', trendProdTonnes: 273773, actualProdTonnes: 173932, lossTonnes: 99841, lossPercent: 36.5, source: 'SDAE Zavala; INGD 2022' },
  { year: 2023, event: '[OBSERVADO] Seca El Niño 2023-24 - fracasso e colapso', trendProdTonnes: 173932, actualProdTonnes: 35371, lossTonnes: 138561, lossPercent: 79.7, source: 'SDAE Zavala; INAM 2024; INGD 2024' },
  { year: 2024, event: '[OBSERVADO] Seca El Niño extrema - Dez.2024 (recuperação parcial)', trendProdTonnes: 35371, actualProdTonnes: 48573, lossTonnes: -13202, lossPercent: -37.3, source: 'SDAE Zavala; INAM 2024' }
];

export const TOTAL_ESTIMATED_LOSSES_1994_2016 = 547224; // toneladas cumulativas

export const THESIS_METHODOLOGY_LAYERS: MethodologyLayer[] = [
  {
    layerNumber: 1,
    title: 'Camada 1: Âncoras Observadas Distritais (SDAE Zavala)',
    shortDesc: 'Dados primários e inalterados para o período recente (2017-2024)',
    details: [
      'Valores oficiais verificados dos Serviços Distritais de Actividades Económicas (SDAE) de Zavala.',
      'Representam âncoras firmes não ajustadas em nenhuma circunstância.',
      'Proporção distrital calibrada em aproximadamente ~15% da produção provincial de Inhambane (base: PROSUL 2014-19, World Bank Jobs WP No.31, 127.000 ha provinciais).'
    ],
    keyReferences: [
      'SDAE Zavala (2017-2024) Séries Primárias de Produção Agrária',
      'World Bank Jobs Working Paper No. 31 (The Cassava Value Chain in Mozambique)',
      'PROSUL (2014-2019) Relatórios Distritais de Cadeia de Valor'
    ]
  },
  {
    layerNumber: 2,
    title: 'Camada 2: Modelo de Função de Produção Híbrida',
    shortDesc: 'Fórmula estrutural: Produção(t) = [Área(t) × F_Área] × [Rendimento(t) × F_Rendimento]',
    details: [
      'Área(t) = area_base_1994 × (1 + taxa_area)^(t-1994), com três períodos: 0,8%/ano (1994-2006), 1,0%/ano (2007-2016) e 1,8%/ano (2017-2024).',
      'Rendimento(t) = rendimento_base_1994 × (1 + taxa_rendimento)^(t-1994), com 4,0%/ano (1994-2009), 7,0%/ano (2010-2016) e 18,0%/ano (2017-2024).',
      'Fundamentação econométrica baseada em Adebayo et al. (2023, Heliyon), onde 95,6% da variância de mandioca em África é explicada pela área colhida e tecnologia radicular.'
    ],
    keyReferences: [
      'Adebayo et al. (2023) "Cassava production in Africa: A panel analysis" Heliyon 9(9)',
      'Szyniszewska (2020) CassavaMap Scientific Data 7:159 (Nature)',
      'Folmer et al. "Assessment soil fertility depletion Mozambique" ScienceDirect',
      'FAO Statistical Quality Assurance Framework (SQAF)'
    ]
  },
  {
    layerNumber: 3,
    title: 'Camada 3: Factores de Choque Climático e Extremos',
    shortDesc: 'Multiplicadores biofísicos baseados em Lobell & Burke (2010) e Vogel et al. (2019)',
    details: [
      'Factor de Choque = F_Área × F_Rendimento, com valores abaixo de 1.00 indicando perda líquida.',
      'Mapeamento dos grandes choques climáticos: Ciclone Favio 2007 (F_prod = 0,36, perda de 74.902 t), Cheias de 2000 (F_prod = 0,45, perda de 46.291 t) e Seca El Niño de 2016 (F_prod = 0,41, perda de 131.627 t).',
      'Intervalos de confiança de ±15% para anos normais e ±20% para anos de choque severo.',
      'Perdas totais cumulativas de 547.224 toneladas no período 1994-2016.'
    ],
    keyReferences: [
      'Lobell & Burke (2010) "Climate Change and Food Security" Springer',
      'Vogel et al. (2019) "The impact of extreme weather on global crop yields" Environ. Res. Lett. 14',
      'FEWS NET Food Security Outlook (2016, 2024)',
      'OCHA Flash Appeal Moçambique (2007)',
      'INGD (Instituto Nacional de Gestão e Redução do Risco de Desastres) Relatórios 2013, 2016, 2017, 2024'
    ]
  }
];
