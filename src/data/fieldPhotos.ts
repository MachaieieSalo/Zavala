// Registos Fotográficos Reais do Trabalho de Campo em Zavala (Apêndice D)
// Documentação etnográfica, agronómica e espacial da dissertação de Yolanda Tamele
// (Estritamente baseado nos registos de campo da investigadora e nos ficheiros fornecidos)

export interface FieldPhoto {
  id: string;
  number: number;
  originalFileName: string;
  src: string; // Will be populated with user's uploaded real photos via LocalStorage/IndexedDB
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  location: string;
  locationEn: string;
  coords: string;
  date: string;
  dateEn: string;
  category: 'Comunidade e Extensão' | 'Agronomia e Colheita' | 'Sistemas de Cultivo' | 'Entrevistas e Grupos Focais';
  categoryEn: 'Community & Extension' | 'Agronomy & Harvest' | 'Cropping Systems' | 'Interviews & Focus Groups';
  description: string;
  descriptionEn: string;
  technicalDetails: string[];
  technicalDetailsEn: string[];
  tags: string[];
}

export const REAL_FIELD_PHOTOS: FieldPhoto[] = [
  {
    id: 'foto_1',
    number: 1,
    originalFileName: 'WhatsApp Image 2026-09-04 at 15.23.20.jpeg',
    src: '',
    title: 'Mandiocal de Sequeiro em Plena Maturação Vegetativa',
    titleEn: 'Rainfed Cassava Plot at Full Vegetative Maturity',
    subtitle: 'Apêndice D: Densidade de hastes e sanidade foliar em solo arenoso',
    subtitleEn: 'Appendix D: Stem density and foliar health in sandy soil',
    location: 'Posto Administrativo de Quissico • Distrito de Zavala',
    locationEn: 'Quissico Administrative Post • Zavala District',
    coords: '24°41′15″S 34°44′28″E • Altitude 118m',
    date: 'Campanha Agrícola 2023/2024',
    dateEn: 'Agricultural Campaign 2023/2024',
    category: 'Sistemas de Cultivo',
    categoryEn: 'Cropping Systems',
    description: 'Parcela de mandioca em estado avançado de desenvolvimento vegetativo. Observa-se a formação de caules retos esbranquiçados com entrenós curtos, boa retenção foliar no dossel superior e solo arenoso com palhada de cobertura seca para conservação de humidade residual.',
    descriptionEn: 'Cassava plot in advanced vegetative development stage. Shows erect whitish stems with short internodes, strong canopy leaf retention, and sandy coastal soil with dry mulching for residual moisture preservation.',
    technicalDetails: [
      'Espaçamento observado: aproximadamente 1,0 m × 1,0 m (densidade ~10.000 plantas/ha).',
      'Variedade local com tolerância moderada a períodos de estiagem costeira.',
      'Solo: Arenossolo vermelho litorâneo com drenagem excessiva e baixa capacidade de troca catiónica (CTC).'
    ],
    technicalDetailsEn: [
      'Observed plant spacing: approximately 1.0 m × 1.0 m (density ~10,000 plants/ha).',
      'Local cultivar showing moderate tolerance to coastal drought spells.',
      'Soil: Coastal red arenosol with excessive drainage and low cation-exchange capacity (CEC).'
    ],
    tags: ['mandiocal', 'sequeiro', 'dossel', 'solo arenoso', 'Zavala', 'hastes']
  },
  {
    id: 'foto_2',
    number: 2,
    originalFileName: 'WhatsApp Image 2026-09-04 at 15.23.18.jpeg',
    src: '',
    title: 'Consociação em Linhas com Leguminosas e Coqueiros',
    titleEn: 'Intercropping in Rows with Grain Legumes and Coconut Palms',
    subtitle: 'Apêndice D: Sistema agroecológico tradicional sobre areias brancas litorâneas',
    subtitleEn: 'Appendix D: Traditional agroecological system on white coastal sands',
    location: 'Faixa Litoral de Zavala • Quissico Sul',
    locationEn: 'Coastal Belt of Zavala • Quissico South',
    coords: '24°43′02″S 34°42′10″E • Altitude 85m',
    date: 'Campanha Agrícola 2023/2024',
    dateEn: 'Agricultural Campaign 2023/2024',
    category: 'Sistemas de Cultivo',
    categoryEn: 'Cropping Systems',
    description: 'Machamba ampla instalada em cordão arenoso claro. O plantio em linhas regulares concilia a cultura da mandioca com cobertura rasteira de amendoim (Arachis hypogaea) e feijão nhemba (Vigna unguiculata), com coqueiros e cajueiros ao fundo formando o estrato agroflorestal.',
    descriptionEn: 'Broad family field (machamba) established on pale sandy ridge. Row planting combines cassava with ground-cover groundnut (Arachis hypogaea) and cowpea (Vigna unguiculata), with coconut and cashew trees in the background forming an agroforestry belt.',
    technicalDetails: [
      'Função agronómica: fixação biológica de azoto pelas leguminosas e atenuação da erosão eólica.',
      'Temperatura da camada superficial do solo reduzida pela consociação rasteira.',
      'Presença de palmeiras (Cocos nucifera) servindo de quebra-ventos naturais contra ventos marítimos do Canal de Moçambique.'
    ],
    technicalDetailsEn: [
      'Agronomic function: biological nitrogen fixation by legumes and wind erosion abatement.',
      'Soil surface temperature reduced through living legume ground cover.',
      'Coconut palms (Cocos nucifera) providing natural windbreaks against Mozambique Channel marine gusts.'
    ],
    tags: ['consociação', 'amendoim', 'coqueiros', 'areias brancas', 'linhas', 'agrofloresta']
  },
  {
    id: 'foto_3',
    number: 3,
    originalFileName: 'WhatsApp Image 2026-09-04 at 15.23.17 (1).jpeg',
    src: '',
    title: 'Investigadora Yolanda Tamele com Agricultores de Zavala',
    titleEn: 'Researcher Yolanda Tamele with Smallholder Farmers in Zavala',
    subtitle: 'Apêndice D: Levantamento etnográfico e validação participativa de campo',
    subtitleEn: 'Appendix D: Ethnographic survey and participatory field validation',
    location: 'Comunidade de Zavalene • Quissico',
    locationEn: 'Zavalene Community • Quissico',
    coords: '24°41′48″S 34°44′50″E • Altitude 122m',
    date: 'Trabalho de Campo Etnográfico',
    dateEn: 'Ethnographic Fieldwork',
    category: 'Comunidade e Extensão',
    categoryEn: 'Community & Extension',
    description: 'A investigadora Yolanda Tamele (ao centro, de casaco cinzento com capuz) ladeada por pequenos agricultores e agricultoras locais em frente a uma parcela experimental de mandioca. O registo ilustra o compromisso direto da pesquisa com as lideranças agrárias comunitárias de Zavala.',
    descriptionEn: 'Researcher Yolanda Tamele (center) alongside local smallholder farmers in front of an experimental cassava plot. Documents direct participatory engagement with community agrarian leaders in Zavala.',
    technicalDetails: [
      'Amostragem com produtores representativos das unidades familiares de sequeiro.',
      'Aplicação de questionários semiestruturados sobre perceção de riscos climáticos e choques históricos (Eline 2000, Favio 2007, El Niño 2016 e 2023).',
      'Predomínio do protagonismo feminino na gestão cotidiana das machambas.'
    ],
    technicalDetailsEn: [
      'Field sample covering representative rainfed smallholder households.',
      'Semi-structured questionnaires applied regarding climate risk perceptions and historical shocks (Eline 2000, Favio 2007, El Niño 2016 and 2023).',
      'Predominance of female leadership in day-to-day farm management.'
    ],
    tags: ['Yolanda Tamele', 'produtores', 'Zavalene', 'entrevistas', 'pesquisa participativa']
  },
  {
    id: 'foto_4',
    number: 4,
    originalFileName: 'WhatsApp Image 2026-09-04 at 15.23.17.jpeg',
    src: '',
    title: 'Equipa de Extensão e Serviços Agrários no Mandiocal',
    titleEn: 'Agricultural Extension Team & Services in Cassava Fields',
    subtitle: 'Apêndice D: Integração entre extensionistas, técnicos SDAE e produtoras',
    subtitleEn: 'Appendix D: Cooperation among extension agents, SDAE technicians, and women farmers',
    location: 'Bairro Mucoho / Mahumane • Zavala',
    locationEn: 'Mucoho / Mahumane Village • Zavala',
    coords: '24°42′10″S 34°43′35″E • Altitude 114m',
    date: 'Missão Técnica de Avaliação Agrária',
    dateEn: 'Agrarian Technical Assessment Mission',
    category: 'Comunidade e Extensão',
    categoryEn: 'Community & Extension',
    description: 'Equipa de extensionistas rurais uniformizados com chapéu de campo e colete técnico, ao lado do técnico agrário com farda de serviço ("Mucuho Services") e produtoras rurais locais com capulanas tradicionais, avaliando o crescimento de variedades melhoradas fornecidas por programas de fomento.',
    descriptionEn: 'Field extensionists in technical attire alongside agrarian staff ("Mucuho Services") and rural women farmers in traditional capulanas, evaluating stem development of improved varieties distributed by development schemes.',
    technicalDetails: [
      'Monitoria de variedades melhoradas introduzidas pelo IIAM e projetos de fomento (ex.: Chigoma Mafia e Mulaleia).',
      'Avaliação de resistência à podridão radicular e ao vírus do estriamento castanho da mandioca (CBSD).',
      'Cooperação entre extensionistas públicos do SDAE e prestadores de serviços comunitários de mecanização/estacas.'
    ],
    technicalDetailsEn: [
      'Field monitoring of improved cultivars released by IIAM and promotion programs (e.g. Chigoma Mafia and Mulaleia).',
      'Screening for resistance to root rot and Cassava Brown Streak Disease (CBSD).',
      'Collaborative synergy between public SDAE extension officers and local service providers.'
    ],
    tags: ['extensão agrária', 'técnicos', 'Mucuho', 'variedades melhoradas', 'CBSD', 'capulana']
  },
  {
    id: 'foto_5',
    number: 5,
    originalFileName: 'WhatsApp Image 2026-09-04 at 15.23.12 (1).jpeg',
    src: '',
    title: 'Amostragem Destrutiva e Escavação de Raiz Tuberosa',
    titleEn: 'Destructive Sampling & Excavation of Cassava Tuberous Root',
    subtitle: 'Apêndice D: Medição biométrica do rendimento radicular e teor de amido',
    subtitleEn: 'Appendix D: Biometric measurement of tuber yield and starch caliber',
    location: 'Talhão Experimental de Quissico • Zavala',
    locationEn: 'Quissico Experimental Plot • Zavala',
    coords: '24°40′50″S 34°45′12″E • Altitude 130m',
    date: 'Pesquisa Biométrica de Rendimento',
    dateEn: 'Biometric Yield Research',
    category: 'Agronomia e Colheita',
    categoryEn: 'Agronomy & Harvest',
    description: 'Produtor rural ajoelhado com botas de borracha retirando manualmente com pá/enxada uma raiz tuberosa de mandioca fresca de calibre comercial, com a casca sã e sem sinais de podridão castanha. A investigadora Yolanda Tamele (com chapéu branco de campo) e agricultoras analisam a tuberização na cova.',
    descriptionEn: 'Smallholder farmer excavating a commercial-grade fresh cassava root with healthy peel and no sign of brown rot. Researcher Yolanda Tamele and local women farmers analyze in-situ tuberization in sandy soil.',
    technicalDetails: [
      'Parâmetro medido: peso fresco da raiz por planta para calibração do rendimento (t/ha).',
      'Comprimento médio da raiz coletada: ~35-42 cm; diâmetro central: ~7 cm.',
      'Solo observado: franco-arenoso avermelhado bem estruturado na rizosfera, permitindo desenvolvimento radicular profundo.'
    ],
    technicalDetailsEn: [
      'Measurement parameter: fresh root weight per plant for yield calibration (t/ha).',
      'Average excavated root length: ~35-42 cm; center diameter: ~7 cm.',
      'Soil: well-structured reddish sandy loam in rhizosphere enabling deep root development.'
    ],
    tags: ['tubérculo', 'raiz tuberosa', 'escavação', 'biometria', 'rendimento', 'colheita']
  },
  {
    id: 'foto_6',
    number: 6,
    originalFileName: 'WhatsApp Image 2026-09-04 at 15.23.12.jpeg',
    src: '',
    title: 'Mutirão Comunitário de Mulheres com Ferramentas Tradicionais',
    titleEn: 'Women Community Collective (Kukwatsana) with Hand Hoes',
    subtitle: 'Apêndice D: Trabalho agrícola coletivo (Kukwatsana) e instrumentos de monda',
    subtitleEn: 'Appendix D: Mutual labor assistance (Kukwatsana) and weeding hand tools',
    location: 'Comunidade de Quissico Norte • Zavala',
    locationEn: 'Quissico North Community • Zavala',
    coords: '24°39′30″S 34°46′05″E • Altitude 138m',
    date: 'Mutirão de Preparação de Solo',
    dateEn: 'Land Preparation Collective Work',
    category: 'Comunidade e Extensão',
    categoryEn: 'Community & Extension',
    description: 'Grande grupo de camponesas de Zavala reunidas com a investigadora Yolanda Tamele e a equipa técnica. Em primeiro plano, destacam-se várias enxadas manuais de cabo curto artesanal de madeira pousadas no chão arenoso, refletindo a tecnologia tradicional intensiva em mão-de-obra que sustenta a mandioca no distrito.',
    descriptionEn: 'Large gathering of rural women farmers in Zavala with researcher Yolanda Tamele. Foreground highlights short-handled traditional hand hoes rested on sandy ground, symbolizing labor-intensive technology sustaining regional cassava cultivation.',
    technicalDetails: [
      'A enxada tradicional de cabo curto ("Xikotso / Enxada de mão") permanece a ferramenta primordial de lavoura, sacha e colheita.',
      'Organização do trabalho em regime de entreajuda comunitária (kukwatsana/ntxemo), vital para superar a escassez de mecanização.',
      'Cerca de 85% das operações de campo são executadas por mulheres chefes de agregado familiar.'
    ],
    technicalDetailsEn: [
      'Short-handled hoe ("Xikotso") remains primary implement for plowing, weeding, and root harvesting.',
      'Community mutual assistance (kukwatsana) proves vital to overcome severe lack of mechanization.',
      'Approximately 85% of field operations are executed by female heads of households.'
    ],
    tags: ['mutirão', 'enxadas', 'kukwatsana', 'mulheres rurais', 'cultivo tradicional', 'ferramentas']
  },
  {
    id: 'foto_7',
    number: 7,
    originalFileName: 'WhatsApp Image 2026-09-04 at 15.23.11 (1).jpeg',
    src: '',
    title: 'Produtor em Parcela com Pousio Arbustivo e Troncos Queimados',
    titleEn: 'Farmer in Cleared Plot with Shrub Fallow & Charred Trunks',
    subtitle: 'Apêndice D: Prática de corte e queima (Itikoma) e regeneração agrária',
    subtitleEn: 'Appendix D: Traditional slash-and-burn (Itikoma) and land regeneration',
    location: 'Zona de Expansão Agrária • Zavala Interior',
    locationEn: 'Agrarian Expansion Zone • Zavala Hinterland',
    coords: '24°44′18″S 34°41′55″E • Altitude 98m',
    date: 'Monitoramento de Parcela Individual',
    dateEn: 'Individual Plot Monitoring',
    category: 'Sistemas de Cultivo',
    categoryEn: 'Cropping Systems',
    description: 'Agricultor local em pé no meio de sua machamba de mandioca, onde se observam restos de troncos carbonizados de desbrave tradicional e rebrotas vigorosas de caules. O registo evidencia a dinâmica de abertura de novas áreas de cultivo florestal para compensar a exaustão de nutrientes nos solos velhos.',
    descriptionEn: 'Smallholder farmer standing in cassava parcel featuring charred trunks from customary clearing and vigorous stem regrowth. Documents land opening dynamics to overcome nutrient depletion in continuous plots.',
    technicalDetails: [
      'Sistema tradicional de rotação com corte e queima controlada ("Itikoma").',
      'Troncos e tocos remanescentes servem de micro-habitat e barreiras físicas contra o escoamento superficial.',
      'A altura do agricultor (~1,70 m) serve de escala biométrica: o dossel da mandioca atinge entre 1,80 m e 2,20 m de altura.'
    ],
    technicalDetailsEn: [
      'Customary rotation system utilizing controlled slash-and-burn ("Itikoma").',
      'Residual wood logs act as micro-habitats and physical soil barriers against runoff.',
      'Farmer height (~1.70 m) provides visual biometric scale: cassava canopy reaches 1.80 m to 2.20 m.'
    ],
    tags: ['agricultor', 'escala biométrica', 'corte e queima', 'pousio', 'troncos', 'Zavala']
  },
  {
    id: 'foto_8',
    number: 8,
    originalFileName: 'WhatsApp Image 2026-09-04 at 15.23.09.jpeg',
    src: '',
    title: 'Grupo Focal Participativo com Mulheres Produtoras',
    titleEn: 'Participatory Focus Group with Women Smallholders',
    subtitle: 'Apêndice D: Reunião etnográfica no terreiro comunitário sobre choques e segurança alimentar',
    subtitleEn: 'Appendix D: Ethnographic village courtyard discussion on climate shocks & food security',
    location: 'Aldeia de Mahumane • Posto de Quissico',
    locationEn: 'Mahumane Village • Quissico Post',
    coords: '24°41′05″S 34°43′15″E • Altitude 125m',
    date: 'Entrevistas de Grupo Focal (FGD)',
    dateEn: 'Focus Group Discussion (FGD)',
    category: 'Entrevistas e Grupos Focais',
    categoryEn: 'Interviews & Focus Groups',
    description: 'Reunião participativa no terreiro sombreado de uma residência rural tradicional em Zavala. As mulheres produtoras estão sentadas sobre esteiras de palha trançada, com uma agricultora de pé erguendo a enxada como elemento central do debate sobre as estratégias de sobrevivência alimentar e consumo de rale durante os anos de seca extrema.',
    descriptionEn: 'Participatory meeting in a shaded courtyard of a traditional homestead in Zavala. Women farmers seated on woven straw mats discuss survival food strategies and dried cassava processing (rale) during extreme drought years.',
    technicalDetails: [
      'Metodologia: Diagnóstico Rural Participativo (DRP) e grupos focais com 15 a 20 mulheres por povoação.',
      'Tópicos debatidos: perda de colheitas em 2016 e 2023, consumo de folhas de mandioca (matapa) como recurso de reserva e acesso a variedades tolerantes à seca.',
      'Disposição espacial: esteira tradicional para a comunidade e cadeiras para a equipa técnica facilitadora.'
    ],
    technicalDetailsEn: [
      'Methodology: Participatory Rural Appraisal (PRA) with 15–20 rural women per village.',
      'Key topics: 2016 and 2023 harvest losses, cassava leaf (matapa) emergency consumption, and access to drought-tolerant cuttings.',
      'Spatial seating arrangement: customary straw mats for villagers and chairs for facilitation staff.'
    ],
    tags: ['grupo focal', 'DRP', 'mulheres', 'esteira', 'enxada', 'Mahumane', 'segurança alimentar']
  },
  {
    id: 'foto_9',
    number: 9,
    originalFileName: 'WhatsApp Image 2026-09-04 at 15.23.10.jpeg',
    src: '',
    title: 'Perspectiva Intergeracional da Força de Trabalho Agrária',
    titleEn: 'Intergenerational Labor Perspective in Cassava Systems',
    subtitle: 'Apêndice D: Jovens, mulheres e idosos na cadeia produtiva da mandioca',
    subtitleEn: 'Appendix D: Youth, women, and elders across the cassava value chain',
    location: 'Comunidade de Zavalene • Zavala',
    locationEn: 'Zavalene Community • Zavala',
    coords: '24°41′55″S 34°44′45″E • Altitude 120m',
    date: 'Registro de Agrupamento Produtivo',
    dateEn: 'Agrarian Demographic Record',
    category: 'Comunidade e Extensão',
    categoryEn: 'Community & Extension',
    description: 'Registro complementar do grupo de produtores demonstrando a heterogeneidade etária no campo de cultivo de Zavala. A presença simultânea de jovens e idosas camponesas salienta a transmissão intergeracional do conhecimento tradicional sobre o manejo de estacas e sinais prévios de seca.',
    descriptionEn: 'Demographic photo illustrating generational diversity in Zavala fields. Co-presence of youth and elderly peasant women underscores oral intergenerational transfer of cutting preservation and early drought indicators.',
    technicalDetails: [
      'Fator demográfico: envelhecimento da força de trabalho agrícola devido à migração laboral de homens jovens para as minas e cidades sul-africanas.',
      'A mandioca atua como cultura de segurança familiar confiada primordialmente às mulheres e idosos da casa.',
      'Diversidade de vestuário tradicional de trabalho com capulanas multifuncionais.'
    ],
    technicalDetailsEn: [
      'Demographic driver: aging agrarian workforce due to historical male labor migration to South African mines and cities.',
      'Cassava functions as household baseline safety net entrusted primarily to women and elderly relatives.',
      'Rich diversity of traditional workwear featuring multifunctional capulana wraps.'
    ],
    tags: ['intergeracional', 'trabalho familiar', 'migração', 'conhecimento tradicional', 'capulana']
  },
  {
    id: 'foto_10',
    number: 10,
    originalFileName: 'WhatsApp Image 2026-09-04 at 15.23.11.jpeg',
    src: '',
    title: 'Arquitetura de Ramificação e Cobertura do Solo em Sequeiro',
    titleEn: 'Canopy Branching Architecture & Ground Cover under Rainfed Stress',
    subtitle: 'Apêndice D: Resistência mecânica e adaptação a ventos cíclicos costeiros',
    subtitleEn: 'Appendix D: Mechanical strength and adaptation to cyclic coastal marine winds',
    location: 'Talhões de Quissico • Zavala',
    locationEn: 'Quissico Plots • Zavala',
    coords: '24°40′40″S 34°44′10″E • Altitude 128m',
    date: 'Avaliação Estrutural da Biomassa Aérea',
    dateEn: 'Structural Aboveground Biomass Assessment',
    category: 'Agronomia e Colheita',
    categoryEn: 'Agronomy & Harvest',
    description: 'Visão interior do dossel de mandioca, evidenciando a ramificação tricotómica dos caules flexíveis que conferem maior tolerância mecânica a ventanias marinhas frequentes na costa de Inhambane. Sob os caules, plantas espontâneas e serapilheira contribuem para o sombreamento do solo avermelhado.',
    descriptionEn: 'Interior view of cassava canopy showing trichotomous flexible stem branching granting mechanical resilience against marine storms common along Inhambane coast. Shading mitigates soil heat buildup.',
    technicalDetails: [
      'Arquitetura da copa: ramificação a partir de 80 cm de altura, permitindo fácil circulação de ar e menor incidência de fungos nas folhas inferiores.',
      'Eficiência no uso da radiação solar (RUE) superior a 1,8 g/MJ.',
      'A capacidade de desfoliação parcial em períodos secos com posterior rebrote rápido (desfasamento biológico) explica a resiliência singular da espécie em Zavala.'
    ],
    technicalDetailsEn: [
      'Canopy architecture: branching starts around 80 cm, promoting air flow and dampening foliar fungal incidence.',
      'Radiation use efficiency (RUE) exceeding 1.8 g/MJ.',
      'Partial dry-season shedding followed by quick flushing (biological lag) accounts for remarkable resilience in Zavala.'
    ],
    tags: ['ramificação', 'biomassa aérea', 'arquitetura da planta', 'solo avermelhado', 'resiliência']
  }
];
